import { ServicePage, serviceMetadata } from "@/components/pages/service-page";

export const metadata = serviceMetadata("buchhaltung");

export default function Page() {
  return <ServicePage slug="buchhaltung" />;
}
