import React from "react";
import { Route, Link, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoute = ({ component: Component, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  return user && user.token ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <LoadingToRedirect />
  );
};

export default UserRoute;
