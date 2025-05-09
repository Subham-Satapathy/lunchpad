import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fetchDigitalAsset, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, keypairIdentity, percentAmount, publicKey } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';
import { TransactionInstruction, SystemProgram, PublicKey, Transaction } from '@solana/web3.js';

// Initialize UMI with the RPC endpoint
const umi = createUmi('https://rpc.lazorkit.xyz').use(mplTokenMetadata());

type WalletState = {
  isConnected: boolean;
  smartWalletAuthorityPubkey: string | null;
  signMessage: (instruction: TransactionInstruction) => Promise<string>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
};

export class NFTService {
  private wallet: WalletState;

  constructor(wallet: WalletState) {
    this.wallet = wallet;
    console.log('NFTService initialized with wallet state:', wallet);
  }

  public static create(wallet: WalletState): NFTService {
    return new NFTService(wallet);
  }

  public async mintAccessNFT(): Promise<{ success: boolean; mintAddress?: string; error?: string }> {
    try {
      console.log('Current wallet state in mintAccessNFT:', this.wallet);
      
      if (!this.wallet.isConnected) {
        console.error('Wallet is not connected');
        throw new Error('Wallet is not connected');
      }
      
      if (!this.wallet.smartWalletAuthorityPubkey) {
        console.error('Smart wallet authority public key is missing');
        throw new Error('Smart wallet authority public key is missing');
      }

      // Generate a new mint signer
      const mint = generateSigner(umi);
      console.log('Generated mint signer:', mint.publicKey.toString());

      // Create authority signer
      const authority = generateSigner(umi);
      authority.publicKey = publicKey(this.wallet.smartWalletAuthorityPubkey);
      console.log('Generated authority signer:', authority.publicKey.toString());
      
      // Use the authority as identity for UMI
      const localUmi = umi.use(keypairIdentity(authority));
      
      // Add a 2 second delay before minting
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Minting NFT...');
      await createNft(localUmi, {
        mint,
        name: 'My NFT',
        uri: '',
        sellerFeeBasisPoints: percentAmount(5.5),
      }).sendAndConfirm(localUmi)

      // Fetch the created asset
      const asset = await fetchDigitalAsset(localUmi, mint.publicKey);
      console.log('Created NFT asset:', asset);

      return {
        success: true,
        mintAddress: mint.publicKey.toString(),
      };
    } catch (error) {
      console.error('Error minting NFT:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  public async verifyNFTOwnership(mintAddress: string): Promise<boolean> {
    try {
      if (!this.wallet.isConnected || !this.wallet.smartWalletAuthorityPubkey) {
        return false;
      }

      // Convert string address to PublicKey
      const mintPublicKey = publicKey(mintAddress);
      const asset = await fetchDigitalAsset(umi, mintPublicKey);
      
      // Check if the current wallet owns the NFT
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const currentWallet = this.wallet.smartWalletAuthorityPubkey;
      
      // TODO: Implement proper ownership verification once we have the correct type
      // For now, we'll just check if the asset exists
      return !!asset;
    } catch (error) {
      console.error('Error verifying NFT ownership:', error);
      return false;
    }
  }

  public async signMessage(message: string): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      if (!this.wallet.isConnected) {
        console.error('Wallet is not connected');
        throw new Error('Wallet is not connected');
      }

      if (!this.wallet.smartWalletAuthorityPubkey) {
        console.error('Smart wallet authority public key is missing');
        throw new Error('Smart wallet authority public key is missing');
      }

      const instruction = new TransactionInstruction({
        keys: [
          {
            pubkey: new PublicKey(this.wallet.smartWalletAuthorityPubkey),
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: SystemProgram.programId,
        data: Buffer.from(message),
      });

      const signature = await this.wallet.signMessage(instruction);
      return {
        success: true,
        signature,
      };
    } catch (error) {
      console.error('Error signing message:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
} 