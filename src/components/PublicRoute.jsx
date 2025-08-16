import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // If user is fully authenticated (completed setup), redirect to main app
  if (isAuthenticated) {
    return <Navigate to="/for-you" replace />;
  }
  
  // If user is not fully authenticated, render the public component (login/signup)
  return children;
};

export default PublicRoute;
