import { 
  TransactionInstruction, 
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from '@solana/web3.js';

type WalletState = {
  isConnected: boolean;
  smartWalletAuthorityPubkey: string | null;
  signMessage: (instruction: TransactionInstruction) => Promise<string>;
};

export class TokenService {
  private wallet: WalletState;
  private readonly PAYMENT_ACCOUNT = new PublicKey('BwJspeLwXZWv7ojBjMxYjACEkPBmXPL96szgEKC8XukC');
  private readonly BACKEND_API_URL = '/api/mint';

  constructor(wallet: WalletState) {
    this.wallet = wallet;
  }

  public static create(wallet: WalletState): TokenService {
    return new TokenService(wallet);
  }

  private createSOLPaymentInstruction(solAmount: number): TransactionInstruction {
    if (!this.wallet.smartWalletAuthorityPubkey) {
      throw new Error('Smart wallet authority public key is missing');
    }

    const authorityPubkey = new PublicKey(this.wallet.smartWalletAuthorityPubkey);
    const lamports = Math.round(solAmount * LAMPORTS_PER_SOL);

    return SystemProgram.transfer({
      fromPubkey: authorityPubkey,
      toPubkey: this.PAYMENT_ACCOUNT,
      lamports,
    });
  }

  public async mintTokensAfterPayment(
    solAmount: number, 
    tokenAmount: number
  ): Promise<{ success: boolean; paymentSig?: string; mintSig?: string; error?: string }> {
    try {
      // Validate inputs and connection
      if (!this.wallet.isConnected || !this.wallet.smartWalletAuthorityPubkey) {
        throw new Error('Wallet not connected or missing authority');
      }
      if (solAmount <= 0 || tokenAmount <= 0) {
        throw new Error('Amounts must be positive');
      }

      // Step 1: Process payment
      const paymentIx = this.createSOLPaymentInstruction(solAmount);
      const paymentSig = await this.wallet.signMessage(paymentIx);

      // Step 2: Call backend to handle minting
      const response = await fetch(this.BACKEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userWallet: this.wallet.smartWalletAuthorityPubkey,
          paymentTx: paymentSig,
          tokenAmount: tokenAmount
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Backend minting failed');
      }

      return { 
        success: true, 
        paymentSig, 
        mintSig: result.mintSig 
      };
    } catch (error) {
      console.error('Transaction error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}