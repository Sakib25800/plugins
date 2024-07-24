import type { CustomCode } from "framer-plugin";
import { framer } from "framer-plugin";
import { useEffect, useState } from "react";

type EditCode = typeof framer.setCustomCode;
type EditCodeOptions = Parameters<EditCode>[0];
type EditAction = "append" | "set" | "delete";

interface ExtendedEditCodeOptions extends EditCodeOptions {
  action: EditAction;
  html: string;
}

const locations = {
  bodyEnd: "body end",
  bodyStart: "body start",
  headStart: "head start",
  headEnd: "head end",
};

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const useCustomCode = (): [
  CustomCode | null,
  (options: ExtendedEditCodeOptions) => Promise<void>,
] => {
  const [customCode, setCustomCode] = useState<CustomCode | null>(null);

  useEffect(() => framer.subscribeToCustomCode(setCustomCode), []);

  const editCustomCode = async ({
    html,
    location,
    action,
  }: ExtendedEditCodeOptions): Promise<void> => {
    if (!customCode) {
      throw new Error("No custom code.");
    }

    const { html: existingHTML, disabled } = customCode[location];

    if (disabled) {
      framer.notify(
        `Custom code has been disabled at ${locations[location]}. Please enable it to continue.`,
        { variant: "error" }
      );
      return;
    }

    let newHTML: string | null = existingHTML || "";

    switch (action) {
      case "append": {
        newHTML = existingHTML ? `${existingHTML}\n${html}` : html;
        break;
      }
      case "set": {
        newHTML = html;
        break;
      }
      case "delete": {
        if (!existingHTML) {
          throw new Error("No existing custom code to delete.");
        }

        const escapedHtml = escapeRegExp(html);
        const regex = new RegExp(`${escapedHtml}[\\s\\S]*`, "i");

        if (!regex.test(existingHTML)) {
          throw new Error("The specified HTML to delete was not found.");
        }

        newHTML = existingHTML.replace(regex, "").trim();
        break;
      }
      default: {
        throw new Error(`Unknown action type: ${action}`);
      }
    }

    await framer.setCustomCode({
      html: newHTML,
      location: location,
    });
  };

  return [customCode, editCustomCode];
};
