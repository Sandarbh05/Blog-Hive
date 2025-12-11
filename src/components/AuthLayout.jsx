import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({children, authentication = true}) {
    const navigate=useNavigate();
    const [loader, setLoader]=useState(true);
    const authStatus=useSelector((state)=> state.auth.status);

    useEffect(()=>{

        if(authentication && authStatus !== authentication){ //t && t when loggedin != true --> false
            navigate('/login')
        }else if(!authentication && authStatus!==authentication){ //f & t when loggedin !== t --> true 
            navigate("/")
        }

        setLoader(false);
        
    }, [authStatus, navigate, authentication])

  return loader ? <h1>loading...</h1> : <>{children}</>;

}

// src/components/AuthLayout.jsx
// import React, { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// export default function AuthLayout({ children, authentication = true }) {
//   const navigate = useNavigate();

//   // defensive selector: if state.auth is missing, default to a safe shape.
//   const auth = useSelector((state) => state.auth ?? { status: 'idle', user: null });

//   // derived values
//   const isLoading = auth.status === 'idle' || auth.status === 'loading';
//   const isAuthenticated = !!auth.user;

//   useEffect(() => {
//     // don't attempt redirects while auth status is still loading
//     if (isLoading) return;

//     // If route requires auth but user is NOT authenticated => go to login
//     if (authentication && !isAuthenticated) {
//       if (location.pathname !== '/login') navigate('/login', { replace: true });
//       return;
//     }

//     // If this route is for guests (authentication === false) but user is authenticated => go home
//     if (!authentication && isAuthenticated) {
//       if (location.pathname !== '/') navigate('/', { replace: true });
//       return;
//     }
//   }, [authentication, isAuthenticated, isLoading, navigate]);

//   // while auth is initializing, show a simple loader (no local setState in effect)
//   if (isLoading) return <div className="w-full py-8 text-center">Loading...</div>;

//   // otherwise render children (the wrapped page: Signup/Login/etc)
//   return <>{children}</>;
// }
