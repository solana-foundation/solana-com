// #region bip39
package main

import (
	"crypto/ed25519"
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/bip39"
)

func main() {
	mnemonic := "pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter"
	seed := bip39.NewSeed(mnemonic, "")

	// Use the first 32 bytes of the seed as the private key.
	keypair := solana.PrivateKey(ed25519.NewKeyFromSeed(seed[:32]))
	fmt.Println(keypair.PublicKey())
}

// #endregion bip39
