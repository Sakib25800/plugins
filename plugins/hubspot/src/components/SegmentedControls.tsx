import { motion } from "framer-motion";
import { ChangeEvent } from "react";

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: [Option, Option];
  value: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export const SegmentedControls = ({
  options,
  value,
  name,
  onChange,
}: SegmentedControlProps) => {
  const selectedIndex = options.findIndex((option) => option.value === value);

  const handleChange = (newValue: string) => {
    if (newValue !== value) {
      const mockEvent = {
        target: {
          value: newValue,
          name,
        },
      } as ChangeEvent<HTMLSelectElement>;
      onChange(mockEvent);
    }
  };

  return (
    <div className="relative bg-tertiary w-[134px] h-[32px] p-0.5 rounded-lg flex items-center justify-center gap-1 font-semibold text-xs select-none">
      <motion.div
        style={{
          boxShadow:
            "0px 2px 4px 0px rgba(0, 0, 0, .1), 0px 1px 0px 0px rgba(0, 0, 0, .05)",
        }}
        className="absolute top-[2px] left-[2px] w-[64px] h-[28px] bg-white dark:bg-[#555555] rounded-lg"
        initial={false}
        animate={{ x: selectedIndex * 66 + "px" }}
        transition={{ type: "spring", stiffness: 700, damping: 50 }}
      />
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => handleChange(option.value)}
          className={`relative flex-grow text-center z-10 ${
            value === option.value
              ? "text-framer-blue dark:text-white cursor-default"
              : "text-tertiary cursor-pointer"
          }`}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};
