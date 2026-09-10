import React from "react";

/**
 * Byte-layout and failure-trace diagrams for the Larger Transaction Sizes
 * upgrade article.
 *
 * Each diagram is hand-drawn SVG rather than an uploaded image so that it stays
 * diffable in review, scales without artifacts, and inherits its body color
 * from `currentColor`. Colors are literal rather than CSS custom properties
 * because the upgrades article template renders on a permanently dark surface.
 *
 * Registered as Keystatic component blocks in `lib/keystatic/components.tsx`
 * so the CMS editor accepts them in the article body, and wired into the MDX
 * component map in `./mdx-components.tsx`.
 */

/** Inline monospace run, matching the accent used for `code` in article prose. */
function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.9em] text-[#14F195]">{children}</code>
  );
}

/**
 * Shared diagram frame: horizontal scroll on narrow viewports so labels stay
 * legible instead of shrinking with the viewport, plus a caption.
 *
 * @param minWidth - Width in px below which the frame scrolls rather than scaling down.
 */
function Figure({
  caption,
  children,
  minWidth,
}: {
  caption: React.ReactNode;
  children: React.ReactNode;
  minWidth: number;
}) {
  return (
    <figure className="mb-8 mt-2">
      <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/[0.02] p-4 md:p-6">
        <div style={{ minWidth }} className="text-gray-300">
          {children}
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-gray-400">
        {caption}
      </figcaption>
    </figure>
  );
}

export function TxWireLayout() {
  return (
    <Figure
      caption={
        <>
          v1 puts <Mono>0x81</Mono> at byte 0 and appends signatures last with
          no length prefix — the count is implied by the header. The config mask
          and its values are new.
        </>
      }
      minWidth={700}
    >
      <svg
        viewBox="0 0 900 330"
        role="img"
        aria-label="Byte layout of legacy, v0 and v1 transactions compared. Legacy and v0 begin with a length-prefixed signature array; v1 begins with the version byte 0x81 and places its signatures last, adding a config mask field."
      >
        <defs>
          <marker
            id="tick"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <polygon points="0,0 6,3 0,6" fill="currentColor" />
          </marker>
        </defs>

        {/* byte 0 pointer */}
        <text
          x="110"
          y="22"
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          fill="currentColor"
          opacity=".62"
        >
          byte 0
        </text>
        <line
          x1="112"
          y1="28"
          x2="112"
          y2="292"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity=".28"
        />

        {/* ============ LEGACY ============ */}
        <text
          x="0"
          y="66"
          fontFamily="ui-monospace, monospace"
          fontSize="12"
          fontWeight="600"
          fill="currentColor"
        >
          legacy
        </text>
        <g
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          textAnchor="middle"
        >
          <rect
            x="110"
            y="46"
            width="180"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="200" y="70" fill="currentColor">
            Signatures
          </text>
          <rect
            x="290"
            y="46"
            width="70"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="325" y="70" fill="currentColor">
            Header
          </text>
          <rect
            x="360"
            y="46"
            width="130"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="425" y="70" fill="currentColor">
            Blockhash
          </text>
          <rect
            x="490"
            y="46"
            width="190"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="585" y="70" fill="currentColor">
            Accounts
          </text>
          <rect
            x="680"
            y="46"
            width="200"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="780" y="70" fill="currentColor">
            Instructions
          </text>
        </g>

        {/* ============ V0 ============ */}
        <text
          x="0"
          y="166"
          fontFamily="ui-monospace, monospace"
          fontSize="12"
          fontWeight="600"
          fill="currentColor"
        >
          v0
        </text>
        <g
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          textAnchor="middle"
        >
          <rect
            x="110"
            y="146"
            width="170"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="195" y="170" fill="currentColor">
            Signatures
          </text>
          <rect
            x="280"
            y="146"
            width="40"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="300" y="170" fill="currentColor">
            0x80
          </text>
          <rect
            x="320"
            y="146"
            width="60"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="350" y="170" fill="currentColor">
            Hdr
          </text>
          <rect
            x="380"
            y="146"
            width="110"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="435" y="170" fill="currentColor">
            Blockhash
          </text>
          <rect
            x="490"
            y="146"
            width="160"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="570" y="170" fill="currentColor">
            Accounts
          </text>
          <rect
            x="650"
            y="146"
            width="150"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="725" y="170" fill="currentColor">
            Instructions
          </text>
          <rect
            x="800"
            y="146"
            width="80"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="840" y="170" fill="currentColor">
            ALTs
          </text>
        </g>

        {/* ============ V1 ============ */}
        <text
          x="0"
          y="266"
          fontFamily="ui-monospace, monospace"
          fontSize="12"
          fontWeight="600"
          fill="#14F195"
        >
          v1
        </text>
        <g
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          textAnchor="middle"
        >
          <rect
            x="110"
            y="246"
            width="40"
            height="38"
            rx="3"
            fill="#14F195"
            stroke="#14F195"
          />
          <text x="130" y="270" fill="#161A20" fontWeight="700">
            0x81
          </text>
          <rect
            x="150"
            y="246"
            width="55"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#14F195"
          />
          <text x="177" y="270" fill="currentColor">
            Hdr
          </text>
          <rect
            x="205"
            y="246"
            width="80"
            height="38"
            rx="3"
            fill="#0F2E24"
            stroke="#14F195"
          />
          <text x="245" y="270" fill="currentColor">
            Mask
          </text>
          <rect
            x="285"
            y="246"
            width="110"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#14F195"
          />
          <text x="340" y="270" fill="currentColor">
            Lifetime
          </text>
          <rect
            x="395"
            y="246"
            width="55"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#14F195"
          />
          <text x="422" y="270" fill="currentColor">
            Cnts
          </text>
          <rect
            x="450"
            y="246"
            width="140"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#14F195"
          />
          <text x="520" y="270" fill="currentColor">
            Addresses
          </text>
          <rect
            x="590"
            y="246"
            width="90"
            height="38"
            rx="3"
            fill="#0F2E24"
            stroke="#14F195"
          />
          <text x="635" y="270" fill="currentColor">
            Values
          </text>
          <rect
            x="680"
            y="246"
            width="90"
            height="38"
            rx="3"
            fill="#1D222A"
            stroke="#14F195"
          />
          <text x="725" y="270" fill="currentColor">
            Ix
          </text>
          <rect
            x="770"
            y="246"
            width="110"
            height="38"
            rx="3"
            fill="#14F195"
            stroke="#14F195"
          />
          <text x="825" y="270" fill="#161A20" fontWeight="700">
            Signatures
          </text>
        </g>

        {/* annotation: signatures moved */}
        <path
          d="M 195 190 C 195 216, 825 214, 825 240"
          fill="none"
          stroke="#14F195"
          strokeWidth="1.3"
          strokeDasharray="4 4"
          markerEnd="url(#tick)"
          opacity=".85"
        />
        <text
          x="510"
          y="228"
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          textAnchor="middle"
          fill="#14F195"
        >
          signatures move to the tail &mdash; no length prefix
        </text>

        {/* annotation: config */}
        <text
          x="245"
          y="306"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          textAnchor="middle"
          fill="currentColor"
          opacity=".7"
        >
          u32 bitmask
        </text>
        <text
          x="635"
          y="306"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          textAnchor="middle"
          fill="currentColor"
          opacity=".7"
        >
          fixed-width values
        </text>
      </svg>
    </Figure>
  );
}

