import { useAccountQuery, useInboxesQuery } from "@/api";
import { useEffect, useRef } from "react";
import { SegmentedControls } from "../components/SegmentedControls";
import { Spinner } from "../components/Spinner";
import { useCustomCode } from "../hooks/useCustomCode";
import useForm from "@/hooks/useForm";
import { useLocation } from "wouter";

interface Settings {
  enableWidgetCookieBanner: string;
  disableAttachment: string;
}

export function ChatPage() {
  const {
    formState: settings,
    setFormState: setSettings,
    handleChange,
  } = useForm<Settings>({
    enableWidgetCookieBanner: "false",
    disableAttachment: "false",
  });
  const prevSettingsRef = useRef(settings);

  const [customCode, editCustomCode] = useCustomCode();
  const [, navigate] = useLocation();

  const { data: account, isLoading: isLoadingAccount } = useAccountQuery();
  const { data: inboxes, isLoading: isLoadingInboxes } = useInboxesQuery();

  const isLoadingVisible = isLoadingAccount || isLoadingInboxes;
  const existingHTML = customCode?.bodyEnd.html;

  // Check for existing settings
  useEffect(() => {
    const matches = (existingHTML ?? "").match(
      /window\.hsConversationsSettings\s*=\s*(\{.*?\});/
    );

    if (!matches) return;

    const { enableWidgetCookieBanner, disableAttachment } = JSON.parse(
      matches[1]
    );

    setSettings({
      enableWidgetCookieBanner: enableWidgetCookieBanner.toString(),
      disableAttachment: disableAttachment.toString(),
    });
  }, [existingHTML, setSettings]);

  useEffect(() => {
    const prevSettings = prevSettingsRef.current;
    const settingsChanged =
      JSON.stringify(prevSettings) !== JSON.stringify(settings);

    if (!settingsChanged) return;

    const { enableWidgetCookieBanner, disableAttachment } = settings;
    const hsConversationsSettings = {
      enableWidgetCookieBanner:
        enableWidgetCookieBanner === "true"
          ? true
          : enableWidgetCookieBanner === "ON_EXIT_INTENT"
            ? "ON_EXIT_INTENT"
            : false,
      disableAttachment: disableAttachment === "true",
      loadImmediately: true,
      avoidInlineStyles: true,
    };

    editCustomCode({
      html: `<script>window.hsConversationsSettings = ${JSON.stringify(hsConversationsSettings)};</script>`,
      location: "bodyStart",
      action: "set",
    });

    prevSettingsRef.current = settings;
  }, [settings, editCustomCode]);

  if (isLoadingVisible) {
    return <Spinner inheritColor inline className="mx-auto my-10" />;
  }

  return (
    <div className="col-lg">
      <p>
        Ensure
        <a
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            navigate("/tracking/learn-more");
          }}
        >
          {" "}
          tracking{" "}
        </a>
        is enabled for the chats to display on your page.
      </p>
      <h6>Inboxes</h6>
      {(inboxes?.length ?? 0) > 0 ? (
        inboxes?.map((inbox, i) => (
          <div className="embedded-container" key={i}>
            <p>{inbox.name}</p>
            <a
              target="_blank"
              title={inbox.name}
              href={`https://app.hubspot.com/live-messages-settings/${account?.portalId}/inboxes/${inbox.id}/edit/live-chat/primary/configure`}
            >
              Open
            </a>
          </div>
        ))
      ) : (
        <p className="text-tertiary text-center my-10">
          Create an inbox in HubSpot to view it here.
        </p>
      )}
      <hr />
      <h6>Settings</h6>
      <div className="embedded-container">
        <label htmlFor="enableWidgetCookieBanner">Banner</label>
        <select
          name="enableWidgetCookieBanner"
          id="enableWidgetCookieBanner"
          value={settings.enableWidgetCookieBanner}
          onChange={handleChange}
        >
          <option value="true">Enabled</option>
          <option value="false">Disabled</option>
          <option value="ON_EXIT_INTENT">On Exit Intent</option>
        </select>
      </div>
      <div className="embedded-container">
        <label htmlFor="disableAttachment">Attachment</label>
        <SegmentedControls
          name="disableAttachment"
          options={[
            { value: "false", label: "Show" },
            { value: "true", label: "Hide" },
          ]}
          value={settings.disableAttachment}
          onChange={handleChange}
        />
      </div>
      <hr />
      <button
        className="framer-button-primary w-full"
        onClick={() => {
          window.open(
            `https://app-eu1.hubspot.com/chatflows/${account?.portalId}/`,
            "_blank"
          );
        }}
      >
        View Chatflows
      </button>
    </div>
  );
}
