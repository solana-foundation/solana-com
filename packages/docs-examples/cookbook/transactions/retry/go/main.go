// #region rebroadcast
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/programs/system"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

func main() {
	ctx := context.Background()
	client := rpc.New("http://localhost:8899")

	payer := solana.NewWallet()
	toAccount := solana.NewWallet().PublicKey()
	_, err := client.RequestAirdrop(ctx, payer.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	time.Sleep(2 * time.Second)

	latest, err := client.GetLatestBlockhash(ctx, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	tx, err := solana.NewTransaction(
		[]solana.Instruction{
			system.NewTransferInstruction(1_000_000, payer.PublicKey(), toAccount).Build(),
		},
		latest.Value.Blockhash,
		solana.TransactionPayer(payer.PublicKey()),
	)
	if err != nil {
		panic(err)
	}
	tx.Sign(func(solana.PublicKey) *solana.PrivateKey { return &payer.PrivateKey })
	rawTx, err := tx.MarshalBinary()
	if err != nil {
		panic(err)
	}
	signature := tx.Signatures[0]

	// Resend the same signed transaction until it lands or its blockhash expires.
	// MaxRetries 0 turns off the RPC node's own rebroadcasting.
	maxRetries := uint(0)
	for {
		height, err := client.GetBlockHeight(ctx, rpc.CommitmentConfirmed)
		if err != nil {
			panic(err)
		}
		if height > latest.Value.LastValidBlockHeight {
			break
		}
		client.SendRawTransactionWithOpts(ctx, rawTx, rpc.TransactionOpts{SkipPreflight: true, MaxRetries: &maxRetries})
		time.Sleep(500 * time.Millisecond)
		statuses, err := client.GetSignatureStatuses(ctx, false, signature)
		if err == nil && statuses.Value[0] != nil {
			break
		}
	}

	fmt.Println("Signature:", signature)
}

// #endregion rebroadcast
