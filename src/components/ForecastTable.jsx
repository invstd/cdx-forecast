import { useState, useMemo, useRef, useCallback, Fragment } from 'react'
import { createPortal } from 'react-dom'
import {
  columnGroups,
  months,
  scopeRows,
  aggregateCards,
  aggregateDone,
  filterCards,
  getDeckCapacity,
} from '../data/sampleData'
import ColumnDrawer from './ColumnDrawer'
import { cdxBtnClass, cdxInputClass, Stepper } from './CdxControls'

// ─── Style map ────────────────────────────────────────────────────────────────

// Original Codecks uses NO colored group header backgrounds — just plain dark bg
// with light grey text for all groups. The colored backgrounds were our prototype addition.
const groupStyles = {
  purple:     { header: '',  headerText: 'text-grey-100' },
  ocean:      { header: '',  headerText: 'text-grey-100' },
  caramel:    { header: '',  headerText: 'text-grey-100' },
  tangerine:  { header: '',  headerText: 'text-grey-100' },
  cornflower: { header: '',  headerText: 'text-grey-100' },
}

let _colIdx = 0
const allColumns = columnGroups.flatMap((g) =>
  g.columns.map((col, i) => ({
    name: col,
    group: g.name,
    color: g.color,
    isFirstInGroup: i === 0,
    isFirstOverall: _colIdx++ === 0,
  }))
)

const deckCapacityMap = getDeckCapacity()
const dividerClass = 'border-l-2 border-grey-500'
const dividerClassFoot = 'border-l-2 border-grey-600'

// ─── Projected end date ───────────────────────────────────────────────────────

const THREE_YEARS_MS = 3 * 365.25 * 24 * 60 * 60 * 1000
const NOW = new Date(2026, 3, 1) // April 2026 — current project date

const FOREVER = '∞'

// Walk through months consuming capacity until totalWork is done.
// monthlyCaps = { '2026-04': 100, '2026-05': 50, ... }
function projectedEnd(load, buf, cap, monthlyCaps) {
  if (load === 0) return '—'
  const totalWork = load + buf
  if (cap === 0 || totalWork > cap) return FOREVER

  let remaining = totalWork
  for (const m of months) {
    const mCap = monthlyCaps[m] ?? 0
    if (mCap <= 0) continue
    remaining -= mCap
    if (remaining <= 0) {
      // Finished partway through this month
      const [y, mo] = m.split('-').map(Number)
      const daysInMonth = new Date(y, mo, 0).getDate()
      const fraction = 1 - (Math.abs(remaining) / mCap) // how far into the month
      const day = Math.max(1, Math.ceil(fraction * daysInMonth))
      const end = new Date(y, mo - 1, day)
      const d = end.getDate()
      const suffix = d === 1 || d === 21 || d === 31 ? 'st' : d === 2 || d === 22 ? 'nd' : d === 3 || d === 23 ? 'rd' : 'th'
      const monthStr = end.toLocaleDateString('en-US', { month: 'short' })
      const yearStr = end.getFullYear() !== NOW.getFullYear() ? ` ${end.getFullYear()}` : ''
      return `${d}${suffix} ${monthStr}${yearStr}`
    }
  }
  return FOREVER
}

function isOverloaded(load, buf, cap) {
  if (load === 0) return false
  if (cap === 0) return true
  const totalWork = load + buf
  const weeksNeeded = totalWork / cap
  const end = new Date(NOW)
  end.setDate(end.getDate() + Math.ceil(weeksNeeded * 7))
  return end.getTime() - NOW.getTime() > THREE_YEARS_MS
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

// ─── Cell value display ───────────────────────────────────────────────────────

function CellValue({ total, done, bold = false }) {
  if (total == null) {
    return <span className="text-grey-450">—</span>
  }
  const hasDone = done != null && done > 0
  return (
    <span className="inline-flex items-baseline justify-center">
      {hasDone && (
        <span className={`tabular-nums text-salad-200 ${bold ? 'font-bold' : ''}`}>
          {done}/
        </span>
      )}
      <span className={`text-grey-50 tabular-nums ${bold ? 'font-bold' : ''}`}>{total}</span>
    </span>
  )
}

// ─── Tooltip (fixed-position, escapes overflow:hidden) ───────────────────────

function Tooltip({ text, children, className = '' }) {
  const ref = useRef(null)
  const [pos, setPos] = useState(null)

  const show = useCallback(() => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    setPos({ left: r.left, top: r.top - 4 })
  }, [])

  const hide = useCallback(() => setPos(null), [])

  return (
    <>
      <span ref={ref} onMouseEnter={show} onMouseLeave={hide} className={className}>
        {children}
      </span>
      {pos && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none -translate-y-full rounded-[6px] px-2.5 py-1 text-xs text-white shadow-lg whitespace-nowrap"
          style={{ left: pos.left, top: pos.top, background: 'linear-gradient(180deg, #34a485 0%, #2a8b70 100%)' }}
        >
          {text}
        </div>,
        document.body
      )}
    </>
  )
}

