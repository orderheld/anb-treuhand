import { Fragment } from "react";

/** "08.00–12.00 und 13.30–17.30 Uhr" with every time range kept on one line. */
export function Hours({ text }: { text: string }) {
  return (
    <>
      {text.split(" und ").map((part, i) => (
        <Fragment key={part}>
          {i > 0 ? " und " : null}
          <span className="whitespace-nowrap">{part}</span>
        </Fragment>
      ))}
    </>
  );
}
