import { useUserQuery } from "@/api";
import { useCustomCode } from "./useCustomCode";

export const useTracking = () => {
  const { data, isLoading } = useUserQuery();
  const [customCode, editCustomCode] = useCustomCode();

  const existingHtml = customCode?.bodyEnd.html;
  const trackingScript = `<script type="text/javascript" id="hs-script-loader" async defer src="//js-eu1.hs-scripts.com/${data?.hub_id}.js"></script>`;
  const isTrackingEnabled = existingHtml?.includes(trackingScript);

  const toggleTracking = () => {
    editCustomCode({
      html: trackingScript,
      location: "bodyEnd",
      action: isTrackingEnabled ? "delete" : "append",
    });
  };

  return {
    isTrackingEnabled,
    toggleTracking,
    isLoading,
  };
};
