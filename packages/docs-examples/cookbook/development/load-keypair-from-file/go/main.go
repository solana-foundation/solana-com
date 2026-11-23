// #region load
package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/solana-foundation/solana-go/v2"
)

func main() {
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	keypair, err := solana.PrivateKeyFromSolanaKeygenFile(filepath.Join(home, ".config", "solana", "id.json"))
	if err != nil {
		panic(err)
	}

	fmt.Println(keypair.PublicKey())
}

// #endregion load
