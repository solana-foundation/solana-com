/**
 * General types that are used through out the site
 */

/**
 * Default props available on most reusable components
 */
export type SimpleComponentProps<T> = T & {
  /** children component to include */
  children?: React.ReactNode;
  /** class name styles to apply */
  className?: string;
};

/**
 *
 */
export type BreadcrumbItem = {
  href?: string;
  title?: string;
  label: string;
};

/**
 *
 */
export type ComponentWithBreadcrumbs = SimpleComponentProps<{
  breadcrumbs: BreadcrumbItem[];
}>;
