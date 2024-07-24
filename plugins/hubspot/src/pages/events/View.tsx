import { useEventsQuery, useUserQuery } from "@/api";
import { Spinner } from "@/components/Spinner";
import { AnyNode, framer } from "framer-plugin";

const findNode = async (
  id: string,
  type: "TextNode" | "AnyNode",
  ignoreCase: boolean,
) => {
  let node: AnyNode | null | undefined;

  if (ignoreCase) {
    node = await framer.getNode(id);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes = await framer.getNodesWithType(type as any);
    node = nodes.find((n) => n.id.toLowerCase() === id.toLowerCase());
  }

  if (!node) {
    framer.notify(
      "We couldn't find that element. You may have deleted it since the event was created.",
      { variant: "error" },
    );
    return;
  }

  framer.zoomIntoView([node.id]);
};

export function ViewEventPage({ params }: { params: Record<string, string> }) {
  const { data: user } = useUserQuery();
  const { data: events, isLoading } = useEventsQuery();
  const event = events?.find((e) => e.id === params.eventId);

  if (isLoading) {
    return <Spinner inheritColor inline className="mx-auto my-10" />;
  }

  if (!event) {
    return (
      <p className="text-tertiary text-center my-10">
        Something went wrong. We couldn't find that event.
      </p>
    );
  }

  const { labels, id, properties, nodeId } = event;
  const customFramerProps = properties.filter(
    (prop) => prop.name.includes("framer") && prop.name !== "framer_node",
  );

  return (
    <div className="col-lg">
      <h6>Details</h6>
      <div className="embedded-container">
        <p className="text-primary">Name</p>
        <p>{labels.singular}</p>
      </div>
      <div className="embedded-container">
        <p className="text-primary">Element</p>
        <button
          onClick={() => findNode(nodeId, "AnyNode", true)}
          className="w-fit"
        >
          Find
        </button>
      </div>
      {customFramerProps && (
        <>
          <hr />
          <h6>Properties</h6>
        </>
      )}
      {customFramerProps.map(({ label, lowercaseNodeId }, i) => (
        <div key={i} className="embedded-container">
          <p className="text-primary">{label}</p>
          <button
            className="w-fit"
            onClick={() => findNode(lowercaseNodeId, "TextNode", false)}
          >
            Find
          </button>
        </div>
      ))}
      <hr />
      <button
        className="framer-button-primary w-full"
        onClick={() =>
          window.open(
            `https://app-eu1.hubspot.com/events/${user?.hubId}/manage/${id}/overview`,
            "_blank",
          )
        }
      >
        View in HubSpot
      </button>
    </div>
  );
}
