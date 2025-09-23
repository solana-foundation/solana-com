export type WhatIsItProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  features?: string[];
};

/**
 * Displays a section with a title and description.
 *
 * @component
 * @param {WhatIsItProps} props - The props for the component.
 * @param {React.ReactNode} props.title - The title of the section.
 * @param {React.ReactNode} props.description - The description of the section.
 *
 * @example
 * <WhatIsIt
 *   title="What is it?"
 *   description="This is a description of the section."
 * />
 */
export const WhatIsIt = ({ title, description }: WhatIsItProps) => (
  <section className="relative bg-black text-white text-left">
    <div className="max-w-sm md:max-w-3xl xl:max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[40px] pt-[64px] md:pt-[112px] xl:pt-[160px] pb-5 md:pb-[32px] xl:pb-[40px]">
      <h2 className="font-brand font-medium leading-none text-[40px] md:text-[48px] xl:text-[80px] max-w-xl mb-[32px] xl:mb-[64px]">
        {title}
      </h2>
      <div className="flex flex-col xl:flex-row gap-8 xl:gap-16">
        <div className="w-2/5 max-xl:hidden"></div>
        <p className="w-full xl:w-3/5 max-w-2xl text-xl md:text-3xl mb-0 font-medium">
          {description}
        </p>
      </div>
    </div>
  </section>
);
