import { CalculatorPage, calculatorMetadata } from "@/components/pages/calculator-page";

export const metadata = calculatorMetadata("firmengruendung");

export default function Page() {
  return <CalculatorPage slug="firmengruendung" />;
}
