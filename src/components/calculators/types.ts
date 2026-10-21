/** Settings of the offer form, computed on the server and passed to the calculators. */
export interface OfferSettings {
  /** The form can send (e-mail configured or test mode). Otherwise an e-mail link replaces it. */
  formsAvailable: boolean;
  /** Submissions are only checked, not sent (local tests, previews without Resend). */
  testMode: boolean;
  /** The visitor receives a confirmation e-mail. */
  confirmation: boolean;
  fallbackEmail: string;
  /** ", in der Regel innert eines Arbeitstages" once confirmed, otherwise "". */
  responseClause: string;
  /** Sentence about VAT next to prices. */
  vatNote: string;
  phone: { label: string; href: string } | null;
}
