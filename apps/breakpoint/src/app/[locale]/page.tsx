"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { config } from "@/config";

function LogoMark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 16" fill="none">
      <g clipPath="url(#clip0_breakpoint_local)">
        <mask
          id="mask0_breakpoint_local"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="20"
          height="17"
        >
          <path d="M0 0H108.364V16.1033H0V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_breakpoint_local)">
          <path
            d="M18.2087 12.6968L15.2363 15.8837C15.1719 15.9528 15.094 16.0079 15.0074 16.0457C14.9209 16.0835 14.8275 16.1031 14.733 16.1033H0.642129C0.57507 16.103 0.509559 16.0832 0.453556 16.0463C0.397554 16.0094 0.353471 15.957 0.326665 15.8955C0.299859 15.8341 0.291483 15.7661 0.302556 15.7C0.313629 15.6339 0.343673 15.5724 0.389038 15.523L3.35777 12.3361C3.42219 12.267 3.50008 12.2119 3.58665 12.1741C3.67321 12.1363 3.76659 12.1167 3.86104 12.1164H17.9519C18.0197 12.1151 18.0864 12.1338 18.1436 12.1702C18.2008 12.2067 18.246 12.2592 18.2734 12.3212C18.3008 12.3832 18.3093 12.452 18.2978 12.5188C18.2863 12.5856 18.2553 12.6475 18.2087 12.6968ZM15.2363 6.27716C15.1716 6.20844 15.0937 6.15354 15.0072 6.11579C14.9207 6.07804 14.8274 6.05822 14.733 6.05753H0.642129C0.574929 6.05757 0.509199 6.07721 0.452991 6.11404C0.396783 6.15087 0.352538 6.20329 0.325675 6.26489C0.298813 6.32649 0.2905 6.39459 0.301754 6.46084C0.313009 6.52709 0.343342 6.58862 0.389038 6.63789L3.35777 9.82698C3.42245 9.89571 3.5004 9.9506 3.5869 9.98835C3.6734 10.0261 3.76666 10.0459 3.86104 10.0466H17.9519C18.0189 10.046 18.0842 10.0259 18.14 9.98895C18.1958 9.95195 18.2396 9.89958 18.2663 9.83816C18.2929 9.77675 18.3011 9.70893 18.29 9.64293C18.2789 9.57692 18.2489 9.51555 18.2036 9.46626L15.2363 6.27716ZM0.642129 3.98771H14.733C14.8275 3.98744 14.9209 3.96781 15.0074 3.93004C15.094 3.89226 15.1719 3.83714 15.2363 3.76807L18.2087 0.580436C18.2433 0.543467 18.2693 0.499351 18.2849 0.451209C18.3006 0.403067 18.3054 0.352076 18.2992 0.301843C18.2929 0.25161 18.2757 0.203363 18.2488 0.160516C18.2218 0.117669 18.1858 0.0812688 18.1432 0.0538909C18.0862 0.0174073 18.0196 -0.00132368 17.9519 7.27636e-05H3.86104C3.76659 0.000340677 3.67321 0.0199692 3.58665 0.0577459C3.50008 0.0955226 3.42219 0.150645 3.35777 0.219709L0.389038 3.40735C0.343342 3.45662 0.313009 3.51815 0.301754 3.5844C0.2905 3.65065 0.298813 3.71875 0.325675 3.78034C0.352538 3.84194 0.396783 3.89437 0.452991 3.9312C0.509199 3.96803 0.574929 3.98767 0.642129 3.98771Z"
            fill="#E7D2F9"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_breakpoint_local">
          <rect width="108.364" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <a
        className="block w-full nav-sm:w-auto whitespace-nowrap nav-sm:px-xs"
        href={href}
      >
        <div className="inset-shadow-[0px_-2px_0px_0px] inset-shadow-transparent hover:inset-shadow-transparent-wisp-40 py-xs">
          {children}
        </div>
      </a>
    </li>
  );
}

function CTAButton({
  href,
  children,
  className = "",
  onClick,
  type = "link",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "link" | "button";
}) {
  const classes =
    `gap-xs cta cursor-pointer uppercase flex gap-xs items-center justify-center cta-transition [&>svg]:transition-all [&>svg]:duration-300 outline-offset-[8px] outline-transparent focus:outline focus:outline-transparent-wisp-40 px-[var(--spacing-xs)] h-[3rem] w-full hover:text-invert hover:[&>svg]:fill-primary-null active:bg-transparent-wisp-80 bg-byte text-invert [&>svg]:fill-primary-null ${className}`.trim();

  const arrow = (
    <svg
      width="10"
      height="10"
      viewBox="0 0 9 10"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.35938 8.65625L5.10156 6.97656L6.6875 5.57812V5.53125L4.77344 5.625H0V4.21094H4.78906L6.6875 4.3125V4.26562L5.10156 2.86719L3.35938 1.1875L4.32812 0.171875L9 4.92188L4.32812 9.66406L3.35938 8.65625Z"
        fill="currentColor"
      />
    </svg>
  );

  if (type === "button") {
    return (
      <button className={classes} onClick={onClick}>
        {children}
        {arrow}
      </button>
    );
  }

  return (
    <a className={classes} target="_blank" rel="noreferrer" href={href}>
      {children}
      {arrow}
    </a>
  );
}

function CopyrightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={11}
      viewBox="0 0 11 14"
      fill="none"
    >
      <g clipPath="url(#clip0_copyright)">
        <path
          d="M1.16623 7.99474C1.3658 10.3771 2.72847 12.7563 5.43824 12.4788C8.75294 12.1389 9.2082 7.40227 8.53778 4.88584C7.50564 1.02232 2.98105 0.691787 1.56536 4.42434C1.34709 5.00121 1.30655 6.37636 0.626769 6.44185C-0.424083 6.54475 0.26817 4.28402 0.526985 3.69467C1.69633 1.00673 4.70545 -0.15326 7.32478 1.29361C11.1852 3.4265 10.9232 12.1576 6.41737 13.4548C2.82202 14.4901 0.159031 11.5371 0 8.13506L1.16623 7.99474Z"
          fill="currentColor"
        />
        <path
          d="M7.21906 6.28024C6.07778 6.55153 6.15885 5.96842 5.65682 5.59422C4.27231 4.56208 3.09361 7.1783 4.27231 8.52538C4.97704 9.33301 5.80961 8.90581 6.07466 7.97345L7.37186 7.98281C6.19627 12.0584 1.2133 9.49516 2.85039 5.70648C3.76092 3.59854 7.16917 3.92596 7.21906 6.27712V6.28024Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_copyright">
          <rect
            width="10.0221"
            height="13"
            fill="white"
            transform="translate(0 0.666992)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

