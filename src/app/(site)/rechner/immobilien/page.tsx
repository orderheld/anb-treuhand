import { CalculatorPage, calculatorMetadata } from "@/components/pages/calculator-page";

export const metadata = calculatorMetadata("immobilien");

export default function Page() {
  return <CalculatorPage slug="immobilien" />;
}
