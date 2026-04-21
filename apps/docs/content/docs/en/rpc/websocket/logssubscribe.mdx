---
title: logsSubscribe
description: Subscribe to transaction log messages that match a log filter.
url: /docs/rpc/websocket/logssubscribe
type: reference
hideTableOfContents: true
---

Subscribe to transaction log messages that match a log filter.

<Callout type="info" title="Source">
  [`logs_subscribe`](https://github.com/anza-xyz/agave/blob/v3.1.8/rpc/src/rpc_pubsub.rs#L482)
</Callout>

<APIMethod>

```jsonc !!request curl
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "logsSubscribe",
  "params": [
    // !hover(1:3) filter
    {
      "mentions": ["11111111111111111111111111111111"]
    },
    // !hover(1:3) config
    {
      // !hover commitment
      "commitment": "finalized"
    }
  ]
}
```

```ts !!request title="Kit"
import { createSolanaRpcSubscriptions } from "@solana/kit";

const rpc = createSolanaRpcSubscriptions("wss://api.devnet.solana.com");

const subscription = await rpc
  .logsNotifications(
    { mentions: ["11111111111111111111111111111111"] },
    { commitment: "confirmed" }
  )
  .subscribe({ abortSignal: AbortSignal.timeout(50_000) });

for await (const notification of subscription) {
  console.log(notification);
}
```

```ts !!request title="web3.js"
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const subscriptionId = connection.onLogs(
  "11111111111111111111111111111111",
  (logs, context) => {
    console.log("Logs:", logs);
    console.log("Context:", context);
  },
  "finalized"
);
```

```rs !!request title="Rust"
use anyhow::Result;
use futures::StreamExt;
use solana_client::{
    nonblocking::pubsub_client::PubsubClient,
    rpc_config::{RpcTransactionLogsConfig, RpcTransactionLogsFilter},
};
use solana_commitment_config::CommitmentConfig;

#[tokio::main]
async fn main() -> Result<()> {
    let pubsub_client = PubsubClient::new("wss://api.devnet.solana.com/").await?;

    let filter = RpcTransactionLogsFilter::Mentions(vec![
        "11111111111111111111111111111111".to_string(),
    ]);

    let config = RpcTransactionLogsConfig {
        commitment: Some(CommitmentConfig::finalized()),
    };

    let (mut notifications, unsubscribe) = pubsub_client
        .logs_subscribe(filter, config)
        .await?;

    while let Some(notification) = notifications.next().await {
        println!("{:?}", notification);
    }

    unsubscribe().await;

    Ok(())
}
```

### !params

#### !! filter

!type string | object !required

Filter describing which transactions should emit log notifications.

- `all` subscribes to all transactions except simple vote transactions
- `allWithVotes` subscribes to all transactions, including simple vote
  transactions
- `{ "mentions": [<pubkey>] }` subscribes to transactions that mention a single
  base-58 encoded address

<Callout type="warn">
  The `mentions` filter currently supports exactly one address. Listing more
  than one returns an `Invalid params` error.
</Callout>

#### !! config

!type object

Optional configuration object.

##### !! commitment

!type string !values processed confirmed finalized !default finalized

The commitment describes how finalized a block is at that point in time. See
[Configuring State Commitment](/docs/rpc#configuring-state-commitment).

### !!result

```jsonc !response
{
  "jsonrpc": "2.0",
  // !hover result
  "result": 24040,
  "id": 1
}
```

!type integer

Subscription id. Pass this to
[logsUnsubscribe](/docs/rpc/websocket/logsunsubscribe).

</APIMethod>

### Notification format

Notifications are delivered as `logsNotification`.

<CodeReference>

```jsonc !!
{
  // !hover jsonrpc
  "jsonrpc": "2.0",
  // !hover method
  "method": "logsNotification",
  // !hover(1:16) params
  "params": {
    // !hover(1:13) params.result
    "result": {
      // !hover(1:3) params.result.context
      "context": {
        // !hover params.result.context.slot
        "slot": 3557
      },
      // !hover(1:8) params.result.value
      "value": {
        // !hover params.result.value.signature
        "signature": "67Viive4HpLJRPuYggAu3cbxZeQra5Y58oh4AmGc1YRXgQHevSwFbyxhBeDXw6rTCmUtHyCY7BjeHiHvhC9tud9U",
        // !hover params.result.value.err
        "err": null,
        // !hover params.result.value.logs
        "logs": [
          "Program 11111111111111111111111111111111 invoke [1]",
          "Program 11111111111111111111111111111111 success"
        ]
      }
    },
    // !hover params.subscription
    "subscription": 14
  }
}
```

## !reference

### !! jsonrpc

!type string

Always `"2.0"`.

### !! method

!type string

Always `"logsNotification"`.

### !! params

!type object

Notification wrapper with the logs payload and the subscription id.

#### !! result

!type object

Notification result object with `context` and `value`. For PubSub notifications,
`context` includes `slot` and omits `apiVersion`.

##### !! context

!type object

Context for the bank slot that produced this notification.

###### !! slot

!type u64

Slot associated with the notification.

##### !! value

!type object

Logs emitted by the matching transaction.

###### !! signature

!type string

Transaction signature, as a base-58 encoded string.

###### !! err

!type object | null

Transaction error for the matching transaction, or `null` on success. Uses the
same structure documented in
[Transaction Errors](/docs/rpc/json-structures#transaction-errors).

###### !! logs

!type array[string]

Program log messages emitted during instruction execution.

#### !! subscription

!type integer

Subscription id that produced this notification.

</CodeReference>
