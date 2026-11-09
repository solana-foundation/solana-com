/**
 * Components for the docs content (apps/docs MDX). The pages are written
 * with the component names and props of the format they were authored in
 * (Note, Card, Columns, Steps, CodeGroup, ParamField, ...); these
 * implementations keep those names and props, so the content compiles and
 * renders unchanged. The markup keeps the class names and
 * data-component-part hooks the docs stylesheets target (content/styles,
 * components/docs/docs.css).
 */
import {
  Children,
  Fragment,
  isValidElement,
  type CSSProperties,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { icons as lucideIcons } from "lucide";
import {
  CodeGroupClient,
  CodeExpandFooter,
  CodePanelSteps,
  AskCodeButton,
  CopyCodeButton,
  TabsClient,
} from "./docs-components.client";
import {
  CalloutIcon,
  CaretIcon,
  ChevronIcon,
  ExternalArrowIcon,
} from "./docs-ui-icons";
import { DocsLink } from "./docs-link";
import { isDocsHref } from "@/lib/docs/docs-href";
import { parseRanges } from "@/lib/docs/line-ranges.mjs";
import { TxWalkthrough } from "@/components/tx-walkthrough";
import { LiveFeed } from "./docs-live-feed.client";
import { Tooltip } from "./docs-tooltip";
import { FullscreenButton, InActionScene } from "./docs-inaction-scene.client";

type P = { children?: ReactNode };

/** Element children, with fragments flattened. */
function elements(
  children: ReactNode,
): ReactElement<Record<string, unknown>>[] {
  const out: ReactElement<Record<string, unknown>>[] = [];
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) continue;
    if (child.type === Fragment)
      out.push(...elements((child.props as { children?: ReactNode }).children));
    else out.push(child as ReactElement<Record<string, unknown>>);
  }
  return out;
}

function text(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(text).join("");
  if (isValidElement(node))
    return text((node.props as { children?: ReactNode }).children);
  return "";
}

// ------------------------------------------------------------------ Icon