const socialLinks = [
  {
    name: "X",
    url: "https://x.com/solana",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        viewBox="0 0 24 25"
        fill="currentColor"
      >
        <path d="M18.3263 2.07129H21.6998L14.3297 10.4948L23 21.9573H16.2112L10.894 15.0053L4.80995 21.9573H1.43443L9.31743 12.9474L1 2.07129H7.96111L12.7674 8.42562L18.3263 2.07129ZM17.1423 19.9381H19.0116L6.94539 3.98442H4.93946L17.1423 19.9381Z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    url: "https://discord.com/invite/solana",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        viewBox="0 0 24 25"
        fill="currentColor"
      >
        <path d="M20.317 4.32208C18.7873 3.6202 17.147 3.10308 15.4319 2.80691C15.4007 2.80119 15.3695 2.81548 15.3534 2.84405C15.1424 3.21926 14.9087 3.70876 14.7451 4.0935C12.9004 3.81733 11.0652 3.81733 9.25832 4.0935C9.09465 3.70021 8.85248 3.21926 8.64057 2.84405C8.62449 2.81643 8.59328 2.80214 8.56205 2.80691C6.84791 3.10213 5.20756 3.61925 3.67693 4.32208C3.66368 4.32779 3.65233 4.33732 3.64479 4.34969C0.533392 8.99805 -0.31895 13.5322 0.0991801 18.0101C0.101072 18.032 0.11337 18.0529 0.130398 18.0662C2.18321 19.5738 4.17171 20.489 6.12328 21.0956C6.15451 21.1051 6.18761 21.0937 6.20748 21.068C6.66913 20.4376 7.08064 19.7728 7.43348 19.0738C7.4543 19.0329 7.43442 18.9843 7.39186 18.9681C6.73913 18.7205 6.1176 18.4186 5.51973 18.0758C5.47244 18.0482 5.46865 17.9805 5.51216 17.9481C5.63797 17.8539 5.76382 17.7558 5.88396 17.6567C5.90569 17.6386 5.93598 17.6348 5.96153 17.6462C9.88928 19.4395 14.1415 19.4395 18.023 17.6462C18.0485 17.6339 18.0788 17.6377 18.1015 17.6558C18.2216 17.7548 18.3475 17.8539 18.4742 17.9481C18.5177 17.9805 18.5149 18.0482 18.4676 18.0758C17.8697 18.4253 17.2482 18.7205 16.5945 18.9671C16.552 18.9833 16.533 19.0329 16.5538 19.0738C16.9143 19.7719 17.3258 20.4366 17.7789 21.067C17.7978 21.0937 17.8319 21.1051 17.8631 21.0956C19.8241 20.489 21.8126 19.5738 23.8654 18.0662C23.8834 18.0529 23.8948 18.0329 23.8967 18.011C24.3971 12.8341 23.0585 8.33714 20.3482 4.35064C20.3416 4.33732 20.3303 4.32779 20.317 4.32208ZM8.02002 15.2835C6.8375 15.2835 5.86313 14.1978 5.86313 12.8646C5.86313 11.5313 6.8186 10.4456 8.02002 10.4456C9.23087 10.4456 10.1958 11.5408 10.1769 12.8646C10.1769 14.1978 9.22141 15.2835 8.02002 15.2835ZM15.9947 15.2835C14.8123 15.2835 13.8379 14.1978 13.8379 12.8646C13.8379 11.5313 14.7933 10.4456 15.9947 10.4456C17.2056 10.4456 18.1705 11.5408 18.1516 12.8646C18.1516 14.1978 17.2056 15.2835 15.9947 15.2835Z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    url: "https://github.com/solana-labs",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        viewBox="0 0 24 25"
        fill="currentColor"
      >
        <g clipPath="url(#clip0_github)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.0099 0.166992C5.36875 0.166992 0 5.57532 0 12.2662C0 17.6145 3.43994 22.1418 8.21205 23.7441C8.80869 23.8646 9.02724 23.4838 9.02724 23.1634C9.02724 22.8829 9.00757 21.9215 9.00757 20.9197C5.6667 21.641 4.97099 19.4774 4.97099 19.4774C4.43409 18.0752 3.63858 17.7148 3.63858 17.7148C2.54511 16.9736 3.71823 16.9736 3.71823 16.9736C4.93117 17.0538 5.56763 18.2156 5.56763 18.2156C6.64118 20.0583 8.37111 19.5377 9.06706 19.2171C9.16638 18.4358 9.48473 17.895 9.82275 17.5946C7.15817 17.3141 4.35469 16.2725 4.35469 11.625C4.35469 10.3029 4.8316 9.22127 5.58729 8.38003C5.46807 8.07962 5.0504 6.83743 5.70677 5.17486C5.70677 5.17486 6.72083 4.85429 9.00732 6.41681C9.98625 6.15196 10.9958 6.01723 12.0099 6.0161C13.024 6.0161 14.0577 6.15647 15.0123 6.41681C17.299 4.85429 18.3131 5.17486 18.3131 5.17486C18.9695 6.83743 18.5515 8.07962 18.4323 8.38003C19.2079 9.22127 19.6652 10.3029 19.6652 11.625C19.6652 16.2725 16.8617 17.2939 14.1772 17.5946C14.6148 17.9751 14.9924 18.6962 14.9924 19.8381C14.9924 21.4606 14.9727 22.7627 14.9727 23.1632C14.9727 23.4838 15.1915 23.8646 15.7879 23.7443C20.56 22.1415 23.9999 17.6145 23.9999 12.2662C24.0196 5.57532 18.6312 0.166992 12.0099 0.166992Z"
          />
        </g>
        <defs>
          <clipPath id="clip0_github">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0 0.166992)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    name: "Reddit",
    url: "https://reddit.com/r/solana",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        viewBox="0 0 24 25"
        fill="currentColor"
      >
        <path d="M14.4414 5.82523C14.6495 6.70742 15.4417 7.36461 16.3877 7.36461C17.492 7.36461 18.3873 6.4693 18.3873 5.36492C18.3873 4.26055 17.492 3.36523 16.3877 3.36523C15.422 3.36523 14.6167 4.04961 14.4292 4.95992C12.812 5.13336 11.5492 6.50492 11.5492 8.16711C11.5492 8.17086 11.5492 8.17367 11.5492 8.17742C9.79047 8.25148 8.18453 8.75211 6.90953 9.54242C6.43609 9.17586 5.84172 8.95742 5.19672 8.95742C3.64891 8.95742 2.39453 10.2118 2.39453 11.7596C2.39453 12.8827 3.05453 13.8502 4.00797 14.2974C4.10078 17.5505 7.64547 20.1671 12.0058 20.1671C16.3661 20.1671 19.9155 17.5477 20.0036 14.2918C20.9495 13.8418 21.6039 12.8771 21.6039 11.7605C21.6039 10.2127 20.3495 8.95836 18.8017 8.95836C18.1595 8.95836 17.568 9.17492 17.0955 9.53867C15.8092 8.74274 14.1855 8.24211 12.4089 8.17555C12.4089 8.17273 12.4089 8.17086 12.4089 8.16805C12.4089 6.97742 13.2939 5.9893 14.4414 5.82711V5.82523ZM6.79703 13.538C6.84391 12.5218 7.51891 11.7418 8.30359 11.7418C9.08828 11.7418 9.68828 12.5659 9.64141 13.5821C9.59453 14.5984 9.00859 14.9677 8.22297 14.9677C7.43734 14.9677 6.75016 14.5543 6.79703 13.538ZM15.7089 11.7418C16.4945 11.7418 17.1695 12.5218 17.2155 13.538C17.2623 14.5543 16.5742 14.9677 15.7895 14.9677C15.0048 14.9677 14.418 14.5993 14.3711 13.5821C14.3242 12.5659 14.9233 11.7418 15.7089 11.7418ZM14.7752 15.8893C14.9223 15.9043 15.0161 16.0571 14.9589 16.194C14.4761 17.348 13.3361 18.159 12.0058 18.159C10.6755 18.159 9.53641 17.348 9.05266 16.194C8.99547 16.0571 9.08922 15.9043 9.23641 15.8893C10.0989 15.8021 11.0317 15.7543 12.0058 15.7543C12.9798 15.7543 13.9117 15.8021 14.7752 15.8893Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://youtube.com/SolanaFndn",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        viewBox="0 0 24 25"
        fill="currentColor"
      >
        <path d="M23.7609 7.3668C23.7609 7.3668 23.5266 5.71211 22.8047 4.98555C21.8906 4.0293 20.8688 4.02461 20.4 3.96836C17.0438 3.72461 12.0047 3.72461 12.0047 3.72461H11.9953C11.9953 3.72461 6.95625 3.72461 3.6 3.96836C3.13125 4.02461 2.10938 4.0293 1.19531 4.98555C0.473438 5.71211 0.24375 7.3668 0.24375 7.3668C0.24375 7.3668 0 9.31211 0 11.2527V13.0715C0 15.0121 0.239062 16.9574 0.239062 16.9574C0.239062 16.9574 0.473437 18.6121 1.19062 19.3387C2.10469 20.2949 3.30469 20.2621 3.83906 20.3652C5.76094 20.548 12 20.6043 12 20.6043C12 20.6043 17.0438 20.5949 20.4 20.3559C20.8688 20.2996 21.8906 20.2949 22.8047 19.3387C23.5266 18.6121 23.7609 16.9574 23.7609 16.9574C23.7609 16.9574 24 15.0168 24 13.0715V11.2527C24 9.31211 23.7609 7.3668 23.7609 7.3668ZM9.52031 15.2793V8.53398L16.0031 11.9184L9.52031 15.2793Z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    url: "https://t.me/solana",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        viewBox="0 0 24 25"
        fill="currentColor"
      >
        <g clipPath="url(#clip0_telegram)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 12.167C24 18.7944 18.6274 24.167 12 24.167C5.37258 24.167 0 18.7944 0 12.167C0 5.53958 5.37258 0.166992 12 0.166992C18.6274 0.166992 24 5.53958 24 12.167ZM12.43 9.02592C11.2628 9.51139 8.93014 10.5162 5.43189 12.0403C4.86383 12.2662 4.56626 12.4872 4.53917 12.7033C4.49339 13.0685 4.95071 13.2123 5.57347 13.4081C5.65818 13.4348 5.74595 13.4623 5.83594 13.4916C6.44864 13.6908 7.27283 13.9238 7.70129 13.933C8.08994 13.9414 8.52373 13.7812 9.00264 13.4523C12.2712 11.246 13.9584 10.1308 14.0643 10.1068C14.139 10.0898 14.2426 10.0685 14.3128 10.1308C14.3829 10.1932 14.376 10.3113 14.3686 10.343C14.3233 10.5361 12.5281 12.2051 11.5991 13.0688C11.3095 13.338 11.1041 13.529 11.0621 13.5726C10.968 13.6703 10.8721 13.7628 10.78 13.8516C10.2108 14.4003 9.78391 14.8118 10.8036 15.4838C11.2936 15.8067 11.6858 16.0737 12.077 16.3401C12.5042 16.6311 12.9303 16.9213 13.4816 17.2827C13.6221 17.3747 13.7562 17.4704 13.8869 17.5635C14.3841 17.918 14.8307 18.2364 15.3826 18.1856C15.7032 18.1561 16.0345 17.8546 16.2027 16.9553C16.6002 14.8301 17.3816 10.2254 17.5622 8.32797C17.578 8.16172 17.5581 7.94896 17.5422 7.85557C17.5262 7.76217 17.4928 7.6291 17.3714 7.53059C17.2276 7.41393 17.0056 7.38933 16.9064 7.39108C16.455 7.39903 15.7626 7.63981 12.43 9.02592Z"
          />
        </g>
        <defs>
          <clipPath id="clip0_telegram">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0 0.166992)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
  },
];

