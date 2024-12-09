import classNames from "classnames";
import { useState } from "react";
import Link from "next/link";
import * as Collapsible from "@radix-ui/react-collapsible";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import CaretIcon from "@/components/icons/Caret";

import styles from "./WalletCard.module.scss";

import ArrowUpRightIcon from "../../../../assets/wallets/arrow-up-right.inline.svg";

// Function to group keys into categories
const groupWalletData = (content) => {
  const groups = {
    "Wallet Type": ["custodial", "non_custodial", "hardware", "mpc"],
    "Financial Transactions": ["buy_crypto", "sell_crypto", "staking"],
    "Asset Management": ["hold_nfts", "gas_abstraction", "spending_limits"],
    "Security and Recovery": [
      "social_recovery",
      "open_source",
      "private_key_infrastructure",
    ],
    "Solana Tooling": ["te", "blinks_and_actions", "solana_pay"],
  };

  // Generate content for each group by filtering true values
  const groupedContent = Object.entries(groups).map(([groupName, keys]) => {
    const filteredKeys = keys.filter((key) => content[key] === true);
    return {
      groupName,
      values: filteredKeys,
    };
  });

  return groupedContent;
};

const Tag = ({ text }) => (
  <div className={styles.Tag}>
    <span>{text}</span>
  </div>
);

const Dot = () => <span className={styles.Dot}>•</span>;

