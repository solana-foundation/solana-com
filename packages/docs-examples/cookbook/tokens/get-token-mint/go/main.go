// #region fetch
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
	token2022 "github.com/solana-foundation/solana-go/v2/programs/token-2022"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	client := rpc.New("http://localhost:8899")
	address := solana.MustPublicKeyFromBase58("2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo")

	info, err := client.GetAccountInfo(context.Background(), address)
	if err != nil {
		panic(err)
	}
	mint, _, err := token2022.ParseMintWithExtensions(info.Value.Data.GetBinary())
	if err != nil {
		panic(err)
	}

	out, _ := json.MarshalIndent(mint, "", "  ")
	fmt.Println(string(out))
}

// #endregion fetch
