import {
  ExternalLink,
  Wallet,
  Smartphone,
  GalleryVerticalEnd,
  Sparkles,
  Fullscreen,
  Box,
} from "lucide-react";

const products = [
  {
    title: "Wallets",
    icon: Wallet,
    href: "#",
    color: "text-emerald-400 bg-emerald-900/30",
    description:
      "Unlock the potential of decentralized physical infrastructure networks",
  },
  {
    title: "Mobile",
    icon: Smartphone,
    href: "#",
    color: "text-indigo-400 bg-indigo-900/30",
    description:
      "Unlock the potential of decentralized physical infrastructure networks",
  },
  {
    title: "Tokenization",
    icon: Sparkles,
    color: "text-cyan-400 bg-cyan-900/30",
    description:
      "Unlock the potential of decentralized physical infrastructure networks",
  },
  {
    title: "cNFTs",
    icon: GalleryVerticalEnd,
    href: "#",
    color: "text-violet-400 bg-violet-900/30",
    description:
      "Unlock the potential of decentralized physical infrastructure networks",
  },
  {
    title: "zkCompression",
    icon: Fullscreen,
    color: "text-blue-400 bg-blue-900/30",
    description:
      "Unlock the potential of decentralized physical infrastructure networks",
  },
  {
    title: "Token Extensions",
    icon: Box,
    color: "text-emerald-400 bg-emerald-900/30",
    description:
      "Unlock the potential of decentralized physical infrastructure networks",
  },
];

export const Products = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
        Products
        <span className="flex-1 border-t border-white/10 ml-4" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {products.map((product) => {
          const Icon = product.icon;
          const hasLink = Boolean(product.href);
          const Wrapper = hasLink ? "a" : "div";
          return (
            <Wrapper
              key={product.title}
              {...(hasLink
                ? {
                    href: product.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : {})}
              className="group flex flex-col md:flex-row"
            >
              <div className="w-20 h-20 flex items-start md:mr-6 mb-4 md:mb-0">
                <div
                  className={`w-20 h-20 flex items-center justify-center rounded-xl text-2xl ${product.color}`}
                >
                  <Icon size={20} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-white text-xl font-semibold">
                    {product.title}
                  </span>
                  {hasLink && (
                    <ExternalLink size={18} className="ml-1 text-white/60" />
                  )}
                </div>
                <p className="text-gray-300 mt-2 text-base">
                  {product.description}
                </p>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
};
