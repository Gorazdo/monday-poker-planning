import classes from "./index.module.css";
import Tooltip from "monday-ui-react-core/dist/Tooltip";
export const Avatar = ({ url, name }) => {
  return (
    <Tooltip content={name}>
      <div
        className={classes.avatar}
        style={{ backgroundImage: `url(${url})` }}
      />
    </Tooltip>
  );
};
