// #region create
package main

import (
	"context"
	"encoding/binary"
	"fmt"
	"time"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	ctx := context.Background()
	client := rpc.New("http://localhost:8899")

	payer := solana.NewWallet()
	mint := solana.NewWallet()

	_, err := client.RequestAirdrop(ctx, payer.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	time.Sleep(2 * time.Second)

	metadata, _, err := solana.FindTokenMetadataAddress(mint.PublicKey())
	if err != nil {
		panic(err)
	}

	// CreateV1 creates the mint and its metadata account in one instruction.
	data := []byte{42, 0} // CreateV1
	for _, value := range []string{"My Token", "MTK", "https://example.com/token-metadata.json"} {
		data = binary.LittleEndian.AppendUint32(data, uint32(len(value))) // name, symbol, uri
		data = append(data, value...)
	}
	data = binary.LittleEndian.AppendUint16(data, 0) // seller fee basis points (0% royalty)
	// creators: none, primary sale happened: false, is mutable: true,
	// token standard: Fungible, collection, uses, collection details, rule set: none,
	// decimals: 9, print supply: none
	data = append(data, 0, 0, 1, 2, 0, 0, 0, 0, 1, 9, 0)

	createInstruction := solana.NewInstruction(
		solana.TokenMetadataProgramID,
		solana.AccountMetaSlice{
			solana.Meta(metadata).WRITE(),
			solana.Meta(solana.TokenMetadataProgramID), // no master edition
			solana.Meta(mint.PublicKey()).WRITE().SIGNER(),
			solana.Meta(payer.PublicKey()).SIGNER(),         // mint authority
			solana.Meta(payer.PublicKey()).WRITE().SIGNER(), // payer
			solana.Meta(payer.PublicKey()).SIGNER(),         // update authority
			solana.Meta(solana.SystemProgramID),
			solana.Meta(solana.SysVarInstructionsPubkey),
			solana.Meta(solana.TokenProgramID),
		},
		data,
	)

	recent, err := client.GetLatestBlockhash(ctx, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	tx, err := solana.NewTransaction(
		[]solana.Instruction{createInstruction},
		recent.Value.Blockhash,
		solana.TransactionPayer(payer.PublicKey()),
	)
	if err != nil {
		panic(err)
	}
	tx.Sign(func(key solana.PublicKey) *solana.PrivateKey {
		if key.Equals(mint.PublicKey()) {
			return &mint.PrivateKey
		}
		return &payer.PrivateKey
	})

	sig, err := client.SendTransactionWithOpts(ctx, tx, rpc.TransactionOpts{
		PreflightCommitment: rpc.CommitmentConfirmed,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Transaction Signature:", sig)
	fmt.Println("Mint Address:", mint.PublicKey())
}

// #endregion create
