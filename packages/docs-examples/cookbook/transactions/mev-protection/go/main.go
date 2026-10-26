// #region dontfront
package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/solana-foundation/solana-go/v2"
	"github.com/solana-foundation/solana-go/v2/programs/system"
	"github.com/solana-foundation/solana-go/v2/rpc"
)

const jitoEndpoint = "https://mainnet.block-engine.jito.wtf/api/v1/transactions"

// Any pubkey starting with "jitodontfront"; it does not need to exist onchain.
var dontFront = solana.MustPublicKeyFromBase58("jitodontfront111111111111111111111111111111")

// Jito tip accounts: https://docs.jito.wtf/lowlatencytxnsend/#gettipaccounts
var tipAccounts = []string{
	"96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
	"HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
	"Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
	"ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
	"DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
	"ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
	"DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
	"3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT",
}

func main() {
	ctx := context.Background()
	client := rpc.New("http://localhost:8899")

	sender := solana.NewWallet()
	recipient := solana.NewWallet()

	_, err := client.RequestAirdrop(ctx, sender.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	time.Sleep(2 * time.Second)

	// Append jitodontfront as a read-only account to the transfer instruction.
	transfer := system.NewTransferInstruction(1_000_000, sender.PublicKey(), recipient.PublicKey())
	transfer.AccountMetaSlice = append(transfer.AccountMetaSlice, solana.Meta(dontFront))

	// Jito tip: at least 1000 lamports to a random tip account.
	tipAccount := solana.MustPublicKeyFromBase58(tipAccounts[rand.Intn(len(tipAccounts))])
	tip := system.NewTransferInstruction(1_000, sender.PublicKey(), tipAccount)

	recent, err := client.GetLatestBlockhash(ctx, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	tx, err := solana.NewTransaction(
		[]solana.Instruction{transfer.Build(), tip.Build()},
		recent.Value.Blockhash,
		solana.TransactionPayer(sender.PublicKey()),
	)
	if err != nil {
		panic(err)
	}
	tx.Sign(func(solana.PublicKey) *solana.PrivateKey { return &sender.PrivateKey })

	// Send through Jito's block engine, not a regular RPC node.
	body, _ := json.Marshal(map[string]any{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  "sendTransaction",
		"params":  []any{tx.MustToBase64(), map[string]string{"encoding": "base64"}},
	})
	resp, err := http.Post(jitoEndpoint, "application/json", bytes.NewReader(body))
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	var result struct {
		Result string `json:"result"`
		Error  *struct {
			Message string `json:"message"`
		} `json:"error"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		panic(err)
	}
	if result.Error != nil {
		panic("Jito rejected the transaction: " + result.Error.Message)
	}
	if resp.StatusCode != http.StatusOK {
		panic("Jito returned " + resp.Status)
	}
	fmt.Println("Sent with dontfront protection:", result.Result)
}

// #endregion dontfront
