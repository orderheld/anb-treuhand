import { ServicePage, serviceMetadata } from "@/components/pages/service-page";

export const metadata = serviceMetadata("firmengruendung");

export default function Page() {
  return <ServicePage slug="firmengruendung" />;
}
