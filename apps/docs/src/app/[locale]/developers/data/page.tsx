import { DatabricksDashboardEmbed } from "./databricks-dashboard";

export const revalidate = 3600;

export default async function DataDashboard() {
  return (
    <div className="w-full min-h-screen bg-white">
      <DatabricksDashboardEmbed />
    </div>
  );
}
