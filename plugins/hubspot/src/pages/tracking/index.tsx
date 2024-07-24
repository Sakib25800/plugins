import { useLocation } from "wouter";
import { ToggleTrackingButton } from "./components/ToggleTrackingButton";

export function Tracking() {
  const [, navigate] = useLocation();

  return (
    <div className="col-lg">
      <p>
        By enabling tracking, you can monitor your site traffic via HubSpot and
        show chatbots on your site.{" "}
        <span
          onClick={() => navigate("/tracking/learn-more")}
          className="text-framer-blue cursor-pointer"
        >
          Learn more
        </span>
        .
      </p>
      <ToggleTrackingButton className="w-full" />
    </div>
  );
}
