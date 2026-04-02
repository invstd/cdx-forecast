import { useState, useMemo, Fragment } from 'react'
import {
  capacityData,
  months,
  scopeRows,
  aggregateCards,
} from '../data/sampleData'

// ─── Style map ────────────────────────────────────────────────────────────────

const groupStyles = {
  purple:     { header: 'bg-purple-900/60',     headerText: 'text-purple-200' },
  ocean:      { header: 'bg-ocean-900/60',      headerText: 'text-ocean-200' },
  caramel:    { header: 'bg-caramel-900/60',    headerText: 'text-caramel-200' },
  tangerine:  { header: 'bg-tangerine-900/60',  headerText: 'text-tangerine-200' },
  cornflower: { header: 'bg-cornflower-900/60', headerText: 'text-cornflower-200' },
}

// ─── Compute total load per deck from all scope cards ─────────────────────────

function computeDeckLoads() {
  const loads = {}
  for (const row of scopeRows) {
    const agg = aggregateCards(row.cards)
    for (const [col, val] of Object.entries(agg)) {
      loads[col] = (loads[col] ?? 0) + val
    }
  }
  return loads
}

// ─── Month label formatter ────────────────────────────────────────────────────

function fmtMonth(m) {
  const [y, mo] = m.split('-')
  const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${names[parseInt(mo)]} ${y}`
}

// ─── Projected end date ───────────────────────────────────────────────────────

function projectedEnd(load, bufLoad, cap) {
  if (cap === 0) return 'n/a'
  const totalWork = load + bufLoad
  const weeksNeeded = totalWork / cap
  const start = new Date(2026, 0, 1)
  start.setDate(start.getDate() + Math.ceil(weeksNeeded * 7))
  return start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// ─── Editable green badge ─────────────────────────────────────────────────────

function EditableBadge({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { onChange(parseInt(draft) || 0); setEditing(false) }}
        onKeyDown={(e) => { if (e.key === 'Enter') { onChange(parseInt(draft) || 0); setEditing(false) } if (e.key === 'Escape') setEditing(false) }}
        className="w-12 bg-emerald-800/40 border border-emerald-600/50 rounded px-1.5 py-0.5 text-xs text-emerald-100 text-right tabular-nums outline-none"
      />
    )
  }

  return (
    <button
      onClick={() => { setDraft(String(value)); setEditing(true) }}
      className="inline-block bg-emerald-800/30 text-emerald-300 text-xs tabular-nums px-1.5 py-0.5 rounded hover:bg-emerald-700/40 transition-colors cursor-pointer"
    >
      {value}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CapacityTable({ bufferPercent, onBufferChange }) {
  const [expandedDecks, setExpandedDecks] = useState(new Set())
  const [memberMonths, setMemberMonths] = useState(() => {
    // Deep copy initial month data so edits are local
    const init = {}
    for (const group of capacityData) {
      for (const deck of group.decks) {
        for (const member of deck.members) {
          const key = `${deck.name}::${member.name}`
          init[key] = { ...member.months }
        }
      }
    }
    return init
  })

  const deckLoads = useMemo(computeDeckLoads, [])

  const toggleDeck = (name) => {
    setExpandedDecks((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const updateMemberMonth = (deckName, memberName, month, value) => {
    const key = `${deckName}::${memberName}`
    setMemberMonths((prev) => ({
      ...prev,
      [key]: { ...prev[key], [month]: value },
    }))
  }

  // Compute deck-level aggregates
  function deckAgg(deck) {
    let cap = 0
    const monthSums = {}
    for (const m of months) monthSums[m] = 0
    for (const member of deck.members) {
      cap += member.capacity
      const key = `${deck.name}::${member.name}`
      const mo = memberMonths[key] || member.months
      for (const m of months) monthSums[m] += mo[m] ?? 0
    }
    const load = deckLoads[deck.name] ?? 0
    const buf = Math.round(load * (bufferPercent / 100))
    const end = projectedEnd(load, buf, cap)
    return { cap, load, buf, end, monthSums }
  }

  // Compute group-level aggregates
  function groupAgg(group) {
    let cap = 0, load = 0, buf = 0
    const monthSums = {}
    for (const m of months) monthSums[m] = 0
    for (const deck of group.decks) {
      const da = deckAgg(deck)
      cap += da.cap
      load += da.load
      buf += da.buf
      for (const m of months) monthSums[m] += da.monthSums[m]
    }
    const end = cap === 0 ? 'n/a' : projectedEnd(load, buf, cap)
    return { cap, load, buf, end, monthSums }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Buffer slider */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-grey-800 bg-grey-950">
        <label className="text-xs text-grey-400 font-medium whitespace-nowrap">
          {bufferPercent}% Buffer
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={bufferPercent}
          onChange={(e) => onBufferChange(parseInt(e.target.value))}
          className="w-40 h-1 accent-ocean-400 bg-grey-700 rounded cursor-pointer"
        />
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-30">
            <tr className="border-b border-grey-700 bg-grey-950">
              <th className="sticky left-0 z-40 bg-grey-950 px-3 py-2 text-left text-[11px] font-medium text-grey-400 w-52 min-w-[208px]">
                Team
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-medium text-grey-400 w-16">Cap</th>
              <th className="px-3 py-2 text-right text-[11px] font-medium text-grey-400 w-16">Load</th>
              <th className="px-3 py-2 text-right text-[11px] font-medium text-grey-400 w-16">Buf</th>
              <th className="px-3 py-2 text-right text-[11px] font-medium text-grey-400 w-20">End</th>
              {months.map((m) => (
                <th key={m} className="px-3 py-2 text-right text-[11px] font-medium text-grey-400 w-20">
                  {fmtMonth(m)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {capacityData.map((group) => {
              const ga = groupAgg(group)
              const style = groupStyles[group.color]
              return (
                <Fragment key={group.group}>
                  {/* Group header row */}
                  <tr className={`${style.header} border-b border-grey-800`}>
                    <td className={`sticky left-0 z-10 ${style.header} px-3 py-2 font-semibold text-[11px] uppercase tracking-wider ${style.headerText}`}>
                      {group.group}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-grey-200 tabular-nums">{ga.cap}</td>
                    <td className={`px-3 py-2 text-right font-semibold tabular-nums ${ga.load > ga.cap ? 'text-cherry-400' : 'text-grey-200'}`}>
                      {ga.load}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-grey-200 tabular-nums">{ga.buf}</td>
                    <td className="px-3 py-2 text-right text-grey-300 text-xs">{ga.end}</td>
                    {months.map((m) => (
                      <td key={m} className="px-3 py-2 text-right text-grey-300 tabular-nums">{ga.monthSums[m]}</td>
                    ))}
                  </tr>

                  {/* Deck rows */}
                  {group.decks.map((deck) => {
                    const da = deckAgg(deck)
                    const isExpanded = expandedDecks.has(deck.name)
                    return (
                      <Fragment key={deck.name}>
                        <tr className="border-b border-grey-900 hover:bg-grey-900/50 transition-colors">
                          <td className="sticky left-0 z-10 bg-grey-950 px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-2 pl-3">
                              <button onClick={() => toggleDeck(deck.name)} className="shrink-0 text-grey-500 hover:text-grey-300 transition-colors">
                                <svg className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              <span className="text-grey-200 font-medium">{deck.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right text-grey-200 tabular-nums">{da.cap}</td>
                          <td className={`px-3 py-2 text-right tabular-nums ${da.load > da.cap ? 'text-cherry-400 font-semibold' : 'text-grey-200'}`}>
                            {da.load}
                          </td>
                          <td className="px-3 py-2 text-right text-grey-200 tabular-nums">{da.buf}</td>
                          <td className="px-3 py-2 text-right text-grey-400 text-xs">{da.end}</td>
                          {months.map((m) => (
                            <td key={m} className="px-3 py-2 text-right text-grey-300 tabular-nums">{da.monthSums[m]}</td>
                          ))}
                        </tr>

                        {/* Expanded member rows */}
                        {isExpanded && deck.members.map((member) => {
                          const key = `${deck.name}::${member.name}`
                          const mo = memberMonths[key] || member.months
                          return (
                            <tr key={member.name} className="border-b border-grey-900/50 bg-grey-950/50">
                              <td className="sticky left-0 z-10 bg-grey-950 px-3 py-1.5 whitespace-nowrap">
                                <div className="flex items-center gap-2 pl-8">
                                  <span className="w-5 h-5 rounded-full bg-grey-700 flex items-center justify-center text-[9px] text-grey-300 font-medium uppercase">
                                    {member.name.charAt(0)}
                                  </span>
                                  <span className="text-grey-300 text-xs">{member.name}</span>
                                </div>
                              </td>
                              <td className="px-3 py-1.5 text-right text-grey-400 tabular-nums">{member.capacity}</td>
                              <td className="px-3 py-1.5 text-right text-grey-500">-</td>
                              <td className="px-3 py-1.5 text-right text-grey-500">-</td>
                              <td className="px-3 py-1.5 text-right text-grey-500">-</td>
                              {months.map((m) => (
                                <td key={m} className="px-3 py-1.5 text-right">
                                  <EditableBadge
                                    value={mo[m] ?? 0}
                                    onChange={(v) => updateMemberMonth(deck.name, member.name, m, v)}
                                  />
                                </td>
                              ))}
                            </tr>
                          )
                        })}
                      </Fragment>
                    )
                  })}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
