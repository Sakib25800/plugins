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
    className={cx(`framer-button-${variant}`, className)}
    disabled={isPending || disabled}
    {...rest}
  >
    {isPending ? (
      <Spinner
        inheritColor={variant === "secondary"}
        className="mx-auto"
        inline
      />
    ) : (
      children
    )}
  </button>
);
