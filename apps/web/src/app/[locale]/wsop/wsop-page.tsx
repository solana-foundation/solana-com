"use client";

import { useRef } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Video } from "@/component-library/video";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { ArrowDown } from "@boxicons/react/ArrowDown";
import { ArrowOutUpRightSquare } from "@boxicons/react/ArrowOutUpRightSquare";
import { ArrowUpRight } from "@boxicons/react/ArrowUpRight";
import { Club } from "@boxicons/react/Club";
import { CalendarDownArrow } from "@boxicons/react/CalendarDownArrow";
import { Clock3 } from "@boxicons/react/Clock3";
import { CursorClick } from "@boxicons/react/CursorClick";
import { Diamond } from "@boxicons/react/Diamond";
import { Heart } from "@boxicons/react/Heart";
import { Mobile } from "@boxicons/react/Mobile";
import { Spade } from "@boxicons/react/Spade";
import { Ticket } from "@boxicons/react/Ticket";
import { UserPlus } from "@boxicons/react/UserPlus";
import { Wallet } from "@boxicons/react/Wallet";
import { useTranslations } from "@workspace/i18n/client";
import { Link } from "@workspace/i18n/routing";
import { Link as CrossAppLink } from "@solana-com/ui-chrome/link";
import { Button } from "@/app/components/ui/button";

