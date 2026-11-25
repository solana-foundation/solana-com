// #region balance
package main

import (
	"context"
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	client := rpc.New("http://localhost:8899")

	address := solana.MustPublicKeyFromBase58("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
	balance, err := client.GetBalance(context.Background(), address, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Balance: %v SOL\n", float64(balance.Value)/float64(solana.LAMPORTS_PER_SOL))
}

// #endregion balance
