import cx from "classnames";
import React from "react";
import { CaretLeftIcon } from "./Icons";

interface Props {
  children: React.ReactNode;
  title?: string;
  className?: string;
  isSmall?: boolean;
}

export const PluginPage = ({ children, title, className, isSmall }: Props) => (
  <div
    className={cx(
      "flex flex-col h-fit min-w-[260px]",
      {
        "max-w-[260px]": isSmall,
      },
      className
    )}
  >
    {title && (
      <>
        <div className={cx({ "px-15": isSmall })}>
          <hr />
        </div>
        <div className="flex gap-[5px]">
          <div
            onClick={() => history.back()}
            className="flex items-center pl-15 cursor-pointer"
          >
            <CaretLeftIcon />
          </div>
          <div className="py-15">
            <h6>{title}</h6>
          </div>
        </div>
      </>
    )}
    <div className={cx("w-full", { "px-15": isSmall })}>
      <hr />
    </div>
    <div className="col-lg p-15">{children}</div>
  </div>
);
