import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { getAlternates } from "@workspace/i18n/routing";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { ChevronDown } from "@boxicons/react/ChevronDown";
import { Divider } from "@/components/solutions/divider.v2";
import { fetchSolutionNews } from "@/lib/media/solution-news";
import {
  DashboardCarousel,
  HeroScene,
  Lead,
  PageSelectionColor,
  Tabs,
  type Panel,
} from "./interactions";

const repo = "https://github.com/solana-foundation/solana-microscope";
const asset = "/microscope";
const title = "Microscope: Solana Program Monitoring and Alerting";
const description =
  "Monitor Solana program instructions, events, and Squads multisig activity with self-hosted dashboards and alerts. Explore setup options and get started with Microscope.";

export const revalidate = 300;

const container = "mx-auto max-w-[1440px] px-[20px] md:px-[32px] xl:px-[40px]";
const link =
  "text-[#14f195] underline decoration-[#14f195]/50 underline-offset-4 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14f195]";
const card = "rounded-xl border border-white/10 bg-white/[0.04]";
const muted = "text-[#ABABBA]";
const code =
  "rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-white";
const primaryButton =
  "inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-base font-medium tracking-[-0.16px] text-black no-underline transition-colors hover:bg-[#ececec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14f195] md:py-3 md:text-lg md:tracking-[-0.18px]";
