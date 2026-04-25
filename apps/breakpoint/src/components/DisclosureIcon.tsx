type DisclosureIconProps = {
  open: boolean;
};

export default function DisclosureIcon({ open }: DisclosureIconProps) {
  return (
    <span aria-hidden="true" className="relative block size-3 text-white">
      <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
      {!open && (
        <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current" />
      )}
    </span>
  );
}
