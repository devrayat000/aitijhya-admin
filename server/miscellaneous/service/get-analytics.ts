import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    type: "service_account",
    project_id: process.env.GAPI_PROJECT_ID,
    client_id: process.env.GAPI_CLIENT_ID,
    client_email: process.env.GAPI_CLIENT_EMAIL,
    private_key: process.env.GAPI_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    private_key_id: process.env.GAPI_PRIVATE_KEY_ID,
    universe_domain: "googleapis.com",
  },
});

export async function runReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${441360510}`,
    dateRanges: [
      {
        startDate: "2020-03-31",
        endDate: "today",
      },
    ],
    dimensions: [
      {
        name: "city",
      },
    ],
    metrics: [
      {
        name: "activeUsers",
      },
    ],
  });

  console.log("Report result:");
  response.rows?.forEach((row) => {
    console.log(row.dimensionValues?.[0], row.metricValues?.[0]);
  });
}
