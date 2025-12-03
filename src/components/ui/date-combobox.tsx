import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'

const dateRanges = [
  { id: 1, name: 'Any Date' },
  { id: 2, name: 'Today' },
  { id: 3, name: 'This Week' },
  { id: 4, name: 'This Month' },
  { id: 5, name: 'This Year' },
  { id: 6, name: 'Custom Range' },
]

interface DateComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function DateCombobox({ value, onChange }: DateComboboxProps) {
  const [query, setQuery] = useState('')
  const selected = dateRanges.find(d => d.name === value) || dateRanges[0]

  const filteredDates =
    query === ''
      ? dateRanges
      : dateRanges.filter((date) => {
          return date.name.toLowerCase().includes(query.toLowerCase())
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
          displayValue={(date: typeof dateRanges[0]) => query !== '' ? query : (date?.name === 'Any Date' ? '' : date?.name)}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={(event) => {
            if (selected.name === 'Any Date') {
              setQuery('')
            }
          }}
          placeholder="Any Date"
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
        {filteredDates.map((date) => (
          <ComboboxOption
            key={date.id}
            value={date}
            className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 select-none data-[focus]:bg-accent/20"
          >
            <CheckIcon className="invisible size-4 fill-foreground group-data-[selected]:visible" />
            <div className="text-sm text-foreground">{date.name}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  )
}
