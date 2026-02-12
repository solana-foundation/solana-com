import React from "react";

interface SwitchbackProps {
  title: string;
  image?: {
    src: string;
    alt: string;
  };
  eyebrow?: string;
  body: React.ReactNode;
  buttons?: {
    label: string;
    url: string;
  }[];
}

const Switchback: React.FC<SwitchbackProps> = ({
  title,
  image,
  eyebrow,
  body,
  buttons,
}) => {
  const hasImage = image?.src;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col gap-8 ${
            hasImage ? "md:flex-row items-center" : "md:flex-col"
          }`}
        >
          {hasImage && (
            <div className="md:w-1/2">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto shadow-lg"
              />
            </div>
          )}
          <div className={hasImage ? "md:w-1/2" : "md:w-full"}>
            {eyebrow && (
              <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <div className="prose mb-6">{body}</div>
            {buttons && buttons.length > 0 && (
              <div className="flex gap-4">
                {buttons.map((button, index) => (
                  <a
                    key={index}
                    href={button.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-black rounded hover:bg-primary/80 transition"
                  >
                    {button.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Switchback;
