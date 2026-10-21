import { ServicePage, serviceMetadata } from "@/components/pages/service-page";

export const metadata = serviceMetadata("unternehmensberatung");

export default function Page() {
  return <ServicePage slug="unternehmensberatung" />;
}
