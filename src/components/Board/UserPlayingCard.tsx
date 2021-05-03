import classes from "./index.module.css";
import { PlayingCard } from "../../library/PlayingCard";
import { Avatar } from "../../library/Avatar";
import { CARD_BACKS, Vote } from "../../constants/cards";
import clsx from "clsx";
import { useSettings } from "../../contexts/AppContext/useSettings";

export const UserPlayingCard = ({
  user,
  joined,
  vote,
  voting_status,
  style,
}) => {
  const cardBack = useCardBack(user.id + 3, voting_status);
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
        variant={variant}
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
  const { cardsMap } = useSettings();
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
  index: number,
  voting_status
): typeof CARD_BACKS[number] | "king" => {
  if (voting_status === "Moderator") {
    return "king";
  }
  return CARD_BACKS[index % CARD_BACKS.length];
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