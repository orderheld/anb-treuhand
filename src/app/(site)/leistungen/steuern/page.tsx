import { ServicePage, serviceMetadata } from "@/components/pages/service-page";

export const metadata = serviceMetadata("steuern");

export default function Page() {
  return <ServicePage slug="steuern" />;
}