const wsopStyles = {
  wsop_skip_link:
    "[position:fixed] [z-index:100] [top:1rem] [left:1rem] [padding:0.75rem_1rem] [border-radius:9999px] [background:#fff] [color:#000] [font-family:var(--wsop-font-label)] [font-size:0.75rem] [letter-spacing:var(--wsop-label-tracking)] [text-transform:uppercase]",
  wsop_eyebrow:
    "[font-family:var(--wsop-font-label)] [font-size:var(--wsop-label-size)] [font-weight:500] [letter-spacing:var(--wsop-label-tracking)] [line-height:1.33] [text-transform:uppercase] [color:var(--wsop-accent)]",
  wsop_section_label:
    "[font-family:var(--wsop-font-label)] [font-size:var(--wsop-label-size)] [font-weight:500] [letter-spacing:var(--wsop-label-tracking)] [line-height:1.33] [text-transform:uppercase] [display:flex] [align-items:center] [gap:0.75rem] [width:fit-content] [margin-bottom:clamp(2rem,_4vw,_3rem)] [color:var(--wsop-accent)] [&_svg]:[width:1rem] [&_svg]:[height:1rem] [&_svg]:[flex:0_0_1rem] [&_svg]:[color:rgba(255,_255,_255,_0.4)] [&_*.is-red]:[color:var(--wsop-red-bright)] [&_p]:[padding-left:0.75rem] [&_p]:[border-left:1px_solid_var(--wsop-border-prominent)]",
  wsop_suit_run:
    "[display:inline-flex] [align-items:center] [gap:0.5rem] [color:rgba(255,_255,_255,_0.55)] [&_svg]:[width:0.85rem] [&_svg]:[height:0.85rem] [&_.is-red]:[color:var(--wsop-red-bright)]",
  wsop_suit_icon: "[fill:currentColor] [stroke-width:1.75]",
  wsop_section:
    "[position:relative] [width:min(100%,_1440px)] [margin-inline:auto] [padding:clamp(4rem,_calc(10vw_+_2rem),_10rem)_1.25rem] md:[padding-inline:2rem] lg:[padding-block:clamp(6rem,_7vw,_7.5rem)] xl:[padding-inline:2.5rem]",
  wsop_button:
    "[display:inline-flex] [min-height:3rem] [align-items:center] [justify-content:space-between] [gap:1.25rem] [padding:0.5rem_0.5rem_0.5rem_1.25rem] [border:0] [border-radius:9999px] [background:#fff] [color:#000] [cursor:pointer] [font-size:1rem] [font-weight:500] [letter-spacing:-0.01em] [line-height:1.25] [&_svg]:[width:2rem] [&_svg]:[height:2rem] [&_svg]:[padding:0.5rem] [&_svg]:[border-radius:50%] [&_svg]:[background:#000] [&_svg]:[color:#fff] [&_svg]:[stroke-width:2.5] [&_svg]:[transition:transform_180ms_cubic-bezier(0.22,_1,_0.36,_1)] [&:hover_svg]:[transform:translate(1px,_-1px)] hover:[background:rgba(255,_255,_255,_0.9)] focus-visible:[outline:2px_solid_var(--wsop-accent)] focus-visible:[outline-offset:4px] md:[font-size:1.125rem] motion-reduce:[&_svg]:[transition:none] motion-reduce:[&:hover_svg]:[transform:none]",
  wsop_start:
    "[&_a:focus-visible]:[outline:2px_solid_var(--wsop-accent)] [&_a:focus-visible]:[outline-offset:4px] [&_h2]:[max-width:14ch] [&_h2]:[font-size:clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h2]:[letter-spacing:-0.04em] [&_h2]:[line-height:1.125] [padding:clamp(4rem,_calc(10vw_+_2rem),_10rem)_1.25rem] [border-top:1px_solid_var(--wsop-border)] [background:radial-gradient(_circle_at_82%_24%,_rgba(85,_233,_171,_0.16),_transparent_30%_),_radial-gradient(_circle_at_18%_85%,_rgba(202,_159,_245,_0.18),_transparent_34%_),_#000] md:[padding-inline:2rem] lg:[padding-block:clamp(6rem,_7vw,_7.5rem)] xl:[padding-inline:2.5rem]",
  wsop_button_light:
    "[&[data-light]]:[background:#000] [&[data-light]]:[color:#fff] [&[data-light]_svg]:[background:#fff] [&[data-light]_svg]:[color:#000] [&[data-light]:hover]:[background:rgba(0,0,0,0.86)]",
  wsop_hero:
    "[position:relative] [display:flex] [min-height:max(620px,_calc(100svh_-_70px))] [flex-direction:column] [overflow:hidden] [border-bottom:1px_solid_var(--wsop-border)] [isolation:isolate] [&_h1]:[max-width:11ch] [&_h1]:[font-size:clamp(2.5rem,_calc(6.25vw_+_0.5rem),_5.5rem)] [&_h1]:[letter-spacing:-0.03em] [&_h1]:[line-height:1]",
  wsop_hero_topline:
    "flex justify-between gap-8 border-b border-white/20 bg-[rgba(4,40,58,0.35)] px-5 py-4 font-[var(--wsop-font-label)] text-[0.7rem] font-medium leading-[1.4] tracking-[0.08em] text-white/80 uppercase backdrop-blur-md md:px-8 xl:px-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))] max-[767px]:[&>p:last-child]:hidden [&>p:last-child]:text-[var(--wsop-accent)]",
  wsop_hero_content:
    "[display:block] [width:min(100%,_1440px)] [margin-inline:auto] [padding:clamp(4rem,_9vw,_7.75rem)_1.25rem_clamp(8rem,_11vw,_10rem)] md:[padding-inline:2rem] xl:[padding-inline:2.5rem]",
  wsop_hero_eyebrow: "[display:flex] [align-items:center] [gap:0.75rem]",
  wsop_hero_title_mask: "[margin-top:0.75rem] [overflow:hidden]",
  wsop_marquee:
    "[display:flex] [overflow:hidden] [padding-block:0.9rem] [border-bottom:1px_solid_var(--wsop-border)]",
  wsop_marquee_track:
    "[display:flex] [flex:0_0_auto] [min-width:max-content] animate-wsop-marquee motion-reduce:[animation:none] ",
  wsop_marquee_item:
    "[display:inline-flex] [align-items:center] [gap:2.25rem] [padding-right:2.25rem] [white-space:nowrap]",
  wsop_marquee_text:
    "[color:rgba(255,_255,_255,_0.56)] [font-family:var(--wsop-font-label)] [font-size:0.75rem] [font-weight:500] [letter-spacing:0.08em] [text-transform:uppercase]",
  wsop_marquee_suit:
    "[width:0.8rem] [height:0.8rem] [color:rgba(255,_255,_255,_0.3)] [&.is-red]:[color:var(--wsop-red-bright)]",
  wsop_buyins:
    "[border-top:1px_solid_var(--wsop-border)] [border-bottom:1px_solid_var(--wsop-border)]",
  wsop_section_heading:
    "[display:grid] [gap:1.5rem] [&_h2]:[max-width:14ch] [&_h2]:[font-size:clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h2]:[letter-spacing:-0.04em] [&_h2]:[line-height:1.125] [&>p]:[max-width:36rem] [&>p]:[color:var(--wsop-muted)] [&>p]:[font-size:clamp(1.125rem,_3.125vw,_1.5rem)] [&>p]:[letter-spacing:-0.02em] [&>p]:[line-height:1.45] md:[&>p]:[line-height:1.33] lg:[grid-template-columns:minmax(0,_1fr)_minmax(20rem,_0.55fr)] lg:[align-items:end] lg:[gap:3rem] xl:[grid-template-columns:minmax(0,_1fr)_minmax(22rem,_0.55fr)] xl:[gap:4rem]",
  wsop_benefit:
    "[--card-pad:1rem] [position:relative] [display:flex] [flex-direction:column] [padding:var(--card-pad)] [border:1px_solid_rgba(0,_0,_0,_0.1)] [border-radius:0.75rem] [background:#fff] [color:#16141c] [box-shadow:0_14px_32px_rgba(0,_0,_0,_0.2)] [&_h3]:[margin-top:auto] [&_h3]:[font-size:clamp(1.125rem,_2.1875vw,_1.75rem)] [&_h3]:[font-weight:500] [&_h3]:[letter-spacing:-0.02em] [&_h3]:[line-height:1.2] md:[--card-pad:1.25rem] md:max-[959px]:[min-height:clamp(30rem,_52vw,_31rem)] min-[960px]:[min-height:0] min-[960px]:max-[1023px]:[display:grid] min-[960px]:max-[1023px]:[grid-template-rows:auto_minmax(3.25rem,_1fr)_auto_auto] min-[960px]:max-[1023px]:[&_h3]:[margin-top:0.5rem] max-[559px]:[min-height:clamp(19.5rem,_72vw,_22.75rem)] max-[374px]:[min-height:0] max-[374px]:aspect-[5/7]",
  wsop_benefit_index:
    "[display:inline-flex] [width:fit-content] [flex-direction:column] [align-items:center] [gap:0.3rem] [color:rgba(22,_20,_28,_0.72)] [font-family:var(--wsop-font-label)] [font-size:0.8rem] [font-weight:500] [line-height:1] [&.is-red]:[color:var(--wsop-red)] [&_svg]:[width:0.6875rem] [&_svg]:[height:0.6875rem]",
  wsop_benefit_index_mirror:
    "[position:absolute] [right:var(--card-pad)] [bottom:var(--card-pad)] [opacity:0.45] [transform:rotate(180deg)]",
  wsop_benefit_pip:
    "[position:absolute] [top:50%] [left:50%] [width:3.25rem] [height:3.25rem] [color:#16141c] [transform:translate(-50%,_-50%)] [&.is-red]:[color:var(--wsop-red)] min-[960px]:max-[1023px]:[position:static] min-[960px]:max-[1023px]:[width:clamp(2.5rem,_12vw,_3.25rem)] min-[960px]:max-[1023px]:[height:clamp(2.5rem,_12vw,_3.25rem)] min-[960px]:max-[1023px]:[grid-row:2] min-[960px]:max-[1023px]:[align-self:end] min-[960px]:max-[1023px]:[justify-self:center] min-[960px]:max-[1023px]:[transform:none] max-[559px]:[width:clamp(2.5rem,_12vw,_3.25rem)] max-[559px]:[height:clamp(2.5rem,_12vw,_3.25rem)]",
  wsop_live_chip:
    "[display:inline-flex] [min-height:2rem] [align-items:center] [gap:0.6rem] [padding:0.35rem_0.75rem] [border-radius:9999px] [background:rgba(217,_0,_41,_0.16)] [color:var(--wsop-red-bright)] [font-family:var(--wsop-font-label)] [font-size:0.7rem] [font-weight:500] [letter-spacing:0.08em] [text-transform:uppercase] [&>span]:[width:0.45rem] [&>span]:[height:0.45rem] [&>span]:[border-radius:50%] [&>span]:[background:var(--wsop-red-bright)] [&>span]:[box-shadow:0_0_0_4px_rgba(217,_0,_41,_0.16)]",

  wsop_event_layout:
    "[display:grid] [gap:1rem] [margin-top:2rem] md:[margin-top:3rem] min-[1100px]:[grid-template-columns:minmax(0,_1.4fr)_minmax(21rem,_0.6fr)] min-[1100px]:[align-items:center] min-[1100px]:[gap:1.5rem] xl:[grid-template-columns:minmax(0,_1.4fr)_minmax(24rem,_0.6fr)]",
  wsop_ticket:
    '[--ticket-pad:1.4rem] [--ticket-paper:#f1eafd] [--ticket-ink:#16141c] [position:relative] [display:flex] [flex-direction:column] [gap:1.1rem] [padding:var(--ticket-pad)_calc(var(--ticket-pad)_+_0.5rem)] [border-radius:0.75rem] [box-shadow:0_22px_44px_rgba(0,_0,_0,_0.5),_inset_0_1px_0_rgba(255,_255,_255,_0.7)] [color:var(--ticket-ink)] [font-family:"Helvetica_Neue",_Arial,_"Liberation_Sans",_sans-serif] [&_*_.is-red]:[color:var(--wsop-red)] md:[--ticket-pad:2rem] md:[gap:1.5rem] xl:[--ticket-pad:2.4rem] xl:[gap:1.75rem] max-[374px]:[--ticket-pad:1rem] max-[374px]:[gap:0.9rem] max-[374px]:[padding-inline:1.25rem]',
  wsop_ticket_topline:
    "[display:flex] [align-items:baseline] [justify-content:space-between] [gap:1rem] [font-size:clamp(0.85rem,_2.4vw,_1.15rem)] [font-weight:600] [white-space:nowrap] max-[374px]:[gap:0.5rem] max-[374px]:[font-size:0.72rem]",
  wsop_ticket_place:
    "[display:grid] [grid-template-columns:auto_minmax(0,_1fr)] [align-items:center] [gap:1rem]",
  wsop_ticket_chip:
    "[display:grid] [width:clamp(3.25rem,_9vw,_4.5rem)] [height:clamp(3.25rem,_9vw,_4.5rem)] [border-radius:50%] [background:radial-gradient(_circle,_var(--ticket-paper)_0_52%,_var(--ticket-ink)_52.5%_56%,_transparent_56.5%_),_repeating-conic-gradient(_var(--ticket-ink)_0deg_22.5deg,_var(--ticket-paper)_22.5deg_45deg_)] [box-shadow:inset_0_0_0_2px_var(--ticket-ink)] [place-content:center] [justify-items:center] [row-gap:0.15rem] [&>span]:[font-size:0.6875rem] [&>span]:[font-weight:800] [&>span]:[letter-spacing:0.04em] [&>span]:[line-height:1]",
  wsop_ticket_chip_suits:
    "[gap:0.12rem] [color:var(--ticket-ink)] [&_svg]:[width:0.4rem] [&_svg]:[height:0.4rem]",
  wsop_ticket_prize:
    "[flex-wrap:wrap] [justify-content:center] [font-weight:700] [letter-spacing:-0.02em] [line-height:1] [text-align:center] [&_strong]:[font-weight:700] [&>span]:[white-space:nowrap] ",
  wsop_ticket_date:
    "[display:flex] [align-items:baseline] [justify-content:space-between] [gap:0.75rem] [font-size:clamp(0.95rem,_2.6vw,_1.3rem)] [font-weight:600] [white-space:nowrap] max-[374px]:[gap:0.4rem] max-[374px]:[font-size:0.78rem]",
  wsop_ticket_pen:
    '[display:inline-block] [color:#6d3fd8] [font-family:"Bradley_Hand",_"Segoe_Script",_"Comic_Sans_MS",_cursive] [font-size:1.35em] [font-weight:400] [line-height:0.8] [transform:rotate(-4deg)] max-[374px]:[font-size:1.15em]',
  wsop_ticket_scan:
    "[display:grid] [grid-template-columns:auto_minmax(0,_1fr)] [align-items:center] [gap:1rem] max-[374px]:[gap:0.6rem]",
  wsop_ticket_serial:
    "[font-size:clamp(0.8rem,_2.2vw,_0.95rem)] [letter-spacing:0.02em] [white-space:nowrap] max-[374px]:[font-size:0.7rem]",
  wsop_ticket_barcode:
    "[width:min(100%,_16rem)] [height:3.4rem] [color:var(--ticket-ink)] [justify-self:center] xl:[height:4rem]",
  wsop_ticket_bottomline:
    "[display:flex] [align-items:baseline] [justify-content:space-between] [gap:1rem] [font-size:clamp(0.85rem,_2.4vw,_1.1rem)] [font-weight:600] [white-space:nowrap] [&_span:first-child]:[text-transform:uppercase] max-[374px]:[gap:0.5rem] max-[374px]:[font-size:0.72rem]",
  wsop_event_details:
    "[display:grid] [align-content:center] md:[grid-template-columns:repeat(2,_minmax(0,_1fr))] md:[column-gap:3rem] min-[1100px]:[grid-template-columns:1fr]",
  wsop_detail:
    "[display:grid] [gap:0.5rem] [padding-block:1.5rem] [border-bottom:1px_solid_var(--wsop-border)] first-child:[padding-top:0] last-child:[padding-bottom:0] last-child:[border-bottom:0] [&_span]:[color:var(--wsop-accent)] [&_span]:[font-family:var(--wsop-font-label)] [&_span]:[font-size:0.6875rem] [&_span]:[font-weight:400] [&_span]:[letter-spacing:0.14em] [&_span]:[text-transform:uppercase] [&_p]:[max-width:24rem] [&_p]:[font-size:1.2rem] [&_p]:[font-weight:400] [&_p]:[letter-spacing:-0.01em] [&_p]:[line-height:1.35] md:[&:nth-child(2)]:[padding-top:0] md:[&:nth-last-child(-n+2)]:[padding-bottom:0] md:[&:nth-last-child(-n+2)]:[border-bottom:0] min-[1100px]:[&:nth-child(2)]:[padding-top:1.5rem] min-[1100px]:[&:nth-last-child(2)]:[padding-bottom:1.5rem] min-[1100px]:[&:nth-last-child(2)]:[border-bottom:1px_solid_var(--wsop-border)] min-[1100px]:last-child:[border-bottom:0]",
  wsop_lineup:
    "[display:grid] [gap:2rem] [margin-top:4rem] [&_h3]:[max-width:13ch] [&_h3]:[margin-top:0.75rem] [&_h3]:[font-size:clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h3]:[font-weight:500] [&_h3]:[letter-spacing:-0.04em] [&_h3]:[line-height:1.125] [&_ol]:[display:grid] [&_ol]:[margin:0] [&_ol]:[padding:0] [&_ol]:[overflow:hidden] [&_ol]:[border:1px_solid_var(--wsop-border)] [&_ol]:[border-radius:1rem] [&_ol]:[background:rgba(255,_255,_255,_0.04)] [&_ol]:[list-style:none] [&_li]:[min-width:0] [&_li]:[min-height:4.75rem] [&_li]:[padding:0] [&_li]:[overflow:hidden] [&_li]:[border-bottom:1px_solid_var(--wsop-border)] [&_li:last-child]:[border-bottom:0] md:[&_ol]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] md:[&_li]:[border-right:1px_solid_var(--wsop-border)] md:[&_li:nth-child(even)]:[border-right:0] md:[&_li:nth-last-child(-n_+_2):nth-child(odd)]:[border-bottom:0] md:[&_li:last-child]:[border-bottom:0] md:[&_li:last-child:nth-child(odd)]:[grid-column:1_/_-1] md:[&_li:last-child:nth-child(odd)]:[border-right:0] min-[1100px]:[grid-template-columns:minmax(17rem,_0.55fr)_minmax(0,_1fr)] min-[1100px]:[align-items:start] min-[1100px]:[gap:4rem] min-[1100px]:[margin-top:6rem] xl:[grid-template-columns:minmax(18rem,_0.55fr)_minmax(0,_1fr)]",
  wsop_lineup_player:
    "[display:grid] [width:100%] [min-height:4.75rem] [align-items:center] [grid-template-columns:auto_minmax(0,_1fr)_auto] [gap:1rem] [padding:0.75rem_1rem] [color:var(--wsop-text)] [text-decoration:none] [transition:background-color_180ms_ease,_color_180ms_ease,_box-shadow_180ms_ease] focus-visible:[outline:2px_solid_var(--wsop-lavender)] focus-visible:[outline-offset:-3px] motion-reduce:[transition:none]",
  wsop_lineup_identity:
    "[display:flex] [min-width:0] [flex-direction:column] [&_strong]:[overflow:hidden] [&_strong]:[font-size:1rem] [&_strong]:[font-weight:500] [&_strong]:[text-overflow:ellipsis] [&_strong]:[white-space:nowrap] [&>span]:[overflow:hidden] [&>span]:[color:var(--wsop-muted)] [&>span]:[font-family:var(--wsop-font-label)] [&>span]:[font-size:0.7rem] [&>span]:[text-overflow:ellipsis] [&>span]:[white-space:nowrap] [&>span]:[transition:color_180ms_ease]",
  wsop_lineup_suit:
    "[width:0.85rem] [height:0.85rem] [color:rgba(255,_255,_255,_0.26)] [&.is-red]:[color:rgba(255,_84,_112,_0.6)]",
  wsop_event_cta:
    "[display:flex] [align-items:flex-start] [flex-direction:column] [gap:1.5rem] [margin-top:2rem] [&_p]:[max-width:31rem] [&_p]:[color:var(--wsop-muted)] [&_p]:[font-size:1rem] [&_p]:[line-height:1.5] md:[align-items:center] md:[justify-content:flex-end] md:[flex-direction:row] md:[&_p]:[text-align:right]",
  wsop_ambassadors: "[border-top:1px_solid_var(--wsop-border)]",
  wsop_ambassadors_grid:
    "[display:grid] [gap:1rem] [margin-top:2rem] md:[margin-top:3rem] min-[1100px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]",
  wsop_ambassador:
    "[display:grid] [overflow:hidden] [border:1px_solid_var(--wsop-border)] [border-radius:1rem] [background:var(--wsop-card)] [transition:border-color_180ms_ease,_box-shadow_180ms_ease] hover:[border-color:var(--wsop-border-prominent)] hover:[box-shadow:0_18px_44px_rgba(0,_0,_0,_0.24)] sm:[grid-template-columns:minmax(13rem,_0.8fr)_minmax(0,_1.2fr)] min-[1100px]:[&:last-child:nth-child(odd)]:[width:calc(50%_-_0.5rem)] min-[1100px]:[&:last-child:nth-child(odd)]:[grid-column:1_/_-1] min-[1100px]:[&:last-child:nth-child(odd)]:[justify-self:center] motion-reduce:[transition:none]",
  wsop_ambassador_portrait:
    "[position:relative] [display:flex] [min-height:18rem] [flex-direction:column] [align-items:center] [justify-content:center] [overflow:hidden] [border-bottom:1px_solid_var(--wsop-border)] [background:radial-gradient(_circle_at_50%_64%,_rgba(85,_233,_171,_0.26),_transparent_38%_),_linear-gradient(145deg,_rgba(202,_159,_245,_0.2),_transparent_48%),_#121116] before:[position:absolute] before:[z-index:1] before:[inset:0.75rem] before:[border:1px_solid_var(--wsop-border)] before:[border-radius:0.75rem] before:content-[''] before:[pointer-events:none] sm:[min-height:100%] sm:[border-right:1px_solid_var(--wsop-border)] sm:[border-bottom:0]",
  wsop_ambassador_portrait_image: "[object-fit:cover] [object-position:center]",
  wsop_ambassador_copy:
    "[display:flex] [min-height:23rem] [flex-direction:column] [padding:1.25rem] [&>span]:[color:var(--wsop-accent)] [&>span]:[font-family:var(--wsop-font-label)] [&>span]:[font-size:0.7rem] [&>p:first-of-type]:[margin-top:auto] [&>p:first-of-type]:[color:var(--wsop-accent)] [&>p:first-of-type]:[font-family:var(--wsop-font-label)] [&>p:first-of-type]:[font-size:0.7rem] [&>p:first-of-type]:[letter-spacing:0.06em] [&>p:first-of-type]:[text-transform:uppercase] [&_h3]:[margin-top:0.75rem] [&_h3]:[font-size:1.75rem] [&_h3]:[font-weight:500] [&_h3]:[letter-spacing:-0.03em] [&_h3]:[line-height:1.15] sm:[min-height:27rem] sm:[padding:1.5rem] xl:[&_h3]:[font-size:2.25rem]",
  wsop_ambassador_story:
    "[display:flex] [align-items:center] [justify-content:space-between] [gap:0.5rem] [margin-top:1.5rem] [padding-top:1rem] [border-top:1px_solid_var(--wsop-border)] [color:var(--wsop-muted)] [font-family:var(--wsop-font-label)] [font-size:0.6875rem] [letter-spacing:0.05em] [text-transform:uppercase] [&_svg]:[width:0.9rem]",
  wsop_start_inner:
    "[position:relative] [width:min(100%,_1360px)] [margin-inline:auto] [color:var(--wsop-text)] [&>*]:[position:relative] [&>*]:[z-index:1]",
  wsop_start_grid:
    "[display:grid] [gap:1rem] md:[grid-template-columns:minmax(0,_1.08fr)_minmax(18rem,_0.92fr)]",
  wsop_start_card:
    "[position:relative] [display:flex] [min-height:23rem] [flex-direction:column] [overflow:hidden] [border-radius:1rem] [&_h2]:[max-width:11ch] [&_h2]:[color:#000] [&_h2]:[font-size:clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h2]:[letter-spacing:-0.04em] [&_h2]:[line-height:1.125] [&_h3]:[max-width:11ch] [&_h3]:[color:#000] [&_h3]:[font-size:clamp(2rem,_calc(4.6875vw_+_0.25rem),_4rem)] [&_h3]:[letter-spacing:-0.04em] [&_h3]:[line-height:1.125]",
  wsop_start_card_onboarding:
    "[padding:clamp(1.5rem,_3vw,_2.5rem)] [background:#dfcdf5] [color:#000]",
  wsop_start_card_guide:
    "[padding:clamp(1.5rem,_3vw,_2.5rem)] [border:1px_solid_rgba(85,_233,_171,_0.46)] [background:var(--wsop-accent)] [color:#000] [transition:border-color_180ms_ease,_background-color_180ms_ease] after:[position:absolute] after:[right:-7rem] after:[bottom:-8rem] after:[width:19rem] after:[aspect-ratio:1] after:[border:1px_solid_rgba(0,_0,_0,_0.17)] after:[border-radius:50%] after:[box-shadow:inset_0_0_0_1rem_var(--wsop-accent),_inset_0_0_0_calc(1rem_+_1px)_rgba(0,_0,_0,_0.1),_inset_0_0_0_2rem_var(--wsop-accent),_inset_0_0_0_calc(2rem_+_1px)_rgba(0,_0,_0,_0.08)] after:content-[''] after:[pointer-events:none] hover:[border-color:rgba(0,_0,_0,_0.42)] hover:[background:#67efb5] [&:hover_svg]:[transform:translate(1px,_-1px)] motion-reduce:[&:hover_svg]:[transform:none]",
  wsop_start_content:
    "[position:relative] [z-index:1] [display:flex] [flex:1] [flex-direction:column] [max-width:52rem] [&>p]:[max-width:34rem] [&>p]:[margin-top:1rem] [&>p]:[color:rgba(0,_0,_0,_0.64)] [&>p]:[font-size:1.125rem] [&>p]:[line-height:1.5]",
  wsop_start_guide_copy:
    "[position:relative] [z-index:1] [&>p]:[max-width:34rem] [&>p]:[margin-top:1rem] [&>p]:[color:rgba(0,_0,_0,_0.64)] [&>p]:[font-size:1.125rem] [&>p]:[line-height:1.5]",
  wsop_start_guide_action:
    "[position:relative] [z-index:1] motion-reduce:[&_svg]:[transition:none]",
  wsop_start_actions:
    "[display:flex] [flex-wrap:wrap] [align-items:stretch] [gap:0.75rem] [margin-top:auto] [padding-top:1.5rem] [&_*]:[flex:0_0_auto] max-[639px]:[flex-direction:column] max-[639px]:[&>*]:[width:100%]",
};

