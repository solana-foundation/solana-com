package main

import (
	"context"
	"fmt"
	"time"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/programs/system"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	ctx := context.Background()
	client := rpc.New("http://localhost:8899")

	sender := solana.NewWallet()
	recipient := solana.NewWallet()

	_, err := client.RequestAirdrop(ctx, sender.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	time.Sleep(2 * time.Second)

	recent, err := client.GetLatestBlockhash(ctx, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}

	// A v1 transaction carries its resource limits in the message itself, so
	// there are no ComputeBudget instructions. Both limits default to zero, so
	// set them. The priority fee is a total in lamports, not a price per unit.
	tx, err := solana.NewTransaction(
		[]solana.Instruction{
			system.NewTransferInstruction(10_000_000, sender.PublicKey(), recipient.PublicKey()).Build(),
		},
		recent.Value.Blockhash,
		solana.TransactionPayer(sender.PublicKey()),
		solana.TransactionV1Config(solana.TransactionConfig{}.
			WithComputeUnitLimit(20_000).
			WithLoadedAccountsDataSizeLimit(64*1024).
			WithPriorityFee(5_000)),
	)
	if err != nil {
		panic(err)
	}
	tx.Sign(func(solana.PublicKey) *solana.PrivateKey { return &sender.PrivateKey })

	sig, err := client.SendTransactionWithOpts(ctx, tx, rpc.TransactionOpts{
		PreflightCommitment: rpc.CommitmentConfirmed,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction Signature:", sig)

	time.Sleep(2 * time.Second)

	// #region read
	// Reading a v1 transaction requires opting in with version 1.
	maxVersion := rpc.MaxSupportedTransactionVersion1
	fetched, err := client.GetTransaction(ctx, sig, &rpc.GetTransactionOpts{
		Commitment:                     rpc.CommitmentConfirmed,
		Encoding:                       solana.EncodingBase64,
		MaxSupportedTransactionVersion: &maxVersion,
	})
	if err != nil {
		panic(err)
	}
	read, err := fetched.Transaction.GetTransaction()
	if err != nil {
		panic(err)
	}

	// On v1 the limits live in the message config, not in instructions.
	config := read.Message.TransactionConfig
	fmt.Println("Is v1:", read.Message.GetVersion() == solana.MessageVersionV1)
	fmt.Println("Compute unit limit:", *config.ComputeUnitLimit)
	fmt.Println("Priority fee (lamports):", *config.PriorityFee)
	// #endregion read
}
