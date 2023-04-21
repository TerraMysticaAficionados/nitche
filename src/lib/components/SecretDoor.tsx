import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { CookiesProvider } from "react-cookie";
const KEY_COOKIE_MAX_AGE_SECONDS = 60
interface SecretDoorProps { 
  children?: React.ReactNode
}
export const SecretDoor:React.FC<SecretDoorProps> = ({children}) => {
  const [cookies, setCookie] = useCookies(['key-cookie'])
  const times:number[] = []
  useEffect(() => {
    setCookie("key-cookie",null)
  }, [])
  return <CookiesProvider>
      <button onClick={() => {
        times.push(Date.now())
        if(times.length > 5) {times.shift()}
        if(matchingTimes(times)) {
          setCookie("key-cookie", "cookie-key", {
            maxAge: KEY_COOKIE_MAX_AGE_SECONDS
          })
        }
    }}>{children}</button>
  </CookiesProvider>
}
//  not super secret but enough to keep it out of the way.
//  click in the pattern to set the cookie 
//  knock,knock,knock,*pause*,knock,knock
function matchingTimes(times: number[]) {
  if(times.length < 5) {
    return false
  }
  let gap1 = times[1] - times[0]
  let gap2 = times[2] - times[1]
  let gap3 = times[3] - times[2]
  let gap4 = times[4] - times[3]
  let avg1 = (gap1 + gap2 + gap4) / 3
  if(avg1 > 1000) return false
  return avg1 < 300 && gap4 < 300 && (2 * avg1) < gap3
}
