import type { CellContext, ColumnDef } from "@tanstack/react-table";
import type { StudentScoresResponse } from "@/features/teacher/assignment/types.ts";

export function makeAssignedScoresColumns(
  scores: StudentScoresResponse[],
): ColumnDef<StudentScoresResponse, React.ReactNode>[] {
  const levels = deriveChallengeLevels(scores);

  // Name column also returns a ReactNode (string is a subtype)
  const nameCol: ColumnDef<StudentScoresResponse, React.ReactNode> = {
    accessorKey: "name",
    header: "Name",
    cell: (info: CellContext<StudentScoresResponse, React.ReactNode>) =>
      info.getValue(),
  };

  // One column per challenge level
  const levelCols: ColumnDef<StudentScoresResponse, React.ReactNode>[] =
    levels.map((level) => ({
      id: `level_${level}`,
      header: `Lvl ${level}`,
      cell: (info: CellContext<StudentScoresResponse, React.ReactNode>) => {
        const entry = info.row.original.scores.find((c) => c.level === level);
        if (!entry) return "—";
        return Array.from({ length: 3 }).map((_, i) =>
          i < entry.stars ? (
            <span key={i} className="text-md text-yellow-400">
              ★
            </span>
          ) : (
            <span key={i} className="text-md text-zinc-300">
              ★
            </span>
          ),
        );
      },
      meta: { align: "center" },
    }));

  return [nameCol, ...levelCols];
}

export function deriveChallengeLevels(
  scores: StudentScoresResponse[],
): number[] {
  console.log(scores);
  return Array.from(
    new Set(scores.flatMap((s) => s.scores.map((c) => c.level))),
  ).sort((a, b) => a - b);
}
