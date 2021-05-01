import { monday } from "./monday";
import { User } from "./types";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await monday.api(`#graphql 
    { 
      users { 
        id 
        name 
        title 
        is_admin 
        is_guest
        is_pending 
        is_view_only 
        photo_thumb 
      } 
    }`);
  return response.data.users;
};