// Stepper, cdxBtnClass, cdxInputClass imported from CdxControls

// ─── Card row ─────────────────────────────────────────────────────────────────

function CardRow({ card, visibleColumns, disabled, onToggle, journeyActive = true, onToggleJourney, multiplier, onMultiplierChange, onValueChange, activeColumn }) {
  const vals = card.values || {}
  const rowTotal = Object.values(vals).reduce((a, b) => a + (b ?? 0), 0)
  const displayTotal = Math.round(rowTotal * multiplier)

  return (
    <tr className={`${disabled ? 'opacity-60' : ''} h-[39px] bg-grey-750`}>
      <td className="sticky left-0 z-10 bg-grey-750 px-3 sticky-col-shadow border-b border-grey-600 border-r border-grey-500 w-80 min-w-[320px] max-w-[320px]">
        <div className="flex items-center gap-2 pl-5">
          {/* Completed checkbox */}
          <button
            onClick={onToggle}
            className="shrink-0 flex items-center justify-center w-[18px] h-[18px] rounded-[5px] transition-all"
            style={disabled
              ? { background: 'linear-gradient(180deg, #24293b 0%, #1e2333 100%)', boxShadow: 'inset 0 0 0 2px #487dcd, inset 0 1px 3px rgba(0,0,0,0.3)' }
              : { background: 'linear-gradient(180deg, #34a485 0%, #2a8b70 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.3)' }
            }
          >
            {!disabled && (
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6l3 3 5-6" />
              </svg>
            )}
          </button>
          <Tooltip text={card.title} className={`text-sm truncate min-w-0 flex-1 block ${disabled ? 'text-grey-550 line-through' : 'text-grey-100'}`}>
            {card.title}
          </Tooltip>
          {/* Journey toggle + multiplier — pushed to right */}
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            <button
              onClick={onToggleJourney}
              title={journeyActive ? 'Journey active (read-only values)' : 'Journey off (editable values)'}
              className={`shrink-0 inline-grid place-items-center w-[24px] h-[24px] rounded-[5px] transition-all ${
                journeyActive
                  ? 'bg-emerald-800/50 border border-emerald-500/50'
                  : 'bg-purple-800/40 border border-purple-500/40'
              }`}
            >
              <svg className="w-[14px] h-[13px]" viewBox="0 0 20 19" fill={journeyActive ? '#3dbb98' : '#7c5aab'}>
                <path fillRule="evenodd" clipRule="evenodd" d="M7.85623 1.79047C7.52356 1.68852 7.1521 1.78084 6.88211 2.07045C6.70763 2.25759 6.55508 2.61811 6.51225 3.09939C6.47008 3.57324 6.54768 4.02698 6.68349 4.31833C7.12503 5.26554 6.7899 6.45619 5.83496 6.96833C5.79738 6.98848 5.74963 7.03667 5.72755 7.11955L4.71766 10.9109L10.4407 12.7525C11.2605 13.0163 11.3458 14.0698 10.713 14.5223C10.0623 14.9876 9.82616 15.9588 10.2398 16.738C10.4351 17.106 11.0037 17.0601 11.3319 16.8841C11.5565 16.7636 11.7444 16.5395 11.831 16.2457L15.4056 4.10407L7.85623 1.79047ZM17.0722 4.63937L16.3015 7.25742C16.6937 7.31585 17 7.28052 17.2211 7.19012C17.5174 7.06899 17.828 6.78008 17.9674 6.0325C18.0683 5.4911 17.9152 5.21863 17.683 5.00942C17.5289 4.87047 17.3227 4.74833 17.0722 4.63937ZM15.8043 8.94612L13.5097 16.7399C13.2984 17.4577 12.8189 18.0724 12.159 18.4263C11.8053 18.616 11.3362 18.7268 10.8734 18.7468C10.4229 18.7664 9.88861 18.7039 9.39396 18.4626L1.852 15.8359C0.342706 15.3265 -0.361571 13.6068 0.182976 12.1466C0.629228 10.9499 1.81416 10.2062 3.04487 10.3919L4.03652 6.66911C4.17596 6.14563 4.51957 5.688 5.00786 5.42612C5.13222 5.35943 5.15173 5.17435 5.09735 5.0577C4.80593 4.43254 4.70556 3.65866 4.76914 2.94426C4.83206 2.2373 5.06897 1.44895 5.6021 0.877102C6.31057 0.11718 7.37114 -0.188524 8.369 0.117282L16.7312 2.68C17.4123 2.86365 18.2384 3.15407 18.8546 3.70945C19.5412 4.32823 19.8999 5.21542 19.6877 6.35328C19.4679 7.53186 18.8608 8.41033 17.8835 8.80994C17.2356 9.07485 16.5188 9.08915 15.8043 8.94612ZM8.29955 16.2283C8.23087 15.4723 8.40449 14.7062 8.79901 14.0626C6.84551 13.434 4.87801 12.8545 2.94507 12.1634C2.53325 12.0162 2.02413 12.2178 1.82267 12.758C1.58985 13.3824 1.92686 14.0153 2.41344 14.1784L2.42316 14.1816L8.29955 16.2283Z" />
              </svg>
            </button>
            <Stepper
              value={multiplier}
              onChange={onMultiplierChange}
              step={0.5}
              formatValue={(v) => v.toFixed(1)}
              hoverButtons
            />
          </div>
        </div>
      </td>
      {visibleColumns.map((col, ci) => {
        const baseVal = vals[col.name] ?? null
        const isEditable = !journeyActive && !disabled
        const displayVal = baseVal != null ? Math.round(baseVal * multiplier) : null
        return (
          <td key={col.name} className={`px-2 text-center border-b border-grey-600 w-[156px] min-w-[156px] max-w-[156px] ${(col.isFirstInGroup && !col.isFirstOverall) ? dividerClass : ''} ${activeColumn === col.name ? 'active-col' : ''}`}>
            {isEditable ? (
              <Stepper
                value={baseVal ?? 0}
                onChange={(newVal) => onValueChange(card.id, col.name, newVal)}
              />
            ) : (
              baseVal != null ? (
                <Stepper
                  value={displayVal}
                  onChange={() => {}}
                  readOnly
                />
              ) : (
                <span className="text-grey-450">—</span>
              )
            )}
          </td>
        )
      })}
      <td className="sticky right-0 z-10 bg-grey-750 px-3 border-l border-grey-500 border-b border-grey-600 sticky-total-shadow tabular-nums text-sm text-grey-200 text-right">
        {displayTotal > 0 ? displayTotal : ''}
      </td>
    </tr>
  )
}

