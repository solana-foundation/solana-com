// Stats block type
type StatsBlockData = {
  background?: string;
  title?: string;
  description?: string;
  stats?: Array<{
    stat?: string;
    type?: string;
  }>;
};
import { Section } from "../layout/section";

const getGradientClass = (index: number): string => {
  const gradients = [
    "bg-gradient-to-r from-[#f087ff] via-[#6e1fce] to-[rgba(110,31,206,0.1)] bg-clip-text text-transparent",
    "bg-gradient-to-r from-[#1fcff1] via-[#234cb6] to-[rgba(35,76,182,0.1)] bg-clip-text text-transparent",
    "bg-gradient-to-r from-[#19fb9b] via-[#199890] to-[#005f59] bg-clip-text text-transparent",
  ];
  return gradients[index % 3];
};

export const Stats = ({ data }: { data: StatsBlockData }) => {
  return (
    <Section background={data.background!}>
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-bold lg:text-5xl">{data.title}</h2>
          <p>{data.description}</p>
        </div>

        <div className="grid divide-y *:text-center md:grid-cols-3 md:divide-x md:divide-y-0">
          {data.stats?.map((stat, index) => (
            <div key={stat?.type} className="space-y-4 py-6">
              <div className={`text-5xl font-bold ${getGradientClass(index)}`}>
                {stat!.stat}
              </div>
              <p className="uppercase text-gray-500">{stat!.type}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
