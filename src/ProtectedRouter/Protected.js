import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { refreshToken, fetchUser, setAuthenticated } from '../redux/features/auth';
import { CircularProgress } from '@mui/material'
import api from '../lib/api'

export default function Protected({ children, requireAuth = false }) {
    // const { accessToken, user, isLoading, isAuthenticated } = useSelector((state) => state.auth)
    // const [start, setStart] = useState(true)
    // const dispatch = useDispatch()

    // async function init() {
    //     try {
    //         if (!isAuthenticated) {
    //             return
    //         }

    //         if (!accessToken) {
    //             await dispatch(refreshToken()).unwrap();   
    //         }
    //         if (accessToken && !user) {
    //             await dispatch(fetchUser()).unwrap();
    //         }
    //     } catch (error) {
    //         console.log('Auth check error:', error);
    //     } finally {
    //         setStart(false);
    //     }
    // }
    // useEffect(() => {
    //     const data = api.post('http://localhost:4000/api/auth/verify', {}, { withCredentials: true})
    //     if (data.valid) dispatch(setAuthenticated(true))    
    // }, [])

    // useEffect(() => {
    //     init()
    // }, [])

    // if (isLoading || start) {
    //     return (
    //         <div>
    //             <CircularProgress />
    //         </div>
    //     )
    // }

    // if (requireAuth && !accessToken) {
    //     return (
    //         <div className="text-center py-8">
    //             <p>Vui lòng đăng nhập để truy cập tính năng này</p>
    //             <button
    //                 onClick={() => {/* Mở login modal */ }}
    //                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
    //             >
    //                 Đăng nhập
    //             </button>
    //         </div>
    //     );
    // }

    return (
        <React.Fragment>
            {children}
        </React.Fragment> 
    )
}