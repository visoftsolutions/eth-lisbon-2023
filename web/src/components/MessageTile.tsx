export function MessageTileComponent({
  params,
}: {
  params: {
    id: number;
    date: number;
    msg: string;
    isMy: boolean;
  };
}) {
  return (
    <div className="flex gap-4 items-center">
      <span className="text-gray-400">{`${params.date}`}</span>
      {params.isMy ? (
        <span className="text-yellow-400">{`${params.msg}`}</span>
      ) : (
        <span className="text-red-400">{`${params.msg}`}</span>
      )}
    </div>
  );
}
