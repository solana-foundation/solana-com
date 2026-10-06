import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@workspace/i18n/routing";
import { ArrowLeft } from "@boxicons/react/ArrowLeft";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { ChevronDown } from "@boxicons/react/ChevronDown";
import { JsonLd } from "@/components/seo/json-ld";
import { buildArticleJsonLd } from "@/lib/content-structured-data";
import { newsPostMetadata } from "@/lib/metadata";
import { fetchPublishedPostBySlug, readPostBySlug } from "@/lib/post-data";
import { reader } from "@/lib/reader";
import { DashboardCarousel, Tabs, type Panel } from "./interactions";

const slug = "solana-microscope";
const repo = "https://github.com/solana-foundation/solana-microscope";
const asset =
  "/uploads/posts/microscope-monitoring-and-alerting-for-solana-programs";
// The media project's Vercel previews require sign-in; production stays gated
// by the post status and publish timestamp.
const canPreviewDraft =
  process.env.NODE_ENV === "development" ||
  process.env.VERCEL_ENV === "preview";

const link =
  "text-[#14f195] underline decoration-[#14f195]/50 underline-offset-4 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14f195]";
const card = "rounded-lg border border-[#35363d] bg-[#141218]";
const muted = "text-[#b4b1c1]";
const code =
  "rounded border border-[#35363d] bg-[#201b28] px-1 py-0.5 font-mono text-[0.85em] text-[#e6dff0]";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (canPreviewDraft) {
    const publishedPost = await fetchPublishedPostBySlug(slug);
    if (!publishedPost) {
      const draft = await readPostBySlug(slug);
      if (draft) {
        const title = String(draft.title);
        const description = String(draft.description ?? "");
        const canonical = "https://solana.com/news/solana-microscope";
        const image = `https://solana.com${asset}/social.webp`;
        return {
          title,
          description,
          alternates: { canonical },
          openGraph: {
            title,
            description,
            url: canonical,
            type: "article",
            images: [{ url: image, width: 1200, height: 630 }],
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
          },
          robots: { index: false, follow: false },
        };
      }
    }
  }
  return newsPostMetadata(slug, locale);
}

