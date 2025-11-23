import { auth } from '@/auth';
import PageWithSidebarClient from '@/components/self/PageWithSidebarClient';
import TasksTable from '@/components/self/TasksTable'
import { redirect } from 'next/navigation';

 async function  page({ params }:{params:{workspace:string,project:string}}) {
  const {workspace,project} = await params;
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <div>
      {/* <PageWithSidebarServer/>
      
    <PageWithSidebarClient Component={TasksTable} /> */}
     <PageWithSidebarClient params={{workspace,project}} user={session.user} Component={TasksTable} />;
    </div>
  )
}

export default page
