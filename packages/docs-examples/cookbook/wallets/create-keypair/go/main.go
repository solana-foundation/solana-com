// #region create
package main

import (
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
)

func main() {
	keypair := solana.NewWallet()
	address := keypair.PublicKey()

	fmt.Printf("address: %s\n", address)
}

// #endregion create
