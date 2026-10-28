// #region bip44
package main

import (
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
)

func main() {
	mnemonic := "neither lonely flavor argue grass remind eye tag avocado spot unusual intact"

	for i := 0; i < 10; i++ {
		path := fmt.Sprintf("m/44'/501'/%d'/0'", i)
		keypair, err := solana.PrivateKeyFromMnemonicAtPath(mnemonic, "", path)
		if err != nil {
			panic(err)
		}
		fmt.Printf("%s => %s\n", path, keypair.PublicKey())
	}
}

// #endregion bip44
