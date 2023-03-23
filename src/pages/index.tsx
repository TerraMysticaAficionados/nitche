import Navbar from '../lib/components/Navbar.tsx';
import Sidebar from '../lib/components/Sidebar.tsx';

export default () => {
  return (
    <div style={{
      height: '100vh',
      backgroundColor: 'white',
    }}>
      <Navbar/>
      <div style={{
        height: '100%',
        width: '100%',
        paddingTop: '5rem',
      }}>
        <Sidebar/>
          <div style={{
            marginLeft: '15rem', // needs to scale based on the width of the sidebars
            display: 'flex',
          }}>
            <main style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'green',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Player></Player>


            </main>
              <ChatBar></ChatBar>
        </div>
     </div>
    </div>
  )
}


function Player() {
  return (
    <div style={{
      width: '100%',
      maxHeight: 'calc(100vh - 16rem)',
      paddingBottom: '56.25%',
      backgroundColor: 'red',
    }}>
      <div style={{
        width: '100%',
      }}>
      </div>
    </div>
  )
}

function ChatBar() {
  return (
    <div style={{
      width: '21.25rem',
      height: '100vh',
      backgroundColor: 'pink',
    }}>

    </div>
  )
}