// #region create
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

	// Fund the sender so it can pay for the new account.
	_, err := client.RequestAirdrop(ctx, sender.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	time.Sleep(2 * time.Second)

	newAccount := solana.NewWallet()
	space := uint64(0)
	rentLamports, err := client.GetMinimumBalanceForRentExemption(ctx, space, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}

	createAccountInstruction := system.NewCreateAccountInstruction(
		rentLamports,
		space,
		solana.SystemProgramID,
		sender.PublicKey(),
		newAccount.PublicKey(),
	).Build()

	latest, err := client.GetLatestBlockhash(ctx, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	tx, err := solana.NewTransaction(
		[]solana.Instruction{createAccountInstruction},
		latest.Value.Blockhash,
		solana.TransactionPayer(sender.PublicKey()),
	)
	if err != nil {
		panic(err)
	}
	tx.Sign(func(key solana.PublicKey) *solana.PrivateKey {
		if key.Equals(newAccount.PublicKey()) {
			return &newAccount.PrivateKey
		}
		return &sender.PrivateKey
	})

	signature, err := client.SendTransactionWithOpts(ctx, tx, rpc.TransactionOpts{
		PreflightCommitment: rpc.CommitmentConfirmed,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction Signature for create account:", signature)
}

// #endregion create
