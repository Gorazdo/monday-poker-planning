import clsx from "clsx";
import classes from "./index.module.css";

export const PopupContent = ({ ...props }) => {
  return <div {...props} className={clsx(classes.root, props.className)} />;
};
