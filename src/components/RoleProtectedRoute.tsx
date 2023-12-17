import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { User } from "../types/user";

const RoleProtectedRoute = ({ roles, children }: any) => {
  const navigate = useNavigate();

  const profile = useSelector<RootState, User | null>(
    (state) => state.user.profile
  );

  useEffect(() => {
    if (profile !== null && !roles.includes(profile.roles)) navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return children;
};

export default RoleProtectedRoute;
