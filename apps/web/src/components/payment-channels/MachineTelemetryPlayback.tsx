"use client";

import { useEffect, useState } from "react";

type Sample = {
  cpu: number;
  memory: number;
  rss: number;
  inbound: number;
  outbound: number;
  connections: number;
  load: number;
};

type Machine = {
  name: string;
  description: string[];
  processLabel: string;
  samples: Sample[];
};

const machines: Machine[] = [
  {
    name: "Generator",
    description: ["Dispatch 1M logical", "payment / sec, 100k users"],
    processLabel: "bench process RSS",
    samples: [
      {
        cpu: 47.5,
        memory: 54.2,
        rss: 39.9,
        inbound: 0.41,
        outbound: 11.21,
        connections: 130,
        load: 67.4,
      },
      {
        cpu: 47.5,
        memory: 54.3,
        rss: 40.0,
        inbound: 0.41,
        outbound: 11.2,
        connections: 130,
        load: 65.6,
      },
      {
        cpu: 47.4,
        memory: 54.3,
        rss: 40.0,
        inbound: 0.41,
        outbound: 11.18,
        connections: 130,
        load: 65.8,
      },
    ],
  },
  {
    name: "Proxy",
    description: ["Verify and settle 1M", "logical payment / sec"],
    processLabel: "proxy process RSS",
    samples: [
      {
        cpu: 91.2,
        memory: 44.0,
        rss: 2.2,
        inbound: 11.11,
        outbound: 0.43,
        connections: 157,
        load: 127.2,
      },
      {
        cpu: 91.1,
        memory: 43.9,
        rss: 2.2,
        inbound: 11.02,
        outbound: 0.42,
        connections: 158,
        load: 126.8,
      },
      {
        cpu: 91.1,
        memory: 43.9,
        rss: 2.2,
        inbound: 11.03,
        outbound: 0.42,
        connections: 159,
        load: 120.7,
      },
    ],
  },
];

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-nd-border-light py-3">
      <p className="font-brand-mono text-[10px] uppercase text-nd-mid-em-text">
        {label}
      </p>
      <p className="mt-1 whitespace-nowrap font-brand-mono text-base tabular-nums text-nd-high-em-text sm:text-lg">
        {value}
      </p>
    </div>
  );
}