type Icon = typeof Spade;

/** Solana logomark in a single fill so it sits alongside the filled Boxicons. */
const SolanaMark: Icon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 31 27"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="m30.179 21.3-5.008 5.332a1.143 1.143 0 0 1-.848.368H.583a.59.59 0 0 1-.535-.348.568.568 0 0 1-.04-.328.593.593 0 0 1 .148-.298l5.002-5.332a1.141 1.141 0 0 1 .848-.368h23.74a.574.574 0 0 1 .43.971l.003.003ZM25.17 10.56a1.192 1.192 0 0 0-.848-.368H.583a.59.59 0 0 0-.535.349.569.569 0 0 0-.04.328c.02.112.071.213.148.297l5.002 5.335c.107.115.24.208.384.27.147.064.303.095.464.098h23.74a.574.574 0 0 0 .529-.348.569.569 0 0 0-.108-.623l-5-5.335.003-.003ZM.582 6.73h23.74a1.2 1.2 0 0 0 .464-.096c.147-.064.277-.154.384-.272L30.18 1.03a.579.579 0 0 0-.107-.881.571.571 0 0 0-.323-.09H6.006c-.158 0-.317.034-.464.095a1.126 1.126 0 0 0-.384.273L.156 5.759a.582.582 0 0 0-.108.625.59.59 0 0 0 .534.348V6.73Z" />
  </svg>
);

