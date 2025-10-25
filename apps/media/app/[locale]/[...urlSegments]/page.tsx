import React from "react";
import { notFound } from "next/navigation";
import client from "@/tina/__generated__/client";
import { Section } from "@/components/layout/section";
import ClientPage from "./client-page";
import { pathsWithLocales } from "@workspace/i18n/routing";

export const revalidate = 300;

export default async function Page({
  params,
}: {
  params: Promise<{ urlSegments: string[]; locale: string }>;
}) {
  const resolvedParams = await params;
  const filepath = resolvedParams.urlSegments.join("/");

  let data;
  try {
    data = await client.queries.page({
      relativePath: `${filepath}.mdx`,
    });
  } catch (error) {
    notFound();
  }

  return (
    <Section>
      <ClientPage {...data} />
    </Section>
  );
}

export async function generateStaticParams() {
  let pages = await client.queries.pageConnection();
  const allPages = pages;

  if (!allPages.data.pageConnection.edges) {
    return [];
  }

  while (pages.data.pageConnection.pageInfo.hasNextPage) {
    pages = await client.queries.pageConnection({
      after: pages.data.pageConnection.pageInfo.endCursor,
    });

    if (!pages.data.pageConnection.edges) {
      break;
    }

    allPages.data.pageConnection.edges.push(...pages.data.pageConnection.edges);
  }

  const params = allPages.data?.pageConnection.edges
    .map((edge) => ({
      params: {
        urlSegments: edge?.node?._sys.breadcrumbs || [],
      },
    }))
    .filter((x) => x.params.urlSegments.length >= 1)
    .filter((x) => !x.params.urlSegments.every((x) => x === "home")); // exclude the home page

  return pathsWithLocales(params);
}
