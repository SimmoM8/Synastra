import { Link } from 'react-router-dom'

interface UserNodeProps {
  id: number
  name: string
  username: string
  city: string
  x: number
  y: number
  intensity: number
  active?: boolean
  focused?: boolean
}

function UserNode({
  id,
  name,
  username,
  city,
  x,
  y,
  intensity,
  active = false,
  focused = false,
}: UserNodeProps) {
  /*
   * Nodes become larger and brighter as they approach the
   * visual centre of the viewport.
   */
  const scale =
    0.72 +
    intensity * 0.8 +
    (focused ? 0.14 : 0)

  const size =
    7 +
    intensity * 5 +
    (focused ? 1.5 : 0)

  const glow =
    7 +
    intensity * 27 +
    (focused ? 8 : 0)

  const opacity =
    0.25 +
    intensity * 0.75

  const highlighted =
    active || focused

  return (
    <Link
      to={`/users/${id}`}
      aria-label={`Open ${name}`}

      /*
       * Prevent clicking the node from beginning a drag operation
       * on the constellation underneath it.
       */
      onPointerDown={event =>
        event.stopPropagation()
      }

      className="group absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none transition-[opacity,filter] duration-500"

      style={{
        left: x,
        top: y,
      }}
    >

      {/* Hover / search / active label */}
      <span
        className={`
          absolute
          bottom-full
          left-1/2
          mb-3
          -translate-x-1/2
          whitespace-nowrap
          rounded-xl
          border
          px-3
          py-2
          text-center
          backdrop-blur-xl
          transition-all
          duration-300

          ${
            highlighted
              ? `
                translate-y-0
                border-violet-300/30
                bg-slate-900/90
                opacity-100
              `
              : `
                translate-y-1
                border-white/10
                bg-slate-950/80
                opacity-0

                group-hover:translate-y-0
                group-hover:opacity-100

                group-focus-visible:translate-y-0
                group-focus-visible:opacity-100
              `
          }
        `}
      >

        <span className="block text-xs font-medium tracking-wide text-white">
          {name}
        </span>

        <span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-slate-500">
          {city} · @{username}
        </span>

      </span>

      {/* Outer orbital ring */}
      <span
        className={`
          absolute
          rounded-full
          border
          transition-all
          duration-500

          ${
            highlighted
              ? 'border-violet-300/50'
              : 'border-violet-300/10'
          }
        `}
        style={{
          width: size * 3.1,
          height: size * 3.1,

          opacity:
            highlighted
              ? 0.42
              : 0.15 + intensity * 0.28,

          transform:
            `scale(${scale})`,
        }}
      />

      {/* Main star */}
      <span
        className="node-core rounded-full bg-white transition-all duration-500"
        style={{
          width: size,
          height: size,
          opacity,

          transform:
            `scale(${scale})`,

          boxShadow: `
            0 0 ${glow * 0.45}px rgba(255,255,255,0.95),
            0 0 ${glow}px rgba(196,181,253,0.75),
            0 0 ${glow * 1.8}px rgba(129,140,248,0.28)
          `,
        }}
      />

      {/* Horizontal star flare */}
      <span
        className="absolute h-[2px] bg-white/60 transition-all duration-500"
        style={{
          width: size * 2.1,

          opacity:
            highlighted
              ? 0.45
              : intensity * 0.28,

          transform:
            `rotate(20deg) scale(${scale})`,
        }}
      />

      {/* Vertical star flare */}
      <span
        className="absolute w-[2px] bg-white/50 transition-all duration-500"
        style={{
          height: size * 1.9,

          opacity:
            highlighted
              ? 0.38
              : intensity * 0.22,

          transform:
            `rotate(20deg) scale(${scale})`,
        }}
      />

    </Link>
  )
}

export default UserNode