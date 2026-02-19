"use client";

import { useState } from "react";
import classNames from "classnames";
import styles from "./SkillsGrid.module.scss";

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  filename: string;
}

const SKILLS_DATA: Skill[] = [
  {
    id: "solana-dev",
    name: "Solana Development",
    description:
      "End-to-end Solana development playbook. Covers framework-kit, wallet connections, Anchor/Pinocchio programs, testing, and security.",
    category: "Core",
    icon: "🚀",
    filename: "SKILL.md",
  },
  {
    id: "frontend",
    name: "Frontend Framework Kit",
    description:
      "Build React/Next.js apps with @solana/client and @solana/react-hooks. Wallet Standard-first discovery and transaction UX.",
    category: "Frontend",
    icon: "⚛️",
    filename: "frontend-framework-kit.md",
  },
  {
    id: "anchor",
    name: "Anchor Programs",
    description:
      "Smart contract development with Anchor. Account validation, PDAs, CPIs, error handling, and Token-2022 compatibility.",
    category: "Programs",
    icon: "⚓",
    filename: "programs-anchor.md",
  },
  {
    id: "pinocchio",
    name: "Pinocchio Programs",
    description:
      "High-performance programs with Pinocchio. Minimal binary size, zero dependencies, fine-grained CU optimization.",
    category: "Programs",
    icon: "🎭",
    filename: "programs-pinocchio.md",
  },
  {
    id: "testing",
    name: "Testing",
    description:
      "Test Solana programs with LiteSVM, Mollusk, and Surfpool. Unit testing, integration testing, and CI/CD setup.",
    category: "Testing",
    icon: "🧪",
    filename: "testing.md",
  },
  {
    id: "security",
    name: "Security",
    description:
      "Security checklist for Solana programs. Common vulnerabilities, audit preparation, and best practices.",
    category: "Security",
    icon: "🔒",
    filename: "security.md",
  },
  {
    id: "payments",
    name: "Payments",
    description:
      "Implement payment flows on Solana. SOL transfers, SPL tokens, and payment verification patterns.",
    category: "DeFi",
    icon: "💳",
    filename: "payments.md",
  },
  {
    id: "confidential",
    name: "Confidential Transfers",
    description:
      "Token-2022 ZK extension for confidential transfers. Privacy-preserving token operations.",
    category: "Advanced",
    icon: "🔐",
    filename: "confidential-transfers.md",
  },
  {
    id: "idl-codegen",
    name: "IDL & Codegen",
    description:
      "Generate typed clients from IDLs with Codama. Auto-generate instruction builders and account parsers.",
    category: "Tooling",
    icon: "⚙️",
    filename: "idl-codegen.md",
  },
  {
    id: "kit-interop",
    name: "Kit ↔ Web3.js Interop",
    description:
      "Bridge @solana/kit and legacy web3.js code. Adapter patterns for gradual migration.",
    category: "Migration",
    icon: "🔄",
    filename: "kit-web3-interop.md",
  },
];

const CATEGORIES = [
  "All",
  "Core",
  "Frontend",
  "Programs",
  "Testing",
  "Security",
  "DeFi",
  "Advanced",
  "Tooling",
  "Migration",
];

export default function SkillsGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = SKILLS_DATA.filter((skill) => {
    const matchesCategory =
      selectedCategory === "All" || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className={classNames("py-10", styles["skills"])}>
      <div className="container">
        <div className={styles["skills__header"]}>
          <h2 className="h3 mb-4">Browse Skills</h2>

          {/* Search */}
          <div className={styles["skills__search"]}>
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles["skills__search-input"]}
            />
          </div>

          {/* Category filters */}
          <div className={styles["skills__filters"]}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={classNames(
                  styles["skills__filter"],
                  selectedCategory === category &&
                    styles["skills__filter--active"],
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles["skills__grid"]}>
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className={styles["skills__empty"]}>
            <p>No skills found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const githubUrl = `https://github.com/solana-foundation/solana-dev-skill/blob/main/skill/${skill.filename}`;

  return (
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles["skill-card"]}
    >
      <div className={styles["skill-card__icon"]}>{skill.icon}</div>
      <div className={styles["skill-card__content"]}>
        <div className={styles["skill-card__header"]}>
          <h3 className={styles["skill-card__title"]}>{skill.name}</h3>
          <span className={styles["skill-card__category"]}>
            {skill.category}
          </span>
        </div>
        <p className={styles["skill-card__description"]}>{skill.description}</p>
      </div>
      <div className={styles["skill-card__arrow"]}>→</div>
    </a>
  );
}
