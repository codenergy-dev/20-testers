'use client'

import { AppCard } from "@/src/components/app-card"
import { AppSearchParams } from "@/src/components/app-search-params"
import { useState } from "react"
import useInfiniteScroll from "react-infinite-scroll-hook"

export default function Page({searchParams}: any) {
  const [apps, setApps] = useState<App[]>([])

  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [page, setPage] = useState(1)
  const [error, setError] = useState(false)
  const [scroll] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: () => getApps(searchParams),
    disabled: error,
    rootMargin: '0px 0px 400px 0px',
  })

  async function getApps(searchParams: any, refresh: boolean = false) {
    if (loading) return
    try {
      setLoading(true)
      const query = new URLSearchParams({...searchParams, page: refresh ? 1 : page + 1}).toString()
      const apps = await (await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/app?${query}`)).json() as App[]
      if (refresh) {
        setApps(apps)
        setPage(1)
      } else {
        setApps((old) => [...old, ...apps])
        setPage((old) => old + 1)
      }
      setHasNextPage(apps.length > 0)
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <AppSearchParams onChange={(searchParams) => getApps(searchParams, true)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {apps.map((app, i) => <AppCard key={app.packageName} app={app} />)}
        {loading && <div className="skeleton h-96"></div>}
      </div>
      <div ref={scroll} />
    </main>
  );
}
