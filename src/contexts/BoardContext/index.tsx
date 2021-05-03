import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useMap } from "react-use";
import { useLoadingPercent } from "../../hooks/useLoadingStatus";
import { FullScreenLoader } from "../../library/FullScreenLoader";
import { createGroup } from "../../services/createGroup";
import { fetchBoardGroups } from "../../services/fetchBoardGroups";
import { StatusMap } from "../../services/types";
import {
  boardSlice,
  fetchCurrentItemsThunk,
  selectGroupId,
} from "../../state/boardSlice";
import { selectBoardId } from "../../state/contextSlice";
import { useAppDispatch } from "../../state/store";
import { useBoardInitialization } from "./useBoardInitialization";

export const BoardProvider = ({ children, boardType }) => {
  const boardId = useSelector(selectBoardId);
  const dispatch = useAppDispatch();
  const [statuses, { set: setStatus }] = useMap<StatusMap>({
    prepared: "pending",
    group: "pending",
  });
  const groupId = useSelector(selectGroupId);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchCurrentItemsThunk({ boardId, groupId }));
    }
  }, [groupId, boardId]);

  useBoardInitialization({ boardType, boardId, setStatus });

  useEffect(() => {
    if (statuses.prepared === "fulfilled") {
      fetchBoardGroups(boardId)
        .then((groups) => {
          if (groups.length === 0) {
            createGroup(boardId, "My Task").then((group) => {
              dispatch(boardSlice.actions.setGroup(group));
              setStatus("group", "fulfilled");
            });
          } else {
            const [latestGroup] = groups;
            dispatch(boardSlice.actions.setGroup(latestGroup));
            setStatus("group", "fulfilled");
          }
        })
        .catch((error) => {
          setStatus("group", error);
        });
    }
  }, [boardId, statuses.prepared, setStatus]);

  const loadingPercent = useLoadingPercent(statuses);

  if (Object.values(statuses).every((status) => status === "fulfilled")) {
    return <div>{children}</div>;
  }
  return (
    <FullScreenLoader
      statuses={statuses}
      label="Shuffling the deck..."
      percent={loadingPercent}
    />
  );
};
