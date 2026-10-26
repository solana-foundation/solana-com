// #region balance
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	client := rpc.New("http://localhost:8899")

	tokenAccountAddress := solana.MustPublicKeyFromBase58("GfVPzUxMDvhFJ1Xs6C9i47XQRSapTd8LHw5grGuTquyQ")

	balance, err := client.GetTokenAccountBalance(context.Background(), tokenAccountAddress, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	out, _ := json.MarshalIndent(balance, "", "  ")
	fmt.Println(string(out))
}

// #endregion balance
