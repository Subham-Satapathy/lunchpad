import { TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js';

type WalletState = {
  isConnected: boolean;
  smartWalletAuthorityPubkey: string | null;
  signMessage: (instruction: TransactionInstruction) => Promise<string>;
};

export class TokenService {
  private wallet: WalletState;
  private readonly TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
  private readonly TOKEN_MINT = new PublicKey('2zxa7tkuWYm3o1DBbEFNtHfz6Rr1msaagvPp4P4m7UEK'); // Replace with actual token mint address

  constructor(wallet: WalletState) {
    this.wallet = wallet;
  }

  public static create(wallet: WalletState): TokenService {
    return new TokenService(wallet);
  }

  private createMintInstruction(amount: number): TransactionInstruction {
    if (!this.wallet.smartWalletAuthorityPubkey) {
      throw new Error('Smart wallet authority public key is missing');
    }

    // Convert amount to lamports (1 SOL = 1e9 lamports)
    const lamports = BigInt(Math.floor(amount * 1e9));
    const lamportsBuffer = Buffer.alloc(8);
    lamportsBuffer.writeBigUInt64LE(lamports);

    // Create the mint instruction
    return new TransactionInstruction({
      keys: [
        {
          pubkey: new PublicKey(this.wallet.smartWalletAuthorityPubkey),
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: this.TOKEN_MINT,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: this.TOKEN_PROGRAM_ID,
      data: Buffer.from([
        7, 
        ...lamportsBuffer, // Amount in lamports
      ]),
    });
  }

  public async mintTokens(amount: number): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      console.log('Starting token mint process...');
      console.log('Amount to mint:', amount, 'SOL');

      if (!this.wallet.isConnected) {
        console.error('Wallet connection check failed');
        throw new Error('Wallet is not connected');
      }

      if (!this.wallet.smartWalletAuthorityPubkey) {
        console.error('Smart wallet authority check failed');
        throw new Error('Smart wallet authority public key is missing');
      }

      console.log('Creating mint instruction...');
      // Create the mint instruction
      const instruction = this.createMintInstruction(amount);

      console.log('Signing and sending transaction...');
      // Sign and send the transaction using the wallet's signMessage function
      const signature = await this.wallet.signMessage(instruction);
      console.log('Transaction signed successfully. Signature:', signature);

      return {
        success: true,
        signature,
      };
    } catch (error) {
      console.error('Error minting tokens:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
} 