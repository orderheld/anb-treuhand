import { CalculatorPage, calculatorMetadata } from "@/components/pages/calculator-page";

export const metadata = calculatorMetadata("treuhand");

export default function Page() {
  return <CalculatorPage slug="treuhand" />;
}
