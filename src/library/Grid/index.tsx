import classes from "./index.module.css";
import clsx from "clsx";

interface GridProps {
  variant?: keyof typeof classes;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  variant,
  className = "",
  ...rest
}) => {
  return (
    <div {...rest} className={clsx(classes.root, classes[variant], className)}>
      {children}
    </div>
  );
};