// ─── Main table ───────────────────────────────────────────────────────────────

export default function ForecastTable({ activePriorities, selectedMilestone, bufferPercent, onBufferChange }) {
  const [expandedScopes, setExpandedScopes] = useState(new Set())
  const [disabledCards, setDisabledCards] = useState(new Set())
  const [journeyOffCards, setJourneyOffCards] = useState(new Set()) // cards where journey is OFF (editable)
  const [cardValueOverrides, setCardValueOverrides] = useState({}) // { cardId: { colName: value } }
  const [cardMultipliers, setCardMultipliers] = useState({}) // { cardId: number }
  const [openDrawer, setOpenDrawer] = useState(null) // deck name or null
  const scrollRef = useRef(null)

  const toggleJourney = (cardId) => {
    setJourneyOffCards((prev) => {
      const next = new Set(prev)
      next.has(cardId) ? next.delete(cardId) : next.add(cardId)
      return next
    })
  }

  const setMultiplier = (cardId, value) => {
    setCardMultipliers((prev) => ({ ...prev, [cardId]: value }))
  }

  const updateCardValue = (cardId, colName, value) => {
    setCardValueOverrides((prev) => ({
      ...prev,
      [cardId]: { ...(prev[cardId] || {}), [colName]: value },
    }))
  }
  const [drawerVisible, setDrawerVisible] = useState(false) // controls animation
  const [drawerContent, setDrawerContent] = useState(null) // keeps content during close animation

  const handleOpenDrawer = (name) => {
    if (openDrawer === name) {
      // Close
      setDrawerVisible(false)
      setTimeout(() => { setOpenDrawer(null); setDrawerContent(null) }, 250)
    } else {
      setDrawerContent(name)
      setOpenDrawer(name)
      // Force reflow then open
      requestAnimationFrame(() => requestAnimationFrame(() => setDrawerVisible(true)))
    }
  }

  const handleFocusColumn = useCallback(() => {
    if (!openDrawer || !scrollRef.current) return
    const container = scrollRef.current
    const th = container.querySelector(`th[data-col="${openDrawer}"]`)
    if (!th) return
    const containerRect = container.getBoundingClientRect()
    const thRect = th.getBoundingClientRect()
    const scrollLeft = thRect.left - containerRect.left + container.scrollLeft - (containerRect.width / 2) + (thRect.width / 2)
    container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' })
  }, [openDrawer])

  const handleCloseDrawer = () => {
    setDrawerVisible(false)
    setTimeout(() => { setOpenDrawer(null); setDrawerContent(null) }, 250)
  }

  // Lifted month state: { "deckName::memberName": { "2026-01": N, ... } }
  const [memberMonthOverrides, setMemberMonthOverrides] = useState(() => {
    const init = {}
    for (const [deckName, deck] of Object.entries(deckCapacityMap)) {
      for (const member of deck.members) {
        init[`${deckName}::${member.name}`] = { ...member.months }
      }
    }
    return init
  })

  const updateMemberMonth = (deckName, memberName, month, value) => {
    const key = `${deckName}::${memberName}`
    setMemberMonthOverrides((prev) => ({
      ...prev,
      [key]: { ...prev[key], [month]: value },
    }))
  }

  // Compute dynamic capacity per deck from current month overrides
  const { deckCaps, deckMonthlyCaps } = useMemo(() => {
    const caps = {}
    const monthly = {}
    for (const [deckName, deck] of Object.entries(deckCapacityMap)) {
      let totalCap = 0
      const perMonth = {}
      for (const m of months) perMonth[m] = 0
      for (const member of deck.members) {
        const key = `${deckName}::${member.name}`
        const mo = memberMonthOverrides[key] || member.months
        for (const [m, v] of Object.entries(mo)) {
          totalCap += v
          perMonth[m] = (perMonth[m] ?? 0) + v
        }
      }
      caps[deckName] = totalCap
      monthly[deckName] = perMonth
    }
    return { deckCaps: caps, deckMonthlyCaps: monthly }
  }, [memberMonthOverrides])

  // Build per-deck memberMonths for the drawer
  const getDrawerMonths = (deckName) => {
    const deck = deckCapacityMap[deckName]
    if (!deck) return {}
    const result = {}
    for (const member of deck.members) {
      const key = `${deckName}::${member.name}`
      result[member.name] = memberMonthOverrides[key] || { ...member.months }
    }
    return result
  }

  const toggleCard = (cardId) => {
    setDisabledCards((prev) => {
      const next = new Set(prev)
      next.has(cardId) ? next.delete(cardId) : next.add(cardId)
      return next
    })
  }

  const toggleScope = (name) => {
    setExpandedScopes((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const hasFilters = activePriorities.size > 0 || selectedMilestone != null

  // Apply card value overrides to card objects
  const resolvedCards = useMemo(() => {
    return scopeRows.map((row) => ({
      ...row,
      cards: row.cards.map((c) => {
        const overrides = cardValueOverrides[c.id]
        if (!overrides) return c
        return { ...c, values: { ...c.values, ...overrides } }
      }),
    }))
  }, [cardValueOverrides])

  // Aggregate with multipliers applied
  function aggregateWithMultipliers(cards) {
    const agg = {}
    for (const c of cards) {
      const mult = cardMultipliers[c.id] ?? 1
      for (const [col, val] of Object.entries(c.values)) {
        agg[col] = (agg[col] ?? 0) + Math.round(val * mult)
      }
    }
    return agg
  }

  const deckLoads = useMemo(() => {
    const loads = {}
    for (const row of resolvedCards) {
      const agg = aggregateWithMultipliers(row.cards)
      for (const [col, val] of Object.entries(agg)) {
        loads[col] = (loads[col] ?? 0) + val
      }
    }
    return loads
  }, [resolvedCards, cardMultipliers])

  const processedRows = useMemo(() => {
    return resolvedCards.map((row) => {
      const filtered = hasFilters
        ? filterCards(row.cards, { priorities: activePriorities.size > 0 ? activePriorities : null, milestone: selectedMilestone })
        : row.cards
      const enabledCards = filtered.filter((c) => !disabledCards.has(c.id))
      const values = aggregateWithMultipliers(enabledCards)
      const doneValues = aggregateWithMultipliers(enabledCards.filter((c) => c.completed))
      return { ...row, filteredCards: filtered, values, doneValues }
    })
  }, [resolvedCards, activePriorities, selectedMilestone, hasFilters, disabledCards, cardMultipliers])

  const visibleColumns = useMemo(() => {
    if (!hasFilters) return allColumns
    return allColumns.filter((col) =>
      processedRows.some((row) => (row.values[col.name] ?? 0) > 0)
    )
  }, [processedRows, hasFilters])

  const visibleGroups = useMemo(() => {
    return columnGroups
      .map((g) => ({
        ...g,
        visibleCols: g.columns.filter((c) => visibleColumns.some((vc) => vc.name === c)),
      }))
      .filter((g) => g.visibleCols.length > 0)
  }, [visibleColumns])

  const totals = useMemo(() => {
    const t = {}
    const d = {}
    for (const col of visibleColumns) {
      let sum = 0
      let doneSum = 0
      let hasVal = false
      for (const row of processedRows) {
        const v = row.values[col.name]
        if (v != null) { sum += v; hasVal = true }
        const dv = row.doneValues[col.name]
        if (dv != null) doneSum += dv
      }
      t[col.name] = hasVal ? sum : null
      d[col.name] = doneSum
    }
    return { totals: t, doneTotals: d }
  }, [processedRows, visibleColumns])

  const grandTotal = Object.values(totals.totals).reduce((a, b) => a + (b ?? 0), 0)
  const grandDone = Object.values(totals.doneTotals).reduce((a, b) => a + (b ?? 0), 0)

  return (
    <div className="flex gap-0 flex-1 min-h-0">
      {/* Capacity drawer — left side, pushes table right */}
      {(openDrawer || drawerContent) && deckCapacityMap[drawerContent || openDrawer] && (
        <div className="drawer-wrapper shrink-0" style={{ width: drawerVisible ? 380 : 0 }}>
          <div className={`drawer-panel h-full ${drawerVisible ? 'drawer-open' : ''}`}>
            <ColumnDrawer
              deckName={drawerContent || openDrawer}
              members={deckCapacityMap[drawerContent || openDrawer].members}
              memberMonths={getDrawerMonths(drawerContent || openDrawer)}
              load={deckLoads[drawerContent || openDrawer] ?? 0}
              bufferPercent={bufferPercent}
              onClose={handleCloseDrawer}
              onMonthChange={updateMemberMonth}
              onFocus={handleFocusColumn}
            />
          </div>
        </div>
      )}

      <div className={`flex-1 min-w-0 min-h-0 overflow-hidden border border-grey-500 ${drawerVisible ? 'rounded-r-[8px]' : 'rounded-[8px]'}`}>
        <div ref={scrollRef} className="overflow-auto max-h-full bg-grey-750 forecast-scroll" style={{ position: 'relative' }}>
          <table className="text-sm border-separate border-spacing-0" style={{ minWidth: '100%' }}>
          <thead className="sticky top-0 z-30">
            {/* Group headers */}
            <tr className="bg-grey-750">
              <th className="sticky left-0 z-40 bg-grey-750 w-80 min-w-[320px]  sticky-col-shadow px-3 h-[39px] text-xs font-bold tracking-[0.24px] uppercase text-left text-grey-100 border-r border-grey-500">Scope</th>
              {visibleGroups.map((g, gi) => {
                const style = groupStyles[g.color]
                return (
                  <th
                    key={g.name}
                    colSpan={g.visibleCols.length}
                    data-group={g.name}
                    onClick={() => {
                      if (!scrollRef.current) return
                      const el = scrollRef.current.querySelector(`th[data-group="${g.name}"]`)
                      if (!el) return
                      const container = scrollRef.current
                      const containerRect = container.getBoundingClientRect()
                      const elRect = el.getBoundingClientRect()
                      // Left-align: scroll so the group header sits right after the sticky first column
                      const stickyWidth = 320
                      const scrollLeft = elRect.left - containerRect.left + container.scrollLeft - stickyWidth
                      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' })
                    }}
                    className={`px-2 h-[39px] text-xs font-bold tracking-[0.24px] uppercase text-center cursor-pointer hover:text-grey-0 transition-colors ${style.headerText} ${gi > 0 ? dividerClass : ''}`}
                  >
                    {g.name}
                  </th>
                )
              })}
              <th className="sticky right-0 z-40 bg-grey-750 px-3 h-[39px] text-xs font-bold tracking-[0.24px] uppercase text-grey-100 text-right w-20 min-w-[80px] border-l border-grey-500  sticky-total-shadow">
                Total
              </th>
            </tr>

            {/* Column sub-headers with deck color dots + Cap / Load / Buf */}
            <tr className="bg-grey-700">
              <th className="sticky left-0 z-40 bg-grey-700 px-3 py-2 text-left align-middle sticky-col-shadow border-b border-grey-600 border-r border-grey-500">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-normal text-grey-200 whitespace-nowrap">Buffer</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={bufferPercent}
                    onChange={(e) => onBufferChange(parseInt(e.target.value))}
                    className="buffer-slider flex-1 cursor-pointer"
                    style={{ background: `linear-gradient(to right, var(--color-ocean-400) 0%, var(--color-ocean-400) ${bufferPercent}%, var(--color-grey-750) ${bufferPercent}%, var(--color-grey-750) 100%)` }}
                  />
                  <span className="text-[11px] font-bold text-grey-200 tabular-nums">{bufferPercent}%</span>
                </div>
              </th>
              {visibleColumns.map((col, ci) => {
                const deck = deckCapacityMap[col.name]
                const load = deckLoads[col.name] ?? 0
                const cap = deckCaps[col.name] ?? 0
                const buf = Math.round(load * (bufferPercent / 100))
                const overloaded = isOverloaded(load, buf, cap)
                const hasCapacity = !!deck

                const isActive = openDrawer === col.name
                const activeColClass = isActive ? 'active-col active-col-top' : ''

                // State logic:
                // red = cap can't cover load
                // yellow = cap covers load but load+buf end date exceeds current month
                // green = cap covers load+buf and end date is within current month
                // grey = no load
                const totalWork = load + buf
                let state = 'grey' // no load
                if (load > 0) {
                  if (cap < load) state = 'red'
                  else if (cap < totalWork) state = 'yellow'
                  else state = 'green'
                }

                const dotColors = { red: '#e52844', yellow: '#d8a63d', green: '#34a485', grey: '#575e75' }
                const dotGlows = { red: '0 0 6px 2px rgba(229,40,68,0.4)', yellow: '0 0 6px 2px rgba(216,166,61,0.35)', green: '0 0 6px 2px rgba(52,164,133,0.4)', grey: 'none' }
                const endColors = { red: 'text-cherry-300', yellow: 'text-caramel-200', green: 'text-emerald-300', grey: 'text-grey-400' }

                return (
                  <th
                    key={col.name}
                    data-col={col.name}
                    className={`px-3 py-2 text-left text-sm font-bold align-top w-[156px] min-w-[156px] max-w-[156px] border-b border-grey-600 ${(col.isFirstInGroup && !col.isFirstOverall) ? dividerClass : ''} ${activeColClass} text-grey-100 ${hasCapacity ? 'cursor-pointer hover:brightness-110 transition-all' : ''}`}
                    onClick={hasCapacity ? () => handleOpenDrawer(col.name) : undefined}
                  >
                    <Tooltip text={col.name} className="flex items-center gap-2 overflow-hidden">
                      <span
                        className="shrink-0 w-[8px] h-[8px] rounded-full"
                        style={{ background: `radial-gradient(circle, ${dotColors[state]} 40%, transparent 70%)`, boxShadow: dotGlows[state] }}
                      />
                      <span className="truncate">{col.name}</span>
                    </Tooltip>
                    {hasCapacity && (() => {
                      const end = projectedEnd(load, buf, cap, deckMonthlyCaps[col.name] || {})
                      const isForever = end === FOREVER
                      const totalWork = load + buf
                      const progress = totalWork > 0 ? Math.min(1, cap / totalWork) : 0
                      const barFills = { red: '#e52844', yellow: '#d8a63d', green: '#34a485', grey: '#575e75' }
                      const trackColor = '#24293b'
                      return (
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] font-normal">
                          <div className="flex-1 h-[3px] rounded-full min-w-[20px] overflow-hidden" style={{ background: trackColor }}>
                            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress * 100}%`, background: barFills[state] }} />
                          </div>
                          <span className={`shrink-0 ${endColors[state]}`}>{isForever ? <span className="text-[14px] leading-none">∞</span> : end}</span>
                        </div>
                      )
                    })()}
                  </th>
                )
              })}
              <th className="sticky right-0 z-40 bg-grey-700 px-3 py-2 text-center align-middle border-l border-grey-500 border-b border-grey-600 sticky-total-shadow">
                {(() => {
                  // Calculate overall completion: fraction of columns that are "green"
                  let total = 0, done = 0
                  for (const col of visibleColumns) {
                    const deck = deckCapacityMap[col.name]
                    if (!deck) continue
                    const load = deckLoads[col.name] ?? 0
                    if (load === 0) continue
                    total++
                    const cap = deckCaps[col.name] ?? 0
                    const buf = Math.round(load * (bufferPercent / 100))
                    if (cap >= load + buf) done++
                  }
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0
                  const r = 18, stroke = 3
                  const circ = 2 * Math.PI * r
                  const offset = circ - (pct / 100) * circ
                  const color = pct === 100 ? '#34a485' : pct >= 50 ? '#d8a63d' : pct > 0 ? '#e52844' : '#575e75'
                  return (
                    <div className="relative inline-flex items-center justify-center w-[44px] h-[44px]">
                      <svg width={44} height={44} className="absolute inset-0 rotate-[-90deg]">
                        <circle cx={22} cy={22} r={r} fill="none" stroke="#24293b" strokeWidth={stroke} />
                        <circle cx={22} cy={22} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} className="transition-all duration-500" />
                      </svg>
                      <span className="relative text-[10px] tabular-nums text-grey-300">{pct}%</span>
                    </div>
                  )
                })()}
              </th>
            </tr>
          </thead>

          <tbody>
            {processedRows.map((row) => {
              const isExpanded = expandedScopes.has(row.name)
              const rowTotal = Object.values(row.values).reduce((a, b) => a + (b ?? 0), 0)
              const rowDone = Object.values(row.doneValues).reduce((a, b) => a + (b ?? 0), 0)

              return (
                <Fragment key={row.name}>
                  <tr className="bg-grey-700 hover:bg-grey-600/40 transition-colors group h-[39px]">
                    <td className="sticky left-0 z-10 bg-grey-700 px-3 whitespace-nowrap sticky-col-shadow border-b border-grey-600 border-r border-grey-500 w-80 min-w-[320px] max-w-[320px]">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleScope(row.name)} className="shrink-0 text-purple-100 hover:text-grey-50 transition-colors">
                          <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <span className="text-grey-50 text-sm">{row.name}</span>
                        <span className="text-grey-100 text-[11px]">{row.progress}</span>
                        {isExpanded && (
                          <button className={`opacity-0 group-hover:opacity-100 size-[24px] text-[16px] ${cdxBtnClass}`}>
                            +
                          </button>
                        )}
                        <span className="ml-auto text-grey-450 cursor-pointer hover:text-grey-200 transition-colors">
                          <svg className="w-[16px] h-[15px]" viewBox="0 0 20 19" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M7.85623 1.79047C7.52356 1.68852 7.1521 1.78084 6.88211 2.07045C6.70763 2.25759 6.55508 2.61811 6.51225 3.09939C6.47008 3.57324 6.54768 4.02698 6.68349 4.31833C7.12503 5.26554 6.7899 6.45619 5.83496 6.96833C5.79738 6.98848 5.74963 7.03667 5.72755 7.11955L4.71766 10.9109L10.4407 12.7525C11.2605 13.0163 11.3458 14.0698 10.713 14.5223C10.0623 14.9876 9.82616 15.9588 10.2398 16.738C10.4351 17.106 11.0037 17.0601 11.3319 16.8841C11.5565 16.7636 11.7444 16.5395 11.831 16.2457L15.4056 4.10407L7.85623 1.79047ZM17.0722 4.63937L16.3015 7.25742C16.6937 7.31585 17 7.28052 17.2211 7.19012C17.5174 7.06899 17.828 6.78008 17.9674 6.0325C18.0683 5.4911 17.9152 5.21863 17.683 5.00942C17.5289 4.87047 17.3227 4.74833 17.0722 4.63937ZM15.8043 8.94612L13.5097 16.7399C13.2984 17.4577 12.8189 18.0724 12.159 18.4263C11.8053 18.616 11.3362 18.7268 10.8734 18.7468C10.4229 18.7664 9.88861 18.7039 9.39396 18.4626L1.852 15.8359C0.342706 15.3265 -0.361571 13.6068 0.182976 12.1466C0.629228 10.9499 1.81416 10.2062 3.04487 10.3919L4.03652 6.66911C4.17596 6.14563 4.51957 5.688 5.00786 5.42612C5.13222 5.35943 5.15173 5.17435 5.09735 5.0577C4.80593 4.43254 4.70556 3.65866 4.76914 2.94426C4.83206 2.2373 5.06897 1.44895 5.6021 0.877102C6.31057 0.11718 7.37114 -0.188524 8.369 0.117282L16.7312 2.68C17.4123 2.86365 18.2384 3.15407 18.8546 3.70945C19.5412 4.32823 19.8999 5.21542 19.6877 6.35328C19.4679 7.53186 18.8608 8.41033 17.8835 8.80994C17.2356 9.07485 16.5188 9.08915 15.8043 8.94612ZM8.29955 16.2283C8.23087 15.4723 8.40449 14.7062 8.79901 14.0626C6.84551 13.434 4.87801 12.8545 2.94507 12.1634C2.53325 12.0162 2.02413 12.2178 1.82267 12.758C1.58985 13.3824 1.92686 14.0153 2.41344 14.1784L2.42316 14.1816L8.29955 16.2283Z" />
                          </svg>
                        </span>
                      </div>
                    </td>
                    {visibleColumns.map((col, ci) => (
                      <td key={col.name} className={`px-2 text-center border-b border-grey-600 w-[156px] min-w-[156px] max-w-[156px] ${(col.isFirstInGroup && !col.isFirstOverall) ? dividerClass : ''} ${openDrawer === col.name ? 'active-col' : ''}`}>
                        <CellValue total={row.values[col.name] ?? null} done={row.doneValues[col.name] ?? null} />
                      </td>
                    ))}
                    <td className="sticky right-0 z-10 bg-grey-700 px-3 text-right tabular-nums border-l border-grey-500 border-b border-grey-600 sticky-total-shadow">
                      <CellValue total={rowTotal || null} done={rowDone || null} />
                    </td>
                  </tr>

                  {isExpanded &&
                    row.filteredCards.map((c) => (
                      <CardRow
                        key={c.id}
                        card={c}
                        visibleColumns={visibleColumns}
                        disabled={disabledCards.has(c.id)}
                        onToggle={() => toggleCard(c.id)}
                        journeyActive={!journeyOffCards.has(c.id)}
                        onToggleJourney={() => toggleJourney(c.id)}
                        multiplier={cardMultipliers[c.id] ?? 1}
                        onMultiplierChange={(v) => setMultiplier(c.id, v)}
                        onValueChange={updateCardValue}
                        activeColumn={openDrawer}
                      />
                    ))}
                </Fragment>
              )
            })}
          </tbody>

          <tfoot className="sticky bottom-0 z-20">
            <tr className="bg-grey-750 h-[39px]">
              <td className="sticky left-0 z-30 bg-grey-750 px-3 text-sm font-bold text-grey-50  sticky-col-shadow border-r border-grey-500">
                Total
              </td>
              {visibleColumns.map((col, ci) => (
                <td key={col.name} className={`px-2 text-center w-[156px] min-w-[156px] max-w-[156px] ${(col.isFirstInGroup && !col.isFirstOverall) ? dividerClassFoot : ''} ${openDrawer === col.name ? 'active-col active-col-bottom' : ''}`}>
                  <CellValue total={totals.totals[col.name]} done={totals.doneTotals[col.name]} bold />
                </td>
              ))}
              <td className="sticky right-0 z-30 bg-grey-750 px-3 text-right tabular-nums border-l border-grey-500  sticky-total-shadow">
                <CellValue total={grandTotal || null} done={grandDone || null} bold />
              </td>
            </tr>
          </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
