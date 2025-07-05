interface QueryStatusProps {
  isLoading: boolean;
  error: unknown;
}

export const QueryStatus: React.FC<QueryStatusProps> = ({
  isLoading,
  error,
}) => {
  if (isLoading) return <p>Loading scores…</p>;
  if (error instanceof Error)
    return <p className="text-red-600">Error: {error.message}</p>;
  return null;
};
