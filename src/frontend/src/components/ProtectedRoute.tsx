import { Outlet, useLocation, Navigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";



export default function ProtectedRoute() {
	const location = useLocation();
	const {isAuthenticated} = useAuth();
	// let isAuthenticated = true;

	if (!isAuthenticated) {
		return <Navigate to="/signin" state={{ from: location }} replace />
	}

	return (<Outlet />);

}