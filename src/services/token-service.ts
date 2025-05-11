import { 
  TransactionInstruction, 
  PublicKey,
  AccountMeta,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from '@solana/web3.js';
import { 
  createMintToInstruction,
} from '@solana/spl-token';

type WalletState = {
  isConnected: boolean;
  smartWalletAuthorityPubkey: string | null;
  signMessage: (instruction: TransactionInstruction) => Promise<string>;
};

export class TokenService {
  private wallet: WalletState;
  private readonly TOKEN_MINT = new PublicKey('4fbh2EUuDptWpfZfczRBscaCDBx7DH4ZSWTpSiDrSZWf'); // Your token mint address
  private readonly PAYMENT_ACCOUNT = new PublicKey('BwJspeLwXZWv7ojBjMxYjACEkPBmXPL96szgEKC8XukC'); // Account where SOL will be transferred

  constructor(wallet: WalletState) {
    this.wallet = wallet;
  }

  public static create(wallet: WalletState): TokenService {
    return new TokenService(wallet);
  }

  /**
   * Creates an instruction to transfer SOL (payment)
   *
   * @param solAmount - Amount of SOL to transfer as payment
   * @returns TransactionInstruction
   */
  private createSOLPaymentInstruction(solAmount: number): TransactionInstruction {
    if (!this.wallet.smartWalletAuthorityPubkey) {
      throw new Error('Smart wallet authority public key is missing');
    }

    const authorityPubkey = new PublicKey(this.wallet.smartWalletAuthorityPubkey);
    
    // Convert SOL to lamports
    const lamports = BigInt(Math.round(solAmount * LAMPORTS_PER_SOL));

    // Create instruction for transferring SOL from the user to the payment account
    const keys: AccountMeta[] = [
      { pubkey: authorityPubkey, isSigner: true, isWritable: true }, // User's wallet
      { pubkey: this.PAYMENT_ACCOUNT, isSigner: false, isWritable: true }, // Payment account
    ];

    return new TransactionInstruction({
      keys,
      programId: SystemProgram.programId,
      data: Buffer.from([2, ...new Uint8Array(new BigUint64Array([lamports]).buffer)]), // Transfer SOL
    });
  }

  /**
   * Creates minting instruction for token minting
   *
   * @param tokenAmount - Amount of tokens to mint
   * @returns TransactionInstruction
   */
  private async createMintInstruction(tokenAmount: number): Promise<TransactionInstruction> {
    if (!this.wallet.smartWalletAuthorityPubkey) {
      throw new Error('Smart wallet authority public key is missing');
    }

    // Input validation for amounts
    if (typeof tokenAmount !== 'number' || isNaN(tokenAmount) || tokenAmount <= 0) {
      throw new Error(`Invalid token amount: ${tokenAmount}. Amount must be a positive number.`);
    }

    const authorityPubkey = new PublicKey(this.wallet.smartWalletAuthorityPubkey);

    // Convert token amount to smallest unit (multiply by 1e9)
    const tokenAmountInSmallestUnit = BigInt(Math.round(tokenAmount * 1e9));

    // Create the mintTo instruction to mint tokens to the user's associated token account
    const instruction = createMintToInstruction(
      this.TOKEN_MINT,      // Token Mint Address
      new PublicKey(this.wallet.smartWalletAuthorityPubkey),         // User's token account
      authorityPubkey,     // Mint authority (the wallet that owns the token minting ability)
      tokenAmountInSmallestUnit          // The amount of tokens to mint in smallest unit
    );

    return instruction;
  }

  /**
   * Mints tokens only after SOL payment has been made
   *
   * @param solAmount - Amount of SOL to pay for minting tokens
   * @param tokenAmount - Amount of tokens to mint
   * @returns A promise with the transaction result
   */
  public async mintTokensAfterPayment(solAmount: number, tokenAmount: number): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      console.log('Starting token mint process...');
      console.log(`SOL amount to pay: ${solAmount} SOL`);
      console.log(`XYZ tokens to mint: ${tokenAmount}`);

      // Input validation for amounts
      if (typeof solAmount !== 'number' || isNaN(solAmount) || solAmount <= 0) {
        throw new Error(`Invalid SOL amount: ${solAmount}. Amount must be a positive number.`);
      }
      if (typeof tokenAmount !== 'number' || isNaN(tokenAmount) || tokenAmount <= 0) {
        throw new Error(`Invalid token amount: ${tokenAmount}. Amount must be a positive number.`);
      }

      // Ensure the wallet is connected
      if (!this.wallet.isConnected) {
        console.error('Wallet connection check failed');
        throw new Error('Wallet is not connected');
      }

      // Ensure the wallet has a valid authority public key
      if (!this.wallet.smartWalletAuthorityPubkey) {
        console.error('Smart wallet authority check failed');
        throw new Error('Smart wallet authority public key is missing');
      }

      // Create the SOL payment instruction
      const paymentInstruction = this.createSOLPaymentInstruction(solAmount);

      // Create the mint instruction
      const mintInstruction = await this.createMintInstruction(tokenAmount);

      // Create a single instruction that combines both operations
      const combinedInstruction = new TransactionInstruction({
        keys: [...paymentInstruction.keys, ...mintInstruction.keys],
        programId: SystemProgram.programId,
        data: Buffer.concat([paymentInstruction.data, mintInstruction.data])
      });

      console.log('Signing and sending combined instruction...');
      const signature = await this.wallet.signMessage(combinedInstruction);
      console.log('Combined instruction signed successfully. Signature:', signature);

      return {
        success: true,
        signature,
      };
    } catch (error) {
      console.error('Error minting tokens after payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
