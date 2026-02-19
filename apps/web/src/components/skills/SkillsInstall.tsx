"use client";

import { useState } from "react";
import classNames from "classnames";
import Button from "@/components/shared/Button";
import styles from "./SkillsInstall.module.scss";

const INSTALL_METHODS = [
  {
    id: "curl",
    name: "cURL",
    command:
      "curl -sSL https://raw.githubusercontent.com/solana-foundation/solana-dev-skill/main/install.sh | bash",
  },
  {
    id: "git",
    name: "Git Clone",
    command:
      "git clone https://github.com/solana-foundation/solana-dev-skill.git ~/.config/claude/skills/solana-dev",
  },
  {
    id: "manual",
    name: "Manual",
    command:
      "# Download and place in your Claude skills directory\n# ~/.config/claude/skills/solana-dev/",
  },
];

export default function SkillsInstall() {
  const [activeMethod, setActiveMethod] = useState("curl");
  const [copied, setCopied] = useState(false);

  const currentMethod = INSTALL_METHODS.find((m) => m.id === activeMethod)!;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentMethod.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="install" className={classNames("py-10", styles["install"])}>
      <div className="container">
        <div className={styles["install__content"]}>
          <h2 className="h3 mb-4">Get Started</h2>
          <p className="subdued mb-6">
            Install the Solana Developer Skill to give your AI assistant
            specialized knowledge for building on Solana. Works with Claude,
            Cursor, and other AI development tools.
          </p>

          <div className={styles["install__methods"]}>
            {INSTALL_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setActiveMethod(method.id)}
                className={classNames(
                  styles["install__method"],
                  activeMethod === method.id &&
                    styles["install__method--active"],
                )}
              >
                {method.name}
              </button>
            ))}
          </div>

          <div className={styles["install__code"]}>
            <pre className={styles["install__pre"]}>
              <code>{currentMethod.command}</code>
            </pre>
            <button
              onClick={copyToClipboard}
              className={styles["install__copy"]}
              aria-label="Copy to clipboard"
            >
              {copied ? "✓" : "📋"}
            </button>
          </div>

          <div className={styles["install__features"]}>
            <div className={styles["install__feature"]}>
              <div className={styles["install__feature-icon"]}>📚</div>
              <h3 className={styles["install__feature-title"]}>
                Comprehensive Coverage
              </h3>
              <p className={styles["install__feature-desc"]}>
                From frontend to smart contracts, testing to security
              </p>
            </div>
            <div className={styles["install__feature"]}>
              <div className={styles["install__feature-icon"]}>🔄</div>
              <h3 className={styles["install__feature-title"]}>
                Always Updated
              </h3>
              <p className={styles["install__feature-desc"]}>
                Reflects latest Solana best practices and APIs
              </p>
            </div>
            <div className={styles["install__feature"]}>
              <div className={styles["install__feature-icon"]}>⚡</div>
              <h3 className={styles["install__feature-title"]}>
                Framework-Kit First
              </h3>
              <p className={styles["install__feature-desc"]}>
                Modern @solana/kit patterns over legacy web3.js
              </p>
            </div>
          </div>

          <div className="mt-6 d-flex gap-3 flex-wrap justify-content-center">
            <Button
              to="https://github.com/solana-foundation/solana-dev-skill"
              newTab
              size="large"
              variant="secondary"
            >
              View Documentation
            </Button>
            <Button
              to="https://github.com/solana-foundation/solana-dev-skill/issues"
              newTab
              size="large"
              variant="outline"
            >
              Report Issues
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
