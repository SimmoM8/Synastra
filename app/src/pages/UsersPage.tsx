import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useParams } from 'react-router-dom'
import SearchInput from '../components/SearchInput'
import UserNode from '../components/UserNode'
import useUsers from '../hooks/useUsers'
import UserDetailsPage from './UserDetailsPage'

interface Point {
  x: number
  y: number
}

interface ViewportSize {
  width: number
  height: number
}

interface EdgeNode {
  id: number
  point: Point
}

interface Edge {
  from: EdgeNode
  to: EdgeNode
}

/*
 * The constellation is deliberately larger than the viewport so it
 * can still be explored by dragging, but compact enough that more
 * of the network is visible at once.
 */
const WORLD_WIDTH = 1850
const WORLD_HEIGHT = 1150

const NODE_POSITIONS: Record<number, Point> = {
  1: { x: 300, y: 270 },
  2: { x: 610, y: 190 },
  3: { x: 900, y: 330 },
  4: { x: 1240, y: 220 },
  5: { x: 1550, y: 390 },
  6: { x: 390, y: 690 },
  7: { x: 720, y: 890 },
  8: { x: 1090, y: 650 },
  9: { x: 1480, y: 850 },
  10: { x: 970, y: 970 },
}

function getNodePosition(id: number): Point {
  return NODE_POSITIONS[id] ?? {
    x: 180 + ((id * 347) % 1450),
    y: 150 + ((id * 227) % 820),
  }
}

/*
 * Each node connects to its two closest neighbours.
 *
 * Because this function receives only the currently visible nodes,
 * filtering automatically rebuilds the constellation connections.
 */
