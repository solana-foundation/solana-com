import type { Template } from "tinacms";
import { tinaField } from "tinacms/dist/react";
import { PageBlocksStats } from "@/tina/__generated__/types";
import { Section } from "../layout/section";
import { sectionBlockSchemaField } from "../layout/section";

const getGradientClass = (index: number): string => {
  const gradients = [
    "bg-gradient-to-r from-[#f087ff] via-[#6e1fce] to-[rgba(110,31,206,0.1)] bg-clip-text text-transparent",
    "bg-gradient-to-r from-[#1fcff1] via-[#234cb6] to-[rgba(35,76,182,0.1)] bg-clip-text text-transparent",
    "bg-gradient-to-r from-[#19fb9b] via-[#199890] to-[#005f59] bg-clip-text text-transparent",
  ];
  return gradients[index % 3];
};

export const Stats = ({ data }: { data: PageBlocksStats }) => {
  return (
    <Section background={data.background!}>
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2
            className="text-4xl font-bold lg:text-5xl"
            data-tina-field={tinaField(data, "title")}
          >
            {data.title}
          </h2>
          <p data-tina-field={tinaField(data, "description")}>
            {data.description}
          </p>
        </div>

        <div className="grid divide-y *:text-center md:grid-cols-3 md:divide-x md:divide-y-0">
          {data.stats?.map((stat, index) => (
            <div key={stat?.type} className="space-y-4 py-6">
              <div
                className={`text-5xl font-bold ${getGradientClass(index)}`}
                data-tina-field={tinaField(stat, "stat")}
              >
                {stat!.stat}
              </div>
              <p
                data-tina-field={tinaField(stat, "type")}
                className="uppercase text-gray-500"
              >
                {stat!.type}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export const statsBlockSchema: Template = {
  name: "stats",
  label: "Stats",
  ui: {
    previewSrc: "/blocks/stats.png",
    defaultItem: {
      title: "TinaCMS by the numbers",
      description:
        "TinaCMS is an open-source content management system that allows developers to create and manage content for their websites and applications. It provides a flexible and customizable framework for building content-driven applications.",
      stats: [
        {
          stat: "12K",
          type: "Stars on GitHub",
        },
        {
          stat: "11K",
          type: "Active Users",
        },
        {
          stat: "22K",
          type: "Powered Apps",
        },
      ],
    },
  },
  fields: [
    sectionBlockSchemaField as any,
    {
      type: "string",
      label: "Title",
      name: "title",
    },
    {
      type: "string",
      label: "Description",
      name: "description",
    },
    {
      type: "object",
      label: "Stats",
      name: "stats",
      list: true,
      ui: {
        defaultItem: {
          stat: "12K",
          type: "Stars on GitHub",
        },
        itemProps: (item) => {
          return {
            label: `${item.stat} ${item.type}`,
          };
        },
      },
      fields: [
        {
          type: "string",
          label: "Stat",
          name: "stat",
        },
        {
          type: "string",
          label: "Type",
          name: "type",
        },
      ],
    },
  ],
};
