import React, { ComponentType, FC, JSX } from 'react';
import { Empty } from '@/components/ui/empty';
import PageWithSidebarClient from '@/components/self/PageWithSidebarClient';
import DefaultDashboard from '@/components/self/DefaultDashboard';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

async  function Page() {
    const session = await auth();
  if(!session) redirect("/login")
return(
  <div>
    <PageWithSidebarClient Component={DefaultDashboard} params={{project:"",workspace:""}} user={session?.user}/>
  </div>
)
}
export default Page
