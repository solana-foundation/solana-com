"use client";

import { websocketEndpoints } from "@/lib/websocket-endpoints";
import { WebSocketMethodSolana } from "./WebSocketMethodSolana";

export function WebSocketsRpc() {
  return (
    <div>
      <p className="text-fd-muted-foreground text-base leading-relaxed mb-10">
        Real-time WebSocket subscriptions for monitoring blockchain state
        changes. Connect to{" "}
        <code className="text-fd-primary font-mono">ws://localhost:8900</code>{" "}
        when running Surfnet.
      </p>

      {websocketEndpoints.map((endpoint, index) => {
        const id = endpoint.method_name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-");
        return (
          <div key={index} id={id}>
            <WebSocketMethodSolana endpoint={endpoint} />
          </div>
        );
      })}
    </div>
  );
}
