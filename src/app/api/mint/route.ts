// backend/mintController.ts
import { NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { createMintToInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Initialize Solana connection
const RPC_URL = process.env.NEXT_PUBLIC_LAZOR_RPC_URL;
if (!RPC_URL || !RPC_URL.startsWith('http')) {
  throw new Error('Invalid RPC URL. Must start with http:// or https://');
}
const connection = new Connection(RPC_URL);

// Initialize mint authority from environment variable
if (!process.env.MINT_AUTHORITY_PRIVATE_KEY) {
  throw new Error('MINT_AUTHORITY_PRIVATE_KEY is not set');
}

// Parse the private key array from string
let privateKeyArray: number[];
try {
  privateKeyArray = JSON.parse(process.env.MINT_AUTHORITY_PRIVATE_KEY);
  if (!Array.isArray(privateKeyArray) || privateKeyArray.length !== 64) {
    throw new Error('Invalid key length');
  }
} catch {
  throw new Error('Invalid MINT_AUTHORITY_PRIVATE_KEY format. Must be a valid JSON array of 64 numbers');
}

const MINT_AUTHORITY = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));

// Token mint address
if (!process.env.NEXT_PUBLIC_TOKEN_MINT) {
  throw new Error('NEXT_PUBLIC_TOKEN_MINT is not set');
}
const TOKEN_MINT = new PublicKey(process.env.NEXT_PUBLIC_TOKEN_MINT);

export async function POST(request: Request) {
  try {
    const { userWallet, paymentTx, tokenAmount } = await request.json();

    // Input validation
    if (!userWallet || !paymentTx || !tokenAmount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify payment transaction
    const paymentTransaction = await connection.getParsedTransaction(paymentTx, {
      commitment: 'confirmed'
    });
    if (!paymentTransaction?.meta?.err === null) {
      return NextResponse.json(
        { error: 'Payment not confirmed' },
        { status: 400 }
      );
    }

    // Create mint instruction
    const userTokenAccount = await getAssociatedTokenAddress(
      TOKEN_MINT,
      new PublicKey(userWallet)
    );

    const mintIx = createMintToInstruction(
      TOKEN_MINT,
      userTokenAccount,
      MINT_AUTHORITY.publicKey,
      BigInt(Math.round(tokenAmount * 10 ** 9)),
      [],
      TOKEN_PROGRAM_ID
    );

    // Create and send transaction
    const { blockhash } = await connection.getLatestBlockhash();
    const transaction = new Transaction().add(mintIx);
    transaction.feePayer = MINT_AUTHORITY.publicKey;
    transaction.recentBlockhash = blockhash;
    transaction.sign(MINT_AUTHORITY);

    const signature = await connection.sendRawTransaction(transaction.serialize());
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight
    });

    return NextResponse.json({
      success: true,
      mintSignature: signature
    });

  } catch (error) {
    console.error('Token minting error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}