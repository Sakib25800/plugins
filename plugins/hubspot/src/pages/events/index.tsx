import { useDeleteEventMutation, useEventsQuery } from "@/api";
import { CrossIcon, PointerIcon } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { useLocation } from "wouter";

export function EventsPage() {
  const [, navigate] = useLocation();
  const { data: events, isLoading } = useEventsQuery();
  const { mutate: deleteEvent, variables } = useDeleteEventMutation();

  const optimisticEvents = events?.filter(
    (e) => e.name !== variables?.eventName
  );

  if (isLoading) {
    return <Spinner inheritColor inline className="mx-auto my-10" />;
  }

  return (
    <div className="col-lg justify-between">
      {(optimisticEvents?.length ?? 0) > 0 ? (
        optimisticEvents?.map(
          ({ labels: { singular }, name, nodeId, id }, i) => {
            return (
              <div className="row items-center h-30 pl-15" key={i}>
                <p title={singular} className="truncate w-[71px]">
                  {singular}
                </p>
                <div
                  className="flex-grow h-30 row items-center gap-2 pr-2 pl-1 bg-tertiary rounded-lg ml-auto cursor-pointer"
                  onClick={() => navigate(`/events/${id}`)}
                >
                  <div className="min-w-[22px]">
                    <PointerIcon />
                  </div>
                  <p className="text-primary flex-grow">{nodeId}</p>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEvent({ eventName: name });
                    }}
                    className="cursor-pointer ml-auto z-20"
                  >
                    <CrossIcon />
                  </div>
                </div>
              </div>
            );
          }
        )
      ) : (
        <p className="text-tertiary text-center my-10">
          Create custom HubSpot events for your site and view them here.
        </p>
      )}
      <hr />
      <button
        className="framer-button-primary w-full"
        onClick={() => navigate("/events/new")}
      >
        New Event
      </button>
    </div>
  );
}
