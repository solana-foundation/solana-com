import { useTranslations } from "next-intl";
import { Link } from "./link";
import { HeaderItem } from "./header-item";
import { HeaderBanner } from "./header-banner";
import { CollapseMenu } from "./collapse-menu";
import type { NavItemDefinition, NavPromoDefinition } from "./nav-types";

export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="pt-2 pb-3 xl:pt-1 xl:pb-3 font-brand-mono font-medium text-white/45 text-[11px] tracking-[0.12em] uppercase">
      {title}
    </div>
  );
}

export function NavItemLink({ item }: { item: NavItemDefinition }) {
  const t = useTranslations();

  return (
    <Link
      to={item.href}
      className="block no-underline text-inherit group/link"
      activeClassName="active"
      partiallyActive={item.partiallyActive}
      partiallyActiveIgnore={item.partiallyActiveIgnore}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
    >
      <HeaderItem
        title={t(item.titleKey)}
        description={item.descriptionKey ? t(item.descriptionKey) : undefined}
        Icon={item.icon}
        variant={item.variant}
      />
    </Link>
  );
}

export function NavItemsList({ items }: { items: NavItemDefinition[] }) {
  return (
    <div className="divide-y divide-[rgba(238,228,255,0.04)]">
      {items.map((item) => (
        <NavItemLink key={item.id} item={item} />
      ))}
    </div>
  );
}

export function NavColumns({ columns }: { columns: NavItemDefinition[][] }) {
  return (
    <div className="flex flex-col xl:flex-row xl:gap-5 max-xl:divide-y max-xl:divide-[rgba(238,228,255,0.04)]">
      {columns.map((column, index) => (
        <div
          key={index}
          className="divide-y divide-[rgba(238,228,255,0.04)] flex-1"
        >
          {column.map((item) => (
            <NavItemLink key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CollapsibleNavGroup({
  title,
  isMobile,
  children,
  className = "",
}: {
  title: string;
  isMobile?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CollapseMenu
      className={`text-[rgba(255,255,255,0.64)] data-[state=open]:text-white ${className}`.trim()}
      title={
        <div className="py-3 xl:pt-1 xl:pb-3 font-brand-mono font-medium text-[11px] tracking-[0.12em] uppercase">
          {title}
        </div>
      }
      alwaysOpen={!isMobile}
    >
      {children}
    </CollapseMenu>
  );
}

export function NavSectionPromo({ promo }: { promo?: NavPromoDefinition }) {
  const t = useTranslations();

  if (!promo) {
    return null;
  }

  if (promo.expiresAt && new Date() >= new Date(promo.expiresAt)) {
    return null;
  }

  const content = t.raw(promo.translationKey) as {
    title?: string;
    description?: string;
    cta?: string;
    location?: string;
    date?: string;
  };
  const Logo = promo.Logo;

  return (
    <HeaderBanner
      className={promo.className}
      backgroundClassName={promo.backgroundClassName}
      logo={
        Logo ? (
          <Logo width={promo.logoWidth} height={promo.logoHeight} />
        ) : undefined
      }
      title={content?.title}
      description={content?.description}
      cta={content?.cta}
      ctaHref={promo.href}
      location={content?.location}
      date={content?.date}
    />
  );
}
