import { ServicePage, serviceMetadata } from "@/components/pages/service-page";

export const metadata = serviceMetadata("lohnbuchhaltung");

export default function Page() {
  return <ServicePage slug="lohnbuchhaltung" />;
}
