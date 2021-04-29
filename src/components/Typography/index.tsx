import classes from "./index.module.css";
import clsx from "clsx";

export interface TypographyProps {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "p";
  component?: string;
  className?: string;
  gutterBottom?: boolean;
  children: any;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  className,
  gutterBottom,
  component: Component = variant,
  ...rest
}) => {
  return (
    <Component
      // @ts-ignore
      className={clsx(
        "heading-component",
        `heading-element-type-${variant}`,
        {
          [classes.paragraph]: variant === "p",
          [classes.gutterBottom]: gutterBottom,
        },
        className
      )}
      {...rest}
    />
  );
};
