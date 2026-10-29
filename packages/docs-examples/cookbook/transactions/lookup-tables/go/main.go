package main

import (
	"context"
	"fmt"
	"time"

	"github.com/solana-foundation/solana-go/v2"
	lookup "github.com/solana-foundation/solana-go/v2/programs/address-lookup-table"
	"github.com/solana-foundation/solana-go/v2/programs/system"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	// #region create
	ctx := context.Background()
	client := rpc.New("http://localhost:8899")

	payer := solana.NewWallet()
	_, err := client.RequestAirdrop(ctx, payer.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	time.Sleep(2 * time.Second)

	signer := func(solana.PublicKey) *solana.PrivateKey { return &payer.PrivateKey }
	send := func(instructions ...solana.Instruction) {
		recent, err := client.GetLatestBlockhash(ctx, rpc.CommitmentConfirmed)
		if err != nil {
			panic(err)
		}
		tx, err := solana.NewTransaction(instructions, recent.Value.Blockhash, solana.TransactionPayer(payer.PublicKey()))
		if err != nil {
			panic(err)
		}
		tx.Sign(signer)
		_, err = client.SendTransactionWithOpts(ctx, tx, rpc.TransactionOpts{PreflightCommitment: rpc.CommitmentConfirmed})
		if err != nil {
			panic(err)
		}
		time.Sleep(2 * time.Second)
	}

	slot, err := client.GetSlot(ctx, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	createInstruction, lookupTableAddress, err := lookup.NewCreateLookupTableInstruction(
		payer.PublicKey(), // authority
		payer.PublicKey(), // payer
		slot,
	)
	if err != nil {
		panic(err)
	}
	send(createInstruction.Build())
	fmt.Println("lookup table address:", lookupTableAddress)
	// #endregion create

	// #region extend
	recipient := solana.NewWallet().PublicKey()
	extendInstruction := lookup.NewExtendLookupTableInstruction(
		lookupTableAddress,
		payer.PublicKey(), // authority
		payer.PublicKey(), // payer
		[]solana.PublicKey{recipient, solana.SystemProgramID},
	)
	send(extendInstruction.Build())
	// #endregion extend

	// #region fetch
	lookupTable, err := lookup.GetAddressLookupTable(ctx, client, lookupTableAddress)
	if err != nil {
		panic(err)
	}
	fmt.Println("Table address from cluster:", lookupTableAddress)
	// #endregion fetch

	// #region list
	for i, address := range lookupTable.Addresses {
		fmt.Println(i, address)
	}
	// #endregion list

	// #region use
	recent, err := client.GetLatestBlockhash(ctx, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	tx, err := solana.NewTransaction(
		[]solana.Instruction{
			system.NewTransferInstruction(1_000_000, payer.PublicKey(), recipient).Build(),
		},
		recent.Value.Blockhash,
		solana.TransactionPayer(payer.PublicKey()),
		// Passing the table makes this a v0 transaction that loads `recipient` from it.
		solana.TransactionAddressTables(map[solana.PublicKey]solana.PublicKeySlice{
			lookupTableAddress: lookupTable.Addresses,
		}),
	)
	if err != nil {
		panic(err)
	}
	tx.Sign(signer)

	sig, err := client.SendTransactionWithOpts(ctx, tx, rpc.TransactionOpts{PreflightCommitment: rpc.CommitmentConfirmed})
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction:", sig)
	// #endregion use
}
