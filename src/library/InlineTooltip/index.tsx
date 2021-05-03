import Tooltip from "monday-ui-react-core/dist/Tooltip";
import classes from "./index.module.css";

export const InlineTooltip = ({
  content,
  TooltipProps = {},
  children,
  ...rest
}) => {
  return (
    <Tooltip content={content} {...TooltipProps}>
      <span {...rest} className={classes.tooltiped}>
        {children}
      </span>
    </Tooltip>
  );
};
