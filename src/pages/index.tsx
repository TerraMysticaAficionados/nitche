import Navbar from '../lib/components/Navbar';
import Sidebar from '../lib/components/Sidebar';
import { WebRTCVideo } from '@/lib/components/WebRTCVideo';
import {SecretDoor} from '@/lib/components/SecretDoor';

export default () => {
  return (
    <div style={{
      height: '100vh',
      backgroundColor: 'white',
    }}>
      <SecretDoor>
        <Navbar/>
      </SecretDoor>
      <div style={{
        height: '100%',
        width: '100%',
        paddingTop: '3rem',
      }}>
        <Sidebar/>
        <div className='flex w-full h-full'>

        <main
          className='flex flex-col items-stretch h-full w-full ml-14 lg:ml-52 bg-green-300'>
            <WebRTCVideo/>

            <section id="info" className='h-full'> hi i'm david beame the greatest streamer in a generation</section>
          </main>
          <ChatBar></ChatBar>
        </div>
      </div>
    </div>
  )
}


function ChatBar() {
  return (
    <div id='chatbar'
    className='hidden md:block h-screen md:h-full w-96 bg-pink-300'

    >
    </div>
  )
}