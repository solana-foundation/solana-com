import Image from "next/legacy/image";

export default function HackathonSponsorCard({ logo, alt, width, height }) {
  return (
    <div className={"flex justify-center items-center"}>
      <Image
        alt={alt}
        src={logo}
        layout="fixed"
        width={width}
        height={height}
      />
    </div>
  );
}
