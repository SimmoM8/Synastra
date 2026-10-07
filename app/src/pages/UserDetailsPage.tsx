import { Link, useParams } from 'react-router-dom'
import useUsers from '../hooks/useUsers'

function UserDetailsPage() {
  const { id } = useParams()

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useUsers()

  if (isLoading) {
    return null
  }

  const user = users.find(
    currentUser => currentUser.id === Number(id),
  )

  return (
    <>
      <Link
        to="/"
        aria-label="Close node profile"
        className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[1px]"
      />

      <aside className="sidebar-enter fixed right-0 top-0 z-50 h-screen w-full overflow-y-auto border-l border-white/10 bg-slate-950/88 shadow-[-30px_0_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:max-w-md">
        <div className="min-h-full px-7 py-7 sm:px-9">
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.4em] text-violet-300/60">
              Node profile
            </p>

            <Link
              to="/"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-lg font-light text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              ×
            </Link>
          </div>

          {isError ? (
            <div className="mt-24">
              <p className="text-xs uppercase tracking-[0.35em] text-red-300">
                Signal lost
              </p>
              <p className="mt-4 text-sm text-slate-400">
                {error.message}
              </p>
            </div>
          ) : !user ? (
            <div className="mt-24">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Light node not found
              </p>
            </div>
          ) : (
            <>
              <div className="mt-16 flex items-center gap-6">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                  <div className="absolute h-20 w-20 rounded-full border border-violet-300/10" />
                  <div className="absolute h-12 w-12 rounded-full border border-violet-300/20" />

                  <div
                    className="node-core h-3 w-3 rounded-full bg-white"
                    style={{
                      boxShadow:
                        '0 0 12px rgba(255,255,255,.95), 0 0 30px rgba(196,181,253,.8), 0 0 55px rgba(129,140,248,.35)',
                    }}
                  />
                </div>

                <div>
                  <p className="mb-2 text-[9px] uppercase tracking-[0.3em] text-slate-600">
                    Light {String(user.id).padStart(2, '0')}
                  </p>

                  <h1 className="text-2xl font-light tracking-wide text-white">
                    {user.profile.name}
                  </h1>

                  <p className="mt-1 text-sm text-violet-300/65">
                    @{user.username}
                  </p>
                </div>
              </div>

              <div className="my-10 h-px bg-gradient-to-r from-violet-300/20 via-white/5 to-transparent" />

              <section>
                <p className="section-label">
                  Coordinates
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {user.profile.address.street}
                  <br />
                  {user.profile.address.zipCode}{' '}
                  {user.profile.address.city}
                </p>
              </section>

              <section className="mt-10">
                <p className="section-label">
                  Signal
                </p>

                <a
                  href={`mailto:${user.profile.email}`}
                  className="mt-4 block text-sm text-slate-300 transition hover:text-violet-200"
                >
                  {user.profile.email}
                </a>
              </section>

              <section className="mt-10">
                <p className="section-label">
                  Roles
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {user.roles.map(role => (
                    <span
                      key={role}
                      className="rounded-full border border-violet-300/10 bg-violet-300/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-violet-200/70"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </section>

              <section className="mt-10">
                <p className="section-label">
                  Preferences
                </p>

                <div className="mt-4 divide-y divide-white/5 rounded-2xl border border-white/5 bg-white/[0.025]">
                  <div className="flex items-center justify-between px-4 py-4">
                    <span className="text-xs text-slate-500">
                      Interface
                    </span>

                    <span className="text-xs capitalize text-slate-300">
                      {user.settings.theme}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-4">
                    <span className="text-xs text-slate-500">
                      Email signal
                    </span>

                    <span
                      className={
                        user.settings.notifications.email
                          ? 'text-xs text-emerald-300/80'
                          : 'text-xs text-slate-600'
                      }
                    >
                      {user.settings.notifications.email
                        ? 'Connected'
                        : 'Silent'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-4 py-4">
                    <span className="text-xs text-slate-500">
                      Push signal
                    </span>

                    <span
                      className={
                        user.settings.notifications.push
                          ? 'text-xs text-emerald-300/80'
                          : 'text-xs text-slate-600'
                      }
                    >
                      {user.settings.notifications.push
                        ? 'Connected'
                        : 'Silent'}
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

export default UserDetailsPage