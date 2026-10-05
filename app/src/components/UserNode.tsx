


function UserNode(props: { name: string; username: string; city: string }) {

    const handleClick = () => {
        console.log(`Selected Node: ${props.name}`);
    }
    
  return (
    <div onClick={handleClick}>
          <p>{props.name}</p>
          <p>{props.username}</p>
          <p>{props.city}</p>
    </div>
  )
}

export default UserNode