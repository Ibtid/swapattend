import { Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import UiPaths from "../paths/uiPaths";
import PrivateRoute from "./PrivateRoute";

const AuthForm = lazy(() => import("../pages/AuthForm"))
const TaskManager = lazy(() => import("../pages/TaskManager"));

const Loading = () => <div className="text-3xl text-center">Loading...</div>;

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to={UiPaths.auth} />} />
        
        <Route path={UiPaths.auth} element={<AuthForm />} />

        
        <Route
          path={UiPaths.task}
          element={
            <PrivateRoute redirectTo={UiPaths.auth}>
              <TaskManager />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<div className="text-3xl">Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