function CoreUsageMonitor({
  machine,
  sample,
  index,
}: {
  machine: Machine;
  sample: Sample;
  index: number;
}) {
  const lanes = Array.from({ length: 16 }, (_, lane) => {
    const wave = ((lane * 17 + index * 11) % 29) - 14;
    const usage = Math.max(5, Math.min(100, sample.cpu + wave));
    return Math.round((usage / 100) * 12);
  });
  const isBound = machine.name === "Proxy";

  return (
    <div
      className="overflow-hidden rounded-[1.5rem] border border-[#5a5a5e] bg-[#7a7a7d] p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.3)]"
      aria-label={`${machine.name} Activity Monitor CPU usage`}
    >
      <div className="flex h-10 items-center gap-2 rounded-t-[1.15rem] bg-[#202021] px-4">
        <span className="size-3 rounded-full bg-[#ff4f5c]" />
        <span className="size-3 rounded-full bg-[#454547]" />
        <span className="size-3 rounded-full bg-[#454547]" />
        <div className="ml-2 flex flex-1 items-center justify-between font-brand-mono text-[10px] uppercase tracking-[0.12em] text-[#bcbcc0]">
          <span>CPU usage</span>
          <span>{sample.cpu.toFixed(1)}%</span>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-2 bg-[#3e3e40] p-3 sm:grid-cols-8">
        {lanes.map((activeSegments, lane) => (
          <div
            key={lane}
            className="flex h-28 flex-col-reverse gap-px rounded-md bg-[#19191a] p-1.5"
          >
            {Array.from({ length: 12 }, (_, segment) => (
              <span
                key={segment}
                className={`block flex-1 rounded-[1px] transition-colors duration-500 ${segment < activeSegments ? (isBound ? "bg-[#ff5b61]" : "bg-[#54c8ff]") : isBound ? "bg-[#5b272a]" : "bg-[#25475b]"}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-b-[1.15rem] bg-[#3e3e40] px-4 pb-3 font-brand-mono text-[9px] uppercase tracking-[0.1em] text-[#d0d0d4]">
        <span>128 logical cores · 8 cores/lane</span>
        <span>host aggregate</span>
      </div>
    </div>
  );
}

function MachinePanel({ machine, index }: { machine: Machine; index: number }) {
  const sample = machine.samples[index % machine.samples.length];
  const cpuCores = (sample.cpu * 1.28).toFixed(0);

  return (
    <article className="border border-nd-border-prominent bg-black p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-brand-mono text-xs uppercase text-nd-highlight-lime">
            {machine.name}
          </p>
          <h3 className="mt-3 min-h-[2.2em] font-brand text-xl leading-[1.1] sm:text-2xl">
            {machine.description.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h3>
        </div>
        <span
          className="size-2 shrink-0 rounded-full bg-nd-highlight-lime"
          aria-label="active sample"
        />
      </div>
      <div className="mt-8">
        <CoreUsageMonitor machine={machine} sample={sample} index={index} />
        <div className="mt-3 font-brand-mono text-[10px] uppercase text-nd-mid-em-text">
          <p>AMD EPYC 9555P · 64 cores / 128 threads</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span>host CPU</span>
            <span className="text-sm tabular-nums text-nd-high-em-text">
              {cpuCores}/128 cores active
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6">
        <Metric
          label="host memory"
          value={`${sample.memory.toFixed(1)} GiB / 1.1 TiB`}
        />
        <Metric
          label={machine.processLabel}
          value={`${sample.rss.toFixed(1)} GiB`}
        />
        <Metric label="established TCP" value={sample.connections.toString()} />
        <Metric label="host load" value={sample.load.toFixed(1)} />
      </div>
      <div className="mt-6 border border-nd-border-light p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-brand-mono text-[10px] uppercase text-nd-mid-em-text">
            network activity
          </p>
          <p className="font-brand-mono text-[10px] uppercase text-nd-mid-em-text">
            host / bond0
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="font-brand-mono text-[10px] uppercase text-nd-highlight-lime">
            <span className="block text-2xl tabular-nums">
              {sample.inbound.toFixed(2)}
            </span>
            in Gbps
          </div>
          <div className="font-brand-mono text-[10px] uppercase text-nd-high-em-text">
            <span className="block text-2xl tabular-nums">
              {sample.outbound.toFixed(2)}
            </span>
            out Gbps
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between font-brand-mono text-[10px] uppercase text-nd-mid-em-text">
        <span>looping host sample</span>
        <span>50–75 seconds captured</span>
      </div>
    </article>
  );
}

export default function MachineTelemetryPlayback() {
  const [sampleIndex, setSampleIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(
      () => setSampleIndex((index) => index + 1),
      1_800,
    );
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto grid max-w-screen-2xl border-x border-b border-nd-border-light lg:grid-cols-[0.8fr_1.2fr]">
      <div className="p-6 sm:p-10 lg:border-r lg:border-nd-border-light lg:p-14">
        <p className="font-brand-mono text-xs uppercase text-nd-highlight-lime">
          Full stack benchmark
        </p>
        <h2 className="mt-5 max-w-md text-balance font-brand text-4xl leading-tight sm:text-5xl">
          Scale up a Proxy. Then scale out.
        </h2>
        <p className="mt-6 max-w-md text-pretty leading-relaxed text-nd-mid-em-text">
          One Proxy completed the full receive, verify, and settlement path on
          an AMD EPYC 9555P: 64 physical cores and 128 threads. At one million
          logical payments per second, it kept 117 threads busy and absorbed
          about 11 Gbps of inbound traffic.
        </p>
        <div className="mt-8 grid max-w-md gap-4 border-t border-nd-border-light pt-5">
          <div>
            <p className="font-brand-mono text-[10px] uppercase text-nd-highlight-lime">
              Scale up
            </p>
            <p className="mt-1 text-sm leading-relaxed text-nd-mid-em-text">
              Give one Proxy more CPU and network bandwidth to raise its own
              throughput ceiling.
            </p>
          </div>
          <div>
            <p className="font-brand-mono text-[10px] uppercase text-nd-highlight-lime">
              Scale out
            </p>
            <p className="mt-1 text-sm leading-relaxed text-nd-mid-em-text">
              Give the next Proxy a different channel range. Channel state stays
              local, so the hot path needs no shared state.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 bg-[#050707] p-4 sm:grid-cols-2 sm:p-6">
        {machines.map((machine) => (
          <MachinePanel
            key={machine.name}
            machine={machine}
            index={sampleIndex}
          />
        ))}
      </div>
    </section>
  );
}