const HOW_TO_STEPS: Array<{ step: number; icon: Icon }> = [
  { step: 1, icon: Mobile },
  { step: 2, icon: UserPlus },
  { step: 3, icon: CalendarDownArrow },
  { step: 4, icon: CursorClick },
  { step: 5, icon: Ticket },
  { step: 6, icon: SolanaMark },
  { step: 7, icon: Wallet },
];

const ParadiseScene = dynamic(() => import("./paradise-scene"), { ssr: false });

// Swap src and poster when the final walkthrough is delivered.
const BUY_IN_VIDEO = {
  src: "/src/img/wsop/paradise/buy-in-walkthrough-placeholder.mp4",
  poster: "/src/img/wsop/paradise/buy-in-walkthrough-poster.webp",
};

const EASE = [0.22, 1, 0.36, 1] as const;

const SUITS = ["spade", "diamond", "heart", "club"] as const;
type Suit = (typeof SUITS)[number];

const SUIT_ICONS: Record<Suit, Icon> = {
  spade: Spade,
  diamond: Diamond,
  heart: Heart,
  club: Club,
};

const isRedSuit = (suit: Suit) => suit === "heart" || suit === "diamond";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.07,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const dealVariants: Variants = {
  hidden: { opacity: 0, y: 18, rotate: -1.5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const heroVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const heroTitleVariants: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const MARQUEE_LINE_IDS = [
  "skipWire",
  "buyInSolana",
  "settles",
  "nothingToDeclare",
  "anyDay",
  "shuffleUp",
  "noCash",
  "paradise",
] as const;

const BENEFITS: Array<{ id: string; suit: Suit; rank: string }> = [
  { id: "speed", suit: "spade", rank: "A" },
  { id: "fees", suit: "diamond", rank: "K" },
  { id: "crossBorder", suit: "heart", rank: "Q" },
  { id: "availability", suit: "club", rank: "J" },
  { id: "customs", suit: "spade", rank: "10" },
  { id: "security", suit: "diamond", rank: "9" },
];
const SHOWDOWN_DETAILS = ["when", "where", "format"] as const;

const ambassadors: Array<{
  id: string;
  name: string;
  image: string;
  unoptimized?: boolean;
  releaseDate?: string;
  href?: string;
}> = [
  {
    id: "jamieGold",
    name: "Jamie Gold",
    image: "/src/img/wsop/jamie-gold.webp",
  },
  {
    id: "michaelMizrachi",
    name: "Michael Mizrachi",
    image: "/src/img/wsop/michael-mizrachi.webp",
    unoptimized: true,
    releaseDate: "Mon 23 Nov",
  },
  {
    id: "philHellmuth",
    name: "Phil Hellmuth",
    image: "/src/img/wsop/phil-hellmuth.webp",
    releaseDate: "Mon 30 Nov",
  },
];

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -8% 0px", amount: 0.12 }}
      variants={revealVariants}
    >
      {children}
    </motion.div>
  );
}

