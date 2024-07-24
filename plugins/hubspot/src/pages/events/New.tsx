import { HSCreateEvent, HSObject, HSType, useCreateEventMutation } from "@/api";
import { Button } from "@/components/Button";
import ContextMenu from "@/components/ContextMenu";
import { PlusIcon } from "@/components/Icons";
import useForm from "@/hooks/useForm";
import { AnimatePresence, motion } from "framer-motion";
import { AnyNode, framer, isFrameNode } from "framer-plugin";
import { useEffect, useState } from "react";

interface Property {
  nodeId: string;
  label: string;
}

const formDefaults = {
  name: "",
  label: "",
  description: "",
  primaryObject: HSObject.Contact,
  propertyDefinitions: [],
};

/**
 * Takes a string and removes whitespace, replaces spaces
 * with underscores and removes all special characters
 */
const slugify = (str: string) => {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");
};

const useSelectedFrameNode = () => {
  const [selection, setSelection] = useState<AnyNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<AnyNode | null>(null);

  useEffect(() => framer.subscribeToSelection(setSelection), []);

  useEffect(() => {
    const selectedNode = selection.length === 1 ? selection[0] : null;
    if (isFrameNode(selectedNode)) {
      setSelectedNode(selectedNode);
    }
  }, [selection]);

  return selectedNode;
};

const textNodes = await framer.getNodesWithType("TextNode");

export function NewEventPage() {
  const selectedFrameNode = useSelectedFrameNode();
  const [properties, setProperties] = useState<Property[]>([]);
  const { mutateAsync, isPending } = useCreateEventMutation();
  const {
    formState: eventDataState,
    handleChange: handleEventDataChange,
    resetForm,
  } = useForm<HSCreateEvent>(formDefaults);

  const handleNewEvent = async () => {
    if (!eventDataState.label || selectedFrameNode === null) {
      framer.notify("Ensure all fields are filled.", {
        variant: "error",
      });
      return;
    }

    const propDefs = properties.map((prop, i) => ({
      ...prop,
      // TODO: Figure out some way to store nodeId for each
      // property, since node IDs contain underscores
      name: `framer_${prop.nodeId.toLowerCase()}`,
      type: HSType.string,
      displayOrder: i,
    }));

    await mutateAsync({
      ...eventDataState,
      name: `framer_${slugify(eventDataState.label)}`,
      propertyDefinitions: [
        ...propDefs,
        {
          hidden: true,
          name: "framer_node",
          label: "Framer Node",
          description:
            "The ID of the Framer (frame) node that is being tracked.",
          type: HSType.enumeration,
          options: [
            {
              label: "Node ID",
              value: selectedFrameNode.id,
            },
          ],
        },
      ],
    });

    // TODO: Apply on click code override and query
    // select the property definitions

    resetForm();
    setProperties([]);
  };

  const handlePropertyChange = (
    index: number,
    field: keyof Property,
    value: string,
  ) => {
    setProperties((prevProps) => {
      const newProps = [...prevProps];
      newProps[index][field] = value;
      return newProps;
    });
  };

  return (
    <div className="col-lg">
      <p>Ensure tracking is enabled and the selected node is not deleted.</p>
      <h6>Details</h6>
      <div className="embedded-container">
        <label htmlFor="label">Name</label>
        <input
          name="label"
          type="text"
          placeholder="Qualified Lead"
          onChange={handleEventDataChange}
          value={eventDataState.label}
        />
      </div>
      <div className="embedded-container">
        <label htmlFor="description">Description</label>
        <input
          name="description"
          type="text"
          placeholder="Events that tell me a customer is interested"
          onChange={handleEventDataChange}
          value={eventDataState.description}
        />
      </div>
      <div className="embedded-container">
        <label htmlFor="target">Target</label>
        <input
          type="text"
          name="target"
          readOnly={true}
          value={selectedFrameNode?.id ?? "Select..."}
          onChange={() => {}}
        />
      </div>
      <p className="helper-text">Select an element from the page.</p>
      <div className="embedded-container">
        <label htmlFor="primaryObject">Object</label>
        <select
          name="primaryObject"
          id="primaryObject"
          onChange={handleEventDataChange}
          value={eventDataState.primaryObject}
        >
          {Object.values(HSObject).map((value) => (
            <option value={value.toUpperCase()} key={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() =>
          setProperties((prevProps) => [
            ...prevProps,
            {
              label: "",
              nodeId: "",
            },
          ])
        }
      >
        <h6>Properties</h6>
        <PlusIcon />
      </div>
      {properties.length === 0 && (
        <p className="text-tertiary text-center my-2">
          Create your own properties from text content on the page.
        </p>
      )}
      {properties.length > 0 && (
        <div className="col max-h-40 overflow-y-auto no-scrollbar">
          <AnimatePresence>
            {properties.map((property, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.09, ease: "linear" },
                }}
                exit={{
                  opacity: 1,
                  y: 10,
                  transition: { duration: 0.09, ease: "linear" },
                }}
              >
                <ContextMenu
                  options={[{ label: "Remove", value: "" }]}
                  onOptionClick={() =>
                    setProperties((prevProps) =>
                      prevProps.filter((_, propIndex) => i !== propIndex),
                    )
                  }
                  activateOn="rightClick"
                >
                  <div className="flex gap-2.5 pl-15">
                    <input
                      type="text"
                      className="flex-1 min-w-0 w-0"
                      placeholder="Name"
                      value={property.label}
                      onChange={(e) =>
                        handlePropertyChange(i, "label", e.target.value)
                      }
                    />
                    <select
                      name="type"
                      id="type"
                      className="flex-1 min-w-0 w-0"
                      value={property.nodeId}
                      onChange={(e) =>
                        handlePropertyChange(i, "nodeId", e.target.value)
                      }
                    >
                      <option value="">Choose text node...</option>
                      {textNodes?.map((node, idx) => (
                        <option value={node.id} key={idx}>
                          {node.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </ContextMenu>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <hr />
      <Button isPending={isPending} onClick={handleNewEvent} className="w-full">
        Create Event
      </Button>
    </div>
  );
}