export function TxSimulationTrace() {
  return (
    <Figure
      caption={
        <>
          The fee payer is collected first and its size is always greater than
          zero, so a v1 transaction with an empty config dies on the very first
          account it tries to load.
        </>
      }
      minWidth={720}
    >
      <svg
        viewBox="0 0 900 250"
        role="img"
        aria-label="Trace of a v1 transaction simulation with an empty config. Sanitization, the feature gate, and fee calculation all pass. Account loading fails on the fee payer, the very first account, because the requested loaded accounts data size limit is zero. The result is a fees-only outcome returning MaxLoadedAccountsDataSizeExceeded with an empty log array."
      >
        <defs>
          <marker
            id="ar4"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0,0 7,3.5 0,7" fill="currentColor" />
          </marker>
          <marker
            id="ar4w"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0,0 7,3.5 0,7" fill="#FF8080" />
          </marker>
        </defs>

        <g
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          textAnchor="middle"
        >
          {/* passing stages */}
          <rect
            x="10"
            y="52"
            width="128"
            height="46"
            rx="4"
            fill="#161A20"
            stroke="#272D36"
          />
          <text x="74" y="72" fill="currentColor">
            sanitize
          </text>
          <text x="74" y="87" fill="#14F195" fontSize="9.5">
            passes
          </text>

          <rect
            x="168"
            y="52"
            width="128"
            height="46"
            rx="4"
            fill="#161A20"
            stroke="#272D36"
          />
          <text x="232" y="72" fill="currentColor">
            feature gate
          </text>
          <text x="232" y="87" fill="#14F195" fontSize="9.5">
            passes
          </text>

          <rect
            x="326"
            y="52"
            width="128"
            height="46"
            rx="4"
            fill="#161A20"
            stroke="#272D36"
          />
          <text x="390" y="72" fill="currentColor">
            fee calc
          </text>
          <text x="390" y="87" fill="#14F195" fontSize="9.5">
            passes
          </text>

          {/* the failure */}
          <rect
            x="484"
            y="52"
            width="150"
            height="46"
            rx="4"
            fill="#331A1A"
            stroke="#FF8080"
            strokeWidth="1.5"
          />
          <text x="559" y="72" fill="currentColor" fontWeight="600">
            account loading
          </text>
          <text x="559" y="87" fill="#FF8080" fontSize="9.5">
            fails here
          </text>

          <rect
            x="664"
            y="52"
            width="128"
            height="46"
            rx="4"
            fill="#161A20"
            stroke="#272D36"
          />
          <text x="728" y="72" fill="currentColor">
            execution
          </text>
          <text x="728" y="87" fill="currentColor" fontSize="9.5" opacity=".55">
            never reached
          </text>
        </g>

        <path
          d="M 142 75 L 162 75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          markerEnd="url(#ar4)"
        />
        <path
          d="M 300 75 L 320 75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          markerEnd="url(#ar4)"
        />
        <path
          d="M 458 75 L 478 75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          markerEnd="url(#ar4)"
        />
        <path
          d="M 638 75 L 658 75"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeDasharray="3 4"
          opacity=".4"
        />

        {/* why it fails */}
        <path
          d="M 559 104 L 559 132"
          fill="none"
          stroke="#FF8080"
          strokeWidth="1.3"
          markerEnd="url(#ar4w)"
        />
        <rect
          x="404"
          y="136"
          width="310"
          height="56"
          rx="4"
          fill="#161A20"
          stroke="#FF8080"
        />
        <text
          x="418"
          y="156"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="currentColor"
        >
          fee payer is collected first, and its size
        </text>
        <text
          x="418"
          y="170"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="currentColor"
        >
          is always &gt; 0. Requested limit is 0.
        </text>
        <text
          x="418"
          y="185"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="#FF8080"
          fontWeight="600"
        >
          dies on the very first account
        </text>

        {/* response */}
        <rect
          x="10"
          y="136"
          width="360"
          height="96"
          rx="4"
          fill="#1D222A"
          stroke="#272D36"
        />
        <text
          x="24"
          y="156"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="currentColor"
          opacity=".6"
        >
          what comes back
        </text>
        <text
          x="24"
          y="175"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="#FF8080"
        >
          err: "MaxLoadedAccountsDataSizeExceeded"
        </text>
        <text
          x="24"
          y="191"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="currentColor"
        >
          logs: []
        </text>
        <text
          x="24"
          y="207"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="currentColor"
        >
          unitsConsumed: 0
        </text>
        <text
          x="24"
          y="223"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="currentColor"
        >
          loadedAccountsDataSize: 0
        </text>
      </svg>
    </Figure>
  );
}

export function TxAccountBytes() {
  return (
    <Figure
      caption={
        <>
          A SOL transfer seeding a brand-new wallet. Loading happens before
          execution, so the recipient is still absent at estimate time. The
          check is <Mono>&gt;</Mono> rather than <Mono>&gt;=</Mono>, so 149
          lands exactly on the limit and passes.
        </>
      }
      minWidth={720}
    >
      <svg
        viewBox="0 0 900 236"
        role="img"
        aria-label="Running total of loaded account bytes for a SOL transfer seeding a new wallet. At estimate time the recipient does not exist and is charged zero, giving a total of 149 bytes which becomes the transaction's limit. On replay the recipient exists and is charged 64 bytes, pushing the total to 213 and crossing the limit while loading the System program."
      >
        <defs>
          <marker
            id="ar5"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0,0 7,3.5 0,7" fill="#FF8080" />
          </marker>
        </defs>

        {/* limit line */}
        <line
          x1="597"
          y1="34"
          x2="597"
          y2="196"
          stroke="#FF8080"
          strokeWidth="1.4"
          strokeDasharray="4 4"
        />
        <text
          x="602"
          y="28"
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          fill="#FF8080"
          fontWeight="600"
        >
          limit written by the estimator: 149
        </text>

        {/* ROW 1 : estimate */}
        <text
          x="10"
          y="72"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fill="currentColor"
          fontWeight="600"
        >
          at estimate
        </text>
        <text
          x="10"
          y="87"
          fontFamily="ui-monospace, monospace"
          fontSize="9.5"
          fill="currentColor"
          opacity=".6"
        >
          recipient absent
        </text>

        <g
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          textAnchor="middle"
        >
          <rect
            x="180"
            y="52"
            width="179"
            height="34"
            rx="2"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="269" y="73" fill="currentColor">
            fee payer &middot; 64
          </text>
          <rect
            x="359"
            y="52"
            width="238"
            height="34"
            rx="2"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="478" y="73" fill="currentColor">
            System program &middot; 85
          </text>
        </g>
        <text
          x="359"
          y="46"
          fontFamily="ui-monospace, monospace"
          fontSize="9.5"
          textAnchor="middle"
          fill="#14F195"
        >
          recipient &middot; 0
        </text>
        <text
          x="612"
          y="73"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fill="#14F195"
          fontWeight="600"
        >
          149 &nbsp;lands exactly on the limit &mdash; passes
        </text>

        {/* ROW 2 : replay */}
        <text
          x="10"
          y="152"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fill="currentColor"
          fontWeight="600"
        >
          on replay
        </text>
        <text
          x="10"
          y="167"
          fontFamily="ui-monospace, monospace"
          fontSize="9.5"
          fill="currentColor"
          opacity=".6"
        >
          recipient now exists
        </text>

        <g
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          textAnchor="middle"
        >
          <rect
            x="180"
            y="132"
            width="179"
            height="34"
            rx="2"
            fill="#1D222A"
            stroke="#79828F"
          />
          <text x="269" y="153" fill="currentColor">
            fee payer &middot; 64
          </text>
          <rect
            x="359"
            y="132"
            width="179"
            height="34"
            rx="2"
            fill="#0F2E24"
            stroke="#14F195"
          />
          <text x="448" y="153" fill="currentColor">
            recipient &middot; 64
          </text>
          <rect
            x="538"
            y="132"
            width="238"
            height="34"
            rx="2"
            fill="#331A1A"
            stroke="#FF8080"
          />
          <text x="657" y="153" fill="currentColor">
            System program &middot; 85
          </text>
        </g>
        <text
          x="790"
          y="153"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fill="#FF8080"
          fontWeight="600"
        >
          213
        </text>

        {/* crossing marker */}
        <path
          d="M 597 178 L 597 196"
          fill="none"
          stroke="#FF8080"
          strokeWidth="1.4"
          markerEnd="url(#ar5)"
        />
        <text
          x="597"
          y="214"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          textAnchor="middle"
          fill="#FF8080"
        >
          total crosses here, while loading the System program
        </text>
        <text
          x="597"
          y="228"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          textAnchor="middle"
          fill="currentColor"
          opacity=".68"
        >
          &mdash; not while loading the recipient that caused the growth
        </text>
      </svg>
    </Figure>
  );
}

/**
 * Diagrams for the Alpenglow upgrade article. Same conventions as the
 * transaction diagrams above: fixed-width SVG inside a scrolling `Figure`,
 * literal colors for the permanently dark article surface.
 */

export function AgBanksPerSlot() {
  const lanes = [
    {
      id: "bank_id 7",
      won: true,
      events: ["tx 4vJ9…", "tx 8pQ2…", "block meta"],
    },
    {
      id: "bank_id 8",
      won: false,
      events: ["tx 4vJ9…", "tx c1Ld…", "block meta"],
    },
    {
      id: "bank_id 9",
      won: false,
      events: ["tx 6nT8…", "tx 8pQ2…", "block meta"],
    },
  ];

  return (
    <Figure
      caption={
        <>
          Before Agave 4.3 there was no <Mono>bank_id</Mono> to key on, so a
          pipeline had only the slot — and quietly produced the block on the
          left. The events are illustrative; a real slot carries thousands.
        </>
      }
      minWidth={720}
    >
      <svg
        viewBox="0 0 900 348"
        role="img"
        aria-label="One slot during replay carrying three candidate banks, tagged bank_id 7, 8 and 9. Only bank_id 7 reaches Confirmed; the other two are never confirmed. Keying a buffer on the slot alone fuses all three banks' events into a single block with no error raised. Keying on slot and bank_id together yields only bank 7's events, and the other two banks are dropped."
      >
        <defs>
          <marker
            id="agArrow"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0,0 7,3.5 0,7" fill="currentColor" />
          </marker>
        </defs>

        {/* the slot, holding every candidate bank */}
        <rect
          x="8"
          y="30"
          width="548"
          height="152"
          rx="6"
          fill="#161A20"
          stroke="#272D36"
        />
        <text
          x="20"
          y="50"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fontWeight="600"
          fill="currentColor"
        >
          slot 412300800
        </text>
        <text
          x="132"
          y="50"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="#79828F"
        >
          — three candidate banks during replay
        </text>

        {lanes.map((lane, i) => {
          const y = 62 + i * 40;
          const dim = lane.won ? 1 : 0.45;
          return (
            <g key={lane.id} fontFamily="ui-monospace, monospace">
              <rect
                x="20"
                y={y}
                width="92"
                height="32"
                rx="4"
                fill="#1D222A"
                stroke="#272D36"
                opacity={dim}
              />
              <text
                x="66"
                y={y + 20}
                fontSize="10.5"
                textAnchor="middle"
                fill="currentColor"
                opacity={dim}
              >
                {lane.id}
              </text>

              {lane.events.map((chip, j) => (
                <g key={chip} opacity={dim}>
                  <rect
                    x={122 + j * 106}
                    y={y}
                    width="98"
                    height="32"
                    rx="4"
                    fill="#161A20"
                    stroke="#272D36"
                    strokeDasharray={lane.won ? undefined : "3 3"}
                  />
                  <text
                    x={171 + j * 106}
                    y={y + 20}
                    fontSize="10"
                    textAnchor="middle"
                    fill="currentColor"
                  >
                    {chip}
                  </text>
                </g>
              ))}

              {lane.won ? (
                <>
                  <rect
                    x="444"
                    y={y}
                    width="94"
                    height="32"
                    rx="4"
                    fill="#0F2E24"
                    stroke="#14F195"
                  />
                  <text
                    x="491"
                    y={y + 20}
                    fontSize="10"
                    textAnchor="middle"
                    fill="#14F195"
                    fontWeight="600"
                  >
                    Confirmed
                  </text>
                </>
              ) : (
                <text
                  x="491"
                  y={y + 20}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#79828F"
                >
                  never confirmed
                </text>
              )}
            </g>
          );
        })}

        {/* what each keying choice produces */}
        <path
          d="M 223 182 L 223 212"
          fill="none"
          stroke="#FF8080"
          strokeWidth="1.3"
          markerEnd="url(#agArrow)"
          opacity=".8"
        />
        <path
          d="M 681 182 L 681 212"
          fill="none"
          stroke="#14F195"
          strokeWidth="1.3"
          markerEnd="url(#agArrow)"
          opacity=".8"
        />
        <path
          d="M 556 78 L 681 78 L 681 182"
          fill="none"
          stroke="#14F195"
          strokeWidth="1.3"
          opacity=".8"
        />

        <rect
          x="8"
          y="214"
          width="430"
          height="112"
          rx="6"
          fill="#161A20"
          stroke="#FF8080"
          strokeWidth="1.4"
        />
        <g fontFamily="ui-monospace, monospace">
          <text
            x="26"
            y="240"
            fontSize="11"
            fontWeight="600"
            fill="currentColor"
          >
            key = slot
          </text>
          <text x="26" y="264" fontSize="10.5" fill="#FF8080">
            nine events from three banks, fused into one block
          </text>
          <text x="26" y="284" fontSize="10.5" fill="#FF8080">
            no error, no warning, no way to notice
          </text>
          <text x="26" y="308" fontSize="10" fill="#79828F">
            every pipeline written before Agave 4.3
          </text>
        </g>

        <rect
          x="470"
          y="214"
          width="422"
          height="112"
          rx="6"
          fill="#161A20"
          stroke="#14F195"
          strokeWidth="1.4"
        />
        <g fontFamily="ui-monospace, monospace">
          <text
            x="488"
            y="240"
            fontSize="11"
            fontWeight="600"
            fill="currentColor"
          >
            key = (slot, bank_id)
          </text>
          <text x="488" y="264" fontSize="10.5" fill="#14F195">
            three events, all of them from bank_id 7
          </text>
          <text x="488" y="284" fontSize="10.5" fill="currentColor">
            banks 8 and 9 lost the race and are dropped
          </text>
          <text x="488" y="308" fontSize="10" fill="#79828F">
            needs Agave 4.3 on the node you stream from
          </text>
        </g>
      </svg>
    </Figure>
  );
}

export function AgBankIdAcrossConnections() {
  const rows = [
    {
      label: "connection A",
      host: "rpc-a.example",
      y: 40,
      cards: [
        { id: "bank_id 7", hash: "blockhash 9xK…d4" },
        { id: "bank_id 8", hash: "blockhash 3mB…7a" },
      ],
    },
    {
      label: "connection B",
      host: "rpc-b.example",
      y: 136,
      cards: [
        { id: "bank_id 12", hash: "blockhash 9xK…d4" },
        { id: "bank_id 7", hash: "blockhash 3mB…7a" },
      ],
    },
  ];

  return (
    <Figure
      caption={
        <>
          Both connections are reporting the same two banks for the same slot.
          Every <Mono>bank_id</Mono> disagrees, and one value — <Mono>7</Mono> —
          names a different bank on each side.
        </>
      }
      minWidth={720}
    >
      <svg
        viewBox="0 0 900 316"
        role="img"
        aria-label="The same slot seen through two gRPC connections. Connection A labels two banks bank_id 7 and bank_id 8; connection B labels the same two banks bank_id 12 and bank_id 7. Banks with matching blockhashes are the same bank and can be merged. Bank_id 7 on connection A and bank_id 7 on connection B are unrelated banks, so merging on bank_id corrupts the result."
      >
        <text
          x="8"
          y="20"
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          fill="#79828F"
        >
          one slot, two connections, two independently assigned counters
        </text>

        {rows.map((row) => (
          <g key={row.label} fontFamily="ui-monospace, monospace">
            <rect
              x="8"
              y={row.y}
              width="150"
              height="46"
              rx="4"
              fill="#1D222A"
              stroke="#272D36"
            />
            <text
              x="22"
              y={row.y + 20}
              fontSize="10.5"
              fill="currentColor"
              fontWeight="600"
            >
              {row.label}
            </text>
            <text x="22" y={row.y + 36} fontSize="9.5" fill="#79828F">
              {row.host}
            </text>

            {row.cards.map((card, j) => (
              <g key={card.id + j}>
                <rect
                  x={176 + j * 216}
                  y={row.y}
                  width="200"
                  height="46"
                  rx="4"
                  fill="#161A20"
                  stroke="#272D36"
                />
                <text
                  x={192 + j * 216}
                  y={row.y + 20}
                  fontSize="10.5"
                  fill="currentColor"
                >
                  {card.id}
                </text>
                <text
                  x={192 + j * 216}
                  y={row.y + 36}
                  fontSize="9.5"
                  fill="#14F195"
                >
                  {card.hash}
                </text>
              </g>
            ))}
          </g>
        ))}

        {/* blockhash matches — the same bank, safe to reconcile */}
        <path
          d="M 276 86 L 276 136"
          fill="none"
          stroke="#14F195"
          strokeWidth="1.4"
        />
        <path
          d="M 492 86 L 492 136"
          fill="none"
          stroke="#14F195"
          strokeWidth="1.4"
        />

        {/* same bank_id, different banks — the trap */}
        <path
          d="M 330 86 L 438 136"
          fill="none"
          stroke="#FF8080"
          strokeWidth="1.4"
          strokeDasharray="5 4"
        />
        <g>
          <circle cx="384" cy="111" r="9" fill="#331A1A" stroke="#FF8080" />
          <path
            d="M 380 107 L 388 115 M 388 107 L 380 115"
            stroke="#FF8080"
            strokeWidth="1.4"
          />
        </g>

        <g fontFamily="ui-monospace, monospace" fontSize="10.5">
          <line
            x1="616"
            y1="100"
            x2="644"
            y2="100"
            stroke="#14F195"
            strokeWidth="1.4"
          />
          <text x="654" y="104" fill="currentColor">
            blockhashes match
          </text>
          <text x="654" y="120" fill="#79828F" fontSize="9.5">
            one bank, safe to merge
          </text>
          <line
            x1="616"
            y1="146"
            x2="644"
            y2="146"
            stroke="#FF8080"
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />
          <text x="654" y="150" fill="currentColor">
            bank_ids match
          </text>
          <text x="654" y="166" fill="#79828F" fontSize="9.5">
            two unrelated banks
          </text>
        </g>

        <rect
          x="8"
          y="204"
          width="884"
          height="98"
          rx="6"
          fill="#161A20"
          stroke="#272D36"
        />
        <g fontFamily="ui-monospace, monospace">
          <text
            x="26"
            y="232"
            fontSize="11"
            fontWeight="600"
            fill="currentColor"
          >
            the only key that crosses connections is the blockhash
          </text>
          <text x="26" y="258" fontSize="10.5" fill="currentColor">
            It arrives on SubscribeUpdateBlockMeta. Nothing on a transaction or
          </text>
          <text x="26" y="278" fontSize="10.5" fill="currentColor">
            slot-status update is comparable across streams — bank_id least of
            all.
          </text>
        </g>
      </svg>
    </Figure>
  );
}

export function AgCommitmentLevels() {
  return (
    <Figure
      caption={
        <>
          The levels do not change meaning; the distance between them collapses.{" "}
          <Mono>processed</Mono> still means only that the transaction executed
          in a bank.
        </>
      }
      minWidth={720}
    >
      <svg
        viewBox="0 0 900 316"
        role="img"
        aria-label="Under TowerBFT a transaction goes from processed to confirmed at roughly 400 milliseconds, then to finalized at 12.8 seconds. Under Alpenglow, processed is followed by a single state in which confirmed and finalized are equivalent, reached in roughly 150 milliseconds. A block reaches that state either by the fast path, 80 percent notarizing in one round, or by two rounds of 60 percent, and the two paths are indistinguishable to a client."
      >
        <defs>
          <marker
            id="agArrow2"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0,0 7,3.5 0,7" fill="currentColor" />
          </marker>
          <marker
            id="agArrow2g"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0,0 7,3.5 0,7" fill="#14F195" />
          </marker>
        </defs>

        <text
          x="8"
          y="20"
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          fill="#79828F"
        >
          today — TowerBFT
        </text>
        <g fontFamily="ui-monospace, monospace" textAnchor="middle">
          {[
            { x: 8, label: "processed", sub: "executed" },
            { x: 156, label: "confirmed", sub: "~400ms, optimistic" },
            { x: 304, label: "finalized", sub: "12.8s" },
          ].map((node) => (
            <g key={node.label}>
              <rect
                x={node.x}
                y="32"
                width="128"
                height="48"
                rx="4"
                fill="#161A20"
                stroke="#272D36"
              />
              <text
                x={node.x + 64}
                y="52"
                fontSize="10.5"
                fill="currentColor"
                fontWeight="600"
              >
                {node.label}
              </text>
              <text x={node.x + 64} y="68" fontSize="9.5" fill="#79828F">
                {node.sub}
              </text>
            </g>
          ))}
        </g>
        <path
          d="M 140 56 L 152 56"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          markerEnd="url(#agArrow2)"
        />
        <path
          d="M 288 56 L 300 56"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          markerEnd="url(#agArrow2)"
        />

        <line
          x1="450"
          y1="14"
          x2="450"
          y2="112"
          stroke="#272D36"
          strokeWidth="1.2"
        />

        <text
          x="470"
          y="20"
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          fill="#79828F"
        >
          with Alpenglow
        </text>
        <g fontFamily="ui-monospace, monospace" textAnchor="middle">
          <rect
            x="470"
            y="32"
            width="128"
            height="48"
            rx="4"
            fill="#161A20"
            stroke="#272D36"
          />
          <text
            x="534"
            y="52"
            fontSize="10.5"
            fill="currentColor"
            fontWeight="600"
          >
            processed
          </text>
          <text x="534" y="68" fontSize="9.5" fill="#79828F">
            executed
          </text>

          <rect
            x="618"
            y="32"
            width="274"
            height="48"
            rx="4"
            fill="#0F2E24"
            stroke="#14F195"
          />
          <text x="755" y="52" fontSize="10.5" fill="#14F195" fontWeight="600">
            confirmed = finalized
          </text>
          <text x="755" y="68" fontSize="9.5" fill="currentColor">
            ~150ms, irreversible
          </text>
        </g>
        <path
          d="M 602 56 L 614 56"
          fill="none"
          stroke="#14F195"
          strokeWidth="1.3"
          markerEnd="url(#agArrow2g)"
        />
        <text
          x="470"
          y="98"
          fontFamily="ui-monospace, monospace"
          fontSize="9.5"
          fill="#79828F"
        >
          one state, two names — confirmed goes away in a later release
        </text>

        <line
          x1="8"
          y1="132"
          x2="892"
          y2="132"
          stroke="#272D36"
          strokeWidth="1.2"
        />
        <text
          x="8"
          y="158"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fontWeight="600"
          fill="currentColor"
        >
          two ways to get there, both invisible from the outside
        </text>

        <g fontFamily="ui-monospace, monospace">
          <rect
            x="8"
            y="176"
            width="300"
            height="42"
            rx="4"
            fill="#161A20"
            stroke="#272D36"
          />
          <text x="26" y="195" fontSize="10.5" fill="currentColor">
            fast path — 80% notarize
          </text>
          <text x="26" y="210" fontSize="9.5" fill="#79828F">
            one round
          </text>

          <rect
            x="8"
            y="232"
            width="300"
            height="42"
            rx="4"
            fill="#161A20"
            stroke="#272D36"
          />
          <text x="26" y="251" fontSize="10.5" fill="currentColor">
            60% notarize, then 60% finalize
          </text>
          <text x="26" y="266" fontSize="9.5" fill="#79828F">
            two rounds
          </text>
        </g>

        <path
          d="M 308 197 L 348 197 L 348 225 L 386 225"
          fill="none"
          stroke="#14F195"
          strokeWidth="1.3"
          markerEnd="url(#agArrow2g)"
        />
        <path
          d="M 308 253 L 348 253 L 348 225 L 386 225"
          fill="none"
          stroke="#14F195"
          strokeWidth="1.3"
        />

        <rect
          x="392"
          y="202"
          width="172"
          height="46"
          rx="23"
          fill="#0F2E24"
          stroke="#14F195"
        />
        <text
          x="478"
          y="230"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          textAnchor="middle"
          fill="#14F195"
          fontWeight="600"
        >
          finalized
        </text>

        <g fontFamily="ui-monospace, monospace" fontSize="10.5">
          <text x="588" y="196" fill="currentColor">
            Which path wins depends on
          </text>
          <text x="588" y="214" fill="currentColor">
            network latency and topology,
          </text>
          <text x="588" y="232" fill="currentColor">
            not on the block. A tight 60% can
          </text>
          <text x="588" y="250" fill="currentColor">
            finish two rounds before a
          </text>
          <text x="588" y="268" fill="currentColor">
            spread-out 80% finishes one.
          </text>
        </g>

        <text
          x="8"
          y="300"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="#79828F"
        >
          No new status appears between processed and finalized, and no client
          change is required on activation day.
        </text>
      </svg>
    </Figure>
  );
}

export function AgVotorCertificates() {
  // Each column is one route out of a proposed block. Rows line up across
  // columns so the three outcomes share a bottom line; `null` leaves a gap
  // bridged by a dashed connector.
  const columns = [
    {
      x: 8,
      head: "fast path — one round",
      accent: true,
      rows: [
        "NotarVote(b)",
        "≥ 80% of stake notarizes",
        "Fast-finalization cert",
        null,
        null,
      ],
      outcome: "FINAL",
      outcomeAccent: true,
    },
    {
      x: 312,
      head: "two rounds",
      accent: false,
      rows: [
        "NotarVote(b)",
        "≥ 60% but < 80%",
        "Notarization cert — not final",
        "FinalVote round, ≥ 60%",
        "Finalization cert",
      ],
      outcome: "FINAL",
      outcomeAccent: true,
    },
    {
      x: 616,
      head: "skip",
      accent: false,
      rows: ["SkipVote(s)", "≥ 60% of stake skips", "Skip cert", null, null],
      outcome: "slot is skipped",
      outcomeAccent: false,
    },
  ];

  const rowY = (i: number) => 134 + i * 36;
  const OUTCOME_Y = 314;

  return (
    <Figure
      caption={
        <>
          Three routes out of a proposed block, and the certificate each one
          produces. A node casts exactly one <Mono>NotarVote</Mono> or{" "}
          <Mono>SkipVote</Mono> per slot; fallback votes are added on top of
          that one, never in place of it.
        </>
      }
      minWidth={760}
    >
      <svg
        viewBox="0 0 900 452"
        role="img"
        aria-label="Three routes out of a block proposed for a slot. On the fast path a NotarVote reaching 80 percent of stake in one round produces a fast-finalization certificate and the block is final. On the two-round path a NotarVote reaching at least 60 but under 80 percent produces a notarization certificate, which is not final, and a second FinalVote round reaching 60 percent produces a finalization certificate and finality. On the third route a SkipVote reaching 60 percent produces a skip certificate and the slot is skipped. Separately, when votes split and no threshold clears, SafeToNotar or SafeToSkip fires, nodes cast an additional fallback vote, and a notarization-fallback certificate can form at 60 percent."
      >
        <defs>
          <marker
            id="agV"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon points="0,0 6,3 0,6" fill="currentColor" />
          </marker>
        </defs>

        <text
          x="8"
          y="18"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fill="#79828F"
        >
          every correct node casts exactly one notarization-or-skip vote per
          slot
        </text>

        {/* the block under consideration */}
        <rect
          x="340"
          y="32"
          width="220"
          height="32"
          rx="4"
          fill="#1D222A"
          stroke="#272D36"
        />
        <text
          x="450"
          y="52"
          fontFamily="ui-monospace, monospace"
          fontSize="10.5"
          textAnchor="middle"
          fill="currentColor"
          fontWeight="600"
        >
          block b proposed for slot s
        </text>

        <path
          d="M 450 64 L 450 82 L 146 82 L 146 98"
          fill="none"
          stroke="#272D36"
          strokeWidth="1.3"
        />
        <path
          d="M 450 64 L 450 98"
          fill="none"
          stroke="#272D36"
          strokeWidth="1.3"
        />
        <path
          d="M 450 64 L 450 82 L 754 82 L 754 98"
          fill="none"
          stroke="#272D36"
          strokeWidth="1.3"
        />

        {columns.map((col) => {
          const cx = col.x + 138;
          const bx = col.x + 20;
          const filled = col.rows.filter(Boolean).length;
          return (
            <g key={col.head} fontFamily="ui-monospace, monospace">
              {/* column head */}
              <rect
                x={col.x}
                y="98"
                width="276"
                height="28"
                rx="4"
                fill={col.accent ? "#0F2E24" : "#1D222A"}
                stroke={col.accent ? "#14F195" : "#272D36"}
              />
              <text
                x={cx}
                y="117"
                fontSize="10.5"
                textAnchor="middle"
                fill={col.accent ? "#14F195" : "currentColor"}
                fontWeight="600"
              >
                {col.head}
              </text>

              {col.rows.map((row, i) =>
                row === null ? null : (
                  <g key={row}>
                    <path
                      d={`M ${cx} ${i === 0 ? 126 : rowY(i - 1) + 28} L ${cx} ${rowY(i)}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      opacity=".45"
                      markerEnd="url(#agV)"
                    />
                    <rect
                      x={bx}
                      y={rowY(i)}
                      width="236"
                      height="28"
                      rx="4"
                      fill="#161A20"
                      stroke="#272D36"
                    />
                    <text
                      x={cx}
                      y={rowY(i) + 19}
                      fontSize="10.5"
                      textAnchor="middle"
                      fill="currentColor"
                    >
                      {row}
                    </text>
                  </g>
                ),
              )}

              {/* bridge the gap so all three outcomes share a bottom line */}
              <path
                d={`M ${cx} ${rowY(filled - 1) + 28} L ${cx} ${OUTCOME_Y}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                opacity=".45"
                strokeDasharray={filled < 5 ? "4 4" : undefined}
                markerEnd="url(#agV)"
              />

              <rect
                x={bx}
                y={OUTCOME_Y}
                width="236"
                height="32"
                rx={col.outcomeAccent ? 16 : 4}
                fill={col.outcomeAccent ? "#0F2E24" : "#161A20"}
                stroke={col.outcomeAccent ? "#14F195" : "#272D36"}
              />
              <text
                x={cx}
                y={OUTCOME_Y + 21}
                fontSize="10.5"
                textAnchor="middle"
                fill={col.outcomeAccent ? "#14F195" : "#79828F"}
                fontWeight="600"
              >
                {col.outcome}
              </text>
            </g>
          );
        })}

        {/* the fallback lane, which is not a fourth route but an extra vote */}
        <rect
          x="8"
          y="372"
          width="884"
          height="72"
          rx="6"
          fill="#161A20"
          stroke="#272D36"
          strokeDasharray="4 4"
        />
        <g fontFamily="ui-monospace, monospace">
          <text
            x="26"
            y="396"
            fontSize="10.5"
            fontWeight="600"
            fill="currentColor"
          >
            votes split and nothing clears 60%
          </text>
          <text x="26" y="416" fontSize="10.5" fill="currentColor">
            SafeToNotar / SafeToSkip fires → notar-fallback or skip-fallback
            vote → Notar-fallback cert at ≥ 60%
          </text>
          <text x="26" y="434" fontSize="10" fill="#79828F">
            A fallback vote is a second vote added on top of the one required
            vote, never a replacement, and only once it is safe to add.
          </text>
        </g>
      </svg>
    </Figure>
  );
}
