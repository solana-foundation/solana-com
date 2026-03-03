const StyledCaption = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`font-brand-mono text-sm leading-4 ${className ?? ""}`}
    {...props}
  >
    {children}
  </div>
);

export default StyledCaption;
