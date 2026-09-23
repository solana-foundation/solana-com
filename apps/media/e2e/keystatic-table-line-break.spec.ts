import { expect, test } from "@playwright/test";

test("loads an upgrade containing line breaks in table cells", async ({
  page,
}) => {
  test.skip(
    process.env.NEXT_PUBLIC_KEYSTATIC_LOCAL === "false",
    "This test reads the local upgrade content fixture.",
  );

  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(
    "/keystatic/collection/upgrades/item/larger-transaction-sizes",
  );

  await expect(
    page.getByText("Larger Transaction Sizes").first(),
  ).toBeVisible();
  await expect(page.getByText(/Field validation failed/)).toHaveCount(0);
  expect(pageErrors).not.toEqual(
    expect.arrayContaining([expect.stringContaining("unexpected children")]),
  );
});
