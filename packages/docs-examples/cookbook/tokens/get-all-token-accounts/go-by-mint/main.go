// #region by-mint
package main

import (
	"context"
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	client := rpc.New("http://localhost:8899")

	owner := solana.MustPublicKeyFromBase58("4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF")
	mint := solana.MustPublicKeyFromBase58("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

	response, err := client.GetTokenAccountsByOwner(
		context.Background(),
		owner,
		&rpc.GetTokenAccountsConfig{Mint: &mint},
		&rpc.GetTokenAccountsOpts{Encoding: solana.EncodingJSONParsed},
	)
	if err != nil {
		panic(err)
	}
	for _, account := range response.Value {
		fmt.Println(account.Pubkey, string(account.Account.Data.GetRawJSON()))
	}
}

// #endregion by-mint
