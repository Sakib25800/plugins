import { Spinner } from "@/components/Spinner";
import { useTracking } from "@/hooks/useTracking";
import cx from "classnames";

export const ToggleTrackingButton = ({ className }: { className?: string }) => {
  const { isTrackingEnabled, toggleTracking, isLoading } = useTracking();

  return (
    <button
      className={cx(className, {
        "framer-button-primary": !isLoading && !isTrackingEnabled,
        "framer-button-destructive": !isLoading && isTrackingEnabled,
      })}
      onClick={toggleTracking}
      disabled={isLoading}
    >
      {isLoading ? (
        <Spinner inline className="mx-auto" inheritColor />
      ) : isTrackingEnabled ? (
        "Disable"
      ) : (
        "Enable"
      )}
    </button>
  );
};
