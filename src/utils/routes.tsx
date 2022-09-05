import React, { lazy } from "react";

const HomePage = lazy(() => import("../pages/Home"));
const AddMeeting = lazy(() => import("../pages/AddMeeting"));

const NoMatch = () => {
  return <div>404</div>;
};
export const routes = [
  {
    path: "/home",
    component: HomePage,
    isPrivate: false,
    exact: true,
  },
  {
    path: "/add-meeting",
    component: AddMeeting,
    isPrivate: false,
    exact: true,
  },
  {
    path: "/",
    component: HomePage,
    isPrivate: false,
    exact: true,
  },
  {
    path: "/:notFound",
    component: NoMatch,
  },
];
