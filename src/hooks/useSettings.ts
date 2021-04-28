import { useEffect, useState } from "react";
import { monday } from "../services/monday";

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    monday.listen("settings", (res) => {
      setSettings(res.data);
    });
    // return () => unsubscribe();
  }, []);
  return settings;
};
