import clsx from "clsx";
import { useEffect, useState } from "react";
import classes from "./index.module.css";

export interface PlayingCardProps {
  value: number;
  label: string;
  face?: string;
  back?: string;
  variant: "face" | "back";
  onChange: (value: number, variant: "face" | "back") => void;
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
  face,
  back,
  label,
  variant,
  onChange,
}) => {
  const [state, setState] = useState(variant);
  const [rotate, setRotate] = useState(variant === "face" ? 180 : 0);
  const handleClick = (event) => {
    if (state === "face") {
      setState("back");
      setRotate(rotate + 180);
    } else {
      setState("face");
      setRotate(rotate + 180);
    }
  };
  useEffect(() => {
    onChange?.(value, state);
  }, [onChange, value, state]);
  return (
    <div
      className={classes.aspectRatio}
      aria-label={useAriaLabel(state, value)}
    >
      <button
        onClick={handleClick}
        aria-label={useButtonAriaLabel(state, value)}
        className={clsx(classes.root, classes.aspectRatioInner, {
          [classes.rootFaceUp]: state === "face",
          [classes.rootFaceDown]: state === "back",
        })}
        style={{ transform: `rotateY(${rotate}deg)` }}
      >
        <div
          className={clsx(classes.content, classes.face)}
          style={{ backgroundImage: `url(${face})` }}
        >
          <div className={classes.innerContent}>{label}</div>
        </div>
        <div
          className={clsx(classes.content, classes.back)}
          style={{ backgroundImage: `url(${back})` }}
        >
          <div className={classes.innerContent}></div>
        </div>
      </button>
    </div>
  );
};
