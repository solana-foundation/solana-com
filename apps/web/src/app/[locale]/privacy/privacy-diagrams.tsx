"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/**
 * One small animated diagram per ecosystem project, showing how it works
 * rather than a logo. White strokes, one accent for the private element.
 */

export type DiagramLabels = {
  sender: string;
  recipient: string;
  auditor: string;
  encryptedAmount: string;
  solana: string;
  channel: string;
  deposit: string;
  withdraw: string;
  ring: string;
  confidential: string;
  anonymous: string;
  allowList: string;
  transferLimits: string;
  auditorAccess: string;
  ownRules: string;
  input: string;
  nodes: string;
  result: string;
  compute: string;
  prover: string;
  proof: string;
  verified: string;
  rollup: string;
  delegate: string;
  commit: string;
  pool: string;
};

const ACCENT = "#55E9AB";
/** Text accent: light Solana purple rather than green. */
const TEXT_ACCENT = "#CA9FF5";
const LINE = "rgba(255,255,255,0.28)";
const DIM = "rgba(255,255,255,0.55)";

type DiagramProps = { labels: DiagramLabels; reduce: boolean };

function Box({
  x,
  y,
  w,
  h,
  label,
  accent = false,
  dashed = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  accent?: boolean;
  dashed?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={accent ? "rgba(85,233,171,0.06)" : "rgba(255,255,255,0.03)"}
        stroke={accent ? ACCENT : LINE}
        strokeDasharray={dashed ? "4 4" : undefined}
      />
      {label && (
        <text
          x={x + w / 2}
          y={y + h / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fill={accent ? TEXT_ACCENT : DIM}
          className="font-brand-mono"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function Caption({
  x,
  y,
  children,
  anchor = "middle",
  accent = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  accent?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={10}
      letterSpacing="0.08em"
      fill={accent ? TEXT_ACCENT : "rgba(255,255,255,0.45)"}
      className="font-brand-mono uppercase"
    >
      {children}
    </text>
  );
}

/** A dot that travels through a list of points and loops. */
function Packet({
  points,
  reduce,
  duration = 3,
  delay = 0,
  color = ACCENT,
  r = 4,
  hideBetween,
}: {
  points: Array<[number, number]>;
  reduce: boolean;
  duration?: number;
  delay?: number;
  color?: string;
  r?: number;
  /** Fade out between these point indexes, e.g. inside a tunnel. */
  hideBetween?: [number, number];
}) {
  const [x0, y0] = points[0];
  if (reduce) {
    const [mx, my] = points[Math.floor(points.length / 2)];
    return <circle cx={mx} cy={my} r={r} fill={color} />;
  }
  const opacity = points.map((_, i) =>
    hideBetween && i > hideBetween[0] && i < hideBetween[1] ? 0 : 1,
  );
  opacity[0] = 0;
  opacity[opacity.length - 1] = 0;
  return (
    <motion.circle
      cx={x0}
      cy={y0}
      r={r}
      fill={color}
      animate={{
        x: points.map(([x]) => x - x0),
        y: points.map(([, y]) => y - y0),
        opacity,
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Pulse({
  cx,
  cy,
  r,
  reduce,
  delay = 0,
}: {
  cx: number;
  cy: number;
  r: number;
  reduce: boolean;
  delay?: number;
}) {
  if (reduce) return null;
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={ACCENT}
      initial={{ opacity: 0.6, scale: 1 }}
      animate={{ opacity: 0, scale: 1.8 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      transition={{ duration: 2.4, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/* ── Diagrams ─────────────────────────────────────────────────────── */

function ConfidentialBalancesDiagram({ labels, reduce }: DiagramProps) {
  return (
    <>
      <Box x={20} y={70} w={100} h={44} label={labels.sender} />
      <Box x={280} y={70} w={100} h={44} label={labels.recipient} />
      <line x1={120} y1={92} x2={280} y2={92} stroke={LINE} />
      <Box x={160} y={56} w={80} h={28} label="••••••" accent />
      <Caption x={200} y={46} accent>
        {labels.encryptedAmount}
      </Caption>
      <Packet
        points={[
          [120, 92],
          [200, 92],
          [280, 92],
        ]}
        reduce={reduce}
      />
      <line
        x1={200}
        y1={92}
        x2={200}
        y2={176}
        stroke={ACCENT}
        strokeDasharray="3 4"
        opacity={0.6}
      />
      <Box x={140} y={176} w={120} h={44} label={labels.auditor} />
      <text
        x={200}
        y={244}
        textAnchor="middle"
        fontSize={13}
        fill={TEXT_ACCENT}
        className="font-brand-mono"
      >
        $8,450.00
      </text>
    </>
  );
}

function PrivateChannelsDiagram({ labels, reduce }: DiagramProps) {
  const members: Array<[number, number]> = [
    [140, 70],
    [260, 70],
    [200, 140],
  ];
  return (
    <>
      <Box x={70} y={30} w={260} h={150} dashed accent />
      <Caption x={82} y={50} anchor="start" accent>
        {labels.channel}
      </Caption>
      {members.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={14}
          fill="rgba(255,255,255,0.05)"
          stroke={LINE}
        />
      ))}
      <line x1={140} y1={70} x2={260} y2={70} stroke={LINE} />
      <line x1={260} y1={70} x2={200} y2={140} stroke={LINE} />
      <line x1={200} y1={140} x2={140} y2={70} stroke={LINE} />
      <Packet
        points={[members[0], members[1], members[2], members[0]]}
        reduce={reduce}
        duration={2.4}
        r={3.5}
      />
      <Box x={40} y={226} w={320} h={40} label={labels.solana} />
      <line x1={120} y1={226} x2={120} y2={180} stroke={LINE} />
      <line x1={280} y1={180} x2={280} y2={226} stroke={LINE} />
      <Caption x={112} y={206} anchor="end">
        {labels.deposit}
      </Caption>
      <Caption x={288} y={206} anchor="start">
        {labels.withdraw}
      </Caption>
      <Packet
        points={[
          [120, 226],
          [120, 180],
        ]}
        reduce={reduce}
        duration={2}
        color="white"
        r={3}
      />
      <Packet
        points={[
          [280, 180],
          [280, 226],
        ]}
        reduce={reduce}
        duration={2}
        delay={1}
        color="white"
        r={3}
      />
    </>
  );
}

function RingsDiagram({ labels, reduce }: DiagramProps) {
  const rings = [
    {
      cx: 80,
      color: "#CA9FF5",
      labelColor: "#CA9FF5",
      name: "A",
      privacy: labels.confidential,
      rule: labels.allowList,
    },
    {
      cx: 200,
      color: "#6693F7",
      labelColor: "#8FB0FA",
      name: "B",
      privacy: labels.anonymous,
      rule: labels.transferLimits,
    },
    {
      cx: 320,
      color: "#9945FF",
      labelColor: "#CA9FF5",
      name: "C",
      privacy: labels.confidential,
      rule: labels.auditorAccess,
    },
  ];
  const cy = 110;
  const r = 50;
  return (
    <>
      <line
        x1={80 + r}
        y1={cy}
        x2={200 - r}
        y2={cy}
        stroke={LINE}
        strokeDasharray="3 4"
      />
      <line
        x1={200 + r}
        y1={cy}
        x2={320 - r}
        y2={cy}
        stroke={LINE}
        strokeDasharray="3 4"
      />
      {rings.map((ring, index) => (
        <g key={ring.name}>
          <motion.g
            style={{ transformOrigin: `${ring.cx}px ${cy}px` }}
            animate={reduce ? undefined : { rotate: index % 2 ? -360 : 360 }}
            transition={{
              duration: 14 + index * 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i / 36) * Math.PI * 2;
              return (
                <circle
                  key={i}
                  cx={(ring.cx + Math.cos(a) * r).toFixed(2)}
                  cy={(cy + Math.sin(a) * r).toFixed(2)}
                  r={2.2}
                  fill={ring.color}
                  opacity={0.4 + (i % 6) * 0.1}
                />
              );
            })}
          </motion.g>
          <text
            x={ring.cx}
            y={cy + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill="white"
            className="font-brand-mono"
          >
            {`${labels.ring} ${ring.name}`}
          </text>
          <rect
            x={ring.cx - 54}
            y={186}
            width={108}
            height={50}
            rx={8}
            fill="rgba(255,255,255,0.03)"
            stroke={LINE}
          />
          <text
            x={ring.cx}
            y={205}
            textAnchor="middle"
            fontSize={10}
            fill={ring.labelColor}
            className="font-brand-mono"
          >
            {ring.privacy}
          </text>
          <text
            x={ring.cx}
            y={223}
            textAnchor="middle"
            fontSize={10}
            fill={DIM}
            className="font-brand-mono"
          >
            {ring.rule}
          </text>
          <line x1={ring.cx} y1={cy + r} x2={ring.cx} y2={186} stroke={LINE} />
        </g>
      ))}
      <Packet
        points={[
          [80 + r, cy],
          [200 - r, cy],
          [200, cy],
          [200 + r, cy],
          [320 - r, cy],
        ]}
        hideBetween={[1, 3]}
        reduce={reduce}
        duration={3.6}
        color="white"
        r={3.5}
      />
      <Caption x={200} y={262}>
        {labels.ownRules}
      </Caption>
    </>
  );
}

function ArciumDiagram({ labels, reduce }: DiagramProps) {
  const nodes: Array<[number, number]> = [
    [200, 60],
    [200, 140],
    [200, 220],
  ];
  return (
    <>
      <Box x={10} y={118} w={100} h={44} label={labels.input} accent />
      <Box x={290} y={118} w={100} h={44} label={labels.result} />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <line x1={110} y1={140} x2={x - 22} y2={y} stroke={LINE} />
          <line x1={x + 22} y1={y} x2={290} y2={140} stroke={LINE} />
          <rect
            x={x - 22}
            y={y - 18}
            width={44}
            height={36}
            rx={8}
            fill="rgba(255,255,255,0.04)"
            stroke={LINE}
          />
          <Pulse cx={x} cy={y} r={12} reduce={reduce} delay={i * 0.4} />
          <Packet
            points={[
              [110, 140],
              [x - 22, y],
              [x + 22, y],
              [290, 140],
            ]}
            reduce={reduce}
            duration={3}
            delay={i * 0.25}
            r={3}
          />
        </g>
      ))}
      <Caption x={200} y={268}>
        {labels.nodes}
      </Caption>
    </>
  );
}

function EncryptDiagram({ labels, reduce }: DiagramProps) {
  return (
    <>
      <Box x={10} y={118} w={96} h={44} label={labels.sender} />
      <Box x={294} y={118} w={96} h={44} label={labels.recipient} />
      <rect
        x={106}
        y={112}
        width={188}
        height={56}
        rx={28}
        fill="rgba(85,233,171,0.06)"
        stroke={ACCENT}
        strokeDasharray="4 4"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <text
          key={i}
          x={130 + i * 35}
          y={144}
          textAnchor="middle"
          fontSize={11}
          fill={TEXT_ACCENT}
          opacity={0.5}
          className="font-brand-mono"
        >
          {["a3", "f9", "0c", "7e", "d1"][i]}
        </text>
      ))}
      <Packet
        points={[
          [106, 140],
          [140, 140],
          [200, 140],
          [260, 140],
          [294, 140],
        ]}
        hideBetween={[0, 4]}
        reduce={reduce}
        duration={3}
        color="white"
      />
      <Caption x={200} y={96} accent>
        {labels.encryptedAmount}
      </Caption>
    </>
  );
}

function IncoDiagram({ labels, reduce }: DiagramProps) {
  return (
    <>
      <Box x={10} y={70} w={90} h={40} label="Enc(x)" accent />
      <Box x={10} y={170} w={90} h={40} label="Enc(y)" accent />
      <line x1={100} y1={90} x2={155} y2={140} stroke={LINE} />
      <line x1={100} y1={190} x2={155} y2={140} stroke={LINE} />
      <circle
        cx={200}
        cy={140}
        r={45}
        fill="rgba(255,255,255,0.03)"
        stroke={LINE}
      />
      <motion.circle
        cx={200}
        cy={140}
        r={34}
        fill="none"
        stroke={ACCENT}
        strokeDasharray="6 8"
        style={{ transformOrigin: "200px 140px" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <text
        x={200}
        y={144}
        textAnchor="middle"
        fontSize={14}
        fill="white"
        className="font-brand-mono"
      >
        f(·)
      </text>
      <line x1={245} y1={140} x2={290} y2={140} stroke={LINE} />
      <Box x={290} y={120} w={100} h={40} label="Enc(f)" accent />
      <Caption x={200} y={220}>
        {labels.compute}
      </Caption>
      <Packet
        points={[
          [100, 90],
          [155, 140],
        ]}
        reduce={reduce}
        duration={2}
        r={3}
      />
      <Packet
        points={[
          [100, 190],
          [155, 140],
        ]}
        reduce={reduce}
        duration={2}
        delay={0.3}
        r={3}
      />
      <Packet
        points={[
          [245, 140],
          [290, 140],
        ]}
        reduce={reduce}
        duration={2}
        delay={1}
        r={3}
      />
    </>
  );
}

function LigeroDiagram({ labels, reduce }: DiagramProps) {
  return (
    <>
      <Box x={10} y={110} w={110} h={60} />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={26}
          y={124 + i * 12}
          width={78 - i * 16}
          height={5}
          rx={2.5}
          fill="rgba(255,255,255,0.25)"
        />
      ))}
      <Caption x={65} y={96}>
        {labels.prover}
      </Caption>
      <line x1={120} y1={140} x2={280} y2={140} stroke={LINE} />
      <Caption x={200} y={124} accent>
        {labels.proof}
      </Caption>
      {reduce ? (
        <text
          x={200}
          y={146}
          textAnchor="middle"
          fontSize={16}
          fill={TEXT_ACCENT}
        >
          π
        </text>
      ) : (
        <motion.text
          x={140}
          y={146}
          textAnchor="middle"
          fontSize={16}
          fill={TEXT_ACCENT}
          animate={{ x: [0, 120], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          π
        </motion.text>
      )}
      <Box x={280} y={110} w={110} h={60} label={labels.solana} />
      <motion.g
        initial={false}
        animate={reduce ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0] }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          times: [0, 0.6, 0.7, 0.95, 1],
        }}
      >
        <circle cx={335} cy={210} r={14} fill="none" stroke={ACCENT} />
        <path
          d="M328 210 l5 5 l9 -10"
          fill="none"
          stroke={ACCENT}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Caption x={335} y={248} accent>
          {labels.verified}
        </Caption>
      </motion.g>
    </>
  );
}

function MagicBlockDiagram({ labels, reduce }: DiagramProps) {
  return (
    <>
      <Box x={60} y={40} w={280} h={70} accent />
      <Caption x={74} y={60} anchor="start" accent>
        {labels.rollup}
      </Caption>
      {Array.from({ length: 12 }, (_, i) => (
        <motion.rect
          key={i}
          x={80 + i * 20}
          y={76}
          width={12}
          height={14}
          rx={2}
          fill={ACCENT}
          initial={false}
          animate={reduce ? { opacity: 0.6 } : { opacity: [0.15, 1, 0.15] }}
          transition={{ duration: 1.2, delay: i * 0.1, repeat: Infinity }}
        />
      ))}
      <Box x={20} y={210} w={360} h={56} />
      <Caption x={34} y={230} anchor="start">
        {labels.solana}
      </Caption>
      {Array.from({ length: 4 }, (_, i) => (
        <rect
          key={i}
          x={60 + i * 80}
          y={240}
          width={48}
          height={14}
          rx={2}
          fill="rgba(255,255,255,0.3)"
        />
      ))}
      <line x1={110} y1={210} x2={110} y2={110} stroke={LINE} />
      <line x1={290} y1={110} x2={290} y2={210} stroke={LINE} />
      <Caption x={102} y={164} anchor="end">
        {labels.delegate}
      </Caption>
      <Caption x={298} y={164} anchor="start">
        {labels.commit}
      </Caption>
      <Packet
        points={[
          [110, 210],
          [110, 110],
        ]}
        reduce={reduce}
        duration={2.2}
        color="white"
        r={3}
      />
      <Packet
        points={[
          [290, 110],
          [290, 210],
        ]}
        reduce={reduce}
        duration={2.2}
        delay={1.1}
        r={3}
      />
    </>
  );
}

function PrivacyCashDiagram({ labels, reduce }: DiagramProps) {
  const left: Array<[number, number]> = [
    [40, 70],
    [40, 140],
    [40, 210],
  ];
  const right: Array<[number, number]> = [
    [360, 70],
    [360, 140],
    [360, 210],
  ];
  return (
    <>
      <circle
        cx={200}
        cy={140}
        r={62}
        fill="rgba(85,233,171,0.05)"
        stroke={ACCENT}
      />
      <motion.g
        style={{ transformOrigin: "200px 140px" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={(200 + Math.cos(a) * (20 + (i % 3) * 12)).toFixed(2)}
              cy={(140 + Math.sin(a) * (20 + (i % 3) * 12)).toFixed(2)}
              r={3}
              fill={ACCENT}
              opacity={0.7}
            />
          );
        })}
      </motion.g>
      <Caption x={200} y={230} accent>
        {labels.pool}
      </Caption>
      {left.map(([x, y], i) => (
        <g key={`l${i}`}>
          <circle cx={x} cy={y} r={10} fill="#000" stroke={LINE} />
          <line x1={x + 10} y1={y} x2={140} y2={140} stroke={LINE} />
          <Packet
            points={[
              [x + 10, y],
              [140, 140],
            ]}
            reduce={reduce}
            duration={2}
            delay={i * 0.5}
            color="white"
            r={3}
          />
        </g>
      ))}
      {right.map(([x, y], i) => (
        <g key={`r${i}`}>
          <circle cx={x} cy={y} r={10} fill="#000" stroke={LINE} />
          <line x1={260} y1={140} x2={x - 10} y2={y} stroke={LINE} />
          <Packet
            points={[
              [260, 140],
              [x - 10, y],
            ]}
            reduce={reduce}
            duration={2}
            delay={0.8 + i * 0.6}
            color="white"
            r={3}
          />
        </g>
      ))}
      <Caption x={40} y={252}>
        {labels.sender}
      </Caption>
      <Caption x={360} y={252}>
        {labels.recipient}
      </Caption>
    </>
  );
}

const DIAGRAMS: Record<string, (props: DiagramProps) => ReactNode> = {
  confidentialBalances: ConfidentialBalancesDiagram,
  privateChannels: PrivateChannelsDiagram,
  rings: RingsDiagram,
  arcium: ArciumDiagram,
  encrypt: EncryptDiagram,
  inco: IncoDiagram,
  ligero: LigeroDiagram,
  magicBlock: MagicBlockDiagram,
  privacyCash: PrivacyCashDiagram,
};

export function hasDiagram(key: string) {
  return key in DIAGRAMS;
}

export function ProjectDiagram({
  project,
  labels,
  reduce,
}: {
  project: string;
  labels: DiagramLabels;
  reduce: boolean;
}) {
  const Diagram = DIAGRAMS[project];
  if (!Diagram) return null;
  return (
    <svg
      viewBox="0 0 400 280"
      className="h-auto w-full"
      aria-hidden="true"
      focusable="false"
    >
      <Diagram labels={labels} reduce={reduce} />
    </svg>
  );
}