function Heading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-6 mt-24 border-t border-[#35363d] pt-8 font-sans text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em]"
    >
      {children}
    </h2>
  );
}
function Subheading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="mb-3 mt-10 font-sans text-xl font-semibold leading-snug tracking-tight"
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
      className={`inline-block whitespace-nowrap rounded border px-2 py-0.5 font-mono text-xs leading-5 ${faint ? "border-dashed border-[#50495d] text-[#b4b1c1]" : "border-[#50495d] bg-[#201b28] text-[#e6dff0]"}`}
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
    <div className="overflow-x-auto rounded-lg border border-[#35363d] bg-[#100e15]">
      <pre className="p-4 font-mono text-[0.78rem] leading-6">
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
    <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4">
      <div className="flex flex-col items-center">
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#14f195] bg-[#08070b] font-mono text-sm text-[#14f195]">
          {n}
        </span>
        {n < 4 && <span aria-hidden className="my-1 w-px grow bg-[#50495d]" />}
      </div>
      <div className="min-w-0 space-y-4 pb-8 font-sans text-[0.94rem] leading-relaxed">
        <h3 className="text-base font-semibold leading-8">{title}</h3>
        {children}
      </div>
    </div>
  );
}
function ConfigKey({ letter }: { letter: string }) {
  return (
    <span className="mr-2 inline-grid size-6 place-items-center rounded-sm bg-[#14f195] align-middle font-mono text-xs font-semibold text-black">
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
          <span className="ml-2 align-middle text-[0.65rem] uppercase tracking-widest text-[#9995a7]">
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
      <table className="w-full min-w-[30rem] border-collapse font-sans text-sm">
        <tbody>
          {rows.map(([key, value], i) => (
            <tr key={i} className="border-b border-[#393440] last:border-0">
              <th
                scope="row"
                className="w-px whitespace-nowrap px-4 py-3 text-left align-top font-medium"
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
    <figure className="relative left-1/2 w-[min(68rem,calc(100vw-2.5rem))] -translate-x-1/2 space-y-4 py-4">
      <div
        role="img"
        aria-label="Confirmed Solana transactions from your program and optional Squads multisig flow through gRPC or RPC into Microscope on your server, which sends alerts to your team"
        className="grid gap-3 font-sans md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.25fr)_auto_minmax(0,1fr)] md:items-stretch"
      >
        <div className={`${card} space-y-4 p-5`}>
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#14f195]">
            On Solana
          </span>
          <p className="text-sm font-medium">
            Your program
            <span className={`block text-xs font-normal ${muted}`}>
              decoded from its IDL
            </span>
          </p>
          <p className="text-sm font-medium">
            Squads multisig
            <span className={`block text-xs font-normal ${muted}`}>
              optional · v3, v4 or v5
            </span>
          </p>
        </div>
        <div
          aria-hidden
          className={`flex items-center justify-center gap-2 text-center text-xs md:flex-col ${muted}`}
        >
          <span>transactions</span>
          <ArrowRight
            pack="filled"
            aria-hidden
            className="size-5 rotate-90 text-[#14f195] md:rotate-0"
          />
          <span>gRPC or RPC</span>
        </div>
        <div className="relative space-y-4 overflow-hidden rounded-lg border border-[#9945ff]/60 bg-[#1a1326] p-5 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#9945ff] before:to-[#14f195]">
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#14f195]">
            Your server
          </span>
          <strong className="block text-lg">Microscope</strong>
          <div className="flex flex-wrap gap-1">
            <Pill>decode</Pill>
            <Pill>dashboards</Pill>
            <Pill>alert rules</Pill>
          </div>
        </div>
        <div
          aria-hidden
          className={`flex items-center justify-center gap-2 text-center text-xs md:flex-col ${muted}`}
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
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#14f195]">
            Your team
          </span>
          <p className="text-sm font-medium">Slack</p>
          <p className="text-sm font-medium">Telegram</p>
          <p className="text-sm font-medium">PagerDuty</p>
        </div>
      </div>
      <figcaption className={`font-sans text-xs leading-relaxed ${muted}`}>
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
        <table className="w-full min-w-[35rem] border-collapse font-sans">
          <thead className="bg-[#100e15] text-[0.65rem] font-semibold uppercase tracking-widest text-[#9995a7]">
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
                  className="border-b border-[#393440] px-2 py-3 text-center first:text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, description, cells]) => (
              <tr
                key={name}
                className="border-b border-[#393440] last:border-0"
              >
                <th
                  scope="row"
                  className="px-4 py-3 text-left text-sm font-semibold"
                >
                  {name}
                  <small className={`block text-xs font-normal ${muted}`}>
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
                      className={`inline-block size-3.5 rounded-full ${run ? "bg-[#14f195]" : "border-2 border-[#9995a7]"}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className={`flex flex-wrap gap-5 font-sans text-xs ${muted}`}>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#14f195]" />
          Microscope runs it
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full border-2 border-[#9995a7]" />
          You already run it
        </span>
      </figcaption>
    </figure>
  );
}
function ConfigReference() {
  return (
    <div className={`${card} space-y-6 p-4 sm:p-6`}>
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
            className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2 rounded border border-[#393440] bg-[#100e15] p-3"
          >
            <ConfigKey letter={letter ?? ""} />
            <pre className="overflow-x-auto font-mono text-xs leading-5">
              <code>{text}</code>
            </pre>
          </div>
        ))}
        <p className={`text-xs ${muted}`}>B, C and D are optional.</p>
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
          <InlineCode>mode = "rpc"</InlineCode> to poll your RPC endpoint
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
      <aside className="space-y-2 rounded border border-l-4 border-[#e8b76a] bg-[#2a2118] p-4 font-sans text-sm leading-relaxed">
        <strong className="block text-xs uppercase tracking-widest text-[#e8b76a]">
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
    <div className={`${card} overflow-hidden`}>
      {items.map(([question, answer], index) => (
        <details
          key={question}
          id={`faq-${index}`}
          className="group border-b border-[#393440] last:border-0"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-sans font-semibold leading-snug hover:text-[#14f195] focus-visible:outline-2 focus-visible:outline-[#14f195] [&::-webkit-details-marker]:hidden">
            {question}
            <ChevronDown
              pack="filled"
              aria-hidden
              className="size-5 shrink-0 text-[#9995a7] transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="space-y-4 px-4 pb-5 text-[0.97rem] leading-relaxed">
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
      className={`${card} group block p-5 font-sans no-underline transition-colors hover:border-[#14f195] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14f195]`}
    >
      <strong className="text-base group-hover:text-[#14f195]">{name}</strong>
      {by && <span className="ml-2 text-xs text-[#9995a7]">{by}</span>}
      <ArrowUpRight
        pack="filled"
        aria-hidden
        className="float-right size-5 text-[#14f195]"
      />
      <span className={`mt-1 block text-xs leading-relaxed ${muted}`}>
        {use}
      </span>
    </a>
  );
}
export default async function MicroscopePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const publishedPost = await fetchPublishedPostBySlug(slug);
  const post =
    publishedPost ?? (canPreviewDraft ? await readPostBySlug(slug) : null);
  if (!post) notFound();
  const author = await reader.collections.authors.read("jo-desormeaux");
  const title = String(post.title);
  const structuredData = buildArticleJsonLd({
    slug,
    locale,
    title,
    description: String(post.description),
    image: post.heroImage,
    publishedAt: post.publishedAt,
    authorName: "Jo Desormeaux",
    category: "Developers",
    backPath: "/news",
    backLabel: "News",
  });
  const isDraft = !publishedPost;

  return (
    <div className="bg-black font-sans text-[#f7f7fb]">
      {!isDraft && <JsonLd data={structuredData} />}
      <div className="mx-auto max-w-[72rem] px-5 pb-28 sm:px-8">
        <header className="mx-auto max-w-[72rem] pt-12 pb-14 font-sans sm:pt-20 lg:pb-20">
          <Link
            href="/news"
            className="mb-12 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#14f195] no-underline hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14f195]"
          >
            <ArrowLeft pack="filled" aria-hidden className="size-4" /> News
          </Link>
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#14f195]">
            {isDraft && (
              <span className="rounded border border-[#e8b76a] px-2 py-0.5 text-[#e8b76a]">
                Preview
              </span>
            )}
            <span>Solana Foundation</span>
            <span className="text-[#9995a7]">/</span>
            <span>Engineering</span>
          </div>
          <h1 className="max-w-[65rem] text-balance font-sans text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
            {title}
          </h1>
          <div
            className="mt-12 h-px w-full bg-gradient-to-r from-[#9945ff] via-[#6844f5] to-[#14f195]"
            aria-hidden
          />
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#b4b1c1]">
            {author?.twitterUrl ? (
              <a className={link} href={author.twitterUrl} rel="author">
                Jo Desormeaux
              </a>
            ) : (
              <span>Jo Desormeaux</span>
            )}
            {!isDraft && (
              <time dateTime={post.publishedAt}>
                {new Intl.DateTimeFormat("en", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(new Date(post.publishedAt))}
              </time>
            )}
          </div>
        </header>

        <article className="mx-auto max-w-[48rem] space-y-5 text-[1.04rem] leading-[1.75] text-[#d0d0dc]">
          <p className="text-[clamp(1.125rem,2vw,1.375rem)] leading-[1.55] text-white">
            <a className={link} href={repo}>
              Microscope
            </a>{" "}
            is self-hosted monitoring and alerting for Solana programs, open
            source under MIT. It watches every instruction your program runs and
            every event it emits, along with the Squads multisig that controls
            it, and alerts your team on Slack, Telegram or PagerDuty when
            something you care about happens. Point it at your program and its
            IDL, and one config file sets up the dashboards and alert rules.
          </p>
          <div className="py-3">
            <Flow />
          </div>

          <Heading id="how-to-start">How to start</Heading>
          <p>Clone, pick a setup, write the config, then deploy.</p>
          <div className="space-y-1 pt-3">
            <Step n={1} title="Clone the repo">
              <CodeBlock>{`git clone ${repo}.git\ncd solana-microscope`}</CodeBlock>
            </Step>
            <Step n={2} title="Choose your setup">
              <p className={muted}>
                Microscope is five pieces, and your server runs all of them
                unless you already have your own:
              </p>
              <dl className={`${card} divide-y divide-[#393440] text-sm`}>
                {[
                  ["Indexer", "reads and decodes your program’s transactions"],
                  ["Alloy", "ships decoded records to Loki"],
                  ["Prometheus", "stores metrics"],
                  ["Loki", "stores decoded records"],
                  ["Grafana", "dashboards and alerts"],
                ].map(([name, description]) => (
                  <div
                    key={name}
                    className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 px-4 py-2"
                  >
                    <dt className="font-semibold">{name}</dt>
                    <dd className={muted}>{description}</dd>
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
                      <div className={`${card} p-4`}>
                        <p>
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
                      <div className={`${card} space-y-3 p-4`}>
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
                      <div className={`${card} space-y-3 p-4`}>
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
                      <div className={`${card} space-y-3 p-4`}>
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

          <Heading id="what-you-see">What you’ll see</Heading>
          <p>An example of the dashboard Microscope generates.</p>
          <DashboardCarousel panels={panels} />
          <p className={`font-sans text-sm ${muted}`}>
            An alert carries a <InlineCode>signal_kind</InlineCode> label. A{" "}
            <InlineCode>datasource</InlineCode> alert reports a degraded
            monitoring pipeline; activity alerts identify the decoded
            instruction, event or multisig action.{" "}
            <InlineCode>DatasourceError</InlineCode> means Grafana could not run
            a rule’s query, not that your RPC endpoint is down.
          </p>

          <Heading id="try-it">Try it today</Heading>
          <div
            className={`${card} space-y-5 border-t-[3px] border-t-[#14f195] p-6 font-sans sm:p-8`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <strong>Jupiter Lend walkthrough</strong>
              <div className="flex flex-wrap gap-1">
                <Pill>~10 min</Pill>
                <Pill>Docker</Pill>
                <Pill>Yellowstone endpoint</Pill>
              </div>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed marker:text-[#14f195]">
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
              className="inline-flex items-center gap-2 self-start rounded bg-[#14f195] px-5 py-2.5 text-sm font-semibold text-black no-underline transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14f195]"
            >
              Open the walkthrough{" "}
              <ArrowUpRight pack="filled" aria-hidden className="size-4" />
            </a>
            <p className="border-t border-[#393440] pt-3 text-xs leading-relaxed text-[#9995a7]">
              A teaching example. The Solana Foundation does not operate this
              deployment, monitor Jupiter Lend on anyone’s behalf, or claim
              affiliation with or endorsement by Jupiter.
            </p>
          </div>

          <Heading id="faq">FAQ</Heading>
          <Faq />
          <Heading id="resources">Resources</Heading>
          <Subheading>Microscope</Subheading>
          <div className="grid gap-3 sm:grid-cols-2">
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
          <div className="grid gap-3 sm:grid-cols-2">
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
          <div className={`${card} p-4 font-sans text-sm`}>
            <strong>Squads</strong>
            <p className={`mt-1 text-xs ${muted}`}>
              The pinned IDLs behind multisig decoding.
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
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
        </article>
      </div>
    </div>
  );
}
