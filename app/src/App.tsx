import UserNode from './components/UserNode'

function App() {

  return (
    <>
      <h1>Synastra</h1>
      <p>Users as light nodes in a connected network</p>
      <UserNode name="John Doe" username="johndoe" city="New York" />
      <UserNode name="Jane Smith" username="janesmith" city="Los Angeles" />
      <UserNode name="Alice Johnson" username="alicej" city="Chicago" />
      <UserNode name="Bob Brown" username="bobb" city="San Francisco" />
    </>
  )
}

export default App
