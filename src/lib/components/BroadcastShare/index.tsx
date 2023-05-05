import { CopyButton } from "../CopyButton"

interface BroadcastShareProps {
  broadcastName:string
}

function getBroadcastUrl(broadcastId:string) {
  return "http://localhost:3000/" + broadcastId
}

export const BroadcastShare: React.FC<BroadcastShareProps> = ({broadcastName}) => {
  return <div className="flex flex-row my-5 rounded-md align-center bg-slate-300">
    <div className="flex px-2 bg-slate-400 rounded-l-md">
      Viewer Link
    </div>
    <div className="flex px-2 ">
      {getBroadcastUrl(broadcastName)}
    </div>
    <div className="flex p-1 border-l border-l-slate-700 py-1 px-2">
      <CopyButton copyValue={getBroadcastUrl(broadcastName)}/>     
    </div>
  </div>
}