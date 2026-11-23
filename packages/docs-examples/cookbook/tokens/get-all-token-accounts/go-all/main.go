// #region all
package main

import (
	"context"
	"fmt"

	bin "github.com/gagliardetto/binary"
	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/programs/token"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	client := rpc.New("http://localhost:8899")

	owner := solana.MustPublicKeyFromBase58("4kg8oh3jdNtn7j2wcS7TrUua31AgbLzDVkBZgTAe44aF")

	response, err := client.GetTokenAccountsByOwner(
		context.Background(),
		owner,
		&rpc.GetTokenAccountsConfig{ProgramId: solana.TokenProgramID.ToPointer()},
		&rpc.GetTokenAccountsOpts{Encoding: solana.EncodingBase64},
	)
	if err != nil {
		panic(err)
	}
	for _, account := range response.Value {
		var tokenAccount token.Account
		if err := bin.NewBinDecoder(account.Account.Data.GetBinary()).Decode(&tokenAccount); err != nil {
			panic(err)
		}
		fmt.Println(account.Pubkey, tokenAccount.Mint, tokenAccount.Amount)
	}
}

// #endregion all
