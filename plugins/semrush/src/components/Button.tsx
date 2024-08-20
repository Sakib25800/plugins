import cx from "classnames";
import { Spinner } from "./Spinner";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive";
  isPending?: boolean;
}

export const Button = ({
  variant = "primary",
  children,
  className,
  isPending = false,
  disabled,
  ...rest
}: Props) => (
  <button
    className={cx(
      "flex justify-center items-center relative",
      {
        "framer-button-primary": variant === "primary",
        "framer-button-secondary": variant === "secondary",
        "framer-button-destructive": variant === "destructive",
      },
      className
    )}
    disabled={isPending || disabled}
    {...rest}
  >
    {isPending ? <Spinner inheritColor={variant === "secondary"} /> : children}
  </button>
);
