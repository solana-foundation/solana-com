// #region calc
package main

import (
	"context"
	"fmt"

	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	client := rpc.New("http://localhost:8899")

	space := uint64(1500) // bytes
	lamports, err := client.GetMinimumBalanceForRentExemption(
		context.Background(), space, rpc.CommitmentConfirmed,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Minimum balance for rent exemption:", lamports)
}

// #endregion calc
