// #region check
package main

import (
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
)

func main() {
	// on curve address
	key := solana.MustPublicKeyFromBase58("5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY")
	fmt.Println(key.IsOnCurve())

	offCurveAddress := solana.MustPublicKeyFromBase58("4BJXYkfvg37zEmBbsacZjeQDpTNx91KppxFJxRqrz48e")
	fmt.Println(offCurveAddress.IsOnCurve())
}

// #endregion check
