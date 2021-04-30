import { monday } from "./monday";
import { AccountInfo } from "./types";

export const fetchAccount = async (): Promise<AccountInfo> => {
  const response = await monday.api(
    `#graphql query { account { id name slug } }`
  );
  console.log(response);
  return response.data.account;
};
