import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
    let isAuthorized = localStorage.getItem('userdbtoken')
    return(
        isAuthorized !== null || isAuthorized !== undefined || isAuthorized !== "" ? <Outlet/>  : <Navigate to="login" />
    )
    
}