const secondaryButton =
  "inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-5 py-2.5 text-base font-medium tracking-[-0.16px] text-white no-underline transition-colors hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14f195] md:py-3 md:text-lg md:tracking-[-0.18px]";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const alternates = getAlternates("/microscope", locale);
  const image = {
    url: `${asset}/social.webp`,
    width: 1200,
    height: 630,
    alt: title,
  };
  return {
    title,
    description,
    keywords: [
      "Solana program monitoring",
      "Solana alerting",
      "Solana Microscope",
      "Solana observability",
    ],
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: "website",
      siteName: "Solana",
      locale,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@solana",
      title,
      description,
      images: [image],
    },
  };
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Divider />
      <section
        aria-labelledby={id}
        className={`${container} pb-[48px] pt-[64px] md:pb-[80px] md:pt-[112px] xl:pb-[96px] xl:pt-[160px]`}
      >
        <h2
          id={id}
          className="mb-[32px] mt-0 scroll-mt-24 font-brand text-[32px] font-medium leading-[1.25] tracking-[-1.28px] text-white md:text-[40px] md:leading-[1.1] md:tracking-[-1.6px] xl:mb-[48px] xl:text-[64px] xl:leading-[1.125] xl:tracking-[-2.56px]"
        >
          {title}
        </h2>
        <div className="space-y-5">{children}</div>
      </section>
    </>
  );
}
function Subheading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="mb-4 mt-12 font-brand text-xl font-medium leading-[1.33] tracking-[-0.4px] text-white md:text-2xl md:tracking-[-0.48px]"
    >
      {children}
    </h3>
  );
}
function Pill({
  children,
  faint = false,
}: {
  children: ReactNode;
  faint?: boolean;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-xs leading-5 ${faint ? "border-dashed border-white/20 text-[#ABABBA]" : "border-white/15 bg-white/[0.06] text-white"}`}
    >
      {children}
    </span>
  );
}
function InlineCode({ children }: { children: ReactNode }) {
  return <code className={code}>{children}</code>;
}
function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.04]">
      <pre className="m-0 p-4 font-mono text-[0.8rem] leading-6 text-white md:p-5">
        <code>{children}</code>
      </pre>
    </div>
  );
}
function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 md:grid-cols-[2.5rem_minmax(0,1fr)] md:gap-6">
      <div className="flex flex-col items-center">
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white bg-black text-sm font-medium leading-none text-white md:size-10 md:text-base">
          {n}
        </span>
        {n < 4 && <span aria-hidden className="my-2 w-px grow bg-white/15" />}
      </div>
      <div className="min-w-0 space-y-4 pb-12 font-sans text-base leading-[1.6] md:text-lg">
        <h3 className="m-0 font-brand text-xl font-medium leading-8 tracking-[-0.4px] text-white md:text-2xl md:leading-10 md:tracking-[-0.48px]">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}
function ConfigKey({ letter }: { letter: string }) {
  return (
    <span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-[#14f195] align-middle text-xs font-medium leading-none text-black">
      {letter}
    </span>
  );
}
function ConfigSection({
  letter,
  title,
  optional,
  children,
}: {
  letter: string;
  title: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <Subheading id={`cfg-${title.toLowerCase().replaceAll(" ", "-")}`}>
        <ConfigKey letter={letter} />
        {title}
        {optional && (
          <span className="ml-2 align-middle text-sm font-normal tracking-normal text-[#ABABBA]">
            Optional
          </span>
        )}
      </Subheading>
      {children}
    </section>
  );
}
function Table({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <div className={`${card} overflow-x-auto`}>
      <table className="m-0 w-full min-w-[30rem] border-collapse font-sans text-sm md:text-base">
        <tbody>
          {rows.map(([key, value], i) => (
            <tr key={i} className="border-b border-white/10 last:border-0">
              <th
                scope="row"
                className="w-px whitespace-nowrap px-4 py-3 text-left align-top font-medium text-white"
              >
                {key}
              </th>
              <td className={`px-4 py-3 align-top ${muted}`}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const panels: Panel[] = [
  {
    src: `${asset}/panel-1-rates.webp`,
    title: "Transactions / sec and Errors / sec",
    alt: "Two time-series charts showing transaction and on-chain instruction error rates over the last hour",
    caption:
      "Decoded transaction rate and failed on-chain instructions. A failed instruction is not an indexer error.",
    width: 1568,
    height: 296,
  },
  {
    src: `${asset}/panel-2-instructions.webp`,
    title: "Instructions by type",
    alt: "Time-series chart of deposit, redeem, update_rate and withdraw instructions",
    caption:
      "Every decoded instruction your program ran, grouped by instruction name.",
    width: 1568,
    height: 296,
  },
  {
    src: `${asset}/panel-3-liveness.webp`,
    title: "Seconds since last decoded activity and Indexer up",
    alt: "Panels showing 2.28 minutes since the last decoded activity and indexer status UP",
    caption:
      "Shows how long since Microscope last decoded anything and whether the indexer is running.",
    width: 1568,
    height: 296,
  },
  {
    src: `${asset}/panel-4-squads.webp`,
    title: "Squads multisig activity",
    alt: "Chart with a v4 proposal_approved series",
    caption:
      "The multisig’s actions over time. The series appears once the multisig does something.",
    width: 1568,
    height: 296,
  },
  {
    src: `${asset}/panel-5-events.webp`,
    title: "Decoded program events",
    alt: "Table of decoded events with time, event, signature, slot, failed and assets columns",
    caption:
      "Each decoded event as a row. “Not Found” means that event has no configured Assets field.",
    width: 1568,
    height: 448,
  },
  {
    src: `${asset}/panel-6-squads-details.webp`,
    title: "Squads multisig activity details",
    alt: "Table with a Squads v4 proposal_approved row",
    caption:
      "Each multisig action as a row: action, version, instruction, signature and slot.",
    width: 1568,
    height: 440,
  },
  {
    src: `${asset}/panel-7-rpc-health.webp`,
    title: "RPC polling health",
    alt: "Four panels for last successful RPC poll, polling lag, quarantined transactions and confirmed head slot",
    caption:
      "Shown when RPC polling runs: last successful poll, lag, quarantined transactions and confirmed head slot.",
    width: 1544,
    height: 221,
  },
];

function Flow() {
  return (
    <figure className="m-0 space-y-4">
      <div
        role="img"
        aria-label="Confirmed Solana transactions from your program and optional Squads multisig flow through gRPC or RPC into Microscope on your server, which sends alerts to your team"
        className="grid gap-3 font-sans md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.25fr)_auto_minmax(0,1fr)] md:items-stretch"
      >
        <div className={`${card} space-y-4 p-5`}>
          <span className="block text-sm font-medium tracking-[-0.14px] text-[#14f195]">
            On Solana
          </span>
          <p className="m-0 text-base font-medium text-white">
            Your program
            <span className={`block text-sm font-normal ${muted}`}>
              decoded from its IDL
            </span>
          </p>
          <p className="m-0 text-base font-medium text-white">
            Squads multisig
            <span className={`block text-sm font-normal ${muted}`}>
              optional · v3, v4 or v5
            </span>
          </p>
        </div>
        <div
          aria-hidden
          className={`flex items-center justify-center gap-2 text-center text-sm md:flex-col ${muted}`}
        >
          <span>transactions</span>
          <ArrowRight
            pack="filled"
            aria-hidden
            className="size-5 rotate-90 text-[#14f195] md:rotate-0"
          />
          <span>gRPC or RPC</span>
        </div>
        <div className="relative space-y-4 overflow-hidden rounded-xl border border-[#14f195]/40 bg-white/10 p-5">
          <span className="block text-sm font-medium tracking-[-0.14px] text-[#14f195]">
            Your server
          </span>
          <strong className="block font-brand text-2xl font-medium tracking-[-0.48px] text-white">
            Microscope
          </strong>
          <div className="flex flex-wrap gap-1">
            <Pill>decode</Pill>
            <Pill>dashboards</Pill>
            <Pill>alert rules</Pill>
          </div>
        </div>
        <div
          aria-hidden
          className={`flex items-center justify-center gap-2 text-center text-sm md:flex-col ${muted}`}
        >
          <span>alerts</span>
          <ArrowRight
            pack="filled"
            aria-hidden
            className="size-5 rotate-90 text-[#14f195] md:rotate-0"
          />
          <span>by severity</span>
        </div>
        <div className={`${card} space-y-4 p-5`}>
          <span className="block text-sm font-medium tracking-[-0.14px] text-[#14f195]">
            Your team
          </span>
          <p className="m-0 text-base font-medium text-white">Slack</p>
          <p className="m-0 text-base font-medium text-white">Telegram</p>
          <p className="m-0 text-base font-medium text-white">PagerDuty</p>
        </div>
      </div>
      <figcaption className={`font-sans text-sm leading-relaxed ${muted}`}>
        One deployment watches one program and, optionally, one multisig. Alerts
        fire on decoded activity, never on raw log strings.
      </figcaption>
    </figure>
  );
}

function SetupMatrix() {
  const rows: [string, string, boolean[]][] = [
    [
      "Docker Compose",
      "your machine or one host",
      [true, true, true, true, true],
    ],
    [
      "Terraform",
      "a VM in your AWS or GCP account",
      [true, true, true, true, true],
    ],
    [
      "Grafana Cloud",
      "your existing Grafana Cloud stack",
      [true, true, false, false, false],
    ],
    [
      "Kubernetes · reference",
      "your cluster and observability",
      [true, false, false, false, false],
    ],
  ];
  return (
    <figure className="space-y-2">
      <div className={`${card} overflow-x-auto`}>
        <table className="m-0 w-full min-w-[35rem] border-collapse font-sans">
          <thead className="text-sm font-medium text-[#ABABBA]">
            <tr>
              {[
                "Setup",
                "Indexer",
                "Alloy",
                "Prometheus",
                "Loki",
                "Grafana",
              ].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="border-b border-white/10 px-2 py-3 text-center font-medium first:px-4 first:text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, description, cells]) => (
              <tr key={name} className="border-b border-white/10 last:border-0">
                <th
                  scope="row"
                  className="px-4 py-3 text-left text-base font-medium text-white"
                >
                  {name}
                  <small className={`block text-sm font-normal ${muted}`}>
                    {description}
                  </small>
                </th>
                {cells.map((run, index) => (
                  <td key={index} className="px-2 py-3 text-center">
                    <span
                      role="img"
                      aria-label={
                        run ? "Microscope runs it" : "You already run it"
                      }
                      className={`inline-block size-3.5 rounded-full ${run ? "bg-[#14f195]" : "border-2 border-white/40"}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className={`flex flex-wrap gap-5 font-sans text-sm ${muted}`}>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#14f195]" />
          Microscope runs it
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full border-2 border-white/40" />
          You already run it
        </span>
      </figcaption>
    </figure>
  );
}
function ConfigReference() {
  return (
    <div className={`${card} space-y-6 p-4 sm:p-6 xl:p-8`}>
      <p>
        <InlineCode>microscope.toml</InlineCode> drives the deployment.
        Microscope generates the Grafana dashboard, alert rules, contact points
        and notification policies from it. On the Terraform path, the same
        blocks go in <InlineCode>terraform.tfvars</InlineCode>, and Terraform
        writes this file for you.
      </p>
      <div className="space-y-3">
        {[
          ["A", 'program_id = "<PROGRAM_ID>"\nidl_path = "idl/idl1.json"'],
          [
            "B",
            '[multisig]\nvault_address = "<SQUADS_DEFAULT_VAULT>"\nstate_address = "<SQUADS_STATE_ACCOUNT>"\nversion = "v4"',
          ],
          ["C", '[datasource]\nmode = "rpc"'],
          [
            "D",
            '[dashboard]\nevent_fields = ["name", "signature", "slot", "failed", "data.amount"]',
          ],
          [
            "E",
            '[alerting]\nlookback_window_seconds = 60\nevaluation_interval_seconds = 10\nexplorer_transaction_url = "https://explorer.solana.com/tx/{signature}"',
          ],
          [
            "F",
            '[[alerts]]\nkind = "event"\nname = "payment_settled"\nconditions = [\n  { field = "data.amount", operator = "gte", value = 1000 },\n  { field = "failed", operator = "eq", value = false },\n]\nseverity = "warning"\nchannels = ["slack"]',
          ],
        ].map(([letter, text]) => (
          <div
            key={letter}
            className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2 rounded-xl border border-white/10 bg-black/40 p-3"
          >
            <ConfigKey letter={letter ?? ""} />
            <pre className="m-0 overflow-x-auto font-mono text-xs leading-5 text-white">
              <code>{text}</code>
            </pre>
          </div>
        ))}
        <p className={`text-sm ${muted}`}>B, C and D are optional.</p>
      </div>
      <ConfigSection letter="A" title="Program">
        <p>
          The program to watch and the IDL to decode it with. The decoder is
          compiled from that IDL, so run <InlineCode>just generate</InlineCode>{" "}
          after changing either value. If the config and build disagree, the
          indexer refuses to start.
        </p>
      </ConfigSection>
      <ConfigSection letter="B" title="Multisig" optional>
        <p>
          The Squads multisig that controls your program. All three values are
          required together.
        </p>
        <Table
          rows={[
            [
              <InlineCode key="a">vault_address</InlineCode>,
              "The default vault shown in the Squads UI",
            ],
            [
              <InlineCode key="b">state_address</InlineCode>,
              <>
                Its internal state account: <InlineCode>Ms</InlineCode> on v3,{" "}
                <InlineCode>Multisig</InlineCode> on v4,{" "}
                <InlineCode>Settings</InlineCode> on v5
              </>,
            ],
            [
              <InlineCode key="c">version</InlineCode>,
              <div key="v" className="flex gap-1">
                <Pill>v3</Pill>
                <Pill>v4</Pill>
                <Pill>v5</Pill>
              </div>,
            ],
          ]}
        />
        <p className={`text-sm ${muted}`}>
          Watching the state account covers every vault in the multisig. To
          alert on one vault, add a condition on the vault index (on v4,{" "}
          <InlineCode>data.data.args.vault_index</InlineCode>).
        </p>
      </ConfigSection>
      <ConfigSection letter="C" title="Datasource" optional>
        <p>
          Leave it out to stream from Yellowstone. Set{" "}
          <InlineCode>{'mode = "rpc"'}</InlineCode> to poll your RPC endpoint
          instead.
        </p>
      </ConfigSection>
      <ConfigSection letter="D" title="Dashboard" optional>
        <p>
          These JSON paths set the columns in the event and multisig tables. A
          missing field shows as an empty cell; the full record stays in Loki.
          Every record also carries <InlineCode>instruction_index</InlineCode>,{" "}
          <InlineCode>instruction_path</InlineCode> and{" "}
          <InlineCode>stack_height</InlineCode>.
        </p>
      </ConfigSection>
      <ConfigSection letter="E" title="Alerting defaults">
        <p>
          Every alert inherits this timing unless it overrides it. Evaluation
          intervals must be multiples of 10 seconds. The explorer URL links each
          notification to its transaction; add{" "}
          <InlineCode>?cluster=devnet</InlineCode> for devnet.
        </p>
      </ConfigSection>
      <ConfigSection letter="F" title="Alerts">
        <p>
          Use one <InlineCode>[[alerts]]</InlineCode> block per rule.
        </p>
        <Table
          rows={[
            [
              <InlineCode key="kind">kind</InlineCode>,
              <div key="v" className="flex flex-wrap gap-1">
                <Pill>event</Pill>
                <Pill>instruction</Pill>
                <Pill>multisig</Pill>
              </div>,
            ],
            [
              <InlineCode key="name">name</InlineCode>,
              <>
                An instruction or event declared by your IDL in snake_case, or a
                Squads action such as <InlineCode>proposal_approved</InlineCode>
                . Anything else is rejected at startup.
              </>,
            ],
            [
              <InlineCode key="match">match</InlineCode>,
              <>
                <Pill>all</Pill> <Pill>any</Pill> — how conditions combine.
                Defaults to <InlineCode>all</InlineCode>.
              </>,
            ],
            [
              <InlineCode key="conditions">conditions</InlineCode>,
              <>
                The <InlineCode>field</InlineCode> is a dot path into the
                record. Operators: eq, ne, gt, gte, lt, lte, contains, exists.
              </>,
            ],
            [
              <InlineCode key="severity">severity</InlineCode>,
              <div key="v" className="flex flex-wrap gap-1">
                <Pill>critical</Pill>
                <Pill>error</Pill>
                <Pill>warning</Pill>
                <Pill>info</Pill>
              </div>,
            ],
            [
              <InlineCode key="channels">channels</InlineCode>,
              <>
                Slack, Telegram or PagerDuty. Leave empty to evaluate the rule
                without sending anything.
              </>,
            ],
          ]}
        />
      </ConfigSection>
      <aside className="space-y-2 rounded-xl border border-[#e8b76a]/40 bg-[#e8b76a]/[0.08] p-4 font-sans text-base leading-relaxed md:p-5">
        <strong className="block text-base font-medium text-[#e8b76a]">
          Easy to get wrong
        </strong>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <InlineCode>exists</InlineCode> skips missing, null and empty string
            values.
          </li>
          <li>
            <InlineCode>ne</InlineCode> needs the field to be present.
          </li>
          <li>Quote integers above 2^53. Loki compares numbers as float64.</li>
          <li>
            Multisig alerts fire only on successful activity. A{" "}
            <InlineCode>failed</InlineCode> condition is rejected.
          </li>
          <li>
            <InlineCode>multisig_created</InlineCode> and{" "}
            <InlineCode>program_*</InlineCode> actions pass validation but
            reference no state account, so they cannot fire.
          </li>
        </ul>
      </aside>
      <Subheading id="cfg-apply">After you edit</Subheading>
      <p>
        Run <InlineCode>just up</InlineCode> again. Grafana reads alert rules at
        startup, so the command regenerates them and recreates Grafana. A plain{" "}
        <InlineCode>docker compose up</InlineCode> leaves the running stack on
        the old rules.
      </p>
    </div>
  );
}

