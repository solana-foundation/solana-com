// Keep the page's responsive, state, and pseudo-element styles in Tailwind.
export const styles = {
  thesis: "rfs-thesis",
  page: `rfs-page [--ink:#070708] [--surface:#0d0d10] [--paper:#f4f3f6] [--muted:#9996a2] [--quiet:#6d6a74]
    [--line:rgba(244,_243,_246,_0.16)] [--line-strong:rgba(244,_243,_246,_0.28)] [--violet:#9945ff]
    [--green:#14f195] [background:var(--ink)] [color:var(--paper)] [font-family:Diatype,_sans-serif]
    [margin-bottom:-80px] overflow-hidden`,
  hero: `rfs-hero [background:var(--ink)] [color:var(--paper)] [min-height:min(860px,_92svh)] overflow-hidden relative
    isolate
    [&::after]:[background:radial-gradient(_ellipse_46%_54%_at_50%_47%,_rgba(7,_7,_8,_0.98)_0,_rgba(7,_7,_8,_0.9)_36%,_rgba(7,_7,_8,_0.28)_68%,_transparent_84%_)]
    [&::after]:content-[''] [&::after]:inset-0 [&::after]:pointer-events-none [&::after]:absolute
    [&::after]:[z-index:-1]
    [&_h1]:[font:200_clamp(68px,_9.5vw,_148px)/0.88_Diatype,_sans-serif]
    [&_h1]:[letter-spacing:-0.052em]
    [&_h1]:[margin:0]
    [&_h1]:text-balance
    [&_h1_span]:block
    [&_h1_em]:[color:var(--green)]
    [&_h1_em]:italic [&_h1_em]:font-bold
    max-[900px]:[min-height:760px]
    max-[620px]:[min-height:700px]
    max-[620px]:[&_h1]:[font-size:clamp(58px,_18vw,_88px)]
    max-[620px]:[&_h1]:[line-height:0.91]
    max-[620px]:[&_h1_span:first-child]:whitespace-nowrap`,
  pointField: `rfs-pointField [color:rgba(244,_243,_246,_0.7)] h-full inset-0 pointer-events-none absolute w-full [z-index:-2]
    max-[620px]:[left:-55%]
    max-[620px]:[width:210%]`,
  pointCloudPrimary: `rfs-pointCloudPrimary [transform-box:fill-box] [transform-origin:center] [opacity:0.68]
    motion-safe:animate-[rfs-point-drift_14s_ease-in-out_infinite_alternate]`,
  pointCloudAccent: `rfs-pointCloudAccent [transform-box:fill-box] [transform-origin:center] [opacity:0.28]
    [transform:translateY(8px)]
    motion-safe:animate-[rfs-point-drift-accent_18s_ease-in-out_infinite_alternate]`,
  signalLines: `rfs-signalLines [transform-box:fill-box] [transform-origin:center] [fill:none] [opacity:0.75]
    [stroke-dasharray:1.4_7] [stroke-linecap:butt] [stroke-width:1.5]
    motion-safe:animate-[rfs-signal-flow_16s_linear_infinite]`,
  heroInner: `rfs-heroInner flex flex-col [margin:0_auto] [min-height:min(860px,_92svh)]
    [padding:30px_clamp(20px,_4.45vw,_72px)] relative [width:min(100%,_1600px)]
    max-[900px]:[min-height:760px]
    max-[620px]:[min-height:700px]
    max-[620px]:[padding-top:22px]`,
  heroMeta: `rfs-heroMeta [font:500_10px/1.35_DSemi,_monospace] [letter-spacing:0.07em] uppercase
    [color:rgba(244,_243,_246,_0.58)] flex [gap:20px] justify-between
    max-[620px]:[&_span:last-child]:hidden`,
  indexHeader: `rfs-indexHeader [font:500_10px/1.35_DSemi,_monospace] [letter-spacing:0.07em] uppercase grid
    [grid-template-columns:minmax(0,_0.95fr)_minmax(110px,_0.22fr)_minmax(220px,_0.55fr)_28px]
    [border-bottom:1px_solid_var(--line-strong)] [color:var(--quiet)] [padding:14px_0]
    max-[900px]:[grid-template-columns:minmax(0,_1fr)_110px_28px]
    max-[900px]:[&_span:nth-child(3)]:hidden
    max-[620px]:[grid-template-columns:minmax(0,_1fr)_24px]
    max-[620px]:[&_span:nth-child(2)]:hidden`,
  heroCenter: `rfs-heroCenter items-center flex flex-1 flex-col justify-center [margin:38px_auto_56px] [max-width:1060px]
    relative text-center w-full
    max-[620px]:[align-items:flex-start]
    max-[620px]:[margin-bottom:40px]
    max-[620px]:text-left`,
  eyebrow: `rfs-eyebrow [font:500_11px/1.35_DSemi,_monospace] [letter-spacing:0.11em] [margin:0] uppercase`,
  heroLockup: `rfs-heroLockup block [filter:drop-shadow(0_14px_30px_rgba(20,_241,_149,_0.1))] h-auto
    [margin:0_auto_clamp(24px,_3vw,_38px)] [max-width:300px] [width:min(760px,_calc(100vw_-_40px))]`,
  build: `rfs-build
    [&_h2_em]:[color:var(--green)]
    [&_h2_em]:italic [&_h2_em]:font-bold
    items-center [background:var(--ink)] flex [min-height:min(760px,_82svh)] overflow-hidden
    [padding:clamp(80px,_10vw,_150px)_clamp(20px,_8.6vw,_138px)] relative text-center isolate
    [&::before]:[background:radial-gradient(_circle_at_50%_52%,_rgba(153,_69,_255,_0.12),_transparent_37%_)]
    [&::before]:content-[''] [&::before]:inset-0 [&::before]:absolute
    [&::before]:[z-index:-1]
    [&_.rfs-eyebrow]:[color:var(--green)]
    [&_.rfs-eyebrow]:[margin-bottom:28px]
    [&_h2]:[font:200_clamp(58px,_8.2vw,_126px)/0.92_Diatype,_sans-serif]
    [&_h2]:[letter-spacing:-0.05em]
    [&_h2]:[margin:0_auto_30px]
    [&_h2]:text-balance
    [&_p:not(.rfs-eyebrow)]:[color:var(--muted)]
    [&_p:not(.rfs-eyebrow)]:[font:400_clamp(16px,_1.4vw,_20px)/1.5_Diatype,_sans-serif]
    [&_p:not(.rfs-eyebrow)]:[margin:0_auto_34px]
    [&_p:not(.rfs-eyebrow)]:[max-width:530px]
    max-[620px]:[min-height:660px]
    max-[620px]:[padding:80px_20px]
    max-[620px]:text-left
    max-[620px]:[&_h2]:[font-size:clamp(56px,_17vw,_82px)]
    max-[620px]:[&_h2]:[margin-left:0]
    max-[620px]:[&_p:not(.rfs-eyebrow)]:[margin-left:0]
    max-[620px]:[&_.rfs-pointField]:[left:-85%]`,
  heroAside: `rfs-heroAside items-center flex flex-col [margin-top:30px]
    max-[620px]:[align-items:flex-start]
    max-[620px]:[margin-top:30px]`,
  heroActionGroup: `rfs-heroActionGroup items-center flex flex-wrap [gap:12px] justify-center`,
  heroStrapline: `rfs-heroStrapline [color:rgba(244,_243,_246,_0.64)]
    [font:400_clamp(16px,_1.4vw,_20px)/1.48_Diatype,_sans-serif] [margin:34px_0_0] [max-width:580px] text-balance
    max-[620px]:[max-width:390px]
    max-[620px]:[text-wrap:auto]`,
  textLink: `rfs-textLink items-center [color:inherit] inline-flex [gap:10px] no-underline [background:transparent]
    [border:1px_solid_rgba(244,_243,_246,_0.7)] rounded-full shadow-none [font:500_12px/1.2_DSemi,_monospace]
    h-auto [padding:12px_16px]
    [&_svg]:[color:var(--green)]
    motion-safe:[transition:color_0.25s_ease,_border-color_0.25s_ease,_background-color_0.25s_ease,_opacity_0.25s_ease,_transform_0.25s_ease]
    motion-safe:[&:hover]:[background:transparent]
    motion-safe:[&:hover]:[border-color:var(--green)]
    motion-safe:[&:hover]:[color:var(--green)]
    [&:focus-visible]:[outline:3px_solid_var(--green)]
    [&:focus-visible]:[outline-offset:5px]`,
  briefLink: `rfs-briefLink items-center [color:inherit] inline-flex [gap:10px] no-underline
    [border:1px_solid_rgba(244,_243,_246,_0.7)] rounded-full [font:500_11px/1_DSemi,_monospace]
    [letter-spacing:0.025em] [padding:13px_17px]
    [&_svg]:[color:var(--request-accent)]
    motion-safe:[transition:color_0.25s_ease,_border-color_0.25s_ease,_background-color_0.25s_ease,_opacity_0.25s_ease,_transform_0.25s_ease]
    motion-safe:[&:hover]:[background:var(--paper)]
    motion-safe:[&:hover]:[color:var(--ink)]
    motion-safe:[&:hover]:[transform:translateY(-2px)]
    [&:focus-visible]:[outline:3px_solid_var(--green)]
    [&:focus-visible]:[outline-offset:5px]`,
  heroAgentLink: `rfs-heroAgentLink [background:var(--paper)] [border:1px_solid_var(--paper)] rounded-full [color:var(--ink)]
    inline-flex [font:500_12px/1.2_DSemi,_monospace] [gap:10px] h-auto [padding:12px_16px] no-underline
    [&_svg]:[color:var(--violet)]
    motion-safe:[transition:color_0.25s_ease,_border-color_0.25s_ease,_background-color_0.25s_ease,_opacity_0.25s_ease,_transform_0.25s_ease]
    motion-safe:[&:hover]:[background:var(--paper)]
    motion-safe:[&:hover]:[color:var(--ink)]
    motion-safe:[&:hover]:[transform:translateY(-2px)]
    [&:focus-visible]:[outline:3px_solid_var(--green)]
    [&:focus-visible]:[outline-offset:5px]`,
  cta: `rfs-cta
    [&_svg]:[color:var(--green)]
    [background:var(--paper)] rounded-full [color:var(--ink)] inline-flex [font:500_12px/1_DSemi,_monospace]
    [gap:9px] [padding:14px_18px] no-underline
    motion-safe:[transition:color_0.25s_ease,_border-color_0.25s_ease,_background-color_0.25s_ease,_opacity_0.25s_ease,_transform_0.25s_ease]
    motion-safe:[&:hover]:[background:var(--paper)]
    motion-safe:[&:hover]:[color:var(--ink)]
    motion-safe:[&:hover]:[transform:translateY(-2px)]
    [&:focus-visible]:[outline:3px_solid_var(--green)]
    [&:focus-visible]:[outline-offset:5px]`,
  requestsSection: `rfs-requestsSection [background:var(--surface)]
    [padding:clamp(80px,_10vw,_150px)_clamp(20px,_4.45vw,_72px)_clamp(96px,_12vw,_180px)]
    max-[620px]:[padding:72px_20px_104px]`,
  requestsHeading: `rfs-requestsHeading [align-items:end] grid [gap:30px] [grid-template-columns:0.45fr_1fr_0.55fr]
    [margin:0_auto_clamp(48px,_7vw,_94px)] [max-width:1456px]
    [&_.rfs-eyebrow]:[color:var(--green)]
    [&_h2]:[font:200_clamp(48px,_6.2vw,_96px)/0.96_Diatype,_sans-serif]
    [&_h2]:[letter-spacing:-0.045em]
    [&_h2]:[margin:0]
    [&_>_p:last-child]:[color:var(--muted)]
    [&_>_p:last-child]:[font:400_17px/1.45_Diatype,_sans-serif]
    [&_>_p:last-child]:[margin:0]
    [&_>_p:last-child]:[max-width:270px]
    max-[900px]:[grid-template-columns:0.4fr_1.2fr]
    max-[900px]:[&_>_p:last-child]:hidden
    max-[620px]:[align-items:start]
    max-[620px]:[gap:18px]
    max-[620px]:[grid-template-columns:1fr]
    max-[620px]:[margin-bottom:48px]
    max-[620px]:[&_h2]:[font-size:clamp(48px,_16vw,_72px)]`,
  requests: `rfs-requests [border-top:1px_solid_var(--line-strong)] [margin:0_auto] [max-width:1456px]`,
  requestTrigger: `rfs-requestTrigger grid
    [grid-template-columns:minmax(0,_0.95fr)_minmax(110px,_0.22fr)_minmax(220px,_0.55fr)_28px] items-center
    appearance-none [background:none] [border:0] [color:inherit] cursor-pointer
    [padding:clamp(24px,_2.4vw,_37px)_0] text-left no-underline w-full
    [&:hover]:no-underline
    [&_>_svg]:hidden
    [&[data-state=open]_.rfs-toggle]:[font-size:0]
    [&[data-state=open]_.rfs-toggle::after]:content-['−']
    [&[data-state=open]_.rfs-toggle::after]:[font-size:29px]
    motion-safe:[&:hover_.rfs-requestTitle]:[color:var(--request-accent)]
    motion-safe:[&:hover_.rfs-toggle]:[color:var(--request-accent)]
    [&:focus-visible]:[outline:3px_solid_var(--green)]
    [&:focus-visible]:[outline-offset:5px]
    max-[900px]:[grid-template-columns:minmax(0,_1fr)_110px_28px]
    max-[620px]:[grid-template-columns:minmax(0,_1fr)_24px]`,
  request: `rfs-request [--request-accent:var(--green)] [border-bottom:1px_solid_var(--line)] relative
    [&::before]:[background:var(--request-accent)]
    [&::before]:content-['']
    [&::before]:[height:1px]
    [&::before]:[left:0]
    [&::before]:[opacity:0]
    [&::before]:absolute
    [&::before]:[right:100%]
    [&::before]:[top:-1px]
    [&[data-state=open]::before]:[opacity:1]
    [&[data-state=open]::before]:[right:0]
    [&[data-state=open]_.rfs-requestTitle]:[color:var(--request-accent)]
    [&[data-state=open]_.rfs-toggle]:[color:var(--request-accent)]
    motion-safe:[&::before]:[transition:right_0.5s_cubic-bezier(0.22,_1,_0.36,_1),_opacity_0.2s_ease]`,
  category: `rfs-category [color:var(--quiet)] [font:500_10px/1.35_DSemi,_monospace] [letter-spacing:0.06em] uppercase
    max-[620px]:hidden`,
  requestTitle: `rfs-requestTitle [font:500_clamp(27px,_3.25vw,_52px)/1.02_Diatype,_sans-serif] [letter-spacing:-0.035em]
    motion-safe:[transition:color_0.25s_ease,_border-color_0.25s_ease,_background-color_0.25s_ease,_opacity_0.25s_ease,_transform_0.25s_ease]
    max-[620px]:[font-size:clamp(25px,_8.3vw,_38px)]`,
  requestSummary: `rfs-requestSummary [color:var(--muted)] [display:-webkit-box] [font:400_13px/1.35_Diatype,_sans-serif]
    overflow-hidden [padding-right:20px] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]
    max-[900px]:hidden`,
  toggle: `rfs-toggle [font:300_29px/1_Diatype,_sans-serif] text-right
    motion-safe:[transition:color_0.25s_ease,_border-color_0.25s_ease,_background-color_0.25s_ease,_opacity_0.25s_ease,_transform_0.25s_ease]`,
  requestDetail: `rfs-requestDetail overflow-hidden [padding:0]`,
  detailInner: `rfs-detailInner [align-items:start] grid [gap:clamp(40px,_7vw,_116px)]
    [grid-template-columns:minmax(0,_0.86fr)_minmax(380px,_1.14fr)] [padding:10px_0_clamp(52px,_5vw,_76px)]
    max-[900px]:[gap:42px]
    max-[900px]:[grid-template-columns:1fr]
    max-[620px]:[gap:36px]
    max-[620px]:[padding:8px_0_50px]`,
  brief: `rfs-brief [max-width:650px]`,
  copy: `rfs-copy [font:300_clamp(18px,_1.45vw,_22px)/1.48_Diatype,_sans-serif]
    [&_p]:[margin:0_0_24px]
    [&_.rfs-detailLabel]:[color:var(--request-accent)]
    [&_.rfs-detailLabel]:[font:500_10px/1.35_DSemi,_monospace]
    [&_.rfs-detailLabel]:[letter-spacing:0.07em]
    [&_.rfs-detailLabel]:[margin:0_0_12px]
    [&_.rfs-detailLabel]:uppercase
    [&_.rfs-thesis]:[font-size:clamp(24px,_2vw,_33px)]
    [&_.rfs-thesis]:font-medium
    [&_.rfs-thesis]:[letter-spacing:-0.025em]
    [&_.rfs-thesis]:[line-height:1.16]
    [&_p:last-child]:[color:var(--muted)]`,
  detailLabel: `rfs-detailLabel [color:var(--request-accent)] [font:500_10px/1.35_DSemi,_monospace] [letter-spacing:0.07em]
    [margin:0_0_12px] uppercase`,
  context: `rfs-context
    [&_dt]:[color:var(--request-accent)]
    [&_dt]:[font:500_10px/1.35_DSemi,_monospace]
    [&_dt]:[letter-spacing:0.07em]
    [&_dt]:[margin:0_0_12px]
    [&_dt]:uppercase
    [border-bottom:1px_solid_var(--line)] [border-top:1px_solid_var(--line)] grid [gap:28px]
    [grid-template-columns:1fr_1fr] [margin:36px_0] [padding:28px_0]
    [&_div]:[margin:0]
    [&_dd]:[margin:0]
    [&_dd]:[color:var(--muted)]
    [&_dd]:[font:300_15px/1.5_Diatype,_sans-serif]
    max-[620px]:[gap:24px]
    max-[620px]:[grid-template-columns:1fr]`,
  startingPoints: `rfs-startingPoints
    [&_ul]:[list-style:none]
    [&_ul]:[margin:0_0_34px]
    [&_ul]:[padding:0]
    [&_li]:[font:300_16px/1.45_Diatype,_sans-serif]
    [&_li]:[margin-bottom:10px]
    [&_li]:[padding-left:18px]
    [&_li]:relative
    [&_li::before]:[color:var(--request-accent)]
    [&_li::before]:content-['·']
    [&_li::before]:[font-size:24px]
    [&_li::before]:[left:1px]
    [&_li::before]:[line-height:16px]
    [&_li::before]:absolute
    [&_li::before]:[top:0]`,
  briefCtaGroup: `rfs-briefCtaGroup items-center flex flex-wrap [gap:10px]`,
  briefLinkAgent: `rfs-briefLinkAgent [background:var(--request-accent)] [border:1px_solid_var(--request-accent)] rounded-full
    [color:var(--ink)] inline-flex [font:500_11px/1_DSemi,_monospace] [gap:10px] [letter-spacing:0.025em]
    [padding:13px_17px] no-underline
    [&_svg]:[color:currentcolor]
    motion-safe:[transition:color_0.25s_ease,_border-color_0.25s_ease,_background-color_0.25s_ease,_opacity_0.25s_ease,_transform_0.25s_ease]
    motion-safe:[&:hover]:[background:var(--paper)]
    motion-safe:[&:hover]:[color:var(--ink)]
    motion-safe:[&:hover]:[transform:translateY(-2px)]
    [&:focus-visible]:[outline:3px_solid_var(--green)]
    [&:focus-visible]:[outline-offset:5px]`,
  requestVideoPanel: `rfs-requestVideoPanel justify-self-end [margin:0] [width:min(281.25px,_100%)]
    max-[900px]:justify-self-center`,
  requestVideo: `rfs-requestVideo [aspect-ratio:9_/_16] [background:#09090b] [border:1px_solid_var(--line)] block w-full`,
  requestSpeaker: `rfs-requestSpeaker grid [gap:4px] [margin-top:14px] [font:400_13px/1.45_Diatype,_sans-serif]`,
  speakerName: `rfs-speakerName font-medium`,
  speakerRole: `rfs-speakerRole [color:rgba(244,_243,_246,_0.58)]`,
  speakerProfile: `rfs-speakerProfile items-center [color:rgba(244,_243,_246,_0.72)] inline-flex
    [font:500_11px/1.4_DSemi,_monospace] [gap:7px] [min-height:32px] [margin-top:2px] no-underline w-fit
    [&_svg]:[height:13px]
    [&_svg]:[width:13px]
    [&:hover]:[color:var(--request-accent)]
    [&:hover]:underline
    [&:hover]:[text-underline-offset:4px]
    [&:focus-visible]:[color:var(--request-accent)]
    [&:focus-visible]:underline
    [&:focus-visible]:[text-underline-offset:4px]
    [&:focus-visible]:[outline:1px_solid_var(--request-accent)]
    [&:focus-visible]:[outline-offset:4px]`,
  buildInner: `rfs-buildInner [margin:0_auto] [max-width:960px] relative [z-index:1]`,
  ctaGroup: `rfs-ctaGroup items-center flex flex-wrap [gap:12px] justify-center`,
  ctaSecondary: `rfs-ctaSecondary [background:transparent] [border:1px_solid_rgba(244,_243,_246,_0.7)] rounded-full
    [color:var(--paper)] inline-flex [font:500_12px/1_DSemi,_monospace] [gap:9px] [padding:14px_18px] no-underline
    motion-safe:[transition:color_0.25s_ease,_border-color_0.25s_ease,_background-color_0.25s_ease,_opacity_0.25s_ease,_transform_0.25s_ease]
    motion-safe:[&:hover]:[background:var(--paper)]
    motion-safe:[&:hover]:[color:var(--ink)]
    motion-safe:[&:hover]:[transform:translateY(-2px)]`,
  pointFieldCompact: `rfs-pointFieldCompact [opacity:0.4] [transform:scale(1.15)]`,
} as const;
