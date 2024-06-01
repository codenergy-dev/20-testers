import { AppCard } from "@/src/components/app-card"
import { AppFilter } from "@/src/components/app-filter"

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
      <AppFilter />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {apps.map(app => <AppCard key={app.packageName} app={app} />)}
      </div>
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
