import DefaultDashboard from "@/components/self/DefaultDashboard";
async function Page({ params }: { params: any }) {
  console.log("params", await params);
  return (
    <>
      <DefaultDashboard />
    </>
  );
}
export default Page;
