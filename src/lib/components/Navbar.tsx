const Navbar = () => {
  return (
    <nav style={{
      justifyContent: 'space-between',
      height: '50px',
      width: '100%',
      backgroundColor: 'blue',
      display: 'flex',
      alignItems: 'center',

    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexShrink: '0'
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
    </nav>
  )
}


function IconContainer({src}:{src:string}) {
  return (
    <button style={{
      height: '30px',
      width: '30px',
      borderRadius: '50%',
      backgroundColor: 'green',
    }}><image src={src}></image></button>
  )
}

function SearchBar() {
  return (
    <div>SearchBar</div>
  )
}

export default Navbar;