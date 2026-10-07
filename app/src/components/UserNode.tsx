import { useState } from 'react'
import { Link } from 'react-router-dom'

interface UserNodeProps {
  id: number
  name: string
  username: string
  city: string
}

function UserNode(props: UserNodeProps) {
  const [hovering, setHovering] = useState(false)

  const onHover = () => {
    setHovering(true)
  }

  const onLeave = () => {
    setHovering(false)
  }

  return (
    <div onMouseEnter={onHover} onMouseLeave={onLeave}>
      <p>{hovering ? '*' : ''} {props.name}</p>
      <p>@{props.username}</p>
      <p>{props.city}</p>

      <Link to={`/users/${props.id}`}>
        View node
      </Link>
    </div>
  )
}

export default UserNode