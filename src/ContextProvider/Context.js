import React, { createContext, useState } from 'react'


export const LoginContext = createContext("");

const Context = ({children}) => {

    // const [logindata,setLoginData] = useState(JSON.parse(localStorage.getItem("userdbtoken" || {})));
    const [userDetails,setUserDetails] = useState(localStorage.getItem("userDetails" || ''));
    const [logindata,setLoginData] = useState('');
    // const [userDetails,setUserDetails] = useState('');
    const context = {
        logindata,
        setLoginData,
        userDetails,
        setUserDetails,
      };

  return (
    <>
    <LoginContext.Provider value={context}>
        {children}
    </LoginContext.Provider>
    </>
  )
}

export default Context