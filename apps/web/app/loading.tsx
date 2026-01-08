import { CollabFlowLoader } from "@/components/loaders/CollabFlowLoader";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <CollabFlowLoader size={72} />
    </div>
  );
}
