import { useEffect } from "react";
import { useAuth } from "../context/authcontext"
import { useNavigate } from "react-router";
const Root = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(user);
        if (!user) {
            navigate("/login")
            
        } 
        else if (user && user.role === "admin") {
            navigate("/admin/dashboard")
        }
        else if (user && user.role === "user") {
            navigate("/user/dashboard")
        } 
    
    },[user , navigate])
    return null;

}
export default Root;
