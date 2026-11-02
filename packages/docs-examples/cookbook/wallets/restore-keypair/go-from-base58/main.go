// #region from-base58
package main

import (
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
)

func main() {
	keypairBase58 := "5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG"

	signer := solana.MustPrivateKeyFromBase58(keypairBase58)

	fmt.Println(signer.PublicKey())
}

// #endregion from-base58
