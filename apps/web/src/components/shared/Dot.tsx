/**
 * Simple dot for sliders.
 */
const Dot = ({
  active,
  ...props
}: {
  active?: boolean;
  [key: string]: unknown;
}) => (
  <div
    className={`w-2.5 h-2.5 rounded-full cursor-pointer bg-white mr-1 last-of-type:mr-0 ${active ? "opacity-100" : "opacity-40"}`}
    {...(props as React.HTMLAttributes<HTMLDivElement>)}
  />
);

export default Dot;
