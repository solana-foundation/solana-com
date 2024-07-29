import PossibleEcosystemGridRow from "./PossibleEcosystemGridRow";

const PossibleEcosystemGrid = ({ data }) => {
  // convert array of objects into 6 equal chunks
  const chunkedData = divideIntoSixGroups(data, 6);

  return (
    <div className={`d-table w-100 h-auto `}>
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
function divideIntoSixGroups(inputObj, numGroups = 6) {
  const arrays = Object.values(inputObj);
  const output = Array.from({ length: numGroups }, () => []);

  arrays.forEach((array, index) => {
    output[index % numGroups].push(array);
  });

  return output;
}

export default PossibleEcosystemGrid;
