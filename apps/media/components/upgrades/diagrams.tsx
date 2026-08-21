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
