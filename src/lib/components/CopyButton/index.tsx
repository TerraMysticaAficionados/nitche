import {FaCopy} from 'react-icons/fa'
import { useState } from "react"
export interface CopyButtonProps {
  copyValue:string
}
export const CopyButton:React.FC<CopyButtonProps> = ({copyValue}) => {
  const [animating, setAnimating] = useState(false)
  return <div className="relative cursor-pointer flex items-center" onClick={() => {
    navigator.clipboard.writeText(copyValue)
    setAnimating(true)
  }} data-cy="copy-button-container">
      <FaCopy  data-cy="copy-button-static"/>
      <FaCopy 
        data-cy="copy-button-animated"
        className={`${animating ? 'animate-copyConfirm' : ''} absolute left-0`}
        onAnimationEnd={() => {setAnimating(false)}}
      />
  </div>
}
