import Image from "next/legacy/image";

export default function HackathonSponsorCard({ logo, alt, width, height }) {
  return (
    <div className={"d-flex justify-content-center align-items-center"}>
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
