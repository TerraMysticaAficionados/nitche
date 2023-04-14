'use strict';

const TIME_TO_HOST_CANDIDATES = 3000;  // NOTE(mroberts): Too long.


interface APIClient {
  createConnection : string /*
    type: url
    API:
      - must return remote.local_description so we can set our local.remote_description to match. we then create an answer, optionally modify its settings, set it to our local.local_description (???does data get sent when we create the answer before setting it to local description???). 
      - can return id so we know the name of our remote client (the server is tracking an exact pairing to our WebRTC interface). This allows us to modify it.
  */
  createRemoteConnection: () => Promise<RemoteConnection>
  // destroyRemoteClientUrl : string // url, tell reference to kill itself
  destroyRemoteConnection: () => Promise<any> // url, tell reference to kill itself
  // setRemoteRemoteDescription : string // url, tell reference to remember who we are. Reference can include additional data
  setRemoteRemoteDescription: () => Promise<string>
  // getRemoteLocalDescription : string // url, ask reference who it is again.
  getRemoteLocalDescription : () => Promise<string>  //  instructions on how to get the remote.local_description
}

interface RemoteConnection {
  id: string,
  remoteDescription: any,
  localDescription: any,
}



interface ConnectionClientOptions {
  host: string
  prefix: string
  clearTimeout: (timeoutId: NodeJS.Timeout | string | number | undefined) => void
  setTimeout: (callback: (args: void) => void, ms?: number) => void
  // timeToHostCandidates:
}

interface ConnectionClientJoinOptions {

}

/*
  ConnectionClient
    Adapted to dev environment from node-webrtc-examples
    Tightly coupled with backend API
*/
export class ConnectionClient implements APIClient {

  async createRemoteConnection(): Promise<RemoteConnection> {
    return new Promise((resolve) => {
      return fetch(`${this.host}${this.prefix}/connections`, {
        method: 'POST'
      }).then(response => {
        if(!response.ok) return null
        return response.json()
      }).then(data => {
        return data as RemoteConnection
      })
    })
  }

  destroyRemoteConnection() : Promise<any>;

  getRemoteLocalDescription(): Promise<RemoteConnection["localDescription"]>

  host: ConnectionClientCreateOptions["host"]
  prefix: ConnectionClientCreateOptions["prefix"]
  clearTimeout: ConnectionClientCreateOptions["clearTimeout"]
  setTimeout: ConnectionClientCreateOptions["setTimeout"]
  timeToHostCandidates: number

  createConnection(ConnectionClientCreateOptions): void
  joinConnection(ConnectionClientJoinOptions): void

  constructor(options: ConnectionClientOptions) {
    this.host = options.host
    this.prefix = options.prefix
    this.clearTimeout = options.clearTimeout
    this.setTimeout = options.setTimeout
    this.timeToHostCandidates = TIME_TO_HOST_CANDIDATES

    

    this.createConnection = async (options = {}) => {
      options = {
        beforeAnswer() {},
        stereo: false,
        ...options
      };

      const {
        beforeAnswer,
        stereo
      } = options;

      const response1 = await fetch(`${host}${prefix}/connections`, {
        method: 'POST'
      });

      const remoteConnection = await this.createRemoteConnection()


      const remotePeerConnection:{

      } = await response1.json();
      const { id } = remotePeerConnection;

      const localPeerConnection = new RTCPeerConnection({
        sdpSemantics: 'unified-plan'
      });

      localPeerConnection.addEventListener("connectionstatechange", async () => {
        switch (localPeerConnection.connectionState) {
          case "new":
          case "checking":
            console.log("Connecting…");
            break;
          case "connected":
            console.log("Online");
            break;
          case "disconnected":
            console.log("Disconnecting…");
            break;
          case "closed":
            console.log("Offline");
            await fetch(`${host}${prefix}/connections/${id}`, { method: 'delete' }).catch(() => {});
            break;
          case "failed":
            console.log("Error");
            break;
          default:
            console.log("Unknown");
            break;
        }
      })

      try {
        await localPeerConnection.setRemoteDescription(remotePeerConnection.localDescription);

        await beforeAnswer(localPeerConnection);

        const originalAnswer = await localPeerConnection.createAnswer();
        const updatedAnswer = new RTCSessionDescription({
          type: 'answer',
          sdp: stereo ? enableStereoOpus(originalAnswer.sdp) : originalAnswer.sdp
        });
        await localPeerConnection.setLocalDescription(updatedAnswer);

        await fetch(`${host}${prefix}/connections/${id}/remote-description`, {
          method: 'POST',
          body: JSON.stringify(localPeerConnection.localDescription),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        return localPeerConnection;
      } catch (error) {
        localPeerConnection.close();
        throw error;
      }
    };
  }
}

function enableStereoOpus(sdp) {
  return sdp.replace(/a=fmtp:111/, 'a=fmtp:111 stereo=1\r\na=fmtp:111');
}

module.exports = ConnectionClient;
