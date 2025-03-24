import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ redirectTo, children }) => {
  const { token } = useSelector((state) => state.auth);

  return token ? children : <Navigate to={redirectTo} replace />;
};

export default PrivateRoute;
