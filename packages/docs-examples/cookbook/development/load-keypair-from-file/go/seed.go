package main

import (
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/solana-foundation/solana-go/v2"
)

// Seeds `~/.config/solana/id.json` if it doesn't already exist so this example
// runs end-to-end without a prior `solana-keygen new`. Kept out of main.go (the
// file the docs render) because real users will have generated this file
// themselves.
func init() {
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	path := filepath.Join(home, ".config", "solana", "id.json")
	if _, err := os.Stat(path); err == nil {
		return
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		panic(err)
	}
	key := solana.NewWallet().PrivateKey
	ints := make([]int, len(key))
	for i, b := range key {
		ints[i] = int(b)
	}
	data, err := json.Marshal(ints)
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile(path, data, 0o600); err != nil {
		panic(err)
	}
}
