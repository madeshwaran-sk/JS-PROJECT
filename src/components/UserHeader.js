import React, { useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LoginContext } from '../ContextProvider/Context';
import { useNavigate , useLocation,NavLink } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { logout } from "../services/Apis"



const UserHeader = () => {

  const { userDetails, setUserDetails } = useContext(LoginContext);

  const history = useNavigate();

  const handleClick = async () => {
    // const payloaddata = {
    //   userName: userDetails,
    //   token:localStorage.getItem("userdbtoken")
    // }
    // const data = await logout(payloaddata);
    // if (data.status === 201) {
      localStorage.removeItem("userdbtoken"); 
      localStorage.removeItem("userDetails"); 
      setUserDetails('');
      toast.success("logout successful");
      setTimeout(() => {
        history("/login");
      }, 2000)
    // } else {
    //   toast.error("some thing went wrong")
    // }
  }


  return (
          <>
      <Navbar className="header" >
        <Container>
          <NavLink to="/" className=" text-light text-decoration-none"> <img src="https://itnowtechnologies.us/wp-content/uploads/2023/03/cropped-ITNOW-Technologies-Logo.png" style={{width:130}} alt="" /></NavLink>
          <Nav className="">
            <div to="/login" className=" mx-2 text-light text-decoration-none" onClick={handleClick}>Logout</div>
            {/* <img src="/logo192.png" style={{width:50}} alt="" /> */}
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default UserHeader