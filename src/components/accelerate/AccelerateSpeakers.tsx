import { FC } from "react";
import Image from "next/image";
import styles from "./AccelerateSpeakers.module.scss";

interface Speaker {
  speakerName: string;
  title: string;
  image: string;
}

interface AccelerateSpeakersProps {
  speakers: Speaker[];
}

export const AccelerateSpeakers: FC<AccelerateSpeakersProps> = ({
  speakers,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {speakers &&
          speakers.map((speaker, index) => (
            <div key={index} className={styles.speakerCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={speaker.image}
                  alt={speaker.speakerName}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{speaker.speakerName}</h3>
                <p className={styles.title}>{speaker.title}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
