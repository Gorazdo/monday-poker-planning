import classes from "./index.module.css";
import { PlayingCard } from "../../library/PlayingCard";
import { Avatar } from "../../library/Avatar";
import { CARD_BACKS, Vote } from "../../constants/cards";
import clsx from "clsx";
import { useCardsSequence } from "../../hooks/useCardsSequence";

export const UserPlayingCard = ({
  user,
  joined,
  vote,
  voting_status,
  phase,
  style,
}) => {
  const cardBack = useCardBack(user.id, voting_status);
  const { variant, label, value } = usePlayingCardProps(vote, voting_status);
  return (
    <div
      className={clsx(classes.userCard, {
        [classes.userCardJoined]: joined,
      })}
      style={style}
    >
      <PlayingCard
        value={value}
        label={label}
        variant={phase === "Session ended" ? "back" : variant}
        backCover={`/cards/${cardBack}.svg`}
        voting_status={voting_status}
        customAriaLabel={`${user.name} is ${voting_status ?? "off"}`}
      />
      <div
        className={clsx(classes.userCardAvatarWrapper, {
          [classes.userCardAvatarWrapperModerator]:
            voting_status === "Moderator",
        })}
      >
        <Avatar
          url={user.photo_thumb}
          name={user.name}
          className={classes.userCardAvatar}
        />
      </div>
    </div>
  );
};

export const usePlayingCardProps = (
  vote: Vote | null,
  voting_status
): {
  variant: "back" | "face";
  label?: string;
  value?: Vote;
} => {
  const { cardsMap } = useCardsSequence();
  if (vote === null || voting_status === "Moderator") {
    return {
      variant: "back",
    };
  }

  return {
    ...cardsMap[vote],
    variant: "face",
  };
};

const useCardBack = (
  userId: number,
  voting_status
): typeof CARD_BACKS[number] | "king" => {
  if (voting_status === "Moderator") {
    return "king";
  }
  if (userId === 21757101) {
    return "pink";
  }
  if (userId === 21749286) {
    return "green";
  }
  if (userId === 21837843) {
    return "purple";
  }
  if (userId === 21757101) {
    return "blue";
  }
  return CARD_BACKS[userId % CARD_BACKS.length];
};

export const UserPlayingCardStub = () => {
  return (
    <div className={classes.userCard}>
      <PlayingCard value={0} label="0" variant="back" />
      <div className={classes.userCardAvatarWrapper}>
        <Avatar url="" name="" className={classes.userCardAvatar} />
      </div>
    </div>
  );
};
