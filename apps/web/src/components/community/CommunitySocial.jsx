import { FormattedNumber } from "../SolFormattedMessage";
import Telegram from "../../../public/src/img/community/socials-telegram.inline.svg";
import Twitter from "../../../public/src/img/community/socials-twitter.inline.svg";
import Youtube from "../../../public/src/img/community/socials-youtube.inline.svg";
import Weibo from "../../../public/src/img/community/socials-weibo.inline.svg";
import Discord from "../../../public/src/img/community/socials-discord.inline.svg";
import Git from "../../../public/src/img/community/socials-git.inline.svg";
import Sun from "../../../public/src/img/community/socials-sun.inline.svg";
import Mail from "../../../public/src/img/community/socials-mail.inline.svg";
import Reddit from "../../../public/src/img/community/socials-reddit.inline.svg";
import News from "../../../public/src/img/community/socials-news.inline.svg";
import { useTranslations } from "next-intl";
import { Badge } from "@/component-library/badge";

/**
 * Display social network cards
 *
 * @param {object} data - Social network meta information
 * @returns {JSX.Element}
 * @constructor
 */
const CommunitySocial = ({ data }) => {
  const t = useTranslations();

  const {
    telegram = 70463,
    twitter = 3028785,
    github = 97,
    discord = 141556,
    meetup = 8656,
    weibo = 4400,
    youtube = 75000,
    news = 237,
    reddit = 344000,
  } = data;

  const socialAccounts = [
    {
      link: "/telegram",
      category: "Announcements",
      renderIcon: () => <Telegram />,
      nameId: "community.socials.telegram",
      memberStrId: "community.socials.approx-members",
      members: telegram,
    },
    {
      link: "/twitter",
      category: "Announcements",
      renderIcon: () => <Twitter />,
      nameId: "community.socials.twitter",
      memberStrId: "community.socials.approx-members",
      members: twitter,
    },
    {
      link: "/youtube",
      category: "Announcements",
      renderIcon: () => <Youtube size={32} className="stroke" />,
      nameId: "community.socials.youtube",
      memberStrId: "community.socials.yt-subscribers",
      members: youtube,
    },
    {
      link: "/reddit",
      category: "Discussions",
      renderIcon: () => <Reddit />,
      nameId: "community.socials.reddit",
      memberStrId: "community.socials.gt-subscribers",
      members: reddit,
    },
    {
      link: "/discord",
      category: "Engineering",
      renderIcon: () => <Discord />,
      nameId: "community.socials.discord",
      memberStrId: "community.socials.approx-members",
      members: discord,
    },
    {
      link: "/github",
      category: "Engineering",
      renderIcon: () => <Git />,
      nameId: "community.socials.github",
      memberStrId: "community.socials.gt-stars",
      members: github,
    },
    {
      link: "https://www.meetup.com/topics/solana/",
      category: "Meetings",
      renderIcon: () => <Sun />,
      nameId: "community.socials.meetup",
      memberStrId: "community.socials.gt-members",
      members: meetup,
    },
    {
      link: "https://weibo.com/SolanaNews",
      category: "Announcements",
      renderIcon: () => <Weibo />,
      nameId: "community.socials.weibo",
      memberStrId: "community.socials.weibo-subscribers",
      members: weibo,
    },
    {
      link: "/news",
      category: "Discussions",
      renderIcon: () => <News />,
      nameId: "community.socials.medium",
      memberStrId: "community.socials.approx-write-ups",
      members: news,
    },
    {
      link: "mailto:hello@solana.com",
      category: "Meetings",
      renderIcon: () => <Mail />,
      nameId: "community.socials.email",
      membersStr: "hello@solana.com",
    },
  ];

  return (
    <section className="community-socials container mt-16">
      <div>
        <h2 className="mb-4">{t("community.socials.hero")}</h2>
        <p className="text-white md:w-1/2">
          {t("community.socials.subheader")}
        </p>
      </div>
      <div className="grid grid-cols-12 gap-x-5 md:gap-x-10 mt-8 [row-gap:3rem]">
        {socialAccounts.map((item) => (
          <div
            className="col-span-12 sm:col-span-6 md:col-span-3"
            key={item.nameId}
          >
            <a
              href={item.link}
              className="group rounded-[0.5rem] cursor-pointer p-4 text-[#f9f9fb] bg-[#232323] transition-colors duration-[350ms] flex flex-col items-start no-underline hover:no-underline hover:bg-[#f9f9fb] hover:text-[#232323]"
            >
              <Badge className="bg-black font-light" title={item.category} />
              <div className="w-8 h-8 mt-6 mb-2 [&_svg]:fill-[#f9f9fb] [&_svg]:stroke-[#232323] [&_svg]:[stroke-width:0] [&_svg]:[transition:fill_0.3s] group-hover:[&_svg]:fill-[#232323] group-hover:[&_svg]:stroke-[#f9f9fb]">
                {item.renderIcon()}
              </div>
              <p className="font-bold w-full mb-8">{t(item.nameId)}</p>
              <p className="mb-0 break-words">
                {item.membersStr ? (
                  item.membersStr
                ) : (
                  <>
                    <FormattedNumber value={item.members} />
                    <span> {t(item.memberStrId)}</span>
                  </>
                )}
              </p>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommunitySocial;
