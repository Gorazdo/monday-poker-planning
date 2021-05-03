import { useEffect } from "react";
import { monday } from "../services/monday";

export const useMondayListenerEffect = (name, callback) => {
  useEffect(() => {
    monday.listen(name, callback);
    console.log("listen to", name, monday);
    return () => {
      console.log(`monday.listen(${name}) has been unmounted`);
      // @ts-ignore
      monday._clearListeners();
      console.log("All listeners were cleared");
    };
  }, [name, callback]);
};
