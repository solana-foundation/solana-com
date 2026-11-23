// #region metadata
package main

import (
	"context"
	"fmt"
	"strings"

	bin "github.com/gagliardetto/binary"
	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	client := rpc.New("http://localhost:8899")

	// Example: USDC mint address
	mint := solana.MustPublicKeyFromBase58("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

	// The metadata account is a PDA derived from the mint address
	metadataAddress, _, err := solana.FindTokenMetadataAddress(mint)
	if err != nil {
		panic(err)
	}
	account, err := client.GetAccountInfo(context.Background(), metadataAddress)
	if err != nil {
		panic(err)
	}

	// The first fields of the Metaplex Metadata account
	var metadata struct {
		Key             uint8
		UpdateAuthority solana.PublicKey
		Mint            solana.PublicKey
		Name            string
		Symbol          string
		Uri             string
	}
	if err := bin.NewBorshDecoder(account.GetBinary()).Decode(&metadata); err != nil {
		panic(err)
	}

	fmt.Println("Token Name:", strings.TrimRight(metadata.Name, "\x00"))
	fmt.Println("Token Symbol:", strings.TrimRight(metadata.Symbol, "\x00"))
	fmt.Println("Metadata URI:", strings.TrimRight(metadata.Uri, "\x00"))
	fmt.Println("Update Authority:", metadata.UpdateAuthority)
}

// #endregion metadata