function Faq() {
  const items: [string, ReactNode][] = [
    [
      "How do I backfill history?",
      <>
        <p>
          The indexer sees activity only from the moment it starts. With the
          stack running, load earlier activity from a regular RPC endpoint:
        </p>
        <CodeBlock>
          RPC_URL=https://your-rpc-endpoint just backfill 7d
        </CodeBlock>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            It crawls your program and multisig state account with{" "}
            <InlineCode>getSignaturesForAddress</InlineCode>, decodes through
            the same pipeline and backdates records to block time.
          </li>
          <li>
            <strong>Backfilled records never trigger alerts.</strong> They fall
            outside the alert lookback window.
          </li>
          <li>
            Windows accept s, m, h, d and w and cannot exceed Loki retention: 30
            days in the bundled config.
          </li>
          <li>
            Any failure aborts before anything is written. Prometheus metrics
            are not backfilled.
          </li>
        </ul>
        <p className={`text-sm ${muted}`}>
          On Grafana Cloud, push through Alloy and state the depth cap yourself:
          add{" "}
          <InlineCode>
            --loki-url http://alloy:3100 --loki-max-age 30d
          </InlineCode>
          .
        </p>
      </>,
    ],
    [
      "What does it cost to run?",
      <>
        <p>
          <strong>About $50 a month</strong> on AWS or GCP for the VM, disk and
          public IPv4 address, or run it on your own machine. Buckets and
          secrets cost cents. You pay for your own Yellowstone or RPC endpoint.
        </p>
        <p className={`text-sm ${muted}`}>
          The stack needs 2 vCPUs, 4 GiB RAM and 40 GiB disk. The first-boot
          Rust build sets that floor; steady state uses less.
        </p>
      </>,
    ],
    [
      "Can I watch more than one program?",
      <p key="multi">
        Yes, with one Microscope deployment per program. Each deployment watches
        one program and optionally one Squads multisig because its decoder is
        built from that program’s IDL. The Terraform modules can run several
        deployments from the same directory.
      </p>,
    ],
    [
      "Do I need a Squads multisig?",
      <p key="multisig">
        No. Leave out the <InlineCode>[multisig]</InlineCode> block and
        Microscope monitors the program only.
      </p>,
    ],
    [
      "An alert fired. How do I investigate?",
      <>
        <p>
          Every alert carries a <InlineCode>signal_kind</InlineCode> label.{" "}
          <InlineCode>datasource</InlineCode> means the pipeline is degraded or
          lost data. <InlineCode>instruction</InlineCode>,{" "}
          <InlineCode>event</InlineCode> and <InlineCode>multisig</InlineCode>{" "}
          mean your program did something you asked to hear about.
        </p>
        <p>
          The repo’s <InlineCode>diagnose-incident</InlineCode> agent skill
          classifies the alert, checks upstream alerts, confirms the cause
          against live metrics and logs, assesses data loss, suggests a runbook
          fix and writes an incident report.
        </p>
        <p className={`text-sm ${muted}`}>
          Investigation is read-only. Any deployment change waits for your
          confirmation, and the skill never reads values out of{" "}
          <InlineCode>.env</InlineCode>.
        </p>
      </>,
    ],
    [
      "My dashboard is empty. Is my program quiet, or is Microscope broken?",
      <>
        <p>
          Every deployment gets health alerts for its own pipeline whether you
          configure them or not. They cover a stalled stream, stale or failing
          RPC polls, a corrupt checkpoint and log delivery.
        </p>
        <p>
          Check those alerts and the <InlineCode>Indexer up</InlineCode> panel
          before concluding the program is quiet. The{" "}
          <InlineCode>diagnose-incident</InlineCode> skill does this check for
          you.
        </p>
      </>,
    ],
    [
      "Does it work on devnet?",
      <p key="devnet">
        Yes. Point your endpoint at devnet and add{" "}
        <InlineCode>?cluster=devnet</InlineCode> to{" "}
        <InlineCode>explorer_transaction_url</InlineCode> so alert links open
        the right cluster.
      </p>,
    ],
    [
      "Can I add another alert channel?",
      <p key="channel">
        Slack, Telegram and PagerDuty are supported today. Microscope is open
        source, so you can build another channel and contribute upstream. See{" "}
        <a className={link} href={`${repo}/blob/main/CONTRIBUTING.md`}>
          CONTRIBUTING.md
        </a>
        .
      </p>,
    ],
  ];
  return (
    <div className="max-w-[56rem] divide-y divide-white/10 border-y border-white/10">
      {items.map(([question, answer], index) => (
        <details key={question} id={`faq-${index}`} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 font-sans text-lg font-medium leading-[1.33] tracking-[-0.36px] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14f195] md:text-2xl md:tracking-[-0.48px] [&::-webkit-details-marker]:hidden">
            {question}
            <ChevronDown
              pack="filled"
              aria-hidden
              className="size-6 shrink-0 text-[#ABABBA] transition-transform group-open:rotate-180 group-hover:text-white motion-reduce:transition-none"
            />
          </summary>
          <div className="space-y-4 pb-8 text-base leading-[1.6] md:text-lg">
            {answer}
          </div>
        </details>
      ))}
    </div>
  );
}

