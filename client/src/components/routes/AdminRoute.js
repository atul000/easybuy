import React, { useEffect, useState } from "react";
import { Route, Link, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../../functions/auth";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          console.log("admin", res);
          setOk(true);
        })
        .catch((err) => {
          console.log("admin error", err);
          setOk(false);
        });
    }
  }, [user]);

  return ok ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <LoadingToRedirect />
  );
};

export default AdminRoute;
