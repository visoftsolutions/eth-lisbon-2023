export function MessageTileComponent({
  params,
}: {
  params: { date: Date; message: String };
}) {
  return (
    <div className="flex gap-4 items-center">
      <p>{`${params.date}`}</p>
      <p>{`${params.message}`}</p>
    </div>
  );
}
