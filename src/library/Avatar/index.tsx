import classes from "./index.module.css";
import Tooltip from "monday-ui-react-core/dist/Tooltip";
import clsx from "clsx";
export const Avatar = ({ url, name, className = "" }) => {
  return (
    <Tooltip content={name}>
      <div
        className={clsx(classes.avatar, className)}
        style={{ backgroundImage: `url(${url})` }}
      />
    </Tooltip>
  );
};
