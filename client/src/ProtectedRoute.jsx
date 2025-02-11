import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = Cookies.get('token'); 
  console.log(Cookies.get('token'))
  
  console.log(isAuthenticated)
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
