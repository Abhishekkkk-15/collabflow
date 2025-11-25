import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import z from "zod";

export function ValidationAlert({ issues }: { issues: z.ZodIssue[] }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Validation Error</AlertTitle>
      <AlertDescription>
        <ul className="list-inside list-disc text-sm">
          {issues.map((it, idx) => (
            <li key={idx}>{it.message}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