function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={staggerVariants}
    >
      {children}
    </motion.div>
  );
}

function SuitIcon({
  suit,
  className = "",
}: {
  suit: Suit;
  className?: string;
}) {
  const Icon = SUIT_ICONS[suit];

  return (
    <Icon
      className={`${wsopStyles.wsop_suit_icon} ${className} ${
        isRedSuit(suit) ? "is-red" : ""
      }`}
      pack="filled"
      aria-hidden="true"
    />
  );
}

function SuitRun({ className = "" }: { className?: string }) {
  return (
    <span
      className={`${wsopStyles.wsop_suit_run} ${className}`}
      aria-hidden="true"
    >
      {SUITS.map((suit) => (
        <SuitIcon key={suit} suit={suit} />
      ))}
    </span>
  );
}

function LiveChip({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className={`${wsopStyles.wsop_live_chip}`}>
      <motion.span
        aria-hidden="true"
        animate={
          reduceMotion
            ? { boxShadow: "0 0 0 3px rgba(217, 0, 41, 0.2)" }
            : {
                boxShadow: [
                  "0 0 0 3px rgba(217, 0, 41, 0.2)",
                  "0 0 0 8px rgba(217, 0, 41, 0)",
                  "0 0 0 3px rgba(217, 0, 41, 0.2)",
                ],
              }
        }
        transition={{
          duration: 2.6,
          ease: "easeOut",
          repeat: Infinity,
          times: [0, 0.55, 1],
        }}
      />
      {children}
    </span>
  );
}

function SectionLabel({
  suit,
  children,
}: {
  suit: Suit;
  children: React.ReactNode;
}) {
  return (
    <div className={`${wsopStyles.wsop_section_label}`}>
      <SuitIcon className="" suit={suit} />
      <p>{children}</p>
    </div>
  );
}

function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      className={`${wsopStyles.wsop_button} ${className}`}
      target="_blank"
      rel="noreferrer"
      whileHover={reduceMotion ? { y: 0 } : { y: -2 }}
      whileTap={reduceMotion ? { scale: 1 } : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: EASE }}
    >
      <span>{children}</span>
      <ArrowOutUpRightSquare aria-hidden="true" />
    </motion.a>
  );
}

