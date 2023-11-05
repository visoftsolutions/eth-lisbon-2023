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
  function pad(num: number) {
    return ("0"+num).slice(-2);
  }
  

  const getTime = () => {
    const date = new Date(params.date);

    return pad(date.getHours())+":"+pad(date.getMinutes());
  };

  return (
    <div className="flex items-center font-medium">
      
      {params.isMy ? (
        <div className="flex items-center mr-auto">
          <span className="w-8 text-xs text-gray-400">{getTime()}</span>
          <span className="text-yellow-400 px-2 py-1">{`${params.msg}`}</span>
        </div>
      ) : (
        <div className="flex flex-row-reverse items-center ml-auto text-right">
          <span className="w-8 text-xs text-gray-400">{getTime()}</span>
          <span className="px-2 py-1 text-gray-200">{`${params.msg}`}</span>
        </div>
        
      )}
    </div>
  );
}