const ITERABLE_SUBSCRIBE_URL =
  "https://links.iterable.com/lists/publicAddSubscriberForm?publicIdString=7b8f7f90-b5cc-479e-af28-7121d89fc6a4";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const liveMediaCards = [
  {
    eyebrow: "Playlist",
    headline: "All talks from BP25",
    description:
      "Every breakthrough. Every reveal. Every voice that shaped Breakpoint 2025. Dive into the talks from Abu Dhabi and see where the Solana ecosystem is headed next.",
    url: "https://www.youtube.com/watch?v=yOgLKAwney0&list=PLilwLeBwGuK4dz_gqiiDA3GfS094Yr46b",
    imageRef: "6d7274b13accddf1fed94920cfccd8dc54526423-420x420.jpg",
  },
  {
    eyebrow: "Sizzle",
    headline: "Solana Breakpoint 2026 Is Coming to London",
    description: "A new city. A new moment. Same unstoppable energy.",
    url: "https://www.youtube.com/watch?v=Mys5RoZPWMg",
    imageRef: "aca941a95615690c4b9e2a873d6b8c2199dcda6b-1000x500.webp",
  },
  {
    eyebrow: "Playlist",
    headline: "Solana Stories",
    description:
      "Meet the people shaping Solana. In-person interviews that spotlight the builders, founders, and creators moving the ecosystem forward—one story at a time.",
    url: "https://www.youtube.com/watch?v=XHhNzPiY7A8&list=PLilwLeBwGuK6p3pB-vUQf1TjkX48j0Af-",
    imageRef: "50825a84b192c8f0e7253053b80fb983374a0b84-2160x1215.webp",
  },
  {
    eyebrow: "Playlist",
    headline: "Relive talks from BP24",
    description:
      "Take a step back to BP24 and revisit the conversations that defined the year. From bold ideas to major reveals, these talks show how far the ecosystem has come.",
    url: "https://www.youtube.com/watch?v=6M8SGByj-yM&list=PLilwLeBwGuK7YY8igEkLeFcpdoFRJAa0L",
    imageRef: "ef0b6ccd637614306b7014dd75442a9d7ed1d999-2160x1215.webp",
  },
];

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isNext = direction === "next";

  return (
    <button
      type="button"
      aria-label={isNext ? "Next" : "Previous"}
      onClick={onClick}
      className="cta cursor-pointer uppercase flex items-center justify-center cta-transition w-[48px] h-[48px] shrink-0 bg-transparent border border-wisp text-primary-wisp [&>svg]:fill-primary-wisp hover:bg-transparent-wisp-10 active:bg-transparent-wisp-10 active:border-transparent-wisp-40"
    >
      <svg
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={
            isNext
              ? "M9.90341 16L8.89773 15.0028L14.8295 9.07955H0V7.64773H14.8295L8.89773 1.72443L9.90341 0.727273L17.5398 8.36364L9.90341 16Z"
              : "M8.00568 16L0.369318 8.36364L8.00568 0.727273L9.01136 1.71591L3.07955 7.64773H17.9091V9.07955H3.07955L9.01136 14.9943L8.00568 16Z"
          }
          fill="currentColor"
        />
      </svg>
    </button>
  );
}

