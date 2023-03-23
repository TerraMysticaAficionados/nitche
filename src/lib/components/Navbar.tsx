const Navbar = () => {
  return (
    <nav style={{
      height: '5rem',
      width: '100vw',
      backgroundColor: 'blue',
      position: 'fixed'!,
      zIndex: 1000,
      boxShadow: '0 4px 2px -2px black',
      display: 'flex',
      alignItems: 'stretch',
    }}>
      <div style={{

        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexShrink: '0',
      }}>
        <IconContainer/>
        <IconContainer/>
      </div>
      <SearchBar/>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexShrink: '0'
      }}>

        <IconContainer/>
        <IconContainer/>
      </div>





      </div>

    </nav>
  )
}


function IconContainer() {
  return (
    <button style={{
      height: '30px',
      width: '30px',
      borderRadius: '50%',
      backgroundColor: 'green',
    }}></button>
  )
}

function SearchBar() {
  return (
    <div>SearchBar</div>
  )
}

export default Navbar;