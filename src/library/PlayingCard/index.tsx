import clsx from "clsx";
import { useState } from "react";
import { Card } from "../../constants/cards";
import classes from "./index.module.css";

export interface PlayingCardProps extends Card {
  faceCover?: string;
  backCover?: string;
  fontSize?: number;
  variant: "face" | "back";
  selected?: boolean;
  onChange?: (value: Card["value"], variant: "face" | "back") => void;
}

const useAriaLabel = (variant, value) => {
  if (variant === "back") {
    return "The card is face down";
  }
  return `It's a ${value} card, faced up`;
};

const useButtonAriaLabel = (variant, value) => {
  if (variant === "face") {
    return "Select card";
  }
  return "Reveal card";
};

export const PlayingCard: React.FC<PlayingCardProps> = ({
  value,
  faceCover,
  backCover,
  label,
  fontSize = 32,
  variant,
  selected,
  onChange,
}) => {
  const [rotate, setRotate] = useState(variant === "face" ? 180 : 0);
  const handleClick = (event) => {
    // if (variant === "face") {
    //   setRotate(rotate + 180);
    // } else {
    //   setRotate(rotate + 180);
    // }
    if (typeof onChange === "function") {
      onChange(value, variant);
    }
  };
  return (
    <div
      className={classes.aspectRatio}
      aria-label={useAriaLabel(variant, value)}
    >
      <button
        onClick={handleClick}
        aria-label={useButtonAriaLabel(variant, value)}
        className={clsx(classes.root, classes.aspectRatioInner, {
          [classes.rootFaceUp]: variant === "face",
          [classes.rootFaceDown]: variant === "back",
          [classes.rootSelected]: selected,
        })}
        style={{ transform: `rotateY(${rotate}deg)` }}
      >
        <div className={clsx(classes.content, classes.face)}>
          <div
            className={clsx(classes.innerContent)}
            style={{
              backgroundImage: faceCover ? `url(${faceCover})` : "none",
              fontSize: `${fontSize}px`,
            }}
          >
            {label}
          </div>
        </div>
        <div className={clsx(classes.content, classes.back)}>
          <div
            className={classes.innerContent}
            style={backCover && { backgroundImage: `url(${backCover})` }}
          ></div>
        </div>
      </button>
    </div>
  );
};