function LiveMediaCard({
  card,
  assetPath,
}: {
  card: (typeof liveMediaCards)[number];
  assetPath: (path: string) => string;
}) {
  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      data-media-card
      className="flex-[0_0_calc(76.322%)] md:flex-[0_0_calc(50%-(var(--spacing-s)/2))] flex flex-col gap-s snap-start cta-transition outline-offset-[-2px] outline-transparent cursor-pointer focus:outline-2 focus:outline-transparent-wisp-40"
    >
      <div className="w-full relative overflow-hidden aspect-[4/3]">
        <img
          src={assetPath(`/img/${card.imageRef}`)}
          alt={`${card.headline} image`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-xs">
        <p className="text-p2-mono text-secondary">{card.eyebrow}</p>
        <p className="text-h5 md:text-h4">{card.headline}</p>
        <p className="text-p1">{card.description}</p>
      </div>
    </a>
  );
}

function SubscribeForm({
  className,
  inputClassName,
  buttonClassName,
  successClassName,
  errorClassName,
}: {
  className: string;
  inputClassName: string;
  buttonClassName: string;
  successClassName: string;
  errorClassName: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      setStatus("idle");
      setErrorMsg("");
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrorMsg("");

      if (!EMAIL_REGEX.test(email)) {
        setStatus("error");
        setErrorMsg("Please enter a valid email address.");
        return;
      }

      setStatus("submitting");

      try {
        const data = new FormData();
        data.append("email", email);

        const response = await fetch(ITERABLE_SUBSCRIBE_URL, {
          method: "POST",
          body: data,
        });

        if (!response.ok) {
          throw new Error("Subscription failed");
        }

        setStatus("success");
        setEmail("");
      } catch {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      }
    },
    [email],
  );

  if (status === "success") {
    return (
      <p className={successClassName}>
        Thanks for subscribing! We&apos;ll keep you updated.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="email"
        name="email"
        required
        placeholder="email"
        value={email}
        onChange={handleEmailChange}
        className={inputClassName}
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className={buttonClassName}
      >
        {status === "submitting" ? "Submitting..." : "Subscribe"}
      </button>
      {errorMsg ? <p className={errorClassName}>{errorMsg}</p> : null}
    </form>
  );
}

