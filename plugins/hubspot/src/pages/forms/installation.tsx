import { useLocation } from "wouter";

export function FormsInstallationPage() {
  const [, navigate] = useLocation();

  return (
    <div className="col-lg">
      <span>There are two ways to use HubSpot forms with Framer:</span>
      <ol>
        <li className="font-medium text-secondary">
          1. Embed the form directly using the previous page.
        </li>
        <br />
        <li className="font-medium text-secondary">
          2. Create a form in Framer and ensure each input field's name matches
          the corresponding contact property internal name. Ensure
          <a
            onClick={() => navigate("/tracking/learn-more")}
            className="cursor-pointer"
            target="_blank"
          >
            {" "}
            tracking{" "}
          </a>
          is enabled.
        </li>
      </ol>
      <div className="row">
        <button className="flex-1" onClick={() => history.back()}>
          Back
        </button>
        <button
          className="framer-button-primary flex-1"
          onClick={() => {
            window.open(
              "https://knowledge.hubspot.com/forms/use-non-hubspot-forms",
              "_blank"
            );
          }}
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
