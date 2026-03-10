import { Link } from "../../utils/Link";
import Image from "next/legacy/image";
import Button from "../shared/Button";
import { useTranslations } from "next-intl";

type Post = {
  url?: string;
  heroImage?: string;
  title?: string;
};

/**
 * Show blog post data in the card
 */
const PostCard = ({ post }: { post: Post }) => {
  const t = useTranslations();
  const url = post?.url;
  const featuredImage = post?.heroImage ?? "/src/img/news/blogbackup.png";

  return (
    <article className="font-brand flex flex-col justify-between h-full">
      <div>
        <div className="ratio ratio-16x9 hover:scale-[1.02] hover:transition-transform hover:duration-100 hover:ease-[ease] hover:delay-0">
          <Link to={url}>
            <Image
              className="post-card-image m-0 w-auto h-full bg-[var(--color-secondary)] bg-no-repeat bg-center bg-cover [&::before]:bg-black [&::before]:rounded-xl [&::after]:bg-black [&::after]:rounded-xl"
              src={featuredImage}
              loading="eager"
              quality={90}
              width={1920}
              height={1073}
            />
          </Link>
        </div>
        <h3 className="mt-4 mb-4 text-white font-bold text-[1.3rem] leading-[130%]">
          {post?.title}
        </h3>
      </div>
      <div>
        <Button to={url}>{t("blog.readArticle")}</Button>
      </div>
    </article>
  );
};

export default PostCard;
