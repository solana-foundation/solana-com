// #region subscribe
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/rpc"
	"github.com/solana-foundation/solana-go/v2/rpc/ws"
)

func main() {
	ctx := context.Background()
	client := rpc.New("http://localhost:8899")
	wsClient, err := ws.Connect(ctx, "ws://localhost:8900")
	if err != nil {
		panic(err)
	}
	defer wsClient.Close()

	wallet := solana.NewWallet()

	sub, err := wsClient.AccountSubscribe(wallet.PublicKey(), rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	defer sub.Unsubscribe()

	_, err = client.RequestAirdrop(ctx, wallet.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}

	notification, err := sub.Recv(ctx)
	if err != nil {
		panic(err)
	}
	out, _ := json.MarshalIndent(notification, "", "  ")
	fmt.Println(string(out))
}

// #endregion subscribe
