import { useUserQuery } from "@/api";
import { framer } from "framer-plugin";
import { Spinner } from "../components/Spinner";

export function AccountPage() {
  const { data: user, isLoading: isLoadingUser } = useUserQuery();

  const handleLogout = () => {
    window.localStorage.removeItem("hubspotTokens");
    framer.closePlugin(
      "Uninstall the Framer app from the HubSpot integrations dashboard to complete the removal."
    );
  };

  if (isLoadingUser) {
    return <Spinner inheritColor inline className="mx-auto my-10" />;
  }
 
  return (
    <div className="col-lg">
      <h6>Profile</h6>
      <div className="embedded-container">
        <p>User</p>
        <span className="truncate max-w-[134px]" title={user?.user}>
          {user?.user}
        </span>
      </div>
      <div className="embedded-container">
        <p>Hub ID</p>
        <span>{user?.hub_id}</span>
      </div>
      <button
        className="framer-button-destructive w-full"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
