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
	// #region authority
	ctx := context.Background()
	client := rpc.New("http://localhost:8899")

	nonceAuthority := solana.NewWallet()
	_, err := client.RequestAirdrop(ctx, nonceAuthority.PublicKey(), solana.LAMPORTS_PER_SOL, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	time.Sleep(2 * time.Second)
	// #endregion authority

	// #region create
	nonceAccount := solana.NewWallet()

	const nonceAccountLength = 80
	rent, err := client.GetMinimumBalanceForRentExemption(ctx, nonceAccountLength, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}

	recent, err := client.GetLatestBlockhash(ctx, rpc.CommitmentConfirmed)
	if err != nil {
		panic(err)
	}
	tx, err := solana.NewTransaction(
		[]solana.Instruction{
			// create the nonce account, then initialize it with its authority
			system.NewCreateAccountInstruction(
				rent, nonceAccountLength, solana.SystemProgramID,
				nonceAuthority.PublicKey(), nonceAccount.PublicKey(),
			).Build(),
			system.NewInitializeNonceAccountInstruction(
				nonceAuthority.PublicKey(), nonceAccount.PublicKey(),
				solana.SysVarRecentBlockHashesPubkey, solana.SysVarRentPubkey,
			).Build(),
		},
		recent.Value.Blockhash,
		solana.TransactionPayer(nonceAuthority.PublicKey()),
	)
	if err != nil {
		panic(err)
	}
	// sign with both the nonce account and the authority
	tx.Sign(func(key solana.PublicKey) *solana.PrivateKey {
		if key.Equals(nonceAccount.PublicKey()) {
			return &nonceAccount.PrivateKey
		}
		return &nonceAuthority.PrivateKey
	})

	sig, err := client.SendTransactionWithOpts(ctx, tx, rpc.TransactionOpts{PreflightCommitment: rpc.CommitmentConfirmed})
	if err != nil {
		panic(err)
	}
	fmt.Println("Nonce initiated:", sig)
	time.Sleep(2 * time.Second)
	// #endregion create

	// #region fetch
	info, err := client.GetAccountInfoWithOpts(ctx, nonceAccount.PublicKey(), &rpc.GetAccountInfoOpts{Commitment: rpc.CommitmentConfirmed})
	if err != nil {
		panic(err)
	}
	// nonce account layout: version (4 bytes), state (4), authority (32), nonce (32)
	nonce := solana.HashFromBytes(info.GetBinary()[40:72])
	// #endregion fetch

	// #region use
	payer := nonceAuthority

	durableTx, err := solana.NewTransaction(
		[]solana.Instruction{
			// advancing the nonce must be the first instruction
			system.NewAdvanceNonceAccountInstruction(
				nonceAccount.PublicKey(), solana.SysVarRecentBlockHashesPubkey, nonceAuthority.PublicKey(),
			).Build(),
			system.NewTransferInstruction(100, payer.PublicKey(), payer.PublicKey()).Build(),
		},
		nonce, // use the stored nonce as the recent blockhash
		solana.TransactionPayer(payer.PublicKey()),
	)
	if err != nil {
		panic(err)
	}
	durableTx.Sign(func(solana.PublicKey) *solana.PrivateKey { return &payer.PrivateKey })

	// the signed transaction doesn't expire: store it and submit it later
	serializedTx, err := durableTx.ToBase64()
	if err != nil {
		panic(err)
	}
	fmt.Println("Signed Durable Transaction:", serializedTx)
	// #endregion use
}
