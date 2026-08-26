// Lorem ipsum dolor sit amet, consectetur adipiscing elit.
// Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
// Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

export type FaqRef = {
  type: string;
  label: string;
  href?: string;
};

export type FaqItem = {
  q: string;
  tldr: string;
  a: string;
  refs?: FaqRef[];
};

export type FaqTopic = {
  topic: string;
  icon: string;
  items: FaqItem[];
};

const GLOSSARY: Record<string, string> = {
  "Token Extensions":
    "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Confidential Balances":
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
  "Private Channels":
    "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
  CCTP: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
  DvP: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.",
  "Token ACL":
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "RPC providers":
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
};

function T(name: keyof typeof GLOSSARY): string {
  return `<span class="faq-term" tabindex="0" data-tip="${GLOSSARY[name]}">${name}</span>`;
}

export const FAQ_TOPICS: FaqTopic[] = [
  {
    topic: "Chain Migration",
    icon: "⇄",
    items: [
      {
        q: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore?",
        tldr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        refs: [
          { type: "Docs", label: "Lorem ipsum dolor", href: "#" },
          { type: "Docs", label: "Consectetur adipiscing elit", href: "#" },
        ],
        a: `<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. ${T("Token Extensions")} totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p><p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>`,
      },
      {
        q: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo?",
        tldr: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        refs: [
          { type: "Web", label: "Sed do eiusmod", href: "#" },
          { type: "Web", label: "Tempor incididunt", href: "#" },
        ],
        a: `<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
      },
      {
        q: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
        tldr: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        refs: [
          { type: "Docs", label: "Ut labore et dolore", href: "#" },
          { type: "Report", label: "Magna aliqua veniam", href: "#" },
        ],
        a: `<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`,
      },
      {
        q: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim?",
        tldr: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        refs: [
          { type: "Docs", label: "Quis nostrud exercitation", href: "#" },
          { type: "Web", label: "Ullamco laboris nisi", href: "#" },
        ],
        a: `<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. ${T("Confidential Balances")} at vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
      },
      {
        q: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium?",
        tldr: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
        refs: [{ type: "Docs", label: "Aliquip ex ea commodo", href: "#" }],
        a: `<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><ul><li><strong>Lorem ipsum dolor</strong> — Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</li><li><strong>Lorem ipsum dolor</strong> — At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</li></ul>`,
      },
    ],
  },
  {
    topic: "Privacy",
    icon: "◐",
    items: [
      {
        q: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur?",
        tldr: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
        refs: [
          { type: "Docs", label: "Duis aute irure", href: "#" },
          { type: "Report", label: "Lorem ipsum dolor", href: "#" },
        ],
        a: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`,
      },
      {
        q: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit?",
        tldr: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.",
        refs: [
          { type: "Docs", label: "Consectetur adipiscing elit", href: "#" },
          { type: "Report", label: "Sed do eiusmod", href: "#" },
        ],
        a: `<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. ${T("Private Channels")} at vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
      },
      {
        q: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum?",
        tldr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        refs: [
          { type: "Report", label: "Tempor incididunt", href: "#" },
          { type: "Docs", label: "Ut labore et dolore", href: "#" },
        ],
        a: `<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`,
      },
      {
        q: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore?",
        tldr: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        refs: [{ type: "Web", label: "Magna aliqua veniam", href: "#" }],
        a: `<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>`,
      },
      {
        q: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo?",
        tldr: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        refs: [{ type: "Docs", label: "Quis nostrud exercitation", href: "#" }],
        a: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ${T("CCTP")} ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
      },
      {
        q: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
        tldr: "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        refs: [
          { type: "Docs", label: "Ullamco laboris nisi", href: "#" },
          { type: "Guide", label: "Aliquip ex ea commodo", href: "#" },
        ],
        a: `<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
      },
      {
        q: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim?",
        tldr: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
        refs: [
          { type: "Docs", label: "Duis aute irure", href: "#" },
          { type: "Report", label: "Lorem ipsum dolor", href: "#" },
        ],
        a: `<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p><p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>`,
      },
    ],
  },
  {
    topic: "Tokenized Funds & RWA",
    icon: "◈",
    items: [
      {
        q: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium?",
        tldr: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
        refs: [
          { type: "GitHub", label: "Consectetur adipiscing elit", href: "#" },
          { type: "News", label: "Sed do eiusmod", href: "#" },
        ],
        a: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ${T("DvP")} ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
      },
      {
        q: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur?",
        tldr: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        refs: [
          { type: "Docs", label: "Tempor incididunt", href: "#" },
          { type: "Docs", label: "Ut labore et dolore", href: "#" },
        ],
        a: `<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p><p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>`,
      },
      {
        q: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit?",
        tldr: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        refs: [{ type: "Docs", label: "Magna aliqua veniam", href: "#" }],
        a: `<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p>`,
      },
      {
        q: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum?",
        tldr: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        refs: [{ type: "Docs", label: "Quis nostrud exercitation", href: "#" }],
        a: `<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ${T("Token ACL")} excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`,
      },
      {
        q: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore?",
        tldr: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        refs: [{ type: "Docs", label: "Ullamco laboris nisi", href: "#" }],
        a: `<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>`,
      },
      {
        q: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo?",
        tldr: "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
        refs: [{ type: "Docs", label: "Aliquip ex ea commodo", href: "#" }],
        a: `<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
      },
      {
        q: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
        tldr: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
        refs: [
          { type: "Docs", label: "Duis aute irure", href: "#" },
          { type: "Docs", label: "Lorem ipsum dolor", href: "#" },
        ],
        a: `<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. ${T("RPC providers")} totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p><p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>`,
      },
    ],
  },
  {
    topic: "Payments & Settlement",
    icon: "⚡",
    items: [
      {
        q: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim?",
        tldr: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.",
        refs: [
          { type: "Docs", label: "Consectetur adipiscing elit", href: "#" },
          { type: "Docs", label: "Sed do eiusmod", href: "#" },
        ],
        a: `<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p>`,
      },
      {
        q: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium?",
        tldr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        refs: [
          { type: "Docs", label: "Tempor incididunt", href: "#" },
          { type: "Web", label: "Ut labore et dolore", href: "#" },
        ],
        a: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
      },
      {
        q: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur?",
        tldr: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        refs: [
          { type: "Web", label: "Magna aliqua veniam", href: "#" },
          { type: "Docs", label: "Quis nostrud exercitation", href: "#" },
        ],
        a: `<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. ${T("Token Extensions")} totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p><p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>`,
      },
      {
        q: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit?",
        tldr: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        refs: [
          { type: "Docs", label: "Ullamco laboris nisi", href: "#" },
          { type: "Docs", label: "Aliquip ex ea commodo", href: "#" },
        ],
        a: `<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p>`,
      },
      {
        q: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum?",
        tldr: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        refs: [
          { type: "Docs", label: "Duis aute irure", href: "#" },
          { type: "Docs", label: "Lorem ipsum dolor", href: "#" },
        ],
        a: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
      },
      {
        q: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore?",
        tldr: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
        refs: [
          { type: "Docs", label: "Consectetur adipiscing elit", href: "#" },
        ],
        a: `<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. ${T("Confidential Balances")} neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>`,
      },
      {
        q: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo?",
        tldr: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
        refs: [
          { type: "Docs", label: "Sed do eiusmod", href: "#" },
          { type: "Docs", label: "Tempor incididunt", href: "#" },
        ],
        a: `<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p>`,
      },
      {
        q: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
        tldr: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.",
        refs: [
          { type: "Docs", label: "Ut labore et dolore", href: "#" },
          { type: "Upgrade", label: "Magna aliqua veniam", href: "#" },
        ],
        a: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
      },
    ],
  },
  {
    topic: "Custody, Compliance & Yield",
    icon: "⬡",
    items: [
      {
        q: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim?",
        tldr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        refs: [
          { type: "Docs", label: "Quis nostrud exercitation", href: "#" },
          { type: "News", label: "Cillum dolore fugiat", href: "#" },
        ],
        a: `<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. ${T("Private Channels")} neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p><p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p>`,
      },
      {
        q: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium?",
        tldr: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        refs: [
          { type: "Docs", label: "Ullamco laboris nisi", href: "#" },
          { type: "Docs", label: "Aliquip ex ea commodo", href: "#" },
        ],
        a: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
      },
      {
        q: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur?",
        tldr: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        refs: [
          { type: "Docs", label: "Duis aute irure", href: "#" },
          { type: "Docs", label: "Lorem ipsum dolor", href: "#" },
        ],
        a: `<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`,
      },
      {
        q: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit?",
        tldr: "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        a: `<p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. ${T("CCTP")} at vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</p>`,
      },
      {
        q: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum?",
        tldr: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
        refs: [
          { type: "Docs", label: "Consectetur adipiscing elit", href: "#" },
          { type: "News", label: "Sed do eiusmod", href: "#" },
        ],
        a: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><ul><li><strong>Lorem ipsum dolor</strong> — Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</li><li><strong>Lorem ipsum dolor</strong> — At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.</li><li><strong>Lorem ipsum dolor</strong> — Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li></ul>`,
      },
      {
        q: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore?",
        tldr: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
        a: `<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>`,
      },
      {
        q: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo?",
        tldr: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        refs: [
          { type: "Docs", label: "Tempor incididunt", href: "#" },
          { type: "Docs", label: "Ut labore et dolore", href: "#" },
        ],
        a: `<p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. ${T("DvP")} quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</p><p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
      },
      {
        q: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur?",
        tldr: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        refs: [
          { type: "News", label: "Magna aliqua veniam", href: "#" },
          { type: "News", label: "Quis nostrud exercitation", href: "#" },
        ],
        a: `<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>`,
      },
    ],
  },
];

export const FAQ_TOTAL = FAQ_TOPICS.reduce(
  (total, topic) => total + topic.items.length,
  0,
);
