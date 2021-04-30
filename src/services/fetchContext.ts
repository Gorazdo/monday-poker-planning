import { monday } from "./monday";

/** Deprecated:
 * useContext(AppContext) instead
 */

export const fetchContext = async () => {
  const response = await monday.get("context");
  return response.data;
};
