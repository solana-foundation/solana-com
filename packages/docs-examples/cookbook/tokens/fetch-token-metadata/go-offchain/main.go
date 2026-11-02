// #region offchain
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	bin "github.com/gagliardetto/binary"
	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	client := rpc.New("http://localhost:8899")
	mint := solana.MustPublicKeyFromBase58("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")

	// Fetch the onchain metadata and read its uri
	metadataAddress, _, err := solana.FindTokenMetadataAddress(mint)
	if err != nil {
		panic(err)
	}
	account, err := client.GetAccountInfo(context.Background(), metadataAddress)
	if err != nil {
		panic(err)
	}
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
	uri := strings.TrimRight(metadata.Uri, "\x00")

	// Fetch the off-chain JSON metadata
	if uri != "" {
		response, err := http.Get(uri)
		if err != nil {
			panic(err)
		}
		defer response.Body.Close()

		var jsonMetadata struct {
			Name        string `json:"name"`
			Description string `json:"description"`
			Image       string `json:"image"`
		}
		if err := json.NewDecoder(response.Body).Decode(&jsonMetadata); err != nil {
			panic(err)
		}

		fmt.Println("Name:", jsonMetadata.Name)
		fmt.Println("Description:", jsonMetadata.Description)
		fmt.Println("Image:", jsonMetadata.Image)
	}
}

// #endregion offchain
