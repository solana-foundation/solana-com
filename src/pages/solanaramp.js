import { useTranslation } from "next-i18next";
import Layout from "../components/layout";
import HTMLHead from "../components/HTMLHead";
import RampLayout from "../components/ramps/RampsLayout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Solanaramp = ({
  airtableData,
  fiatAssetsOptions,
  countryOptions,
  paymentRailsOptions,
}) => {
  const { t } = useTranslation();
  return (
    <Layout>
      <HTMLHead
        title={t("on-off-ramp.meta.title")}
        description={t("on-off-ramp.meta.description")}
      />
      <RampLayout
        data={airtableData.value}
        fiatAssetsOptions={fiatAssetsOptions.value}
        countryOptions={countryOptions.value}
        paymentRailsOptions={paymentRailsOptions.value}
      />
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  const apiKey = process.env.AIRTABLE_TOKEN;

  let propData = {};

  if (!apiKey) {
    console.warn("Airtable API Key is not set. Returning dummy data");
    propData = {
      airtableData: {
        value: [
          {
            id: "dummy-test-ramp-1",
            fields: {
              RampName: "Test Ramp",
              description: "Lorem Ipsum",
              websiteUrl: "",
              imageUrl: null,
              PaymentRails2: [
                "payment-rails-option-1",
                "payment-rails-option-2",
              ],
              Countries2: ["country-option-1"],
              FiatAssets2: ["fiat-asset-option-1", "fiat-asset-option-2"],
              RampStatusOn: true,
              RampStatusOff: true,
            },
          },
        ],
      },
      fiatAssetsOptions: {
        value: [
          {
            id: "fiat-asset-option-1",
            fields: {
              Name: "EUR",
            },
          },
          {
            id: "fiat-asset-option-2",
            fields: {
              Name: "USD",
            },
          },
        ],
      },
      countryOptions: {
        value: [
          {
            id: "country-option-1",
            fields: {
              Name: "United States",
            },
          },
          {
            id: "country-option-2",
            fields: {
              Name: "European Union",
            },
          },
        ],
      },
      paymentRailsOptions: {
        value: [
          {
            id: "payment-rails-option-1",
            fields: {
              Name: "Visa",
            },
          },
          {
            id: "payment-rails-option-2",
            fields: {
              Name: "Mastercard",
            },
          },
        ],
      },
    };
  } else {
    const headers = new Headers({
      Authorization: `Bearer ${apiKey}`,
    });

    const app = "appbflHYVylWsEorx";

    // Order of tables: Master Ramps, Fiat Assets, Country Options, Payment Rails
    const tableIdentifiers = [
      {
        app,
        tbl: "tblfphNf5WHd1tusv",
      },
      {
        app,
        tbl: "tblXOuVEhS1DqjDHl",
      },
      {
        app,
        tbl: "tblFkXValj82u3eKD",
      },
      {
        app,
        tbl: "tblinJdgA5jE3Bywl",
      },
    ];

    const getAllAirtableRecords = async (
      appId,
      tableId,
      headers,
      offset = "",
      pageSize = 100,
      allData = [],
    ) => {
      let queryParams = new URLSearchParams({
        pageSize,
      });

      if (offset) {
        queryParams.set("offset", offset);
      }

      try {
        const response = await fetch(
          `https://api.airtable.com/v0/${appId}/${tableId}?${queryParams}`,
          {
            headers,
          },
        )
          .then((data) => {
            return data.json();
          })
          .catch((error) =>
            console.error("Issue calling Airtable API:", error),
          );

        if (response && Array.isArray(response.records)) {
          response.records.forEach((item) => allData.push(item));
        }

        if (response.offset) {
          return await getAllAirtableRecords(
            appId,
            tableId,
            headers,
            response.offset,
            100,
            allData,
          );
        }
      } catch (error) {
        console.error("Error fetching Airtable Data:", error);
      }

      return allData;
    };

    const allFetchRequests = tableIdentifiers.map((item) => {
      return getAllAirtableRecords(app, item.tbl, headers);
    });

    const [
      airtableData,
      fiatAssetsOptions,
      countryOptions,
      paymentRailsOptions,
    ] = await Promise.allSettled(allFetchRequests);

    propData = {
      airtableData,
      fiatAssetsOptions,
      countryOptions,
      paymentRailsOptions,
    };
  }

  return {
    props: {
      ...propData,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 60,
  };
}

export default Solanaramp;
