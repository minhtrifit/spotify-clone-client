import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks";
import { RootState } from "../redux/store";

import { handleAccessToken } from "../redux/reducers/user.reducer";

import { axiosInterReq, axiosInterRes } from "../helpers/axios";

const ProtectedRoute = ({ roles, children }: any) => {
  axiosInterReq;
  axiosInterRes;

  const dispatchAsync = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatchAsync(handleAccessToken());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const role: string | undefined = useSelector<RootState, string | undefined>(
    (state) => state.user.profile?.roles
  );


  useEffect(() => {
    if (role === undefined) {
      navigate("/");
    }

    if (role !== undefined && !roles.includes(role)) {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return children;
};

export default ProtectedRoute;
