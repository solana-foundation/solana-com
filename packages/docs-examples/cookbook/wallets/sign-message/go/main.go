// #region sign
package main

import (
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
)

func main() {
	keys := solana.NewWallet().PrivateKey
	message := []byte("Hello, World!")
	signedBytes, err := keys.Sign(message)
	if err != nil {
		panic(err)
	}

	fmt.Println("Signature:", signedBytes)

	verified := signedBytes.Verify(keys.PublicKey(), message)
	fmt.Println("Verified:", verified)
}

// #endregion sign
