import { useState } from 'react';


function UserNode(props: { name: string; username: string; city: string }) {

    const [hovering, setHovering] = useState(false);
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        setSelected(!selected);
        console.log(`Selected Node: ${props.name}`);
    }

    const onHover = () => {
        setHovering(true);
    }
    
    const onLeave = () => {
        setHovering(false);
    }
    
  return (
    <div onClick={handleClick} onMouseEnter={onHover} onMouseLeave={onLeave}>
          <p>{hovering ? '*' : ''} {props.name}</p>
          {selected ?
          <>
            <p>@{props.username}</p>
            <p>{props.city}</p>
          </> : null}
    </div>
  )
}

export default UserNode