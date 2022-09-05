import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "../../utils/routes";

const ApplicationRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>loading...</div>}>
        <Routes>
          {routes.map(({ component: Component, ...route }, index) => (
            <Route element={<Component />} {...route} key={route.path} />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default ApplicationRoutes;