function Resource({
  name,
  use,
  href,
  by,
}: {
  name: string;
  use: string;
  href: string;
  by?: string;
}) {
  return (
    <a
      href={href}
      className="group block rounded-xl bg-white/10 p-5 font-sans text-white no-underline backdrop-blur-sm transition-colors duration-300 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14f195] xl:p-6"
    >
      <strong className="font-brand text-lg font-medium tracking-[-0.36px] md:text-xl">
        {name}
      </strong>
      {by && <span className={`ml-2 text-sm ${muted}`}>{by}</span>}
      <ArrowUpRight
        pack="filled"
        aria-hidden
        className="float-right size-5 text-white opacity-50 transition-opacity group-hover:opacity-100"
      />
      <span
        className={`mt-1 block text-sm leading-relaxed md:text-base ${muted}`}
      >
        {use}
      </span>
    </a>
  );
}
export default async function MicroscopePage() {
  const relatedArticles = await fetchSolutionNews({
    categories: ["developers"],
    includeLinks: false,
    limit: 4,
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Microscope",
    description,
    url: "https://solana.com/microscope",
    applicationCategory: "DeveloperApplication",
    codeRepository: repo,
    license: "https://opensource.org/license/mit",
  };

  return (
    <div className="bg-black font-sans text-white">
      <PageSelectionColor />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
        }}
      />
      <header className="relative overflow-hidden">
        <HeroScene />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[120px] bg-gradient-to-b from-transparent to-black md:h-[200px] xl:h-[260px]"
        />
        <div
          className={`${container} relative z-10 py-[64px] md:py-[112px] xl:py-[160px]`}
        >
          <div className="mb-4 flex flex-wrap items-center gap-2 text-base font-medium tracking-[-0.16px] text-[#14f195] md:text-lg xl:mb-6">
            <span>Developer tools</span>
            <span className={muted}>/</span>
            <span>Open source</span>
          </div>
          <h1 className="m-0 font-brand text-[40px] font-medium leading-[1.1] tracking-[-1.6px] md:text-[56px] md:leading-none md:tracking-[-2.24px] xl:text-[88px] xl:tracking-[-3.52px]">
            Microscope
          </h1>
          <p className="mb-0 mt-[12px] max-w-xl text-lg leading-[1.33] tracking-[-0.36px] text-[#ABABBA] md:text-2xl md:tracking-[-0.48px] xl:mt-[24px]">
            Monitoring and alerting for Solana programs.
          </p>
          <div className="mt-[32px] flex flex-wrap gap-3 xl:mt-[64px]">
            <a href={repo} className={primaryButton}>
              Explore on GitHub
              <ArrowUpRight pack="filled" aria-hidden className="size-5" />
            </a>
            <a href="#how-to-start" className={secondaryButton}>
              Get started
              <ArrowRight pack="filled" aria-hidden className="size-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="pb-[64px] text-base leading-[1.6] text-white/80 md:pb-[112px] md:text-lg xl:pb-[160px]">
        <section
          className={`${container} space-y-[48px] py-[64px] md:py-[112px] xl:space-y-[64px] xl:py-[160px]`}
        >
          <Lead>
            <a className={link} href={repo}>
              Microscope
            </a>{" "}
            is self-hosted monitoring and alerting for Solana programs, open
            source under MIT. It watches every instruction your program runs and
            every event it emits, along with the Squads multisig that controls
            it, and alerts your team on Slack, Telegram or PagerDuty when
            something you care about happens. Point it at your program and its
            IDL, and one config file sets up the dashboards and alert rules.
          </Lead>
          <Flow />
        </section>

        <Section id="how-to-start" title="How to start">
          <p className="m-0">
            Clone, pick a setup, write the config, then deploy.
          </p>
          <div className="max-w-[56rem] space-y-1 pt-6">
            <Step n={1} title="Clone the repo">
              <CodeBlock>{`git clone ${repo}.git\ncd solana-microscope`}</CodeBlock>
            </Step>
            <Step n={2} title="Choose your setup">
              <p className={muted}>
                Microscope is five pieces, and your server runs all of them
                unless you already have your own:
              </p>
              <dl className={`${card} m-0 divide-y divide-white/10 text-base`}>
                {[
                  ["Indexer", "reads and decodes your program’s transactions"],
                  ["Alloy", "ships decoded records to Loki"],
                  ["Prometheus", "stores metrics"],
                  ["Loki", "stores decoded records"],
                  ["Grafana", "dashboards and alerts"],
                ].map(([name, description]) => (
                  <div
                    key={name}
                    className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 px-4 py-3"
                  >
                    <dt className="font-medium text-white">{name}</dt>
                    <dd className={`m-0 ${muted}`}>{description}</dd>
                  </div>
                ))}
              </dl>
              <p className={muted}>
                Each row below is one way to deploy. A filled dot runs on your
                server; a hollow dot is one you already operate.
              </p>
              <SetupMatrix />
            </Step>
            <Step n={3} title="Write the config">
              <Tabs
                label="How to write the config"
                items={[
                  {
                    name: "With an AI Agent",
                    content: (
                      <div className={`${card} p-4 md:p-6`}>
                        <p className="m-0">
                          Have your AI agent run{" "}
                          <a
                            className={link}
                            href={`${repo}/blob/main/.claude/skills/setup-deployment/SKILL.md`}
                          >
                            <InlineCode>setup-deployment</InlineCode>
                          </a>
                          , a skill that ships with the repo. It asks for each
                          value, derives alert rules from your IDL, writes the
                          files your path needs and validates them.
                        </p>
                      </div>
                    ),
                  },
                  { name: "By hand", content: <ConfigReference /> },
                ]}
              />
            </Step>
            <Step n={4} title="Deploy">
              <Tabs
                label="Where to deploy"
                items={[
                  {
                    name: "Local",
                    content: (
                      <div className={`${card} space-y-3 p-4 md:p-6`}>
                        <Pill>Docker Compose</Pill>
                        <CodeBlock>{`cp microscope.toml.example microscope.toml\n# add your endpoint and channel credentials to .env\njust up`}</CodeBlock>
                        <p className={muted}>
                          Grafana is on <InlineCode>localhost:3000</InlineCode>.
                        </p>
                      </div>
                    ),
                  },
                  {
                    name: "AWS or GCP",
                    content: (
                      <div className={`${card} space-y-3 p-4 md:p-6`}>
                        <Pill>Terraform</Pill>
                        <CodeBlock>{`cd infra/aws                # or infra/gcp\ncp terraform.tfvars.example terraform.tfvars\nterraform init              # GCP: add -backend-config for its state bucket\nterraform plan\nterraform apply`}</CodeBlock>
                        <p className={muted}>
                          The whole config lives in{" "}
                          <InlineCode>terraform.tfvars</InlineCode>, and
                          Terraform writes{" "}
                          <InlineCode>microscope.toml</InlineCode>. Reach
                          Grafana through the{" "}
                          <InlineCode>grafana_tunnel</InlineCode> output, over
                          AWS SSM or GCP IAP.
                        </p>
                      </div>
                    ),
                  },
                  {
                    name: "Grafana Cloud",
                    content: (
                      <div className={`${card} space-y-3 p-4 md:p-6`}>
                        <Pill>Compose overlay</Pill>
                        <CodeBlock>{`# add GRAFANA_CLOUD_* and MICROSCOPE_DEPLOYMENT to .env\ndocker compose -f docker-compose.yml -f docker-compose.cloud.yml up -d\nRPC_URL=<endpoint> ./scripts/export-grafana-cloud.sh <deployment> <folder-uid>`}</CodeBlock>
                        <p className={muted}>
                          Only the indexer and Alloy run. Import the exported
                          dashboard and alert rules into your stack. Terraform
                          can also target Grafana Cloud by setting{" "}
                          <InlineCode>grafana_cloud</InlineCode>.
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
              <p className={muted}>
                Running Kubernetes? The{" "}
                <a
                  className={link}
                  href={`${repo}/blob/main/docs/kubernetes.md`}
                >
                  reference manifests
                </a>{" "}
                run the indexer next to observability you already operate.
              </p>
            </Step>
          </div>
        </Section>

        <Section id="what-you-see" title="What you’ll see">
          <p className="m-0">
            An example of the dashboard Microscope generates.
          </p>
          <DashboardCarousel panels={panels} />
          <p className={`max-w-3xl pt-4 font-sans text-base ${muted}`}>
            An alert carries a <InlineCode>signal_kind</InlineCode> label. A{" "}
            <InlineCode>datasource</InlineCode> alert reports a degraded
            monitoring pipeline; activity alerts identify the decoded
            instruction, event or multisig action.{" "}
            <InlineCode>DatasourceError</InlineCode> means Grafana could not run
            a rule’s query, not that your RPC endpoint is down.
          </p>
        </Section>

        <Section id="try-it" title="Try it today">
          <div className="max-w-[56rem] space-y-6 rounded-xl bg-white/10 p-6 font-sans sm:p-8 xl:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <strong className="font-brand text-2xl font-medium tracking-[-0.48px] text-white md:text-[32px] md:tracking-[-0.96px]">
                Jupiter Lend walkthrough
              </strong>
              <div className="flex flex-wrap gap-1">
                <Pill>~10 min</Pill>
                <Pill>Docker</Pill>
                <Pill>Yellowstone endpoint</Pill>
              </div>
            </div>
            <ul className="m-0 list-disc space-y-2 pl-5 text-base leading-[1.6] text-white/90 marker:text-[#14f195] md:text-lg">
              <li>Decoded deposits, withdrawals, redemptions and rebalances</li>
              <li>
                Critical alerts on the two instructions that change who controls
                the program
              </li>
              <li>
                A warning whenever its Squads v4 multisig creates a proposal
              </li>
              <li>
                Swap three values at the end to point it at your own program
              </li>
            </ul>
            <a
              href={`${repo}/blob/main/docs/examples/jupiter-lend.md`}
              className={primaryButton}
            >
              Open the walkthrough{" "}
              <ArrowUpRight pack="filled" aria-hidden className="size-4" />
            </a>
            <p
              className={`m-0 border-t border-white/10 pt-4 text-sm leading-relaxed ${muted}`}
            >
              A teaching example. The Solana Foundation does not operate this
              deployment, monitor Jupiter Lend on anyone’s behalf, or claim
              affiliation with or endorsement by Jupiter.
            </p>
          </div>
        </Section>

        <Section id="faq" title="FAQ">
          <Faq />
        </Section>

        <Section id="resources" title="Resources">
          <Subheading>Microscope</Subheading>
          <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-4">
            <Resource
              name="solana-microscope"
              use="The repository. MIT licensed."
              href={repo}
            />
            <Resource
              name="Operations guide"
              use="Endpoints, Squads state address, cost and troubleshooting."
              href={`${repo}/blob/main/docs/operations.md`}
            />
            <Resource
              name="Jupiter Lend walkthrough"
              use="The full stack against a live mainnet protocol."
              href={`${repo}/blob/main/docs/examples/jupiter-lend.md`}
            />
            <Resource
              name="Kubernetes reference"
              use="Running the indexer next to your observability stack."
              href={`${repo}/blob/main/docs/kubernetes.md`}
            />
          </div>
          <Subheading>Built on</Subheading>
          <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
            <Resource
              name="Carbon"
              by="Sevenlabs"
              use="IDL decoders and indexing pipeline."
              href="https://github.com/sevenlabs-hq/carbon"
            />
            <Resource
              name="Yellowstone gRPC"
              by="Triton"
              use="Streams confirmed transactions."
              href="https://github.com/rpcpool/yellowstone-grpc"
            />
            <Resource
              name="Prometheus"
              use="Stores metrics."
              href="https://github.com/prometheus/prometheus"
            />
            <Resource
              name="Loki"
              by="Grafana Labs"
              use="Stores decoded records."
              href="https://github.com/grafana/loki"
            />
            <Resource
              name="Alloy"
              by="Grafana Labs"
              use="Ships records to Loki."
              href="https://github.com/grafana/alloy"
            />
            <Resource
              name="Grafana"
              by="Grafana Labs"
              use="Dashboards and alerting."
              href="https://github.com/grafana/grafana"
            />
          </div>
          <div className="rounded-xl bg-white/10 p-5 font-sans text-white xl:p-6">
            <strong className="font-brand text-lg font-medium tracking-[-0.36px] md:text-xl">
              Squads
            </strong>
            <p className={`mt-1 text-sm md:text-base ${muted}`}>
              The pinned IDLs behind multisig decoding.
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-base">
              <a className={link} href="https://github.com/Squads-Protocol/v4">
                v4
              </a>
              <a
                className={link}
                href="https://github.com/Squads-Protocol/smart-account-program"
              >
                Smart Account / v5
              </a>
              <a
                className={link}
                href="https://github.com/Squads-Protocol/squads-mpl"
              >
                v3 · archived
              </a>
            </div>
          </div>
        </Section>
        {relatedArticles.length > 0 && (
          <Section id="related-articles" title="Related developer articles">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {relatedArticles.map((article) => (
                <a
                  key={article.id}
                  href={article.link}
                  className={`${card} group block overflow-hidden text-white no-underline transition-colors hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14f195]`}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={article.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 320px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 p-5">
                    <h3 className="m-0 font-brand text-lg font-medium leading-snug tracking-[-0.36px] md:text-xl">
                      {article.title}
                    </h3>
                    <ArrowUpRight
                      pack="filled"
                      aria-hidden
                      className="mt-0.5 size-5 shrink-0 text-[#14f195]"
                    />
                  </div>
                </a>
              ))}
            </div>
          </Section>
        )}
      </main>
    </div>
  );
}
