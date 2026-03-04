import PossibleEcosystemGridRow from "./PossibleEcosystemGridRow";

type EcosystemItem = {
  name: string;
  logo: { src: string };
  category: string;
};

const PossibleEcosystemGrid = ({ data }: { data: EcosystemItem[] }) => {
  // convert array of objects into 6 equal chunks
  const chunkedData = divideIntoSixGroups(data, 6);

  return (
    <div className={`table w-full h-auto `}>
      {chunkedData.map((chunk, index) => {
        return (
          <PossibleEcosystemGridRow
            data={chunk}
            key={index}
            dir={index % 2 === 0 ? "ltr" : "rtl"}
          />
        );
      })}
    </div>
  );
};

// break array into groups
function divideIntoSixGroups<T>(inputObj: T[], numGroups = 6): T[][] {
  const output: T[][] = Array.from({ length: numGroups }, () => []);

  inputObj.forEach((item, index) => {
    output[index % numGroups].push(item);
  });

  return output;
}

export default PossibleEcosystemGrid;
