import Image from "next/legacy/image";
import type { StaticImageData } from "next/image";

interface HackathonSponsorCardProps {
  logo: StaticImageData;
  alt: string;
  width: number;
  height: number;
}

export default function HackathonSponsorCard({
  logo,
  alt,
  width,
  height,
}: HackathonSponsorCardProps) {
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
