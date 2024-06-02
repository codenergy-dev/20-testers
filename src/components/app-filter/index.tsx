'use client'

import { appCategories, gameCategories } from "@/src/constants/categories"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type OrderBy = 'newest' | 'oldest'
type Type = 'all' | 'app' | 'game'

export function AppFilter() {
  const router = useRouter()
  const [orderBy, setOrderBy] = useState<OrderBy>('newest')
  const [type, setType] = useState<Type>('all')
  const [category, setCategory] = useState<string>('')

  useEffect(() => {
    const query = {
      orderBy: 'created',
      sort: orderBy == 'newest' ? 'desc' : 'asc',
      type: type,
      category: category,
    }
    router.push('?' + new URLSearchParams(query).toString())
  }, [orderBy, type, category])

  function onTypeChange(type: Type) {
    setType(type)
    setCategory('')
  }
  
  return (
    <div className="px-4 flex flex-row flex-wrap gap-2">
      <AppButtonFilter
        label="Newest"
        selected={orderBy == 'newest'}
        onClick={() => setOrderBy('newest')}
      />
      <AppButtonFilter
        label="Oldest"
        selected={orderBy == 'oldest'}
        onClick={() => setOrderBy('oldest')}
      />
      <div className="join">
        <AppJoinFilter
          label="All"
          selected={type == 'all'}
          onClick={() => onTypeChange('all')}
        />
        <AppJoinFilter
          label="Apps"
          selected={type == 'app'}
          onClick={() => onTypeChange('app')}
        />
        <AppJoinFilter
          label="Games"
          selected={type == 'game'}
          onClick={() => onTypeChange('game')}
        />
      </div>
      {type == 'app' && (
        <AppSelectFilter
          data={appCategories}
          placeholder="All categories"
          onChange={setCategory}
        />
      )}
      {type == 'game' && (
        <AppSelectFilter
          data={gameCategories}
          placeholder="All categories"
          onChange={setCategory}
        />
      )}
    </div>
  )
}

interface AppButtonFilterProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function AppButtonFilter({label, selected, onClick}: AppButtonFilterProps) {
  return (
    <button
      className={[
        'btn',
        selected ? 'btn-primary' : 'btn-outline',
        'btn-sm',
        'rounded-full',
      ].join(' ')}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

interface AppJoinFilterProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function AppJoinFilter({label, selected, onClick}: AppJoinFilterProps) {
  return (
    <button
      className={[
        'btn',
        selected ? 'btn-primary' : 'btn-outline',
        'btn-sm',
        'rounded-full',
        'join-item',
      ].join(' ')}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

interface AppSelectFilterProps {
  data: string[]
  placeholder?: string
  onChange: (value: string) => void
}

export function AppSelectFilter({data, placeholder, onChange}: AppSelectFilterProps) {
  return (
    <select
      className="w-48 select select-bordered select-sm"
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {data.map(value => (
        <option key={value}>{value}</option>
      ))}
    </select>
  )
}