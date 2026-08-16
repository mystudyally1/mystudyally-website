import { subjectIconPaths } from "@/lib/subject-icons";

export function SubjectIcon({ name, className }: { name: string; className?: string }) {
  const paths = subjectIconPaths(name);
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