function buildEdges(nodes: EdgeNode[]): Edge[] {
  const edges: Edge[] = []
  const existing = new Set<string>()

  nodes.forEach(node => {
    const nearest = nodes
      .filter(other => other.id !== node.id)
      .map(other => ({
        node: other,
        distance: Math.hypot(
          node.point.x - other.point.x,
          node.point.y - other.point.y,
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)

    nearest.forEach(({ node: neighbour }) => {
      const key = [node.id, neighbour.id]
        .sort((a, b) => a - b)
        .join('-')

      if (existing.has(key)) {
        return
      }

      existing.add(key)

      edges.push({
        from: node,
        to: neighbour,
      })
    })
  })

  return edges
}

/*
 * Prevent the constellation from being dragged completely outside
 * the viewport.
 */
function clampPan(
  position: Point,
  viewport: ViewportSize,
): Point {
  const minX = Math.min(0, viewport.width - WORLD_WIDTH)
  const minY = Math.min(0, viewport.height - WORLD_HEIGHT)

  return {
    x: Math.min(0, Math.max(minX, position.x)),
    y: Math.min(0, Math.max(minY, position.y)),
  }
}

function UsersPage() {
  const { id } = useParams()

  const [searchTerm, setSearchTerm] = useState('')
  const [viewport, setViewport] = useState<ViewportSize>({
    width: 0,
    height: 0,
  })

  const [pan, setPan] = useState<Point>({
    x: 0,
    y: 0,
  })

  const [isDragging, setIsDragging] = useState(false)

  const viewportRef = useRef<HTMLDivElement>(null)
  const initialised = useRef(false)

  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
  })

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useUsers()

  /*
   * Measure the visible screen and initially centre the full
   * constellation inside it.
   */
  useEffect(() => {
    const measure = () => {
      const element = viewportRef.current

      if (!element) {
        return
      }

      const nextViewport = {
        width: element.clientWidth,
        height: element.clientHeight,
      }

      setViewport(nextViewport)

      if (!initialised.current) {
        setPan({
          x: (nextViewport.width - WORLD_WIDTH) / 2,
          y: (nextViewport.height - WORLD_HEIGHT) / 2,
        })

        initialised.current = true
      } else {
        setPan(current =>
          clampPan(current, nextViewport),
        )
      }
    }

    measure()

    window.addEventListener('resize', measure)

    return () => {
      window.removeEventListener('resize', measure)
    }
  }, [])

  /*
   * Filter and rank search results.
   *
   * Exact match      = strongest result
   * Starts with text = second strongest
   * Contains text    = third strongest
   */
  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) {
      return users
    }

    const getMatchScore = (value: string) => {
      const text = value.toLowerCase()

      if (text === search) {
        return 0
      }

      if (text.startsWith(search)) {
        return 1
      }

      if (text.includes(search)) {
        return 2
      }

      return 999
    }

    return users
      .map(user => {
        const scores = [
          getMatchScore(user.profile.name),
          getMatchScore(user.username),
          getMatchScore(user.profile.address.city),
        ]

        return {
          user,
          score: Math.min(...scores),
        }
      })
      .filter(result => result.score < 999)
      .sort((a, b) => a.score - b.score)
      .map(result => result.user)
  }, [users, searchTerm])

  /*
   * Convert the filtered user data into positioned constellation
   * nodes.
   */
  const nodes = useMemo(
    () =>
      filteredUsers.map(user => ({
        user,
        point: getNodePosition(user.id),
      })),
    [filteredUsers],
  )

  /*
   * Rebuild connections whenever the visible nodes change.
   */
  const edges = useMemo(
    () =>
      buildEdges(
        nodes.map(node => ({
          id: node.user.id,
          point: node.point,
        })),
      ),
    [nodes],
  )

  /*
   * Search behaviour:
   *
   * - When typing, centre the highest-ranked result.
   * - When clearing the search, return to the middle of the
   *   complete constellation.
   */
  useEffect(() => {
    if (!viewport.width || !viewport.height) {
      return
    }

    const search = searchTerm.trim()

    if (!search) {
      setPan(
        clampPan(
          {
            x: (viewport.width - WORLD_WIDTH) / 2,
            y: (viewport.height - WORLD_HEIGHT) / 2,
          },
          viewport,
        ),
      )

      return
    }

    if (filteredUsers.length === 0) {
      return
    }

    const topResult = filteredUsers[0]
    const point = getNodePosition(topResult.id)

    setPan(
      clampPan(
        {
          x: viewport.width / 2 - point.x,
          y: viewport.height / 2 - point.y,
        },
        viewport,
      ),
    )
  }, [
    searchTerm,
    filteredUsers,
    viewport.width,
    viewport.height,
  ])

  /*
   * Calculate how close a node is to the visual centre.
   *
   * Central nodes become larger, brighter and more luminous.
   */
  const getIntensity = (point: Point) => {
    if (!viewport.width || !viewport.height) {
      return 0.5
    }

    const screenX = point.x + pan.x
    const screenY = point.y + pan.y

    const distance = Math.hypot(
      screenX - viewport.width / 2,
      screenY - viewport.height / 2,
    )

    const maximumDistance =
      Math.hypot(
        viewport.width / 2,
        viewport.height / 2,
      ) * 1.05

    return Math.max(
      0.06,
      1 - distance / maximumDistance,
    )
  }

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) {
      return
    }

    drag.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    }

    setIsDragging(true)

    event.currentTarget.setPointerCapture(
      event.pointerId,
    )
  }

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!drag.current.active) {
      return
    }

    const nextPan = {
      x:
        drag.current.panX +
        (event.clientX - drag.current.startX),

      y:
        drag.current.panY +
        (event.clientY - drag.current.startY),
    }

    setPan(
      clampPan(
        nextPan,
        viewport,
      ),
    )
  }

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    drag.current.active = false
    setIsDragging(false)

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      )
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">

          <div className="mx-auto mb-6 h-2 w-2 animate-ping rounded-full bg-violet-300" />

          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Mapping constellation
          </p>

        </div>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">

        <div className="max-w-md text-center">

          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-red-300">
            Signal lost
          </p>

          <p className="text-slate-400">
            {error.message}
          </p>

        </div>

      </main>
    )
  }

  const focusedUserId =
    searchTerm.trim() && filteredUsers.length > 0
      ? filteredUsers[0].id
      : null

  return (
    <main className="fixed inset-0 overflow-hidden bg-slate-950 text-slate-100">

      {/* Pannable constellation viewport */}
      <div
        ref={viewportRef}
        className={`absolute inset-0 touch-none select-none ${
          isDragging
            ? 'cursor-grabbing'
            : 'cursor-grab'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >

        {/* Larger star world */}
        <div
          className="starfield absolute left-0 top-0 will-change-transform"
          style={{
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT,

            transform:
              `translate3d(${pan.x}px, ${pan.y}px, 0)`,

            /*
             * Panning by mouse should feel immediate.
             * Programmatic movement caused by search glides smoothly.
             */
            transition: isDragging
              ? 'none'
              : 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >

          {/* Connecting constellation lines */}
          <svg
            className="pointer-events-none absolute inset-0"
            width={WORLD_WIDTH}
            height={WORLD_HEIGHT}
            viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
          >

            {edges.map((edge, index) => {
              const intensity =
                (
                  getIntensity(edge.from.point) +
                  getIntensity(edge.to.point)
                ) / 2

              return (
                <g
                  key={`${edge.from.id}-${edge.to.id}`}
                >

                  {/* Base line */}
                  <line
                    x1={edge.from.point.x}
                    y1={edge.from.point.y}
                    x2={edge.to.point.x}
                    y2={edge.to.point.y}
                    stroke="rgb(148 163 184)"
                    strokeWidth={
                      0.5 + intensity * 0.65
                    }
                    style={{
                      opacity:
                        0.05 + intensity * 0.18,
                    }}
                  />

                  {/* Animated shimmer travelling along line */}
                  <line
                    className="constellation-shimmer"
                    x1={edge.from.point.x}
                    y1={edge.from.point.y}
                    x2={edge.to.point.x}
                    y2={edge.to.point.y}
                    stroke="rgb(196 181 253)"
                    strokeWidth={
                      0.65 + intensity * 1.1
                    }
                    style={{
                      opacity:
                        0.04 + intensity * 0.48,

                      animationDuration:
                        `${5.2 - intensity * 2.5}s`,

                      animationDelay:
                        `${-index * 0.37}s`,
                    }}
                  />

                </g>
              )
            })}

          </svg>

          {/* User light nodes */}
          {nodes.map(({ user, point }) => (
            <UserNode
              key={user.id}
              id={user.id}
              name={user.profile.name}
              username={user.username}
              city={user.profile.address.city}
              x={point.x}
              y={point.y}
              intensity={getIntensity(point)}
              active={Number(id) === user.id}
              focused={
                focusedUserId === user.id
              }
            />
          ))}

        </div>
      </div>

      {/* Header overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent pb-20">

        <header className="pointer-events-auto mx-auto flex max-w-7xl flex-col gap-6 px-6 pt-7 md:flex-row md:items-start md:justify-between md:px-10">

          <div>

            <p className="mb-1 text-[10px] uppercase tracking-[0.45em] text-violet-300/70">
              The constellation
            </p>

            <h1 className="text-3xl font-extralight tracking-[0.18em] text-white md:text-4xl">
              SYNASTRA
            </h1>

            <p className="mt-2 max-w-lg text-xs font-light tracking-wide text-slate-400">
              People become points of light in a connected network.
            </p>

          </div>

          {/* Search */}
          <div className="w-full md:w-80">

            <SearchInput
              placeholder="Search the constellation..."
              value={searchTerm}
              onChange={event =>
                setSearchTerm(event.target.value)
              }
            />

            <div className="mt-2 flex justify-between px-1 text-[10px] uppercase tracking-[0.2em] text-slate-600">

              <span>
                {filteredUsers.length}{' '}
                {filteredUsers.length === 1
                  ? 'light'
                  : 'lights'}{' '}
                detected
              </span>

              {searchTerm && (
                <button
                  type="button"
                  className="transition hover:text-slate-300"
                  onClick={() =>
                    setSearchTerm('')
                  }
                >
                  Clear
                </button>
              )}

            </div>

          </div>

        </header>
      </div>

      {/* Darkened viewport edges */}
      <div className="sky-vignette pointer-events-none absolute inset-0 z-20" />

      {/* Drag hint */}
      <div className="pointer-events-none absolute bottom-7 left-1/2 z-30 -translate-x-1/2">

        <p className="rounded-full border border-white/5 bg-slate-950/40 px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-slate-500 backdrop-blur-md">
          Drag to explore
        </p>

      </div>

      {/* Empty API response */}
      {users.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">

          <p className="text-sm tracking-widest text-slate-500">
            No lights detected.
          </p>

        </div>
      )}

      {/* Empty search response */}
      {users.length > 0 &&
        filteredUsers.length === 0 && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">

            <p className="text-sm tracking-widest text-slate-500">
              No matching lights found.
            </p>

          </div>
        )}

      {/* Profile sidebar */}
      {id && <UserDetailsPage />}

    </main>
  )
}

export default UsersPage