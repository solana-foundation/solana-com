// #region estimate
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
	transfer := system.NewTransferInstruction(10_000_000, sender.PublicKey(), recipient.PublicKey()).Build()
	buildTx := func(config solana.TransactionConfig) *solana.Transaction {
		tx, err := solana.NewTransaction(
			[]solana.Instruction{transfer},
			recent.Value.Blockhash,
			solana.TransactionPayer(sender.PublicKey()),
			solana.TransactionV1Config(config.WithPriorityFee(5_000)),
		)
		if err != nil {
			panic(err)
		}
		tx.Sign(func(solana.PublicKey) *solana.PrivateKey { return &sender.PrivateKey })
		return tx
	}

	// Simulate with both limits at the runtime maximum, then read what the
	// transaction actually used.
	sim, err := client.SimulateTransactionWithOpts(ctx, buildTx(solana.TransactionConfig{}.
		WithComputeUnitLimit(1_400_000).
		WithLoadedAccountsDataSizeLimit(64*1024*1024),
	), &rpc.SimulateTransactionOpts{Commitment: rpc.CommitmentConfirmed})
	if err != nil {
		panic(err)
	}
	computeUnits := uint32(*sim.Value.UnitsConsumed)
	dataSize := *sim.Value.LoadedAccountsDataSize
	fmt.Println("Compute unit limit:", computeUnits)
	fmt.Println("Loaded accounts data size limit:", dataSize)

	// The estimate is the exact cost of one run; add a margin in production.
	tx := buildTx(solana.TransactionConfig{}.
		WithComputeUnitLimit(computeUnits).
		WithLoadedAccountsDataSizeLimit(dataSize))
	sig, err := client.SendTransactionWithOpts(ctx, tx, rpc.TransactionOpts{
		PreflightCommitment: rpc.CommitmentConfirmed,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction Signature:", sig)
}

// #endregion estimate
