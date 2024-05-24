import cx from "classnames";
import React from "react";

interface Props {
  children: React.ReactNode;
  title?: string;
  className?: string;
  isSmall?: boolean;
}

export const PluginContainer = ({
  children,
  title,
  className,
  isSmall,
}: Props) => (
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
        <div className="flex gap-[5px] items-center py-15 px-15">
          <div onClick={() => history.back()} className="cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
              <path
                d="M 5 2 L 1.5 6 L 5 9.5"
                fill="transparent"
                strokeWidth={1.5}
                stroke="rgb(153,153,153)"
                strokeLinecap="round"
                strokeMiterlimit={10}
                strokeDasharray=""
              ></path>
            </svg>
          </div>
          <h6>{title}</h6>
        </div>
      </>
    )}
    <div className={cx("w-full", { "px-15": isSmall })}>
      <hr />
    </div>
    <div className="col-lg p-15">{children}</div>
  </div>
);
