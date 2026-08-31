import { Outlet, useLocation, Navigate } from "react-router-dom";

export default function ProtectedRoute() {
	const location = useLocation();
	let isAuthenticated = true;

	if (!isAuthenticated) {
		return <Navigate to="/signin" state={{ from: location }} replace />
	}

	return (<Outlet />);

}