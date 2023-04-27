import { useState } from 'react';

interface BroadcastButtonProps {
  initialBroadcastingState?: boolean,
  onEndBroadcastConfirm?: () => Promise<number> | number | void
  onStartBroadcastConfirm?: () => Promise<number> | number | void
}

export const BroadcastButton:React.FC<BroadcastButtonProps> = ({initialBroadcastingState = false, onEndBroadcastConfirm, onStartBroadcastConfirm}) => {
  const [isBroadcasting, setIsBroadcasting] = useState(initialBroadcastingState)
  if(isBroadcasting) {
    return <div 
      className="relative px-2 items-center border border-red-600 rounded-md cursor-pointer" 
      data-cy="broadcasting-button"
      onClick={ async (event) => {
        const result = confirm("End Broadcast?")
        if(result) {
          if(onEndBroadcastConfirm != undefined) {
            let endTime = await onEndBroadcastConfirm()
          }
          setIsBroadcasting(false)
        }
      }}>
        <button className="mx-2 bg-red-600 rounded-full h-4 w-4 border-red-200 border-2 border-double"></button>
        BROADCASTING
    </div>
  } else {
    return <div 
      className="relative px-2 items-center border border-slate-500 rounded-md cursor-pointer" 
      data-cy="broadcasting-button"
      onClick={async () => {
        const result = confirm("Start Broadcast?")
        if(result) {
          if(onStartBroadcastConfirm != undefined) {
            let startTime = await onStartBroadcastConfirm()
          }
          setIsBroadcasting(true)
        }
      }}>
      <button className="mx-2 bg-slate-500 rounded-full h-4 w-4 border-slate-500 border-2 border-double"></button>
      OFFLINE
  </div>
  }
}