import { Button } from "@/components/Button";
import { framer } from "framer-plugin";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import type { Tokens } from "../auth";
import auth from "../auth";
import { Logo } from "../components/Logo";

export function SetupPage() {
  const [isPolling, setIsPolling] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [, navigate] = useLocation();
  const pollInterval = useRef<
    number | ReturnType<typeof setInterval> | undefined
  >();

  useEffect(() => {
    async function checkForAuthOnLoad() {
      const authenticated = await auth.isAuthenticated();

      if (authenticated) {
        navigate("/menu");
      }

      setIsCheckingAuth(false);
    }

    checkForAuthOnLoad();
  }, [navigate]);

  const pollForTokens = (readKey: string): Promise<Tokens> => {
    setIsPolling(true);

    const stopPolling = () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
        setIsPolling(false);
      }
    };

    if (!pollInterval.current) {
      clearInterval(pollInterval.current);
    }

    const pollingInterval = 2500;
    const maxPollingMinutes = 3;
    const maxAttempts = (maxPollingMinutes * 60 * 1000) / pollingInterval;

    return new Promise((resolve, reject) => {
      let attempts = 0;

      pollInterval.current = setInterval(async () => {
        attempts += 1;

        const tokens = await auth.fetchTokens(readKey);
        stopPolling();
        resolve(tokens);

        if (attempts >= maxAttempts) {
          stopPolling();
          reject("Polling timed out");
        }
      }, pollingInterval);
    });
  };

  const login = async () => {
    try {
      // Retrieve the authorization URL and a set of read and write keys
      const authorization = await auth.authorize();

      // Open up the HubSpot authorization window
      window.open(authorization.url);

      // Poll the auth server and wait for tokens
      await pollForTokens(authorization.readKey);

      navigate("/menu");
    } catch (e) {
      framer.notify(
        e instanceof Error
          ? e.message
          : "Sign in failed. Please try again later.",
        {
          variant: "error",
        },
      );
    }
  };

  return (
    <div className="col-lg items-center">
      <Logo />
      <div className="col items-center">
        <h6>Connect to HubSpot</h6>
        <p className="text-center max-w-50 text-tertiary">
          Sign in to HubSpot to access your forms, enable tracking and more.
        </p>
      </div>
      <Button
        className="framer-button-primary w-full"
        onClick={login}
        isPending={isPolling || isCheckingAuth}
      >
        Connect
      </Button>
    </div>
  );
}
