import Icon from '../lib/components/Icon';
const Sidebar = () => {
  return (
    <div
      id={'sidebar'}
      className='fixed h-full w-14 lg:w-52
               bg-cyan-500 lg:bg-green-300'>
      <Scrollbar/>
    </div>
  )
}


function Scrollbar() {
  return (
    <div className='w-4 h-full'>
      hello world
    </div>
  )
}

export default Sidebar;



// @media (max-width: 1200px) {
//   #sidebar {
//     background-color: greenyellow !important;
//     width: 3rem !important;
//   }
//   main {
//     margin-left: 3rem;
//   }
// }

// @media (min-width: 1200px) {
//   #sidebar {
//     background-color: greenyellow !important;
//     width: 15rem !important;
//   }
//   main {
//     margin-left: 15rem;
//   }
// }

// @media (max-width: 920px) {
//   #chatbar {
//     display: none !important;
//   }