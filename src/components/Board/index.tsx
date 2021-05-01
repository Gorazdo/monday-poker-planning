import Button from "monday-ui-react-core/dist/Button";
import classes from "./index.module.css";
import { Typography } from "../../library/Typography";
import { Grid } from "../../library/Grid";
import { PlayingCard } from "../../library/PlayingCard";
import { useUsers } from "../../contexts/BoardContext/useUsers";
import { Avatar } from "../../library/Avatar";
import { User } from "../../services/types";
import { CARD_BACKS } from "../../constants/cards";

const useCardBack = (index: number): typeof CARD_BACKS[number] => {
  return CARD_BACKS[index % CARD_BACKS.length];
};

export const Board = () => {
  const users = useUsers();
  return (
    <section className={classes.root}>
      <div className={classes.toolbar}>
        <Typography variant="h2" gutterBottom>
          The voting subject
        </Typography>
        <Grid variant="row">
          <Button kind="secondary">Start New Game</Button>
          <Button>Reveal Cards</Button>
        </Grid>
      </div>
      <Grid variant="cardsBoard">
        {users.length === 0 && (
          <>
            <UserPlayingCardStub />
            <UserPlayingCardStub />
          </>
        )}
        {users
          .sort((a, b) => b.id - a.id)
          .map((user, index) => (
            <UserPlayingCard key={user.id} user={user} index={index} />
          ))}
      </Grid>
    </section>
  );
};

const UserPlayingCard = ({ user, index }) => {
  const cardBack = useCardBack(index);
  return (
    <div className={classes.userCard}>
      <PlayingCard
        value={3}
        label="3"
        variant="back"
        backCover={`/cards/${cardBack}.svg`}
      />
      <div className={classes.userCardAvatarWrapper}>
        <Avatar
          url={user.photo_thumb}
          name={user.name}
          className={classes.userCardAvatar}
        />
      </div>
    </div>
  );
};

const UserPlayingCardStub = ({}) => {
  return (
    <div className={classes.userCard}>
      <PlayingCard value={0} label="0" variant="back" />
      <div className={classes.userCardAvatarWrapper}>
        <Avatar url="" name="" className={classes.userCardAvatar} />
      </div>
    </div>
  );
};
