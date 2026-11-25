// #region pay-fees
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/solana-foundation/solana-go/v2"
	ata "github.com/solana-foundation/solana-go/v2/programs/associated-token-account"
	"github.com/solana-foundation/solana-go/v2/programs/system"
	"github.com/solana-foundation/solana-go/v2/programs/token"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	ctx := context.Background()
	client := rpc.New("http://localhost:8899")

	feePayer := solana.NewWallet() // pays the SOL fee, gets paid back in tokens
	sender := solana.NewWallet()   // holds tokens but no SOL
	recipient := solana.NewWallet()
	mint := solana.NewWallet()

	signers := map[solana.PublicKey]*solana.PrivateKey{
		feePayer.PublicKey(): &feePayer.PrivateKey,
		sender.PublicKey():   &sender.PrivateKey,
		mint.PublicKey():     &mint.PrivateKey,
	}
	send := func(instructions ...solana.Instruction) solana.Signature {
		recent, err := client.GetLatestBlockhash(ctx, rpc.CommitmentConfirmed)
		if err != nil {
			panic(err)
		}
		tx, err := solana.NewTransaction(
			instructions,
			recent.Value.Blockhash,
			solana.TransactionPayer(feePayer.PublicKey()),
		)
		if err != nil {
			panic(err)
		}
		tx.Sign(func(key solana.PublicKey) *solana.PrivateKey { return signers[key] })
		sig, err := client.SendTransactionWithOpts(ctx, tx, rpc.TransactionOpts{
			PreflightCommitment: rpc.CommitmentConfirmed,
		})
		if err != nil {
			panic(err)
		}
		return sig
	}

	_, err := client.RequestAirdrop(ctx, feePayer.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	time.Sleep(2 * time.Second)

	// Setup: a mint with 2 decimals, and 1.00 token in the sender's account.
	rent, err := client.GetMinimumBalanceForRentExemption(ctx, token.MINT_SIZE, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	senderATA, _, _ := solana.FindAssociatedTokenAddress(sender.PublicKey(), mint.PublicKey())
	recipientATA, _, _ := solana.FindAssociatedTokenAddress(recipient.PublicKey(), mint.PublicKey())
	feePayerATA, _, _ := solana.FindAssociatedTokenAddress(feePayer.PublicKey(), mint.PublicKey())
	send(
		system.NewCreateAccountInstruction(
			rent, token.MINT_SIZE, solana.TokenProgramID, feePayer.PublicKey(), mint.PublicKey(),
		).Build(),
		token.NewInitializeMint2InstructionBuilder().
			SetDecimals(2).
			SetMintAuthority(feePayer.PublicKey()).
			SetMintAccount(mint.PublicKey()).
			Build(),
		ata.NewCreateInstruction(feePayer.PublicKey(), sender.PublicKey(), mint.PublicKey()).Build(),
		ata.NewCreateInstruction(feePayer.PublicKey(), recipient.PublicKey(), mint.PublicKey()).Build(),
		ata.NewCreateInstruction(feePayer.PublicKey(), feePayer.PublicKey(), mint.PublicKey()).Build(),
		token.NewMintToCheckedInstruction(
			100, 2, mint.PublicKey(), senderATA, feePayer.PublicKey(), nil,
		).Build(),
	)
	time.Sleep(2 * time.Second)

	// One transaction: 0.50 token to the recipient, and 0.50 token to the fee
	// payer to cover the SOL fee it pays.
	sig := send(
		token.NewTransferCheckedInstruction(
			50, 2, senderATA, mint.PublicKey(), recipientATA, sender.PublicKey(), nil,
		).Build(),
		token.NewTransferCheckedInstruction(
			50, 2, senderATA, mint.PublicKey(), feePayerATA, sender.PublicKey(), nil,
		).Build(),
	)
	fmt.Println("Transaction Signature:", sig)
}

// #endregion pay-fees
