// #region mnemonic
package main

import (
	"fmt"

	"github.com/solana-foundation/solana-go/v2/bip39"
)

func main() {
	entropy, err := bip39.NewEntropy(128) // 12 words
	if err != nil {
		panic(err)
	}
	mnemonic, err := bip39.NewMnemonic(entropy)
	if err != nil {
		panic(err)
	}

	fmt.Println(mnemonic)
}

// #endregion mnemonic
