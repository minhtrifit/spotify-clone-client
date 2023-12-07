import { createAction } from "@reduxjs/toolkit";

export const logoutAccount = createAction<string>("user/logoutAccount");
