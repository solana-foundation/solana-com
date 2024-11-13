import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import CollapsibleContent from "@/components/solutions/wallets-explorer/CollapsibleContent";

import XIcon from "../../../../assets/wallets/x.inline.svg";

import styles from "./Filters.module.scss";

const CloseButton = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <XIcon />
    </button>
  );
};

const ToggleFormField = ({ key, label, id, checked, onChange }) => (
  <div key={key} className={styles.FormField}>
    <p
      className={`${styles.FormFieldLabel} ${checked ? styles.LabelChecked : ""}`}
    >
      {label}
    </p>
    <div className={styles.SwitchWrapper}>
      <input
        className={`${styles.Checkbox}`}
        type="checkbox"
        name="filters"
        value={id}
        checked={checked}
        onChange={onChange}
      />
      <label className={`${styles.Switch}`} htmlFor={id}>
        <span className="visually-hidden">{label}</span>
      </label>
    </div>
  </div>
);

export const MobileFilters = ({
  filterState,
  toggleFilterActiveState,
  resetWalletsAndFilters,
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  // Active filters count
  const activeFiltersCount = filterState.filter(
    (filter) => filter.checked,
  ).length;

  // Categories
  const beginnerFilters = filterState.filter(
    (filter) => filter.category === "beginner",
  );
  const advancedFilters = filterState.filter(
    (filter) => filter.category === "advanced",
  );

  // Advanced filters are further categorized into subcategories
  const walletTypeFilters = advancedFilters.filter(
    (filter) => filter.subCategory === "wallet_type",
  );
  const financialTransactionFilters = advancedFilters.filter(
    (filter) => filter.subCategory === "financial_transaction",
  );
  const assetManagementFilters = advancedFilters.filter(
    (filter) => filter.subCategory === "asset_management",
  );
  const securityRecoveryFilters = advancedFilters.filter(
    (filter) => filter.subCategory === "security_recovery",
  );
  const toolingFilters = advancedFilters.filter(
    (filter) => filter.subCategory === "tooling",
  );

  const handleMenuToggle = () => {
    !open
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "auto");
    setOpen(!open);
  };

  return (
    <div className={styles.MobileFilters}>
      <button
        className={styles.MobileFiltersMenuToggle}
        onClick={handleMenuToggle}
      >
        {t("solutions-wallets-explorer.filters")}{" "}
        <span>({`${activeFiltersCount}`})</span>
      </button>

      <div className={styles.MobileFiltersMenu} data-open={`${open}`}>
        <header>
          <h2 className={styles.HeaderTitle}>
            {t("solutions-wallets-explorer.filters")}
          </h2>
          <CloseButton onClick={handleMenuToggle} />
        </header>

        <div className={styles.Fieldsets}>
          <div className={styles.FieldsetsInner}>
            <div>
              <CollapsibleContent
                label={t("solutions-wallets-explorer.beginner-capabilities")}
                defaultOpen={true}
              >
                {beginnerFilters.length &&
                  beginnerFilters.map((filter, index) => (
                    <ToggleFormField
                      key={`beginner-${index}`}
                      label={filter.title}
                      id={filter.filterKey}
                      checked={filter.checked}
                      onChange={() => toggleFilterActiveState(filter.id)}
                    />
                  ))}
              </CollapsibleContent>
            </div>

            <div>
              <CollapsibleContent
                label={t("solutions-wallets-explorer.advanced-capabilities")}
                defaultOpen={true}
              >
                <CollapsibleContent
                  label={t("solutions-wallets-explorer.wallet-type")}
                >
                  {walletTypeFilters.length &&
                    walletTypeFilters.map((filter, index) => (
                      <ToggleFormField
                        key={`wallet-type-${index}`}
                        label={filter.title}
                        id={filter.filterKey}
                        checked={filter.checked}
                        onChange={() => toggleFilterActiveState(filter.id)}
                      />
                    ))}
                </CollapsibleContent>

                <CollapsibleContent
                  label={t("solutions-wallets-explorer.financial-transactions")}
                >
                  {financialTransactionFilters.length &&
                    financialTransactionFilters.map((filter, index) => (
                      <ToggleFormField
                        key={`financial-transaction-${index}`}
                        label={filter.title}
                        id={filter.filterKey}
                        checked={filter.checked}
                        onChange={() => toggleFilterActiveState(filter.id)}
                      />
                    ))}
                </CollapsibleContent>

                <CollapsibleContent
                  label={t("solutions-wallets-explorer.asset-management")}
                >
                  {assetManagementFilters.length &&
                    assetManagementFilters.map((filter, index) => (
                      <ToggleFormField
                        key={`asset-management-${index}`}
                        label={filter.title}
                        id={filter.filterKey}
                        checked={filter.checked}
                        onChange={() => toggleFilterActiveState(filter.id)}
                      />
                    ))}
                </CollapsibleContent>

                <CollapsibleContent
                  label={t("solutions-wallets-explorer.security-recovery")}
                >
                  {securityRecoveryFilters.length &&
                    securityRecoveryFilters.map((filter, index) => (
                      <ToggleFormField
                        key={`security-recovery-${index}`}
                        label={filter.title}
                        id={filter.filterKey}
                        checked={filter.checked}
                        onChange={() => toggleFilterActiveState(filter.id)}
                      />
                    ))}
                </CollapsibleContent>

                <CollapsibleContent
                  label={t("solutions-wallets-explorer.solana-tooling")}
                >
                  {toolingFilters.length &&
                    toolingFilters.map((filter, index) => (
                      <ToggleFormField
                        key={`tooling-${index}`}
                        label={filter.title}
                        id={filter.filterKey}
                        checked={filter.checked}
                        onChange={() => toggleFilterActiveState(filter.id)}
                      />
                    ))}
                </CollapsibleContent>
              </CollapsibleContent>
            </div>
          </div>
        </div>

        <div className={styles.Actions}>
          <div className={styles.ActionsInner}>
            <button
              className={styles.ActionButton}
              onClick={resetWalletsAndFilters}
            >
              {t("solutions-wallets-explorer.reset-btn")}
            </button>
            <button
              className={styles.ActionButton}
              style={{ background: "white", color: "#0F0A16" }}
              onClick={handleMenuToggle}
            >
              {t("solutions-wallets-explorer.apply-btn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DesktopFilters = ({
  filterState,
  toggleFilterActiveState,
  resetWalletsAndFilters,
}) => {
  const { t } = useTranslation();

  // Active filters count
  const activeFiltersCount = filterState.filter(
    (filter) => filter.checked,
  ).length;

  // Categories
  const beginnerFilters = filterState.filter(
    (filter) => filter.category === "beginner",
  );
  const advancedFilters = filterState.filter(
    (filter) => filter.category === "advanced",
  );

  // Advanced filters are further categorized into subcategories
  const walletTypeFilters = advancedFilters.filter(
    (filter) => filter.subCategory === "wallet_type",
  );
  const financialTransactionFilters = advancedFilters.filter(
    (filter) => filter.subCategory === "financial_transaction",
  );
  const assetManagementFilters = advancedFilters.filter(
    (filter) => filter.subCategory === "asset_management",
  );
  const securityRecoveryFilters = advancedFilters.filter(
    (filter) => filter.subCategory === "security_recovery",
  );
  const toolingFilters = advancedFilters.filter(
    (filter) => filter.subCategory === "tooling",
  );

  return (
    <div className={styles.DesktopFilters}>
      <div className={styles.DesktopFiltersMenu}>
        <header className={styles.DesktopFiltersHeader}>
          <p className={styles.DesktopFiltersCount}>
            {t("solutions-wallets-explorer.filters")} ({activeFiltersCount})
          </p>
          <button
            className={styles.DesktopActionButton}
            onClick={resetWalletsAndFilters}
          >
            {t("solutions-wallets-explorer.reset-btn")}
          </button>
        </header>

        <div className={styles.DesktopFieldsets}>
          <div className={styles.DesktopFieldsetsInner}>
            <div className={styles.DesktopFieldsetOne}>
              <CollapsibleContent defaultOpen={true}>
                {beginnerFilters.length &&
                  beginnerFilters.map((filter, index) => (
                    <ToggleFormField
                      key={`beginner-${index}`}
                      label={filter.title}
                      id={filter.filterKey}
                      checked={filter.checked}
                      onChange={() => toggleFilterActiveState(filter.id)}
                    />
                  ))}
              </CollapsibleContent>
            </div>

            <div className={styles.DesktopFieldsetTwo}>
              <CollapsibleContent
                label={t("solutions-wallets-explorer.advanced-capabilities")}
                defaultOpen={true}
                classes={styles.Parent}
              >
                <CollapsibleContent
                  label={t("solutions-wallets-explorer.wallet-type")}
                  defaultOpen={true}
                  icon={
                    <Image
                      src="/src/img/solana-wallets/WalletTypeIconMenu.inline.svg"
                      width={16}
                      height={16}
                    />
                  }
                  classes={styles.FirstChild}
                >
                  {walletTypeFilters.length &&
                    walletTypeFilters.map((filter, index) => (
                      <ToggleFormField
                        key={`wallet-type-${index}`}
                        label={filter.title}
                        id={filter.filterKey}
                        checked={filter.checked}
                        onChange={() => toggleFilterActiveState(filter.id)}
                      />
                    ))}
                </CollapsibleContent>

                <CollapsibleContent
                  label={t("solutions-wallets-explorer.financial-transactions")}
                  defaultOpen={true}
                  icon={
                    <Image
                      src="/src/img/solana-wallets/FinancialTransactionsIconMenu.inline.svg"
                      width={16}
                      height={16}
                    />
                  }
                  classes={styles.Child}
                >
                  {financialTransactionFilters.length &&
                    financialTransactionFilters.map((filter, index) => (
                      <ToggleFormField
                        key={`financial-transaction-${index}`}
                        label={filter.title}
                        id={filter.filterKey}
                        checked={filter.checked}
                        onChange={() => toggleFilterActiveState(filter.id)}
                      />
                    ))}
                </CollapsibleContent>

                <CollapsibleContent
                  label={t("solutions-wallets-explorer.asset-management")}
                  defaultOpen={true}
                  icon={
                    <Image
                      src="/src/img/solana-wallets/AssetManagementIconMenu.inline.svg"
                      width={16}
                      height={16}
                    />
                  }
                  classes={styles.Child}
                >
                  {assetManagementFilters.length &&
                    assetManagementFilters.map((filter, index) => (
                      <ToggleFormField
                        key={`asset-management-${index}`}
                        label={filter.title}
                        id={filter.filterKey}
                        checked={filter.checked}
                        onChange={() => toggleFilterActiveState(filter.id)}
                      />
                    ))}
                </CollapsibleContent>

                <CollapsibleContent
                  label={t("solutions-wallets-explorer.security-recovery")}
                  defaultOpen={true}
                  icon={
                    <Image
                      src="/src/img/solana-wallets/SecurityRecoveryIconMenu.inline.svg"
                      width={16}
                      height={16}
                    />
                  }
                  classes={styles.Child}
                >
                  {securityRecoveryFilters.length &&
                    securityRecoveryFilters.map((filter, index) => (
                      <ToggleFormField
                        key={`security-recovery-${index}`}
                        label={filter.title}
                        id={filter.filterKey}
                        checked={filter.checked}
                        onChange={() => toggleFilterActiveState(filter.id)}
                      />
                    ))}
                </CollapsibleContent>

                <CollapsibleContent
                  label={t("solutions-wallets-explorer.solana-tooling")}
                  defaultOpen={true}
                  icon={
                    <Image
                      src="/src/img/solana-wallets/SolanaToolingIconMenu.inline.svg"
                      width={16}
                      height={16}
                    />
                  }
                  classes={styles.Child}
                >
                  {toolingFilters.length &&
                    toolingFilters.map((filter, index) => (
                      <ToggleFormField
                        key={`tooling-${index}`}
                        label={filter.title}
                        id={filter.filterKey}
                        checked={filter.checked}
                        onChange={() => toggleFilterActiveState(filter.id)}
                      />
                    ))}
                </CollapsibleContent>
              </CollapsibleContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
