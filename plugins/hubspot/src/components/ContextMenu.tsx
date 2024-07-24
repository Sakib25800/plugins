import React, { useCallback, useEffect, useRef, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface ContextMenuProps {
  children: React.ReactElement;
  options: Option[];
  onOptionClick: (option: string) => void;
  activateOn?: "click" | "rightClick" | "both";
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  options,
  onOptionClick,
  activateOn = "click",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLUListElement>(null);
  const clickPositionRef = useRef({ x: 0, y: 0 });

  const adjustPosition = useCallback(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      let { x, y } = clickPositionRef.current;
      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width;
      }
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height;
      }
      setPosition({ x, y });
    }
  }, []);

  const handleActivation = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    clickPositionRef.current = { x: event.clientX, y: event.clientY };
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isOpen) {
      adjustPosition();
    }
  }, [isOpen, adjustPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const childProps: React.HTMLAttributes<HTMLElement> = {};
  if (activateOn === "click" || activateOn === "both") {
    childProps.onClick = handleActivation;
  }
  if (activateOn === "rightClick" || activateOn === "both") {
    childProps.onContextMenu = handleActivation;
  }

  return (
    <>
      {React.cloneElement(children, childProps)}
      {isOpen && (
        <ul
          ref={menuRef}
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            boxShadow: "0 10px 20px rgba(0, 0, 0, .1)",
          }}
          className="flex flex-col bg-white dark:bg-[#2b2b2b] rounded-[10px] z-10 py-1.5"
          role="menu"
        >
          {options.map((option, index) => (
            <li
              key={index}
              onClick={() => {
                setIsOpen(false);
                onOptionClick(option.value);
              }}
              role="menuitem"
              className="py-1 pl-2.5 pr-[7px] mx-[5px] hover:bg-tint text-white rounded-[5px] cursor-default"
            >
              <span className="font-normal pr-1.5">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ContextMenu;
