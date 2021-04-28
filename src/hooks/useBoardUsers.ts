import { useState } from "react";
import { useAsync } from "react-use";
import { monday } from "../services/monday";

export const useBoardUsers = () => {
  return useAsync(async () => {
    const response = await monday.api(
      `query { users { id name title is_admin is_view_only photo_thumb } }`
    );
    return response.data.users;
  }, []);
};
