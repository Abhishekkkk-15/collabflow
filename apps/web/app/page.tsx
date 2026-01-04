export default function Home() {
  return (
    <>
      <span>{process.env.NEXT_PUBLIC_API_URL || "Not found"}</span>
    </>
  );
}
