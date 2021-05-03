import { SerializedError } from "@reduxjs/toolkit";

export type StatusType = "pending" | "fulfilled" | SerializedError;
