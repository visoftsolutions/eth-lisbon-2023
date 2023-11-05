export function MessageTileComponent({
  params,
}: {
  params: { date: number; message: String };
}) {
  return (
    <div className="flex gap-4 items-center">
      <span className="text-gray-400">{`${params.date.toLocaleString()}`}</span>
      <span className="text-yellow-400">{`${params.message}`}</span>
    </div>
  );
}
