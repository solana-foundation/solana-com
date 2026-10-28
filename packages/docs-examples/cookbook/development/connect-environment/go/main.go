// #region rpc-url
package main

import "github.com/solana-foundation/solana-go/v2/rpc"

func main() {
	client := rpc.New("https://api.devnet.solana.com")
	_ = client
}

// #endregion rpc-url
