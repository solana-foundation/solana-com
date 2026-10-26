// #region airdrop
package main

import (
	"context"
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	client := rpc.New("http://localhost:8899")

	wallet := solana.NewWallet()
	sig, err := client.RequestAirdrop(
		context.Background(), wallet.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed, // 1 SOL
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Airdrop Signature:", sig)
}

// #endregion airdrop