function BrandMarquee() {
  const t = useTranslations("wsop.marquee");
  const track = (hidden: boolean) => (
    <div
      className={`${wsopStyles.wsop_marquee_track} ${hidden ? "motion-reduce:hidden" : ""}`}
      aria-hidden={hidden || undefined}
    >
      {MARQUEE_LINE_IDS.map((id, index) => (
        <span className={`${wsopStyles.wsop_marquee_item}`} key={id}>
          <span className={`${wsopStyles.wsop_marquee_text}`}>{t(id)}</span>
          <SuitIcon
            className={`${wsopStyles.wsop_marquee_suit}`}
            suit={SUITS[index % SUITS.length]}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`${wsopStyles.wsop_marquee}`}>
      {track(false)}
      {track(true)}
    </div>
  );
}

/** Code 39 character patterns (1 = bar module, 0 = space module, wide = 2 modules). */
const CODE39: Record<string, string> = {
  "0": "101001101101",
  "1": "110100101011",
  "2": "101100101011",
  "3": "110110010101",
  "4": "101001101011",
  "5": "110100110101",
  "6": "101100110101",
  "7": "101001011011",
  "8": "110100101101",
  "9": "101100101101",
  "*": "100101101101",
};

function TicketBarcode({ value }: { value: string }) {
  const binary = `*${value}*`
    .split("")
    .map((char) => CODE39[char] ?? CODE39["0"])
    .join("0");

  const bars: Array<{ x: number; width: number }> = [];
  let runStart = -1;

  for (let i = 0; i <= binary.length; i++) {
    if (binary[i] === "1") {
      if (runStart < 0) runStart = i;
    } else if (runStart >= 0) {
      bars.push({ x: runStart, width: i - runStart });
      runStart = -1;
    }
  }

  return (
    <svg
      className={`${wsopStyles.wsop_ticket_barcode}`}
      viewBox={`0 0 ${binary.length} 60`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={0}
          width={bar.width}
          height={60}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

function AppDownloadButtons() {
  const t = useTranslations("wsop.howTo.download");
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      <span className="w-full font-[var(--wsop-font-label)] text-xs uppercase tracking-[var(--wsop-label-tracking)] text-white/60">
        {t("label")}
      </span>
      {(
        [
          {
            href: "https://apps.apple.com/us/app/wsop-live-wsop-official-app/id1660727059",
            icon: "apple.svg",
            name: "appStore",
          },
          {
            href: "https://play.google.com/store/apps/details?id=com.nsus.wsopplus&hl=en",
            icon: "google-play.svg",
            name: "googlePlay",
          },
        ] as const
      ).map(({ href, icon, name }) => (
        <Button
          asChild
          size="lg"
          variant="secondary-outline"
          key={name}
          className="group h-auto min-h-[4.25rem] min-w-48 flex-1 justify-start gap-3 rounded-xl border-white/20 bg-white/[0.04] px-3 py-2.5 text-left text-white hover:bg-white/[0.08] hover:text-white"
        >
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={t(`${name}Aria`)}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-[0.625rem] bg-white">
              <Image
                src={`/src/img/wsop/${icon}`}
                alt=""
                width={20}
                height={20}
                className="size-5 invert"
                aria-hidden="true"
              />
            </span>
            <span className="grid min-w-0 gap-0.5">
              <small className="font-[var(--wsop-font-label)] text-[0.6875rem] uppercase text-white/60">
                {t("viewOn")}
              </small>
              <strong className="text-base font-medium">{t(name)}</strong>
            </span>
            <ArrowOutUpRightSquare
              className="ml-auto size-4 shrink-0 opacity-60"
              aria-hidden="true"
            />
          </a>
        </Button>
      ))}
    </div>
  );
}

export function WsopPage() {
  const t = useTranslations("wsop");
  const walletT = useTranslations("wallets.hero");
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallax = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  return (
    <MotionConfig reducedMotion="user">
      <motion.a
        className={`${wsopStyles.wsop_skip_link}`}
        href="#wsop-main"
        initial={{ y: "-180%" }}
        whileFocus={{ y: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        {t("accessibility.skipToMain")}
      </motion.a>
      <main id="wsop-main">
        <section
          className={`${wsopStyles.wsop_hero}`}
          aria-labelledby="wsop-title"
          ref={heroRef}
        >
          <motion.div
            className=" absolute inset-0 z-[-3]"
            style={reduceMotion ? undefined : { y: heroParallax }}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#a9def3_0%,#e6f7fd_40%,#bfeaf5_47%,#58c3d9_60%,#1f95b8_78%,#0b5f80_100%)]" />
            <ParadiseScene className="absolute inset-0 size-full" />
          </motion.div>
          <div className="absolute inset-0 z-[-2] bg-[linear-gradient(90deg,rgba(4,40,58,0.92),rgba(4,40,58,0.85)),linear-gradient(0deg,rgba(4,40,58,0.7),transparent_45%)] md:bg-[linear-gradient(90deg,rgba(4,40,58,0.82),rgba(4,40,58,0.35)_55%,transparent_80%),linear-gradient(0deg,rgba(4,40,58,0.7),transparent_45%)]" />
          <motion.div
            className={`${wsopStyles.wsop_hero_topline} border-b border-white/20 bg-[rgba(4,40,58,0.35)] text-white/80 backdrop-blur-md`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            <p className="font-[var(--wsop-font-label)]">{t("hero.topline")}</p>
            <p className="font-[var(--wsop-font-label)]">
              {t("hero.presentedBy")}
            </p>
          </motion.div>
          <motion.div
            className={`${wsopStyles.wsop_hero_content}`}
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            <motion.div variants={heroItemVariants} className="mb-10">
              <Image
                src="/src/img/wsop/paradise/paradise-lockup.webp"
                alt={t("hero.lockupAlt")}
                width={1611}
                height={361}
                priority
                className="h-auto w-[min(78vw,380px)]"
              />
            </motion.div>
            <motion.div variants={heroItemVariants}>
              <p
                className={`${wsopStyles.wsop_eyebrow} ${wsopStyles.wsop_hero_eyebrow}`}
              >
                <SuitRun />
                {t("hero.eyebrow")}
              </p>
            </motion.div>
            <div className={`${wsopStyles.wsop_hero_title_mask}`}>
              <motion.h1
                id="wsop-title"
                variants={heroTitleVariants}
                className="font-medium text-balance"
              >
                {t("hero.title")}
              </motion.h1>
            </div>
            <motion.p
              variants={heroItemVariants}
              className="mt-7 max-w-[32rem] text-balance text-lg leading-relaxed text-white/85 md:text-xl"
            >
              {t("hero.description")}
            </motion.p>
            <motion.a
              variants={heroItemVariants}
              className={`${wsopStyles.wsop_button} mt-10 w-fit`}
              href="#how-to-buy-in"
            >
              <span>{t("hero.cta")}</span>
              <motion.span
                animate={reduceMotion ? { y: 0 } : { y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowDown aria-hidden="true" />
              </motion.span>
            </motion.a>
          </motion.div>
        </section>
        <section
          className={`${wsopStyles.wsop_section} scroll-mt-24`}
          id="how-to-buy-in"
          aria-labelledby="how-to-heading"
        >
          <Reveal>
            <SectionLabel suit="diamond">{t("howTo.label")}</SectionLabel>
            <div className={`${wsopStyles.wsop_section_heading}`}>
              <h2 id="how-to-heading" className="font-medium text-balance">
                {t("howTo.title")}
              </h2>
              <p>{t("howTo.description")}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
            <div className="lg:sticky lg:top-24">
              <Video
                platform="local"
                id={BUY_IN_VIDEO.src}
                thumbnail={BUY_IN_VIDEO.poster}
                aspectRatio="1:1"
                autoplay={false}
                loop={false}
                title={t("howTo.videoTitle")}
                alt=""
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="rounded-2xl border border-[var(--wsop-border-prominent)] bg-[var(--wsop-card)]"
                bgColorClass="border border-white/30 bg-white/15 backdrop-blur-md"
                playButtonClassName="h-20 w-20"
              />
              <p className="mt-5 font-[var(--wsop-font-label)] text-xs leading-relaxed text-white/55 uppercase tracking-[var(--wsop-label-tracking)]">
                {t("howTo.videoNote")}
              </p>
            </div>
            <div>
              <Stagger className="block">
                <ol className="m-0 list-none p-0">
                  {HOW_TO_STEPS.map(({ step, icon: StepIcon }) => (
                    <motion.li
                      key={step}
                      variants={staggerItemVariants}
                      className="flex border-t border-[var(--wsop-border)] py-6"
                    >
                      <span className="w-12 shrink-0 pt-0.5" aria-hidden="true">
                        <StepIcon
                          pack="filled"
                          className="size-6 fill-[var(--wsop-accent)]"
                        />
                      </span>
                      <span className="text-lg leading-relaxed text-white/75">
                        {t.rich(`howTo.steps.${step}`, {
                          strong: (chunks: React.ReactNode) => (
                            <strong className="font-medium text-white">
                              {chunks}
                            </strong>
                          ),
                          link: (chunks: React.ReactNode) => (
                            <a
                              href="https://apps.apple.com/us/app/wsop-live-wsop-official-app/id1660727059"
                              target="_blank"
                              rel="noreferrer"
                              className="underline decoration-white/30 underline-offset-4 hover:decoration-white"
                            >
                              {chunks}
                            </a>
                          ),
                        })}
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </Stagger>
              <AppDownloadButtons />
            </div>
          </div>
        </section>
        <section
          className={`${wsopStyles.wsop_section} ${wsopStyles.wsop_buyins}`}
          aria-labelledby="why-heading"
        >
          <Reveal>
            <SectionLabel suit="spade">{t("whyOnchain.label")}</SectionLabel>
            <div className={`${wsopStyles.wsop_section_heading} `}>
              <h2 id="why-heading" className="font-medium text-balance">
                {t("whyOnchain.title")}
              </h2>
              <p>{t("whyOnchain.description")}</p>
            </div>
            <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map(({ id, suit, rank }) => (
                <motion.article
                  className={`${wsopStyles.wsop_benefit} [--card-pad:1.25rem] aspect-[5/7] md:max-[959px]:aspect-auto lg:aspect-[4/5] lg:[--card-pad:1.75rem]`}
                  key={id}
                  variants={dealVariants}
                >
                  <span
                    className={`${wsopStyles.wsop_benefit_index} ${isRedSuit(suit) ? "is-red" : ""}`}
                    aria-hidden="true"
                  >
                    {rank}
                    <SuitIcon suit={suit} />
                  </span>
                  <SuitIcon
                    className={`${wsopStyles.wsop_benefit_pip}`}
                    suit={suit}
                  />
                  <h3 className="font-medium text-balance max-w-[16ch]">
                    {t(`whyOnchain.cards.${id}.title`)}
                  </h3>
                  <p className="mt-3 max-w-[21rem] pr-10 text-[0.9375rem] leading-relaxed text-[#16141ca3]">
                    {t(`whyOnchain.cards.${id}.body`)}
                  </p>
                  <span
                    className={`${wsopStyles.wsop_benefit_index} ${wsopStyles.wsop_benefit_index_mirror} ${isRedSuit(suit) ? "is-red" : ""}`}
                    aria-hidden="true"
                  >
                    {rank}
                    <SuitIcon suit={suit} />
                  </span>
                </motion.article>
              ))}
            </Stagger>
          </Reveal>
        </section>
        <section
          className={`${wsopStyles.wsop_section} ${wsopStyles.wsop_ambassadors}`}
          aria-labelledby="stories-heading"
        >
          <Reveal>
            <SectionLabel suit="club">{t("stories.label")}</SectionLabel>
            <div className={`${wsopStyles.wsop_section_heading} `}>
              <h2 id="stories-heading" className="font-medium text-balance">
                {t("stories.title")}
              </h2>
              <p>{t("stories.description")}</p>
            </div>
            <Stagger className={`${wsopStyles.wsop_ambassadors_grid}`}>
              {ambassadors.map((ambassador, index) => (
                <motion.article
                  className={`${wsopStyles.wsop_ambassador}`}
                  key={ambassador.name}
                  variants={staggerItemVariants}
                  whileHover={reduceMotion ? { y: 0 } : { y: -2 }}
                  transition={{ duration: 0.18, ease: EASE }}
                >
                  <div className={`${wsopStyles.wsop_ambassador_portrait}`}>
                    <Image
                      className={`${wsopStyles.wsop_ambassador_portrait_image}`}
                      src={ambassador.image}
                      alt=""
                      fill
                      sizes="(min-width: 1100px) 20vw, (min-width: 640px) 36vw, 100vw"
                      unoptimized={ambassador.unoptimized}
                    />
                  </div>
                  <div className={`${wsopStyles.wsop_ambassador_copy}`}>
                    <span>{t("stories.episode", { number: index + 1 })}</span>
                    <p>{t(`stories.profiles.${ambassador.id}.title`)}</p>
                    <h3 className="font-medium text-balance">
                      {ambassador.name}
                    </h3>
                    <div className="mt-5 flex flex-col gap-1.5 border-l border-[var(--wsop-border-prominent)] pl-3">
                      <strong className="font-[var(--wsop-font-label)] text-xs font-medium tracking-[0.06em] text-[var(--wsop-accent)] uppercase">
                        {t(`stories.profiles.${ambassador.id}.theme`)}
                      </strong>
                      <span className="text-sm leading-snug text-white/75">
                        {t(`stories.profiles.${ambassador.id}.themeLine`)}
                      </span>
                    </div>
                    <p className="mt-5 text-base leading-relaxed text-[var(--wsop-muted)]">
                      {t(`stories.profiles.${ambassador.id}.biography`)}
                    </p>
                    {ambassador.href ? (
                      <a
                        className={`${wsopStyles.wsop_ambassador_story}`}
                        href={ambassador.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("stories.watch")}
                        <ArrowOutUpRightSquare aria-hidden="true" />
                      </a>
                    ) : (
                      <div className={`${wsopStyles.wsop_ambassador_story}`}>
                        {ambassador.releaseDate
                          ? t("stories.goesLive", {
                              date: ambassador.releaseDate,
                            })
                          : t("stories.comingSoon")}
                        <Clock3 aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </Stagger>
          </Reveal>
        </section>
        <BrandMarquee />
        <section
          className={`${wsopStyles.wsop_section} `}
          id="showdown"
          aria-labelledby="showdown-heading"
        >
          <Reveal>
            <SectionLabel suit="heart">{t("showdown.label")}</SectionLabel>
            <div className={`${wsopStyles.wsop_section_heading}`}>
              <div>
                <Image
                  src="/src/img/wsop/paradise/showdown-lockup.webp"
                  alt={t("showdown.lockupAlt")}
                  width={842}
                  height={770}
                  className="mb-8 h-auto w-40 md:w-48"
                />
                <LiveChip>{t("showdown.chip")}</LiveChip>
                <h2
                  id="showdown-heading"
                  className="font-medium text-balance mt-6"
                >
                  {t("showdown.title")}
                </h2>
              </div>
              <p>{t("showdown.description")}</p>
            </div>
            <div className={`${wsopStyles.wsop_event_layout}`}>
              <motion.div
                className={`${wsopStyles.wsop_ticket} bg-[linear-gradient(135deg,#f3fbfe,#cfeefa)]`}
                whileHover={reduceMotion ? { rotate: 0 } : { rotate: -0.75 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className={`${wsopStyles.wsop_ticket_topline}`}>
                  <span>{t("showdown.ticket.topline")}</span>
                  <span>{t("showdown.ticket.type")}</span>
                  <span>NLH</span>
                </div>
                <div className={`${wsopStyles.wsop_ticket_place}`}>
                  <div
                    className={`${wsopStyles.wsop_ticket_chip}`}
                    aria-hidden="true"
                  >
                    <span>WSOP</span>
                    <SuitRun
                      className={`${wsopStyles.wsop_ticket_chip_suits}`}
                    />
                  </div>
                  <p
                    className={`${wsopStyles.wsop_ticket_prize} flex flex-col items-center gap-3 text-[clamp(1.75rem,6vw,3.25rem)] [&>span]:text-[max(0.6875rem,0.36em)] [&>span]:font-semibold [&>span]:tracking-[0.08em] [&>span]:uppercase [&>span]:opacity-60`}
                  >
                    <strong>{t("showdown.ticket.name")}</strong>
                    <span>{t("showdown.ticket.subtitle")}</span>
                  </p>
                </div>
                <div className={`${wsopStyles.wsop_ticket_date} flex-wrap`}>
                  <span>{t("showdown.ticket.dateLabel")}</span>
                  <span
                    className={`${wsopStyles.wsop_ticket_pen}`}
                    aria-hidden="true"
                  >
                    12-12
                  </span>
                  <time dateTime="2026-12-12">
                    {t("showdown.ticket.dateValue")}
                  </time>
                </div>
                <div className={`${wsopStyles.wsop_ticket_scan}`}>
                  <span className={`${wsopStyles.wsop_ticket_serial}`}>
                    1212-009
                  </span>
                  <TicketBarcode value="12122026" />
                </div>
                <div
                  className={`${wsopStyles.wsop_ticket_bottomline} flex-wrap gap-x-4 gap-y-1`}
                >
                  <span>{t("showdown.ticket.venue")}</span>
                  <span>{t("showdown.ticket.streamed")}</span>
                  <span>{t("showdown.ticket.inviteOnly")}</span>
                </div>
              </motion.div>
              <Stagger className={`${wsopStyles.wsop_event_details}`}>
                {SHOWDOWN_DETAILS.map((id) => (
                  <motion.div
                    className={`${wsopStyles.wsop_detail}`}
                    key={id}
                    variants={staggerItemVariants}
                  >
                    <span>{t(`showdown.details.${id}.label`)}</span>
                    <p>{t(`showdown.details.${id}.value`)}</p>
                  </motion.div>
                ))}
              </Stagger>
            </div>
            <div className={`${wsopStyles.wsop_lineup}`}>
              <div>
                <p className={`${wsopStyles.wsop_eyebrow}`}>
                  {t("showdown.lineup.eyebrow")}
                </p>
                <h3 className="font-medium text-balance">
                  {t.rich("showdown.lineup.title", { br: () => <br /> })}
                </h3>
              </div>
              <motion.ol
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                variants={staggerVariants}
              >
                {Array.from({ length: 9 }, (_, index) => (
                  <motion.li key={index} variants={dealVariants}>
                    <div className={`${wsopStyles.wsop_lineup_player} `}>
                      <span className="relative grid size-12 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
                        <svg
                          viewBox="0 0 48 48"
                          className="size-9 fill-white/25"
                          aria-hidden="true"
                        >
                          <circle cx="24" cy="17" r="8" />
                          <path d="M8 42c1-10 7-15 16-15s15 5 16 15Z" />
                        </svg>
                        <span className="absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full bg-black">
                          <Image
                            src="/src/img/logos-solana/logomark.inline.svg"
                            alt=""
                            width={12}
                            height={11}
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                      <span
                        className={`${wsopStyles.wsop_lineup_identity} gap-1`}
                      >
                        <strong>
                          {t("showdown.lineup.seat", { number: index + 1 })}
                        </strong>
                        <span>{t("showdown.lineup.unrevealed")}</span>
                      </span>
                      <SuitIcon
                        className={`${wsopStyles.wsop_lineup_suit}`}
                        suit={SUITS[index % SUITS.length]}
                      />
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
            <div className={`${wsopStyles.wsop_event_cta}`}>
              <p>{t("showdown.cta.description")}</p>
              <ArrowLink href="https://x.com/solana">
                {t("showdown.cta.action")}
              </ArrowLink>
            </div>
          </Reveal>
        </section>
        <section
          className={`${wsopStyles.wsop_start}`}
          aria-labelledby="get-started-heading"
        >
          <Reveal className={`${wsopStyles.wsop_start_inner}`}>
            <SectionLabel suit="diamond">{t("start.label")}</SectionLabel>
            <div className={`${wsopStyles.wsop_start_grid}`}>
              <article
                className={`${wsopStyles.wsop_start_card} ${wsopStyles.wsop_start_card_guide}`}
              >
                <div className={`${wsopStyles.wsop_start_content}`}>
                  <div className={`${wsopStyles.wsop_start_guide_copy}`}>
                    <h3 className="font-medium text-balance">
                      {t("start.guide")}
                    </h3>
                    <p>{t("start.guideDescription")}</p>
                  </div>
                  <div className={`${wsopStyles.wsop_start_actions}`}>
                    <CrossAppLink
                      className={`${wsopStyles.wsop_button} ${wsopStyles.wsop_start_guide_action}`}
                      href="/poker-players-guide-to-crypto"
                    >
                      <span>{t("start.guideCta")}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </CrossAppLink>
                  </div>
                </div>
              </article>

              <article
                className={`${wsopStyles.wsop_start_card} ${wsopStyles.wsop_start_card_onboarding}`}
              >
                <div className={`${wsopStyles.wsop_start_content}`}>
                  <h2
                    id="get-started-heading"
                    className="font-medium text-balance"
                  >
                    {t("start.title")}
                  </h2>
                  <p>{t("start.description")}</p>
                  <div className={`${wsopStyles.wsop_start_actions}`}>
                    <Link
                      className={`${wsopStyles.wsop_button} ${wsopStyles.wsop_button_light}`}
                      data-light=""
                      href="/wallets"
                    >
                      <span>{t("start.findWallet")}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                    <CrossAppLink
                      className={`${wsopStyles.wsop_button}`}
                      href="/poker-players-guide-to-crypto"
                    >
                      <span>{walletT("learnBasics")}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </CrossAppLink>
                  </div>
                </div>
              </article>
            </div>
          </Reveal>
        </section>
      </main>
    </MotionConfig>
  );
}
