import { useAccountQuery, useFormsQuery } from "@/api";
import { ComponentInsert } from "@/components/ComponentInsert";
import { Spinner } from "@/components/Spinner";
import { useLocation } from "wouter";

const createFormsScript = (
  portalId: number,
  dataHostingLocation: string,
  formId: string
) => {
  return `<script src="https://js-${dataHostingLocation}.hsforms.net/forms/embed/${portalId}.js" defer></script><div class="hs-form-frame" data-region="${dataHostingLocation}" data-form-id="${formId}" data-portal-id="${portalId}"></div>`;
};

export function FormsPage() {
  const [, navigate] = useLocation();
  const { data: account, isLoading: isLoadingAccount } = useAccountQuery();
  const { data: formsResponse, isLoading: isLoadingForms } = useFormsQuery();

  const isLoadingVisible = isLoadingForms || isLoadingAccount;
  const { portalId, dataHostingLocation } = account || {};
  const formsExist = (formsResponse?.results.length ?? 0) > 0;

  if (isLoadingVisible) {
    return <Spinner inheritColor inline className="mx-auto my-10" />;
  }

  return (
    <div className="col-lg">
      <p>
        Need some help? View the{" "}
        <a
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            navigate("/forms/installation");
          }}
        >
          installation methods
        </a>
        .
      </p>
      {formsExist ? (
        formsResponse?.results.map((form, i) => (
          <ComponentInsert
            key={i}
            url="https://framer.com/m/Embed-UI5d.js"
            attributes={{
              controls: {
                type: "html",
                html: createFormsScript(
                  portalId ?? 0,
                  dataHostingLocation ?? "",
                  form.id
                ),
              },
            }}
          >
            <div key={i} className="w-full tile p-2 rounded-lg cursor-pointer">
              <p className="truncate font-semibold text-left">{form.name}</p>
            </div>
          </ComponentInsert>
        ))
      ) : (
        <p className="text-tertiary text-center my-10">
          Create a form in HubSpot to add them to your page.
        </p>
      )}
      <button
        className="framer-button-primary w-full"
        onClick={() => {
          window.open(
            `https://${account?.uiDomain}/forms/${portalId}`,
            "_blank"
          );
        }}
      >
        View Forms
      </button>
    </div>
  );
}
