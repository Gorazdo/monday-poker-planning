import clsx from "clsx";
import { useState } from "react";
import { Card } from "../../constants/cards";
import { VotingStatusType } from "../../services/createColumn";
import classes from "./index.module.css";

export interface PlayingCardProps extends Card {
  faceCover?: string;
  backCover?: string;
  fontSize?: number;
  variant: "face" | "back";
  selected?: boolean;
  customAriaLabel?: string;
  voting_status?: VotingStatusType;
  onChange?: (value: Card["value"], variant: "face" | "back") => void;
}

const useAriaLabel = (variant, value) => {
  if (variant === "back") {
    return "The card is face down";
  }
  return `It's a ${value} card, faced up`;
};

const useButtonAriaLabel = (variant, value, label, customAriaLabel) => {
  if (customAriaLabel) {
    return customAriaLabel;
  }
  if (variant === "face") {
    if (Number.isFinite(value)) {
      return `Select card: ${value} SP`;
    }
    return `Select card: "${label}"`;
  }

  return "Reveal card";
};

export const PlayingCard: React.FC<PlayingCardProps> = ({
  value,
  faceCover,
  backCover,
  voting_status,
  label,
  fontSize = 32,
  variant,
  selected,
  customAriaLabel,
  onChange,
}) => {
  const rotate = variant === "face" ? 180 : 0;
  const handleClick = (event) => {
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
        aria-label={useButtonAriaLabel(variant, value, label, customAriaLabel)}
        className={clsx(classes.root, classes.aspectRatioInner, {
          [classes.rootFaceUp]: variant === "face",
          [classes.rootFaceDown]: variant === "back",
          [classes.rootSelected]: selected,
          [classes.rootPale]:
            voting_status === "Joined" || voting_status === "Voting",
          [classes.rootVoted]: voting_status === "Voted",
          [classes.rootModerator]: voting_status === "Moderator",
        })}
        style={{ transform: `rotateY(${rotate}deg)` }}
      >
        <div className={classes.card}>
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
        </div>
      </button>
    </div>
  );
};