const WalletCard = ({
  index,
  walletImage,
  name,
  websiteUrl,
  newToCrypto,
  developer,
  content,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);

  const tags = [];
  if (newToCrypto) tags.push(t("solutions-wallets-explorer.tags.beginner"));
  if (developer) tags.push(t("solutions-wallets-explorer.tags.developer"));

  const groupedContent = groupWalletData(content);

  const localize = (value) =>
    t(`solutions-wallets-explorer.wallet-filters.${value}`);

  // Map of group names to their corresponding icons
  const groupIcons = {
    "Wallet Type": (
      <Image
        src="/src/img/solana-wallets/WalletTypeIcon.inline.svg"
        width={17}
        height={17}
        alt={t("solutions-wallets-explorer.filter-icons.wallet-type-icon-alt")}
      />
    ),
    "Financial Transactions": (
      <Image
        src="/src/img/solana-wallets/FinancialTransactionsIcon.inline.svg"
        width={17}
        height={17}
        alt={t(
          "solutions-wallets-explorer.filter-icons.financial-transactions-icon-alt",
        )}
      />
    ),
    "Asset Management": (
      <Image
        src="/src/img/solana-wallets/AssetManagementIcon.inline.svg"
        width={17}
        height={17}
        alt={t(
          "solutions-wallets-explorer.filter-icons.asset-management-icon-alt",
        )}
      />
    ),
    "Security and Recovery": (
      <Image
        src="/src/img/solana-wallets/SecurityRecoveryIcon.inline.svg"
        width={17}
        height={17}
        alt={t(
          "solutions-wallets-explorer.filter-icons.security-recovery-icon-alt",
        )}
      />
    ),
    "Solana Tooling": (
      <Image
        src="/src/img/solana-wallets/SolanaToolingIcon.inline.svg"
        width={17}
        height={17}
        alt={t(
          "solutions-wallets-explorer.filter-icons.solana-tooling-icon-alt",
        )}
      />
    ),
  };

  const MobileCollapsibleContentRow = ({
    groupName,
    values,
    maxValuesShown,
  }) => {
    if (values.length === 0) return null;

    if (values.length === maxValuesShown) {
      return (
        <div className={styles.GroupedContent}>
          {groupIcons[groupName]}
          <p className={styles.GroupedContentText}>
            {values.map((value, index) => (
              <span key={`${groupName}-${index}`} className={styles.ValueGroup}>
                <span>{localize(value)}</span>
                {index === values.length - 1 ? null : <Dot />}
              </span>
            ))}
          </p>
        </div>
      );
    }

    if (values.length > maxValuesShown - 1) {
      return (
        <div className={styles.GroupedContent}>
          {groupIcons[groupName]}
          <p className={styles.GroupedContentText}>
            {values.slice(0, maxValuesShown).map((value, index) => (
              <span key={`${groupName}-${index}`} className={styles.ValueGroup}>
                <span>{localize(value)}</span>
                <Dot />
              </span>
            ))}
            <span>+{values.length - maxValuesShown}</span>
          </p>
        </div>
      );
    }

    return (
      <div className={styles.GroupedContent}>
        {groupIcons[groupName]}
        <p className={styles.GroupedContentText}>{localize(values[0])}</p>
      </div>
    );
  };

  const MobileTags = () => (
    <div className={classNames(styles.TagsWrapper, styles.MobileTags)}>
      {tags.length > 0 && (
        <div className={styles.Tags}>
          <Tag text={tags[0]} />
          {tags.length > 1 && (
            <span className={styles.ExtraTagsCount}>+{tags.length - 1}</span>
          )}
        </div>
      )}
    </div>
  );

  const DesktopTags = () => (
    <div className={classNames(styles.TagsWrapper, styles.DesktopTags)}>
      {tags.length > 0 && (
        <div className={styles.Tags}>
          {tags.map((tag, index) => (
            <Tag key={index} text={tag} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Collapsible.Root
      className="CollapsibleRoot"
      open={open}
      onOpenChange={setOpen}
    >
      <article data-index={index} className={styles.WalletCard}>
        <Collapsible.Trigger asChild>
          <button
            className={styles.CollapsibleTrigger}
            aria-label={t(
              "solutions-wallets-explorer.wallet-card-toggle-aria-label",
            )}
          >
            {open ? (
              <CaretIcon direction="down" />
            ) : (
              <CaretIcon direction="up" />
            )}
          </button>
        </Collapsible.Trigger>

        <div className={styles.WalletCardContainer}>
          <div className={styles.WalletCardImage}>
            <Link href={websiteUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src={walletImage}
                width={64}
                height={64}
                alt={name}
                className={styles["wallet-card-icon"]}
              />
            </Link>
          </div>

          <div className={styles.WalletCardContent}>
            <Link
              href={websiteUrl}
              className={styles.WalletCardTitle}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}
            </Link>

            <MobileTags />
            <DesktopTags />

            <Collapsible.Content>
              <div className={styles.MobileContent}>
                <MobileCollapsibleContentRow
                  groupName="Wallet Type"
                  values={groupedContent[0].values}
                />
                <MobileCollapsibleContentRow
                  groupName="Financial Transactions"
                  values={groupedContent[1].values}
                />
                <MobileCollapsibleContentRow
                  groupName="Asset Management"
                  values={groupedContent[2].values}
                />
                <MobileCollapsibleContentRow
                  groupName="Security and Recovery"
                  values={groupedContent[3].values}
                  maxValuesShown={1}
                />
                <MobileCollapsibleContentRow
                  groupName="Solana Tooling"
                  values={groupedContent[4].values}
                  maxValuesShown={1}
                />
              </div>

              <div className={styles.DesktopContent}>
                {groupedContent.map((group, index) => {
                  if (group.values.length === 0) return null;
                  return (
                    <div className={styles.GroupedContent} key={index}>
                      {groupIcons[group.groupName]}
                      <p className={styles.GroupedContentText}>
                        {group.values.map((value, index) => (
                          <span
                            key={`${group.groupName}-${index}`}
                            className={styles.ValueGroup}
                          >
                            <span>{localize(value)}</span>
                            {index === group.values.length - 1 ? null : <Dot />}
                          </span>
                        ))}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Collapsible.Content>

            <Link
              href={websiteUrl}
              className={styles.WalletCardLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("solutions-wallets-explorer.visit-website")}
              <ArrowUpRightIcon />
            </Link>
          </div>
        </div>
      </article>
    </Collapsible.Root>
  );
};

export default WalletCard;
