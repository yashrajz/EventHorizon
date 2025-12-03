import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'

const locations = [
  { id: 1, name: 'All Locations' },
  { id: 2, name: 'San Francisco' },
  { id: 3, name: 'New York' },
  { id: 4, name: 'London' },
  { id: 5, name: 'Berlin' },
  { id: 6, name: 'Online' },
]

interface LocationComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationCombobox({ value, onChange }: LocationComboboxProps) {
  const [query, setQuery] = useState('')
  const selected = locations.find(l => l.name === value) || locations[0]

  const filteredLocations =
    query === ''
      ? locations
      : locations.filter((location) => {
          return location.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox 
      value={selected} 
      onChange={(val) => {
        if (val) {
          onChange(val.name)
          setQuery('')
        }
      }}
      onClose={() => setQuery('')}
    >
      <div className="relative flex-1">
        <ComboboxInput
          className={clsx(
            'w-full border-none bg-transparent py-0 pr-8 pl-0 text-sm text-foreground',
            'focus:outline-none focus:ring-0 placeholder:text-muted-foreground'
          )}
          displayValue={(location: typeof locations[0]) => query !== '' ? query : (location?.name === 'All Locations' ? '' : location?.name)}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={(event) => {
            if (selected.name === 'All Locations') {
              setQuery('')
            }
          }}
          placeholder="All Locations"
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center">
          <ChevronDownIcon className="size-4 fill-muted-foreground" />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        anchor="bottom start"
        className={clsx(
          'z-50 w-[var(--input-width)] min-w-[200px] rounded-xl border border-glass-border bg-background p-1 shadow-lg',
          '[--anchor-gap:8px] empty:invisible',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
        )}
      >
        {filteredLocations.map((location) => (
          <ComboboxOption
            key={location.id}
            value={location}
            className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 select-none data-[focus]:bg-accent/20"
          >
            <CheckIcon className="invisible size-4 fill-foreground group-data-[selected]:visible" />
            <div className="text-sm text-foreground">{location.name}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}
