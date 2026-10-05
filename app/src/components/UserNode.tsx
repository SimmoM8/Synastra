
function UserNode(props: { name: string; username: string; city: string }) {
  return (
    <div>
          <p>{props.name}</p>
          <p>{props.username}</p>
          <p>{props.city}</p>
    </div>
  )
}

export default UserNode