export const revalidate = 60

async function getApps(searchParams: any) {
  try {
    const query = new URLSearchParams(searchParams).toString()
    return await (await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/app?${query}`)).json() as App[]
  } catch (e) {
    return []
  }
}

async function getAppsCount() {
  try {
    return await (await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/app/count`)).json() as number
  } catch (e) {
    return 0
  }
}

export default async function Page({searchParams}: any) {
  const page = +searchParams.page ?? 1
  const pageSize = 10
  const apps = await getApps(searchParams)
  const count = await getAppsCount()
  return (
    <main>
      {apps.map(app => (
        <div key={app.packageName} className="m-2 card bg-neutral text-neutral-content">
          <div className="card-body">
            <h2 className="card-title">{app.applicationName}</h2>
            <p>{app.packageName}</p>
          </div>
        </div>
      ))}
      <div className="join ml-2">
        {Array.from({length: Math.ceil(count/pageSize)}, (_, i) => i).map(i => (
          <a
            key={i}
            href={`?page=${i + 1}`}
            className={`join-item btn ${i + 1 == page ? 'btn-active' : ''}`}
          >
            {i + 1}
          </a>
        ))}
      </div>
    </main>
  );
}
