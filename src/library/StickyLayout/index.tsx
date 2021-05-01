import classes from "./index.module.css";

export const StickyLayout = ({ topSlot, bottomSlot }) => (
  <div className={classes.pageWrapper}>
    <main>{topSlot}</main>
    <footer className={classes.footerWrapper}>{bottomSlot}</footer>
  </div>
);