const toPascal = (s: string) =>
  s.replace(/(^|[-_ ])([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());

type IconNode = [string, Record<string, string | number>][];
const maskCache = new Map<string, string | null>();

/** Data URI of a Lucide icon's SVG, for CSS masks. */
function lucideMask(name: string): string | null {
  if (maskCache.has(name)) return maskCache.get(name)!;
  const node = (lucideIcons as unknown as Record<string, IconNode>)[
    toPascal(name)
  ];
  let uri: string | null = null;
  if (node) {
    const body = node
      .map(
        ([tag, attrs]) =>
          `<${tag} ${Object.entries(attrs)
            .map(([k, v]) => `${k}="${v}"`)
            .join(" ")}/>`,
      )
      .join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
    uri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  maskCache.set(name, uri);
  return uri;
}

/**
 * Lucide icon by name ("credit-card"), as the docs' `icon` props name them.
 * Drawn as a mask filled with the background colour (the primary colour by
 * default, `color` when given), as the docs have always drawn them, so the
 * stylesheets that recolour icons keep working.
 */
export function Icon({
  icon,
  size = 16,
  color,
  className,
}: {
  icon: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const mask = lucideMask(icon);
  if (!mask) return null;
  return (
    <svg
      className={className ?? "icon inline"}
      aria-hidden="true"
      focusable="false"
      style={{
        WebkitMaskImage: mask,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: mask,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "100%",
        width: size,
        height: size,
        display: "inline-block",
        verticalAlign: "middle",
        ...(color ? { backgroundColor: color } : {}),
      }}
    />
  );
}

// -------------------------------------------------------------- Callouts

function CalloutBox({
  type,
  icon,
  color,
  className,
  children,
}: P & { type: string; icon?: ReactNode; color?: string; className?: string }) {
  const style = color
    ? ({ "--callout-color": color } as CSSProperties)
    : undefined;
  return (
    <div
      className={["callout", className].filter(Boolean).join(" ")}
      role="note"
      data-callout-type={type}
      style={style}
    >
      <div data-component-part="callout-icon" className="callout-icon">
        {icon ?? <CalloutIcon type={type} />}
      </div>
      <div
        data-component-part="callout-content"
        className="callout-content prose"
      >
        {children}
      </div>
    </div>
  );
}

export const Note = (p: P) => <CalloutBox type="note" {...p} />;
export const Info = (p: P) => <CalloutBox type="info" {...p} />;
export const Tip = (p: P) => <CalloutBox type="tip" {...p} />;
export const Check = (p: P) => <CalloutBox type="check" {...p} />;
export const Warning = (p: P) => <CalloutBox type="warning" {...p} />;
export const Danger = (p: P) => <CalloutBox type="danger" {...p} />;

export function Callout({
  icon,
  color,
  className,
  children,
}: P & { icon?: string; color?: string; className?: string }) {
  return (
    <CalloutBox
      type="callout"
      color={color}
      className={className}
      icon={
        icon ? (
          <span
            className="callout-custom-icon"
            style={color ? { color } : undefined}
          >
            <Icon icon={icon} size={16} className="callout-svg" />
          </span>
        ) : undefined
      }
    >
      {children}
    </CalloutBox>
  );
}

// ----------------------------------------------------------------- Cards

export function Card({
  title,
  href,
  icon,
  img,
  horizontal,
  cta,
  arrow,
  children,
}: P & {
  title?: string;
  href?: string;
  icon?: string;
  img?: string;
  horizontal?: boolean;
  cta?: string;
  arrow?: boolean;
  color?: string;
}) {
  const external = !!href && /^https?:\/\//.test(href);
  const body = (
    <>
      {img ? (
        <img
          src={img}
          alt=""
          className="card-img"
          data-component-part="card-image"
        />
      ) : null}
      <div
        className={horizontal ? "card-body card-body-horizontal" : "card-body"}
        data-component-part="card-content-container"
      >
        {href && (external || arrow) ? (
          <div className="card-arrow" aria-hidden="true">
            <ExternalArrowIcon className="card-arrow-icon" />
          </div>
        ) : null}
        {icon ? (
          <div data-component-part="card-icon" className="card-icon">
            <Icon icon={icon} size={24} className="card-icon-svg" />
          </div>
        ) : null}
        <div className="card-text">
          {title ? (
            <h2
              className={
                icon && !horizontal
                  ? "not-prose card-title card-title-spaced"
                  : "not-prose card-title"
              }
              data-component-part="card-title"
            >
              {title}
            </h2>
          ) : null}
          {children ? (
            <div
              className={
                title && !horizontal
                  ? "prose card-content card-content-spaced"
                  : "prose card-content"
              }
              data-component-part="card-content"
            >
              {children}
            </div>
          ) : null}
          {cta ? (
            <div className="card-cta">
              <span className="card-cta-button">
                {cta}
                <ChevronIcon className="card-cta-icon" />
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
  if (!href) return <div className="card">{body}</div>;
  const className = "card card-link";
  if (isDocsHref(href))
    return (
      <DocsLink href={href} className={className}>
        {body}
      </DocsLink>
    );
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {body}
    </a>
  );
}

export function Columns({
  cols = 2,
  children,
}: P & { cols?: number | string }) {
  const n = Number(cols) || 2;
  return (
    <div
      className="columns prose"
      data-cols={n}
      style={{ "--cols": n } as CSSProperties}
    >
      {children}
    </div>
  );
}
export const CardGroup = Columns;

// ------------------------------------------------------------------ Tabs

export function Tabs({ children }: P) {
  const tabs = elements(children);
  return (
    <TabsClient
      labels={tabs.map((t, i) => String(t.props.title ?? `Tab ${i + 1}`))}
      panels={tabs.map((t) => t.props.children as ReactNode)}
    />
  );
}
export function Tab({ children }: P & { title?: string }) {
  return <>{children}</>;
}

// ----------------------------------------------------------------- Steps

// <Steps codePanel> side by side (`code-panel` variant, tailwind.config.js).
// The walkthrough reaches over "On this page": 19rem column + 3rem gap +
// #content-area's 0.25rem padding (docs.css, 2. Layout). Each step's panel
// is an absolute rail as tall as the walkthrough (so steps and their parts are
// static, and the number and line sit in a zero-width grid column); its box
// sticks at the side column's top (6.5rem) and stops 4.5rem above the window
// bottom (the Ask AI launcher). Below the variant the rail and box are
// `display: contents`: the step lays out exactly as without codePanel.
const PANEL_STEP =
  "code-panel:static code-panel:grid code-panel:min-h-40 code-panel:grid-cols-[0_minmax(0,1fr)] code-panel:scroll-mt-[calc(40dvh-5rem-2px)] code-panel:last:min-h-[calc(60dvh-4rem)]";
const PANEL_LINE =
  "code-panel:static code-panel:mt-11 code-panel:self-stretch code-panel:justify-self-center code-panel:[grid-area:1/1]";
const PANEL_NUMBER =
  "code-panel:static code-panel:self-start code-panel:justify-self-center code-panel:[grid-area:1/1]";
const PANEL_INDICATOR =
  "code-panel:transition-colors code-panel:duration-150 motion-reduce:![transition:none] code-panel:[[data-active]>.step-number>&]:bg-[var(--sol-purple)] code-panel:[[data-active]>.step-number>&]:text-white";
// overflow: clip, not hidden: a scroll container here could capture the
// panel's sticky box in some engines.
const PANEL_BODY =
  "code-panel:overflow-clip code-panel:ps-8 code-panel:pe-px code-panel:[grid-area:1/2]";
const PANEL_RAIL =
  "step-code contents [&:first-child>.step-code-box>:first-child]:mt-0 code-panel:absolute code-panel:inset-y-0 code-panel:end-0 code-panel:block code-panel:w-[50cqw] code-panel:pointer-events-none code-panel:opacity-0 code-panel:transition-opacity code-panel:duration-150 code-panel:data-[shown]:opacity-100 motion-reduce:![transition:none]";
const PANEL_BOX = [
  "step-code-box contents",
  "code-panel:sticky code-panel:top-[6.5rem] code-panel:flex code-panel:max-h-[min(calc(100dvh-11rem),100%)] code-panel:flex-col code-panel:gap-4 code-panel:overflow-y-auto code-panel:rounded-xl code-panel:[scrollbar-width:thin] code-panel:[[data-shown]>&]:pointer-events-auto",
  // Every block: no page margins, no collapsed window, no "See all" footer.
  "code-panel:[&>*]:!m-0 code-panel:[&>*]:flex-none code-panel:[&_.code-block-root]:!h-auto code-panel:[&_.code-block-viewport]:!h-auto code-panel:[&_.code-block-footer]:hidden code-panel:[&_.code-focus-fade]:hidden code-panel:[&_pre]:![transform:none]",
  // One fence: it fills the box, its header stays, its code scrolls.
  "code-panel:[&:has(>.code-block:only-child)]:overflow-hidden code-panel:[&>.code-block:only-child]:flex code-panel:[&>.code-block:only-child]:min-h-0 code-panel:[&>.code-block:only-child]:flex-initial code-panel:[&>.code-block:only-child]:flex-col code-panel:[&>.code-block:only-child>.code-block-root]:flex code-panel:[&>.code-block:only-child>.code-block-root]:min-h-0 code-panel:[&>.code-block:only-child>.code-block-root]:flex-auto code-panel:[&>.code-block:only-child>.code-block-root]:flex-col code-panel:[&>.code-block:only-child_.code-block-viewport]:min-h-0 code-panel:[&>.code-block:only-child_.code-block-viewport]:flex-auto code-panel:[&>.code-block:only-child_.code-block-viewport]:overflow-auto",
  // Several fences, a CodeGroup or Tabs: the box scrolls under their bars.
  "code-panel:[&_.code-block-header]:sticky code-panel:[&_.code-block-header]:top-0 code-panel:[&_.code-block-header]:z-[3] code-panel:[&_.code-group-tab-bar]:sticky code-panel:[&_.code-group-tab-bar]:top-0 code-panel:[&_.code-group-tab-bar]:z-[3] code-panel:[&_.code-group-tab-bar]:bg-[var(--sol-code-head)] code-panel:[&_.tabs-list]:sticky code-panel:[&_.tabs-list]:top-0 code-panel:[&_.tabs-list]:z-[3] code-panel:[&_.tabs-list]:bg-[var(--sol-page)]",
  // Focused lines keep an edge: hovering unblurs the rest (docs.css 7.).
  "code-panel:[&_pre.has-focused_.line-focus]:inline-block code-panel:[&_pre.has-focused_.line-focus]:min-w-full code-panel:[&_pre.has-focused_.line-focus]:-ms-4 code-panel:[&_pre.has-focused_.line-focus]:ps-4 code-panel:[&_pre.has-focused_.line-focus]:[box-shadow:inset_2px_0_0_var(--sol-purple)]",
].join(" ");

/** A fence's props (rehype-code hands each fence in a fragment of its own). */
function fenceProps(n: ReactNode): PreProps | null {
  const el =
    isValidElement(n) && n.type === Fragment
      ? (n.props as { children?: ReactNode }).children
      : n;
  return isValidElement(el) &&
    el.type === CodeBlock &&
    String((el.props as PreProps).className ?? "").includes("shiki")
    ? (el.props as PreProps)
    : null;
}
const isPanelCode = (n: ReactNode) =>
  !!fenceProps(n) ||
  (isValidElement(n) && (n.type === CodeGroup || n.type === Tabs));
const isPanelMark = (n: ReactNode) => fenceProps(n)?.["data-panel"] === "true";

/** [first, last] index of a step's panel code among its children, or null. */
export function panelRun(
  nodes: ReactNode[],
  marked: boolean,
): [number, number] | null {
  if (!marked) {
    const code = nodes.flatMap((n, i) => (isPanelCode(n) ? [i] : []));
    return code.length === 1 ? [code[0], code[0]] : null;
  }
  const start = nodes.findIndex(isPanelMark);
  if (start < 0) return null;
  let end = start;
  for (let i = start + 1; i < nodes.length; i++) {
    if (isPanelMark(nodes[i])) end = i;
    else if (!(typeof nodes[i] === "string" && !String(nodes[i]).trim())) break;
  }
  return [start, end];
}

/**
 * Numbered steps; with `codePanel`, wide screens show each step's code in a
 * sticky panel beside its text (CodePanelSteps), narrower ones as without.
 */
export function Steps({
  children,
  titleSize = "p",
  codePanel,
}: P & { titleSize?: string; codePanel?: boolean }) {
  const steps = elements(children);
  if (!codePanel)
    return (
      <div className="steps" role="list" data-title-size={titleSize}>
        {steps.map((step, i) => (
          <StepItem
            key={i}
            {...(step.props as StepProps)}
            index={i}
            last={i === steps.length - 1}
            titleSize={titleSize}
          />
        ))}
      </div>
    );
  const kids = steps.map((s) =>
    Children.toArray(s.props.children as ReactNode),
  );
  const marked = kids.some((k) => k.some(isPanelMark));
  const shownAt = kids.findIndex((k) => panelRun(k, marked));
  return (
    <CodePanelSteps titleSize={titleSize}>
      {steps.map((step, i) => (
        <StepItem
          key={i}
          {...(step.props as StepProps)}
          index={i}
          last={i === steps.length - 1}
          titleSize={titleSize}
          panel={{ marked, active: i === 0, shown: i === shownAt }}
        />
      ))}
    </CodePanelSteps>
  );
}

interface StepProps {
  title?: ReactNode;
  stepNumber?: number;
  icon?: string;
  id?: string;
  children?: ReactNode;
  /** Set by rehype-docs-compat for Steps whose titles are headings. */
  "data-step-id"?: string;
}

function StepItem({
  title,
  stepNumber,
  icon,
  children,
  index,
  last,
  titleSize,
  panel,
  ...rest
}: StepProps & {
  index: number;
  last: boolean;
  titleSize: string;
  panel?: { marked: boolean; active: boolean; shown: boolean };
}) {
  const id = rest["data-step-id"] ?? rest.id;
  const Title = (titleSize === "h2" || titleSize === "h3" ? titleSize : "p") as
    | "h2"
    | "h3"
    | "p";
  // rehype-docs-compat puts h2/h3 titles in as the first child (for the TOC).
  const all = Children.toArray(children);
  const first = all.find(isValidElement) as
    | ReactElement<Record<string, unknown>>
    | undefined;
  const headingTitle =
    first && first.props["data-step-title"] !== undefined ? first : null;
  if (headingTitle) children = all.filter((c) => c !== headingTitle);
  if (panel) {
    const nodes = headingTitle ? all.filter((c) => c !== headingTitle) : all;
    const run = panelRun(nodes, panel.marked);
    if (run) {
      const [s, e] = run;
      children = [
        ...nodes.slice(0, s),
        <div
          key="step-code"
          className={PANEL_RAIL}
          data-shown={panel.shown ? "" : undefined}
        >
          <div className={PANEL_BOX}>{nodes.slice(s, e + 1)}</div>
        </div>,
        ...nodes.slice(e + 1),
      ];
    }
  }
  return (
    <div
      id={id}
      className={
        panel ? "step step-container " + PANEL_STEP : "step step-container"
      }
      role="listitem"
      data-active={panel?.active ? "" : undefined}
    >
      <div
        data-component-part="step-line"
        className={
          (last ? "step-line step-line-last" : "step-line") +
          (panel ? " " + PANEL_LINE : "")
        }
      />
      <div
        data-component-part="step-number"
        className={panel ? "step-number " + PANEL_NUMBER : "step-number"}
      >
        <div
          data-component-part="step-indicator"
          className={
            panel ? "step-indicator " + PANEL_INDICATOR : "step-indicator"
          }
        >
          {icon ? (
            <Icon icon={icon} size={14} />
          ) : (
            <div>{stepNumber ?? index + 1}</div>
          )}
        </div>
      </div>
      <div className={panel ? "step-body " + PANEL_BODY : "step-body"}>
        {title ? (
          <Title data-component-part="step-title" className="step-title">
            {headingTitle ? (headingTitle.props.children as ReactNode) : title}
          </Title>
        ) : null}
        <div data-component-part="step-content" className="prose step-content">
          {children}
        </div>
      </div>
    </div>
  );
}
export function Step({ children }: P & { title?: string }) {
  return <>{children}</>;
}

// ------------------------------------------------- Accordions, Expandable

export function AccordionGroup({ children }: P) {
  return <div className="accordion-group prose">{children}</div>;
}

export function Accordion({
  title,
  description,
  defaultOpen,
  icon,
  id,
  children,
}: P & {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  icon?: string;
  id?: string;
}) {
  const anchor =
    id ??
    title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "");
  return (
    <details className="accordion" open={defaultOpen || undefined}>
      <summary
        className="not-prose accordion-button"
        data-component-part="accordion-button"
      >
        <div id={anchor} className="accordion-anchor" />
        <div
          data-component-part="accordion-caret-right"
          className="accordion-caret"
        >
          {icon ? (
            <Icon icon={icon} size={12} />
          ) : (
            <CaretIcon className="accordion-chevron" />
          )}
        </div>
        <div
          data-component-part="accordion-title-container"
          className="accordion-title-container"
        >
          <p data-component-part="accordion-title" className="accordion-title">
            {title}
          </p>
          {description ? (
            <p
              data-component-part="accordion-description"
              className="accordion-description"
            >
              {description}
            </p>
          ) : null}
        </div>
      </summary>
      <div
        role="region"
        data-component-part="accordion-content"
        className="accordion-content prose"
      >
        {children}
      </div>
    </details>
  );
}

export function Expandable({
  title,
  defaultOpen,
  children,
}: P & { title?: string; defaultOpen?: boolean }) {
  const label = title ?? "properties";
  return (
    <details className="expandable" open={defaultOpen || undefined}>
      <summary
        className="not-prose expandable-button"
        data-component-part="expandable-button"
      >
        <ChevronIcon className="expandable-chevron" />
        <div className="expandable-label">
          <p className="expandable-label-text">
            <span className="expandable-show">Show {label}</span>
            <span className="expandable-hide">Hide {label}</span>
          </p>
        </div>
      </summary>
      <div
        className="expandable-content"
        data-component-part="expandable-content"
      >
        {children}
      </div>
    </details>
  );
}

// ---------------------------------------------------------------- Fields

function Field({
  name,
  kind,
  type,
  required,
  deprecated,
  defaultValue,
  post,
  children,
}: P & {
  name?: string;
  kind: "param" | "response";
  type?: string;
  required?: boolean;
  deprecated?: boolean;
  defaultValue?: unknown;
  /** Labels after the type (e.g. which response shape this is). */
  post?: string[];
}) {
  const id = name
    ? `${kind === "param" ? "param" : "response"}-${name.replace(/[^\w.-]+/g, "-").toLowerCase()}`
    : undefined;
  return (
    <div className="field">
      <div id={id} className="param-head">
        <div className="param-head-inner">
          <div className="param-head-row">
            {id ? (
              <a href={`#${id}`} className="field-anchor" aria-label={name}>
                ​
              </a>
            ) : null}
            <span data-component-part="field-name" className="field-name">
              {name}
            </span>
            <div data-component-part="field-meta" className="field-meta">
              {type ? (
                <div
                  data-component-part="field-info-pill"
                  className="field-pill"
                >
                  <span>{type}</span>
                </div>
              ) : null}
              {post?.map((label) => (
                <div
                  key={label}
                  data-component-part="field-info-pill"
                  className="field-pill"
                >
                  <span>{label}</span>
                </div>
              ))}
              {defaultValue !== undefined ? (
                <div
                  data-component-part="field-info-pill"
                  className="field-pill"
                >
                  <span className="field-pill-label">default:</span>
                  <span>
                    {typeof defaultValue === "string"
                      ? JSON.stringify(defaultValue)
                      : String(defaultValue)}
                  </span>
                </div>
              ) : null}
              {required ? (
                <div
                  data-component-part="field-required-pill"
                  className="field-pill field-pill-required"
                >
                  required
                </div>
              ) : null}
              {deprecated ? (
                <div
                  data-component-part="field-deprecated-pill"
                  className="field-pill field-pill-deprecated"
                >
                  deprecated
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {children ? (
        <div
          data-component-part="field-content"
          className="field-content prose-sm"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function ParamField(
  props: P & {
    body?: string;
    query?: string;
    path?: string;
    header?: string;
    type?: string;
    required?: boolean;
    deprecated?: boolean;
    default?: unknown;
  },
) {
  return (
    <Field
      kind="param"
      name={props.body ?? props.query ?? props.path ?? props.header}
      type={props.type}
      required={props.required}
      deprecated={props.deprecated}
      defaultValue={props.default}
    >
      {props.children}
    </Field>
  );
}

export function ResponseField(
  props: P & {
    name: string;
    type?: string;
    required?: boolean;
    deprecated?: boolean;
    default?: unknown;
    post?: string[];
  },
) {
  return (
    <Field
      kind="response"
      name={props.name}
      type={props.type}
      required={props.required}
      deprecated={props.deprecated}
      defaultValue={props.default}
      post={props.post}
    >
      {props.children}
    </Field>
  );
}

// ----------------------------------------------------------------- Code

type PreProps = ComponentProps<"pre"> & {
  title?: string;
  "data-language"?: string;
  "data-highlight"?: string;
  "data-focus"?: string;
  "data-expandable"?: string;
  "data-wrap"?: string;
  "data-lines"?: string;
  "data-panel"?: string;
  "data-icon"?: string;
};

function lineCount(children: ReactNode): number {
  const code = elements(children)[0];
  if (!code) return 0;
  return elements(code.props.children as ReactNode).length;
}

/**
 * The rows a collapsed (expandable) block shows when its focused lines (else
 * its highlighted lines) start below today's top window (lines 1–5): those
 * lines plus a line of context, 6 to 16 rows (no more than the block has) from
 * line `from + 1`. Null keeps today's 190px top window.
 */
export function focusWindow(spec: string | undefined, count: number) {
  const lines = [...parseRanges(spec)].filter((n) => n >= 1 && n <= count);
  if (!lines.length) return null;
  const first = Math.min(...lines),
    last = Math.max(...lines);
  if (last <= 5) return null;
  const rows = Math.min(16, count, Math.max(6, last - first + 3));
  return { from: Math.max(0, Math.min(first - 2, count - rows)), rows };
}

/** The bare highlighted code, shared by single blocks and code groups. */
function CodeBody({ pre, rounded }: { pre: PreProps; rounded?: boolean }) {
  const {
    title: _title,
    "data-expandable": expandable,
    "data-wrap": wrap,
    "data-lines": lines,
    "data-icon": _icon,
    children,
    ...rest
  } = pre;
  const count = lineCount(children);
  const collapse = expandable === "true" && count > 8;
  // Blocks that mark lines with `highlight` and no `focus` open on those.
  const win =
    collapse && !wrap
      ? focusWindow(pre["data-focus"] || pre["data-highlight"], count)
      : null;
  return (
    <>
      <div
        role="presentation"
        data-component-part="code-block-root"
        className={
          (rounded
            ? "code-block-root code-block-root-rounded"
            : "code-block-root") +
          (win
            ? " [html[data-theme-preference]_&_pre]:[transform:translateY(calc(var(--focus-from)*-1.5rem))] [[data-expanded]_&_pre]:![transform:none]"
            : "")
        }
        data-expandable={collapse ? "" : undefined}
        data-focus-window={win ? "" : undefined}
        data-wrap={wrap ? "" : undefined}
        data-lines={lines ? "" : undefined}
        style={
          collapse
            ? win
              ? ({
                  height: `calc(${win.rows} * 1.5rem + 4rem)`,
                  "--focus-from": win.from,
                } as CSSProperties)
              : { height: "190px" }
            : undefined
        }
      >
        {/* More code above the window. */}
        {win && win.from > 0 ? (
          <div
            aria-hidden="true"
            className="code-focus-fade pointer-events-none absolute inset-x-0 top-0 z-[1] h-5 bg-gradient-to-b from-[var(--sol-code-bg)] to-transparent [html:not([data-theme-preference])_&]:hidden [[data-expanded]_&]:hidden"
          />
        ) : null}
        <div
          data-component-part="scroll-area-viewport"
          className="code-block-viewport"
        >
          <pre {...rest}>{children}</pre>
        </div>
      </div>
      {collapse ? <CodeExpandFooter count={count} /> : null}
    </>
  );
}

export function CodeBlock(pre: PreProps) {
  // A <pre> written in a page (e.g. the Run panel's live output) is not a
  // code fence: render it as written.
  if (!String(pre.className ?? "").includes("shiki")) return <pre {...pre} />;
  const title = pre.title;
  return (
    <div
      className="code-block not-prose"
      data-has-header={title ? "" : undefined}
      data-has-floating-buttons={title ? undefined : ""}
      data-language={pre["data-language"]}
      data-code-copy-scope=""
    >
      {title ? (
        <div
          data-component-part="code-block-header"
          className="code-block-header"
        >
          <div
            data-component-part="code-block-header-filename"
            className="code-block-filename"
          >
            <span>{title}</span>
          </div>
          <div className="code-block-actions">
            <CopyCodeButton />
            <AskCodeButton />
          </div>
        </div>
      ) : (
        <div data-floating-buttons="true" className="code-block-floating">
          <CopyCodeButton />
          <AskCodeButton />
        </div>
      )}
      <CodeBody pre={pre} rounded={!title} />
      {title ? null : (
        <div className="code-block-fade-overlay" aria-hidden="true" />
      )}
    </div>
  );
}

/**
 * One tab per fence. Anything else in the group (the legacy web3.js notice
 * written before a "Web3.js (legacy)" fence) goes at the top of the next
 * fence's panel. The code under it gets a wrapper of its own: `.code-block-root`
 * is `height: 100%`, which in the stretched panel is the whole panel, notice
 * included, and would push the code's bottom (and scrollbar) under the
 * panels' `overflow: hidden` edge.
 */
function codeGroupFrom(children: ReactNode, variant?: "api") {
  const blocks: { pre: PreProps; lead: ReactElement[] }[] = [];
  let lead: ReactElement[] = [];
  for (const el of elements(children)) {
    if (
      typeof (el.props as PreProps)["data-language"] === "string" ||
      el.type === CodeBlock
    ) {
      blocks.push({ pre: el.props as PreProps, lead });
      lead = [];
    } else lead.push(el);
  }
  const labels = blocks.map(({ pre }, i) =>
    String(pre.title ?? pre["data-language"] ?? `Tab ${i + 1}`),
  );
  return (
    <CodeGroupClient
      labels={labels}
      variant={variant}
      panels={blocks.map(({ pre, lead }, i) =>
        lead.length ? (
          <Fragment key={i}>
            <div className="px-3 pt-3 [&>.callout]:my-0">{lead}</div>
            <div>
              <CodeBody pre={pre} rounded />
            </div>
          </Fragment>
        ) : (
          <CodeBody key={i} pre={pre} rounded />
        ),
      )}
    />
  );
}

export function CodeGroup({ children }: P) {
  return codeGroupFrom(children);
}

/**
 * <RequestExample> / <ResponseExample> (RPC method pages). In the page flow
 * they render nothing: DocsPage shows them in the examples column (from
 * 1280px) or under the page header (narrower), via ApiExamples.
 */
export function RequestExample() {
  return null;
}
export function ResponseExample() {
  return null;
}
function ApiRequestExample({ children }: P) {
  return codeGroupFrom(children, "api");
}
function ApiResponseExample({ children }: P) {
  return codeGroupFrom(children, "api");
}

/**
 * MDX `wrapper` that renders only a page's request/response examples, for
 * the examples column.
 */
export function ApiExamplesWrapper({ children }: P) {
  // MDX passes one element (its content component); render it to its
  // top-level elements (a plain function, no hooks) and keep the examples.
  let content: ReactNode = children;
  const only = elements(children)[0];
  if (only && typeof only.type === "function") {
    const tree = (only.type as (p: unknown) => ReactNode)(only.props);
    content = isValidElement(tree)
      ? ((tree.props as { children?: ReactNode }).children ?? tree)
      : tree;
  }
  const found = elements(content).filter(
    (el) => el.type === RequestExample || el.type === ResponseExample,
  );
  if (!found.length) return null;
  return (
    <div className="api-examples">
      {found.map((el, i) =>
        el.type === RequestExample ? (
          <ApiRequestExample key={i}>
            {el.props.children as ReactNode}
          </ApiRequestExample>
        ) : (
          <ApiResponseExample key={i}>
            {el.props.children as ReactNode}
          </ApiResponseExample>
        ),
      )}
    </div>
  );
}

// ------------------------------------------------------- Frames, images

export function Frame({
  caption,
  hint,
  children,
}: P & { caption?: string; hint?: string }) {
  const Tag = caption ? "figure" : "div";
  return (
    <Tag className="frame not-prose" data-name="frame">
      {hint ? <div className="frame-hint">{hint}</div> : null}
      <div className="frame-inner relative">{children}</div>
      {caption ? (
        <figcaption
          className="frame-caption"
          data-component-part="frame-caption"
        >
          {caption}
        </figcaption>
      ) : null}
    </Tag>
  );
}

// ------------------------------------------------------- Inline helpers

export function Badge({ children, color }: P & { color?: string }) {
  return (
    <span className="badge" data-color={color}>
      {children}
    </span>
  );
}

// ------------------------------------------------------------------ Tree

function TreeFolder({
  name,
  defaultOpen,
  children,
  depth = 0,
}: P & { name: string; defaultOpen?: boolean; depth?: number }) {
  return (
    <details
      className="tree-folder"
      open={defaultOpen || undefined}
      role="none"
    >
      <summary
        role="treeitem"
        className="tree-row"
        style={{ paddingInlineStart: `${6 + depth * 22}px` }}
      >
        <Icon
          icon="folder-open"
          size={16}
          className="tree-icon tree-icon-open"
        />
        <Icon icon="folder" size={16} className="tree-icon tree-icon-closed" />
        <span data-component-part="tree-folder-title" className="tree-title">
          {name}
        </span>
      </summary>
      <div
        role="group"
        className="tree-group"
        data-component-part="tree-folder-children-wrapper"
      >
        <div
          className="tree-line"
          data-component-part="tree-folder-children-line"
          style={{ insetInlineStart: `${14 + depth * 22}px` }}
        />
        {elements(children).map((el, i) => (
          <TreeChild key={i} el={el} depth={depth + 1} />
        ))}
      </div>
    </details>
  );
}

function TreeFile({ name, depth = 0 }: { name: string; depth?: number }) {
  return (
    <div
      role="treeitem"
      className="tree-row"
      style={{ paddingInlineStart: `${6 + depth * 22}px` }}
    >
      <Icon icon="file" size={16} className="tree-icon" />
      <span data-component-part="tree-file-title" className="tree-title">
        {name}
      </span>
    </div>
  );
}

function TreeChild({
  el,
  depth,
}: {
  el: ReactElement<Record<string, unknown>>;
  depth: number;
}) {
  if (el.type === TreeFolderShim)
    return <TreeFolder {...(el.props as { name: string })} depth={depth} />;
  if (el.type === TreeFileShim)
    return <TreeFile {...(el.props as { name: string })} depth={depth} />;
  return el;
}

function TreeFolderShim(props: P & { name: string; defaultOpen?: boolean }) {
  return <TreeFolder {...props} />;
}
function TreeFileShim(props: { name: string }) {
  return <TreeFile {...props} />;
}

function TreeRoot({ children }: P) {
  return (
    <div className="tree not-prose" role="tree">
      <div role="none">
        {elements(children).map((el, i) => (
          <TreeChild key={i} el={el} depth={0} />
        ))}
      </div>
    </div>
  );
}
export const Tree = Object.assign(TreeRoot, {
  Folder: TreeFolderShim,
  File: TreeFileShim,
});

// ------------------------------------------------------------ Elements

function Heading({
  as: Tag,
  id,
  children,
  ...rest
}: ComponentProps<"h2"> & { as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) {
  if ("data-step-title" in rest) return <>{children}</>;
  if (!id) return <Tag {...rest}>{children}</Tag>;
  return (
    <Tag
      id={id}
      {...rest}
      className={["heading", rest.className].filter(Boolean).join(" ")}
    >
      <a
        href={`#${id}`}
        className="heading-anchor"
        aria-label="Navigate to header"
      >
        ​
      </a>
      <span className="heading-text">{children}</span>
    </Tag>
  );
}

/** Markdown links carry the "link" class the docs styles select on. */
function Anchor({
  href = "",
  children,
  className,
  ...rest
}: ComponentProps<"a">) {
  const cls = className ? `link ${className}` : "link";
  if (isDocsHref(href))
    return (
      <DocsLink href={href} {...rest} className={cls}>
        {children}
      </DocsLink>
    );
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...rest}
      className={cls}
      {...(external && !rest.target
        ? { target: "_blank", rel: "noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}

function Table(props: ComponentProps<"table">) {
  // A <table> written in a page renders as written.
  if ((props as Record<string, unknown>)["data-md-table"] === undefined)
    return <table {...props} />;
  return (
    <div className="table-wrap" data-table-wrapper="true">
      <div className="table-scroll" role="region">
        <div className="flex">
          <div className="table-grow">
            <table {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const docsComponents = {
  // Elements
  h1: (p: ComponentProps<"h1">) => <Heading as="h1" {...p} />,
  h2: (p: ComponentProps<"h2">) => <Heading as="h2" {...p} />,
  h3: (p: ComponentProps<"h3">) => <Heading as="h3" {...p} />,
  h4: (p: ComponentProps<"h4">) => <Heading as="h4" {...p} />,
  h5: (p: ComponentProps<"h5">) => <Heading as="h5" {...p} />,
  h6: (p: ComponentProps<"h6">) => <Heading as="h6" {...p} />,
  // Paragraphs are block spans, so JSX blocks written inside them (<p>,
  // <div>) stay valid HTML, as the docs have always rendered them.
  p: (p: ComponentProps<"span">) => <span data-as="p" {...p} />,
  a: Anchor,
  pre: CodeBlock,
  table: Table,
  // Content components
  Note,
  Info,
  Tip,
  Check,
  Warning,
  Danger,
  Callout,
  Card,
  Columns,
  CardGroup,
  Tabs,
  Tab,
  Steps,
  Step,
  AccordionGroup,
  Accordion,
  Expandable,
  CodeGroup,
  RequestExample,
  ResponseExample,
  ParamField,
  ResponseField,
  Frame,
  Tooltip,
  Badge,
  Icon,
  Tree,
  TxWalkthrough,
  LiveFeed,
  InActionScene,
  FullscreenButton,
};

export { text as textContent };
