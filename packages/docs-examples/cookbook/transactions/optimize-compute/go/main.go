// #region optimize
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/solana-foundation/solana-go/v2"
	computebudget "github.com/solana-foundation/solana-go/v2/programs/compute-budget"
	"github.com/solana-foundation/solana-go/v2/programs/system"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	ctx := context.Background()
	client := rpc.New("http://localhost:8899")

	sender := solana.NewWallet()
	recipient := solana.NewWallet()

	// Fund the sender so it can pay for the transfer.
	_, err := client.RequestAirdrop(ctx, sender.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	time.Sleep(2 * time.Second)

	recent, err := client.GetLatestBlockhash(ctx, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	transfer := system.NewTransferInstruction(
		solana.LAMPORTS_PER_SOL/2, sender.PublicKey(), recipient.PublicKey(),
	).Build()

	// Simulate with the maximum limit to measure the compute units actually used.
	simTx, err := solana.NewTransaction(
		[]solana.Instruction{
			computebudget.NewSetComputeUnitLimitInstruction(1_400_000).Build(),
			transfer,
		},
		recent.Value.Blockhash,
		solana.TransactionPayer(sender.PublicKey()),
	)
	if err != nil {
		panic(err)
	}
	sim, err := client.SimulateTransactionWithOpts(ctx, simTx, &rpc.SimulateTransactionOpts{
		Commitment: rpc.CommitmentConfirmed,
	})
	if err != nil {
		panic(err)
	}
	units := uint32(float64(*sim.Value.UnitsConsumed) * 1.1) // add a 10% margin
	fmt.Println("Compute unit limit:", units)

	// Request only that many compute units.
	tx, err := solana.NewTransaction(
		[]solana.Instruction{
			computebudget.NewSetComputeUnitLimitInstruction(units).Build(),
			transfer,
		},
		recent.Value.Blockhash,
		solana.TransactionPayer(sender.PublicKey()),
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
}

// #endregion optimize
