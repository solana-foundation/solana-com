import { useRef, useState, useEffect, useMemo } from "react";
import { builder, BuilderComponent } from "@builder.io/react";
import HTMLHead from "@/components/builder/HTMLHead";
import Layout from "@/components/layout";
import {
  CardDeck,
  Section,
  DetailsHero,
  Input,
  Slider,
  Heading,
  Button,
  Icon,
} from "@solana-foundation/solana-lib";
import CategorySelection from "@/components/news/CategorySelection";
import { getPageSettings } from "@/lib/builder/api";
import customComponentsRegistration from "@/utils/customComponentGenerator";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withLocales } from "@/i18n/routing";
import { NEWS_BUILDER_CONFIG } from "@/lib/builder/news/constants";

builder.init(NEWS_BUILDER_CONFIG.apiKey);
builder.apiVersion = "v3";
customComponentsRegistration();

const BlogIndex = ({ builderLocale, newsListingPage, pressRelease, posts }) => {
  const { t } = useTranslation();
  const postsGridRef = useRef(null);
  const searchInputRef = useRef(null);
  const [categoryFilter, setCategoryFilter] = useState(0);
  const [searchFilter, setSearchFilter] = useState(null);
  const [numResults, setNumResults] = useState(9);
  const featuredPostData = newsListingPage?.data.featuredArticle?.value.data;
  const listingContent = newsListingPage?.data;
  const categoryFiltersData = listingContent.categoryFilters;
  const postsPerPage = listingContent.postsPerPage || 9;
  const newsContent = newsListingPage;

  // convert Builder category data to switcherButtons data and prepend a 'All' category with a null value
  const categoryFilters = useMemo(() => {
    return [
      {
        category: "All",
        value: null,
        id: null,
      },
      ...(categoryFiltersData?.map((item, index) => {
        return {
          category: item.category.value.name,
          value: index + 1,
          id: item.category.value.id,
        };
      }) || []),
    ];
  }, [categoryFiltersData]);

  // convert Builder press release data to Slider data
  const pressReleaseSliderData =
    pressRelease?.map((item) => {
      return {
        title: item.data.title,
        image: {
          src: item.data.thumbnail,
        },
        body: `by ${item.data.author}`,
        url: item.data.callToAction.url,
        button: item.data.callToAction,
      };
    }) || [];

  // convert Builder post data to CardDeck data
  const allPostData = useMemo(() => {
    return (
      posts
        ?.map((post) => {
          const postData = post?.data;
          if (!postData) {
            return null;
          }

          return {
            type: "blog",
            publishedDate: postData?.datePublished,
            heading: postData?.title,
            body: postData?.intro,
            backgroundImage: {
              src: postData?.image || "/src/img/news/blogbackup.png",
            },
            tags:
              postData?.tags?.map((item) => {
                return item.tag ? item.tag.id : null;
              }) || [],
            callToAction: {
              hierarchy: "link",
              size: "md",
              label:
                newsListingPage?.callToActionLabel || t("blog.readArticle"),
              endIcon: "arrow-up-right",
              iconSize: "sm",
              url: `/news/${postData?.slug || ""}`,
            },
          };
        })
        .filter(Boolean)
        .sort((a, b) => {
          const dateA = new Date(a.publishedDate);
          const dateB = new Date(b.publishedDate);
          return dateB - dateA;
        }) || []
    );
  }, [posts, newsListingPage?.callToActionLabel, t]);

  // Set state for all post data
  const [postResults, setPostResults] = useState(allPostData);

  // Handle search field value/state
  const handleSearchChange = (event) => {
    setSearchFilter(event.target.value !== "" ? event.target.value : null);
  };

  // Clear search input from "No results" view
  useEffect(() => {
    if (searchFilter === null && searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  }, [searchFilter]);

  // Filter and Search logic
  useEffect(() => {
    if (!categoryFilter && !searchFilter) {
      setPostResults(allPostData);
      setNumResults(postsPerPage);
    } else {
      let results = allPostData;

      // filter by selected category
      if (categoryFilter) {
        results = results.filter((item) => {
          return item.tags?.includes(categoryFilters[categoryFilter]?.id);
        });
      }

      // filter by search
      if (searchFilter) {
        const normalizedSearchFilter = searchFilter.toLowerCase();

        results = results.filter((item) => {
          const headingIncludesFilter = item.heading
            .toLowerCase()
            .includes(normalizedSearchFilter);
          const bodyIncludesFilter =
            item.body &&
            item.body.toLowerCase().includes(normalizedSearchFilter);

          return headingIncludesFilter || bodyIncludesFilter;
        });
      }

      setPostResults(results);
      setNumResults(postsPerPage);
    }
  }, [
    categoryFilter,
    searchFilter,
    allPostData,
    categoryFilters,
    postsPerPage,
  ]);

  return (
    <Layout>
      <HTMLHead
        seo={listingContent?.seo}
        openGraph={listingContent?.openGraph}
        twitterMeta={listingContent?.openGraph}
      />
      <>
        <div ref={postsGridRef}>
          <DetailsHero
            eyebrow={listingContent?.heroEyebrow}
            title={featuredPostData?.title}
            titleAsLink={true}
            subHead={listingContent?.heroSubheading || t("blog.readArticle")}
            image={featuredPostData?.image || "/src/img/news/blogbackup.png"}
            publishedDate={featuredPostData?.datePublished}
            author={featuredPostData?.author.value}
            buttons={[
              {
                label:
                  listingContent?.callToActionLabel || t("blog.readArticle"),
                url: `/news/${featuredPostData?.slug || ""}`,
                hierarchy: "outline",
                size: "lg",
                endIcon: "arrow-up-right",
              },
            ]}
            slug={`/news/${featuredPostData?.slug || ""}`}
          />
        </div>
        <div className={`tw-z-50 d-block position-relative`}>
          <Section
            className={
              "tw-grid tw-gap-8 md:tw-gap-12 tw-pb-0 sm:tw-pb-0 lg:tw-pb-0"
            }
          >
            <div className="row d-block d-md-flex justify-items-start">
              <div className="col flex-grow-1">
                <CategorySelection
                  categories={categoryFilters}
                  setCategoryFilter={setCategoryFilter}
                  activeCategoryFilter={categoryFilter}
                  moreCategoriesLabel={listingContent?.categoryFilterDropdown}
                />
              </div>
              <div className="col flex-grow-0 justify-self-end">
                <div className={`position-relative`}>
                  <Input
                    ref={searchInputRef}
                    icon={"search"}
                    placeholder="Search"
                    className="tw-w-full tw-max-w-sm"
                    onChange={handleSearchChange}
                  />
                  {searchFilter && (
                    <Button
                      hierarchy={"link"}
                      className="position-absolute top-50 end-0 translate-middle me-2"
                      onClick={() => {
                        setSearchFilter(null);
                      }}
                    >
                      <Icon id="x-close" size={16} stroke={"white"} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Section>
        </div>
        {postResults.length ? (
          <>
            <CardDeck
              numCols={3}
              cards={postResults.slice(0, numResults)}
              isListing
            />
            <Section noPadding={"noPaddingAll"}>
              <hr />
            </Section>
            {numResults < postResults.length && (
              <Button
                hierarchy={"outline"}
                size={"md"}
                onClick={() => setNumResults(numResults + postsPerPage)}
                className="tw-mx-auto tw-mt-8 tw-mb-12 tw-block"
              >
                {listingContent.loadMoreLabel}
              </Button>
            )}
          </>
        ) : (
          <Section className={"tw-pb-0 sm:tw-pb-0 lg:tw-pb-0 tw-mb-0"}>
            <Heading
              headline={listingContent?.noResultsHeading}
              body={listingContent?.noResultsSubheading}
              buttons={
                searchFilter
                  ? [
                      {
                        label: listingContent?.clearSearchLabel,
                        hierarchy: "link",
                        size: "lg",
                        endIcon: "arrow-up-right",
                        className: searchFilter
                          ? "tw-block tw-ml-6"
                          : "tw-hidden",
                        onClick: () => {
                          setSearchFilter(null);
                        },
                      },
                    ]
                  : [
                      {
                        label: "Show all",
                        hierarchy: "link",
                        size: "lg",
                        endIcon: "arrow-up-right",
                        className: searchFilter
                          ? "tw-block tw-ml-6"
                          : "tw-hidden",
                        onClick: () => {
                          setCategoryFilter(0);
                        },
                      },
                    ]
              }
            />
          </Section>
        )}

        {pressReleaseSliderData.length > 0 && (
          <>
            <Heading
              eyebrow={listingContent?.pressReleaseEyebrow}
              headline={listingContent?.pressReleaseHeading}
              body={listingContent?.pressReleaseSubheading}
              paddingBottom={"none"}
            />
            <Slider cards={pressReleaseSliderData} />
          </>
        )}
      </>
      <BuilderComponent
        options={{ includeRefs: true }}
        model={NEWS_BUILDER_CONFIG.listingPageModel}
        content={newsContent}
        locale={builderLocale || "Default"}
      />
    </Layout>
  );
};

export async function getStaticProps({ params }) {
  const { locale = "en" } = params;
  try {
    const isDefaultLocale = locale === "en";
    const builderLocale = isDefaultLocale ? "Default" : locale;

    const newsListingPage = await builder
      .get(NEWS_BUILDER_CONFIG.listingPageModel, {
        options: { locale: builderLocale },
        includeRefs: true,
        staleCacheSeconds: 20,
      })
      .toPromise();

    const posts = await getAllPosts(
      builderLocale,
      newsListingPage.data.featuredArticle.id,
    );

    const pressRelease = await builder
      .getAll(NEWS_BUILDER_CONFIG.pressReleaseModel, {
        limit: 6,
        options: { locale: builderLocale },
      })
      .then((results) => {
        return results;
      });

    const [pageSettings] = await Promise.all([getPageSettings()]);

    if (posts.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        locale,
        builderLocale,
        newsListingPage,
        pressRelease,
        pageSettings,
        posts,
        ...(await serverSideTranslations(builderLocale, ["common"])),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

async function getAllPosts(builderLocale, featuredPostId) {
  let allPosts = [];
  let offset = 0;
  const limit = 100; // Maximum allowed limit per request

  while (true) {
    const response = await builder
      .getAll(NEWS_BUILDER_CONFIG.postsModel, {
        limit: limit,
        query: {
          id: { $ne: featuredPostId },
        },
        options: {
          offset: offset,
          locale: builderLocale,
          fields:
            "data.slug,data.title,data.intro,data.image,data.datePublished,data.author,data.tags",
        },
      })
      .then((response) => {
        return response;
      });

    allPosts = allPosts.concat(response);

    // Break the loop if the number of posts returned is less than the limit, indicating you've reached the end
    if (response.length < limit) {
      break;
    }

    offset += limit; // Increment the offset for the next batch
  }

  return allPosts;
}

export async function getStaticPaths() {
  return {
    paths: withLocales(),
    fallback: "blocking",
  };
}

export default BlogIndex;
