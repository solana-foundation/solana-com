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

	mintAddress := solana.MustPublicKeyFromBase58("2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo")
	authority := solana.MustPublicKeyFromBase58("AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2")

	associatedTokenAddress, _, err := solana.FindAssociatedTokenAddressWithProgram(
		authority, mintAddress, solana.Token2022ProgramID,
	)
	if err != nil {
		panic(err)
	}

	info, err := client.GetAccountInfo(context.Background(), associatedTokenAddress)
	if err != nil {
		panic(err)
	}
	ataDetails, _, err := token2022.ParseAccountWithExtensions(info.Value.Data.GetBinary())
	if err != nil {
		panic(err)
	}

	out, _ := json.MarshalIndent(ataDetails, "", "  ")
	fmt.Println(string(out))
}

// #endregion fetch
