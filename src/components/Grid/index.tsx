import classes from "./index.module.css";
import clsx from "clsx";

export const Grid = ({ children, variant }) => {
  return <div className={clsx(classes.root, classes[variant])}>{children}</div>;
};
