"use client"
import { api } from '@/lib/api/api';
import { setWorkspaces } from '@/lib/redux/slices/workspace';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

export default function DashboardLayout({children}:{children:React.ReactNode}) {
    
    // let dispatch = useDispatch()

    // useEffect(()=>{
    //     fetchWorkspace()
    // },[])

  return (
    <div>
      {children}
    </div>
  )
}

