
/**
 * Create a promise that resolves with a websocket when connection is opened.
 * 
 * return the promise and a cleanup function
 * promise resolves to the websocket and open/error event (websocket is null on error)
 * 
 * @param url 
 * @returns [Promise<WebSocket|null>, Function]
 */
export default function getWebsocketPromise(url:string): [Promise<WebSocket|null>, Function]{
    let cleaned = false
    let websocketRef: WebSocket;
    let websocketPromise = new Promise<WebSocket|null>((resolve, reject) => {
        websocketRef = new WebSocket(url)
        websocketRef.addEventListener("open", (event) => {
            if(cleaned) resolve(null) //    if cleaned don't do anything
            console.log("ws open")
            resolve(websocketRef)
        })
        websocketRef.addEventListener("error", (event) => {
            if(cleaned) resolve(null) //  if cleaned don't do anything
            console.log("ws error")
            reject(null)
        })
        websocketRef.addEventListener("close", ( ) => {
            console.log("ws closed")
        })
    })
    function cleanupPromise () {
        console.log("ws cleanup")
        cleaned = true
        websocketRef.close()
    }
    console.log("getWebsocketPromise", websocketPromise)
    return [websocketPromise, cleanupPromise]
}