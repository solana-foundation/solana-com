import { TICKET_TRANSFER_HREF } from "@/content/links";

export type FAQPageItem = {
  id: string;
  question: string;
  answer: string;
  answerHref?: string;
  answerLinkLabel?: string;
};

export type FAQPageSection = {
  id: string;
  title: string;
  items: FAQPageItem[];
};

export const faqPageMetadata = {
  title: "FAQ | Breakpoint 2026",
  description:
    "Answers to common Breakpoint 2026 questions about the event, tickets, travel, and attending in London.",
};

export const faqPageSections = [
  {
    id: "general",
    title: "General",
    items: [
      {
        id: "general-location",
        question: "Where is Breakpoint located this year?",
        answer:
          "Breakpoint 2026 will take place at Olympia Convention Centre in London.",
      },
      {
        id: "general-speaking",
        question: "How can I apply to speak at Breakpoint?",
        answer:
          "Speaker applications are not open yet. More information will be shared in the coming months.",
      },
      {
        id: "general-press",
        question: "How can I apply for press access?",
        answer:
          "Press registration details will be announced closer to the event. For urgent media requests, contact breakpoint@solana.org.",
      },
      {
        id: "general-contact",
        question: "Who do I contact with questions?",
        answer:
          "Email breakpoint@solana.org and the team will route your question to the right person.",
      },
    ],
  },
  {
    id: "tickets",
    title: "Tickets",
    items: [
      {
        id: "tickets-included",
        question: "What is included in my Breakpoint ticket?",
        answer:
          "Your ticket includes access to main conference programming, networking areas, and on-site experiences. Food and beverages will be available on-site.",
      },
      {
        id: "tickets-refundable",
        question: "Are tickets refundable?",
        answer:
          "Tickets are non-refundable but are transferable. If you've purchased a ticket, you can transfer it",
        answerHref: TICKET_TRANSFER_HREF,
        answerLinkLabel: "here",
      },
      {
        id: "tickets-developer-student",
        question: "Are developer and student tickets available?",
        answer:
          "Yes. Developers and active higher education students can apply for discounted Breakpoint tickets through the registration page.",
      },
      {
        id: "tickets-pricing",
        question: "When do ticket prices change?",
        answer:
          "The current general admission flash sale ends on June 1. Late bird general admission pricing begins September 1.",
      },
      {
        id: "tickets-transfer",
        question: "Can I transfer my ticket?",
        answer:
          "Yes. If you purchased through Lu.ma, use the transfer tools in your ticket confirmation to assign the ticket to another attendee.",
        answerHref: TICKET_TRANSFER_HREF,
        answerLinkLabel: "assign the ticket to another attendee",
      },
      {
        id: "tickets-side-events",
        question: "Do I need a ticket for side events?",
        answer:
          "Some side events require a separate RSVP. Check the event listing before attending, even if you already have a Breakpoint ticket.",
      },
    ],
  },
  {
    id: "travel",
    title: "Travel",
    items: [
      {
        id: "travel-airport",
        question: "Which airport should I fly into?",
        answer:
          "London City, Heathrow, and Gatwick all connect to Olympia by public transport, taxi, or rideshare. Choose the route that works best for your arrival city.",
      },
      {
        id: "travel-hotels",
        question: "Are hotel recommendations available?",
        answer:
          "Yes. The travel page lists hotel recommendations with approximate travel times to Olympia Convention Centre.",
      },
      {
        id: "travel-visa",
        question: "Do I need a visa to attend?",
        answer:
          "Entry requirements depend on your passport and travel plans. Review the official UK visa checker before booking travel.",
      },
      {
        id: "travel-venue",
        question: "How do I get to Olympia Convention Centre?",
        answer:
          "Olympia is connected by London public transport and is also reachable by taxi or rideshare from central London.",
      },
      {
        id: "travel-london",
        question: "What should I do while in London?",
        answer:
          "The travel page includes nearby recommendations like the Science Museum, Design Museum, and Tate Modern.",
      },
      {
        id: "travel-visa-support",
        question: "Can Solana Foundation help with visas?",
        answer:
          "Attendees are responsible for their own visa process. Solana Foundation has engaged Immigration Advice Service for attendees who need paid visa support.",
      },
    ],
  },
] satisfies FAQPageSection[];
