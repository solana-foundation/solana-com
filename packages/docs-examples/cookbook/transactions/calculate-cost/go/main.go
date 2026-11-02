// #region cost
package main

import (
	"context"
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/programs/memo"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	ctx := context.Background()
	client := rpc.New("http://localhost:8899")
	payer := solana.NewWallet()

	recent, err := client.GetLatestBlockhash(ctx, rpc.CommitmentFinalized)
	if err != nil {
		panic(err)
	}

	tx, err := solana.NewTransaction(
		[]solana.Instruction{
			memo.NewMemoInstruction([]byte("Hello, world!")).Build(),
		},
		recent.Value.Blockhash,
		solana.TransactionPayer(payer.PublicKey()),
	)
	if err != nil {
		panic(err)
	}

	fee, err := client.GetFeeForMessage(ctx, tx.Message.ToBase64(), rpc.CommitmentFinalized)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Transaction is estimated to cost %d lamports\n", *fee.Value)
}

// #endregion cost
