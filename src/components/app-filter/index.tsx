'use client'

import { appCategories, gameCategories } from "@/src/constants/categories"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type OrderBy = 'newest' | 'oldest'

export function AppFilter() {
  const router = useRouter()
  const [orderBy, setOrderBy] = useState<OrderBy>('newest')
  const [isGame, setIsGame] = useState<boolean>(false)
  const [category, setCategory] = useState<string>('')

  useEffect(() => {
    const query = {
      orderBy: 'created',
      sort: orderBy == 'newest' ? 'desc' : 'asc',
      game: isGame ? 'true' : 'false',
      category: category,
    }
    router.push('?' + new URLSearchParams(query).toString())
  }, [orderBy, isGame, category])
  
  return (
    <div className="px-4 flex flex-row flex-wrap gap-2">
      <button
        className={[
          'btn',
          orderBy == 'newest' ? 'btn-primary' : 'btn-outline',
          'btn-sm',
          'rounded-full',
        ].join(' ')}
        onClick={() => setOrderBy('newest')}
      >
        Newest
      </button>
      <button
        className={[
          'btn',
          orderBy == 'oldest' ? 'btn-primary' : 'btn-outline',
          'btn-sm',
          'rounded-full',
        ].join(' ')}
        onClick={() => setOrderBy('oldest')}
      >
        Oldest
      </button>
      <button
        className={[
          'btn',
          isGame ? 'btn-primary' : 'btn-outline',
          'btn-sm',
          'rounded-full',
        ].join(' ')}
        onClick={() => {
          setIsGame(!isGame)
          setCategory('')
        }}
      >
        Games
      </button>
      {!isGame && (
        <select
          className="w-48 select select-bordered select-sm"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {appCategories.map(category => (
            <option key={category}>{category}</option>
          ))}
        </select>
      )}
      {isGame && (
        <select
          className="w-48 select select-bordered select-sm"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {gameCategories.map(category => (
            <option key={category}>{category}</option>
          ))}
        </select>
      )}
    </div>
  )
}