function PlayIcon() {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0L14 8L0 16V0Z" />
    </svg>
  );
}

function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="video-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Breakpoint 2025 video"
    >
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-xl right-0 text-primary hover:text-byte cta-transition cursor-pointer"
          aria-label="Close video"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="aspect-video overflow-hidden">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/394wb968J68?autoplay=1"
            title="Solana Breakpoint 2025 - The Movie"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

function SubscribeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="video-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Subscribe for Breakpoint updates"
    >
      <div
        className="video-modal-content max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-xl right-0 text-primary hover:text-byte cta-transition cursor-pointer"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="bg-null border-1 border-wisp-10 p-s md:p-l">
          <p className="text-eyebrow text-byte">Breakpoint 2026</p>
          <h3 className="mt-s text-primary">Get notified</h3>
          <p className="text-p1 text-secondary mt-xs">
            Sign up for updates and early registration details.
          </p>
          <div className="mt-l">
            <SubscribeForm
              className="flex flex-col gap-xs md:flex-row"
              inputClassName="border-1 border-wisp-10 bg-transparent px-xs h-[3rem] w-full focus:outline-none focus:border-byte text-primary"
              buttonClassName="gap-xs cta cursor-pointer uppercase flex gap-xs items-center justify-center cta-transition outline-offset-[8px] outline-transparent px-[var(--spacing-xs)] h-[3rem] bg-byte text-invert hover:bg-primary-wisp shrink-0 disabled:opacity-50"
              successClassName="text-p1 text-byte"
              errorClassName="text-p1 text-byte"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const assetPath = (path: string) => `${config.assetPrefix}${path}`;
  const [videoOpen, setVideoOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const liveMediaCarouselRef = useRef<HTMLDivElement | null>(null);

  const scrollLiveMedia = useCallback((direction: "prev" | "next") => {
    const container = liveMediaCarouselRef.current;

    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>("[data-media-card]");
    const gap = 16;
    const offset =
      (firstCard?.offsetWidth ?? container.clientWidth * 0.76) + gap;

    container.scrollBy({
      left: direction === "next" ? offset : -offset,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <nav
        aria-label="Main"
        className="sticky top-0 flex-col w-full text-button z-20 overflow-hidden"
      >
        <div className="w-full mb-[-2.5px]">
          <ul className="bg-null w-full inline-flex unstyled-list inset-shadow-[0px_-1px_0px_0px] inset-shadow-transparent-wisp-30/100 justify-between">
            <li className="flex-start px-s py-xs">
              <a
                className="block w-[18.2px] h-xs"
                title="Solana"
                href="https://solana.com"
              >
                <LogoMark />
              </a>
            </li>
            <li className="flex-end hidden nav-sm:flex">
              <ul className="inline-flex unstyled-list transition-transform duration-300 transform-[translateX(0)] transform-[translateX(158px)]">
                <NavLink href="#overview">Overview</NavLink>
                <NavLink href="#why-london">Why London</NavLink>
                <NavLink href="#logistics">Logistics</NavLink>
                <li>
                  <CTAButton
                    type="button"
                    onClick={() => setSubscribeOpen(true)}
                    className="px-s focus:outline-none focus:underline focus:underline-offset-4 focus:decoration-null"
                  >
                    Get Notified
                  </CTAButton>
                </li>
              </ul>
            </li>
            <div className="nav-sm:hidden flex-end transition-transform duration-300 transform-[translateX(0)] transform-[translateX(158px)]">
              <li>
                <CTAButton type="button" onClick={() => setSubscribeOpen(true)}>
                  Get Notified
                </CTAButton>
              </li>
            </div>
          </ul>
        </div>
      </nav>

      <main id="top" className="container">
        {/* ── Hero ── */}
        <section className="px-s pt-s pb-xl md:pb-2xl flex flex-col justify-between relative">
          <img
            className="w-full hidden md:block"
            alt="Solana Breakpoint Logo"
            src={assetPath("/assets/bp-logo-full.svg")}
          />
          <img
            className="w-full block md:hidden"
            alt="Solana Breakpoint Logo"
            src={assetPath("/assets/bg-logo-mobile-full.svg")}
          />

          <div className="mt-l md:mt-xl flex flex-col md:flex-row items-start gap-l md:gap-xl">
            <div className="flex flex-col gap-s w-full md:w-7/12">
              <p className="text-eyebrow text-byte">Breakpoint 2026</p>
              <h3>
                The global Solana community comes to London, November 15-17
              </h3>
              <p className="text-p1 text-secondary">
                Breakpoint 2026 brings together the leaders, builders,
                investors, institutions, and creators shaping the future of the
                Solana ecosystem.
              </p>
            </div>
            <div className="flex flex-col gap-xs w-full md:w-5/12 md:pt-l">
              <CTAButton
                type="button"
                onClick={() => setVideoOpen(true)}
                className="bg-transparent-wisp-10 text-primary border-1 border-wisp-10 hover:bg-byte hover:text-invert hover:border-byte"
              >
                <PlayIcon />
                Watch Breakpoint 2025
              </CTAButton>
              <CTAButton type="button" onClick={() => setSubscribeOpen(true)}>
                Get Notified
              </CTAButton>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-xl md:mt-2xl border-t border-transparent-wisp-10" />
        </section>

        {/* ── Overview ── */}
        <article
          id="overview"
          className="px-s py-2xl md:py-3xl text-invert bg-byte"
        >
          <div className="flex flex-col gap-s">
            <p className="text-eyebrow">The Event</p>
            <h2>A high-signal gathering for the Solana ecosystem</h2>
          </div>

          <div className="grid gap-m md:grid-cols-2 mt-l md:mt-xl">
            <p className="text-p1">
              Breakpoint creates space for meaningful connections, new ideas,
              and the unveiling of products and technologies pushing the network
              forward. Attendees will experience a curated program of keynotes,
              lightning talks, debates, workshops, and networking designed to
              spark collaboration and accelerate the next phase of growth across
              the ecosystem.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-xs mt-xl md:mt-2xl">
            {[
              { value: "3", label: "Days" },
              { value: "200+", label: "Speakers" },
              { value: "2", label: "Stages" },
              { value: "100+", label: "Side Events" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border-t border-primary-null/20 pt-s"
              >
                <p className="text-stat-display font-fh-lecturis">
                  {stat.value}
                </p>
                <p className="text-eyebrow mt-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </article>

        {/* ── Why London ── */}
        <article id="why-london" className="text-invert bg-lime">
          <div className="flex flex-col md:flex-row">
            {/* Text — left */}
            <div className="px-s py-2xl md:py-3xl md:w-1/2 flex flex-col justify-center">
              <div className="flex flex-col gap-s">
                <p className="text-eyebrow">Why London</p>
                <h2>At the intersection of global capital</h2>
              </div>

              <div className="flex flex-col gap-m mt-l md:mt-xl">
                <p className="text-p1">
                  London is where money is accumulated, structured, legitimized,
                  and redeployed&mdash;home to family offices, sovereign wealth
                  funds, hedge funds, commodity traders, private credit firms,
                  insurers, and the legal and financial infrastructure that
                  connects markets across continents.
                </p>
                <p className="text-p1">
                  Winning London means gaining distribution across Europe, the
                  Middle East, Africa, and beyond&mdash;making it the ideal
                  stage for the next chapter of Solana&apos;s growth.
                </p>
                <p className="text-p1">
                  Breakpoint 2026 brings the global Solana community to one of
                  the world&apos;s most influential financial centers.
                </p>
              </div>
            </div>

            {/* Image — right */}
            <div
              className="image-filter w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-full"
              style={{ "--tint": "#c9ff7c" } as React.CSSProperties}
            >
              <img
                src={assetPath("/img/tower-bridge.png")}
                alt="Tower Bridge, London"
              />
            </div>
          </div>
        </article>

        {/* ── BP25 Live Media ── */}
        <article className="px-s py-2xl md:py-3xl text-primary bg-null">
          <div className="md:grid md:grid-cols-2">
            <div className="flex flex-col gap-s">
              <p className="text-eyebrow text-byte">BP25 Live Media</p>
              <h2>Internet Capital Markets Are Here</h2>
            </div>

            <div className="hidden md:flex justify-end gap-3xs self-end">
              <CarouselArrow
                direction="prev"
                onClick={() => scrollLiveMedia("prev")}
              />
              <CarouselArrow
                direction="next"
                onClick={() => scrollLiveMedia("next")}
              />
            </div>
          </div>

          <div className="-mx-xs overflow-hidden md:mx-0 mt-l md:mt-xl">
            <div
              ref={liveMediaCarouselRef}
              className="embla__viewport flex gap-xs overflow-x-auto px-xs pb-xs snap-x snap-mandatory scroll-smooth md:px-0 md:pb-0 md:gap-s [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:[&>*:last-child]:mr-s [&>*:last-child]:mr-xs"
            >
              {liveMediaCards.map((card) => (
                <LiveMediaCard
                  key={card.headline}
                  card={card}
                  assetPath={assetPath}
                />
              ))}
            </div>
          </div>
        </article>

        {/* ── Logistics ── */}
        <article
          id="logistics"
          className="px-s py-2xl md:py-3xl text-primary bg-null"
        >
          <div className="flex flex-col gap-s">
            <p className="text-eyebrow">Logistics</p>
            <h2>Venue &amp; Dates</h2>
          </div>

          <div className="grid gap-xs md:grid-cols-3 mt-l md:mt-xl">
            <div className="border-1 border-wisp-10 p-s md:p-m bg-transparent-wisp-10 flex flex-col justify-between min-h-[8rem] md:min-h-[10rem]">
              <p className="text-eyebrow text-byte">Dates</p>
              <h4 className="mt-auto">November 15&ndash;17, 2026</h4>
            </div>
            <div className="border-1 border-wisp-10 p-s md:p-m bg-transparent-wisp-10 flex flex-col justify-between min-h-[8rem] md:min-h-[10rem]">
              <p className="text-eyebrow text-byte">Venue</p>
              <h4 className="mt-auto">Olympia London</h4>
            </div>
            <div className="border-1 border-wisp-10 p-s md:p-m bg-transparent-wisp-10 flex flex-col justify-between min-h-[8rem] md:min-h-[10rem]">
              <p className="text-eyebrow text-byte">Format</p>
              <h4 className="mt-auto">
                Keynotes, talks, demos, workshops, side events
              </h4>
            </div>
          </div>
        </article>

        {/* ── CTA ── */}
        <article className="px-s py-2xl md:py-3xl text-invert bg-mint">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-l md:gap-xl">
            <div className="flex flex-col gap-s md:max-w-[60%]">
              <p className="text-eyebrow">Be There</p>
              <h2>Breakpoint 2026 is coming</h2>
              <p className="text-p1">
                Sign up for updates and early registration details.
              </p>
            </div>
            <div className="flex flex-col gap-xs w-full md:w-auto md:min-w-[16rem]">
              <CTAButton
                type="button"
                onClick={() => setSubscribeOpen(true)}
                className="bg-null text-primary hover:bg-primary hover:text-invert"
              >
                Get Notified
              </CTAButton>
              <CTAButton
                href="https://solanafoundation.typeform.com/bp26sponsorform"
                className="bg-transparent border-1 border-primary-null/30 text-invert hover:bg-primary-null hover:text-primary"
              >
                Become a Sponsor
              </CTAButton>
            </div>
          </div>
        </article>
      </main>

      {/* ── Footer ── */}
      <footer className="container w-full font-macan-mono pt-2xl md:pt-4xl px-s">
        {/* Subscribe row */}
        <div className="text-primary md:flex md:flex-row md:items-center md:justify-between">
          <h3>Stay in the loop</h3>
          <div className="mt-xs md:mt-0 md:w-[452px]">
            <SubscribeForm
              className="flex"
              inputClassName="w-full h-[3rem] grow border-1 border-wisp-40 bg-transparent px-xs uppercase text-primary focus:outline-none focus:border-byte font-macan-mono text-[0.9375rem] tracking-[0.09375rem]"
              buttonClassName="shrink-0 cta cursor-pointer uppercase flex items-center justify-center cta-transition px-xs h-[3rem] bg-byte text-invert hover:bg-primary-wisp whitespace-nowrap disabled:opacity-50"
              successClassName="text-p1 text-byte"
              errorClassName="mt-xs text-p1 text-byte"
            />
          </div>
        </div>

        {/* Links & info row */}
        <div className="flex flex-col-reverse mt-xl md:mt-l md:flex-row md:justify-between">
          {/* Left: logo + copyright */}
          <div className="flex flex-col gap-m justify-end pt-m md:pt-0">
            <a
              href="https://solana.com"
              className="self-start block w-[18.2px]"
            >
              <LogoMark />
            </a>
            <div className="flex gap-[2px] md:justify-end text-button items-center">
              <CopyrightIcon />
              {`Solana Foundation ${new Date().getFullYear()}`}
            </div>
          </div>

          {/* Right: contact + code of conduct + social */}
          <div className="flex flex-col gap-m md:items-end">
            <a
              href="mailto:breakpoint@solana.org"
              className="text-button cta-transition hover:text-byte"
            >
              Contact Us
            </a>
            <a
              href="https://solana.com/code-of-conduct"
              target="_blank"
              rel="noopener noreferrer"
              className="text-button cta-transition hover:text-byte"
            >
              Code of Conduct
            </a>
            <div className="flex gap-xs">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-primary cta-transition hover:text-byte"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Large Breakpoint logo */}
        <img
          className="w-full pt-xl hidden md:block"
          alt="Solana Breakpoint Logo"
          src={assetPath("/assets/bp-logo.svg")}
        />
        <img
          className="w-full pt-xl md:hidden"
          alt="Solana Breakpoint Logo"
          src={assetPath("/assets/bg-logo-mobile-full.svg")}
        />
      </footer>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
      <SubscribeModal
        open={subscribeOpen}
        onClose={() => setSubscribeOpen(false)}
      />
    </>
  );
}
