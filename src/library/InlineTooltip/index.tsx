import classes from "./index.module.css";

// import Tooltip from "monday-ui-react-core/dist/Tooltip";
export const InlineTooltip = ({
  content,
  TooltipProps = {},
  children,
  ...rest
}) => {
  return (
    <span title={content} {...TooltipProps}>
      <span {...rest} className={classes.tooltiped}>
        {children}
      </span>
    </span>
  );
};
