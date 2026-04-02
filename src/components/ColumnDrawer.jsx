import { useState, useCallback } from 'react'
import { months } from '../data/sampleData'
import { Stepper } from './CdxControls'

const CURRENT_MONTH = '2026-04'

function fmtMonth(m) {
  const [, mo] = m.split('-')
  const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return names[parseInt(mo)] || m
}

function isPast(m) {
  return m < CURRENT_MONTH
}

// Average monthly effort based on past performance (seeded by name)
function getAvgEffort(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  return 8 + Math.abs(hash % 35)
}

const futureMonths = months.filter((m) => !isPast(m))

let _extraId = 0

export default function ColumnDrawer({ deckName, memberMonths, load, bufferPercent, onClose, onMonthChange, members, onFocus }) {
  const [extraCards, setExtraCards] = useState([])

  const addExtraCard = () => {
    setExtraCards((prev) => [...prev, { id: ++_extraId, months: Object.fromEntries(futureMonths.map((m) => [m, 0])) }])
  }

  const removeExtraCard = (id) => {
    setExtraCards((prev) => prev.filter((c) => c.id !== id))
  }

  const updateExtraMonth = (id, month, value) => {
    setExtraCards((prev) => prev.map((c) =>
      c.id === id ? { ...c, months: { ...c.months, [month]: value } } : c
    ))
  }

  const [manualMonths, setManualMonths] = useState(() => {
    const init = {}
    for (const member of members) {
      init[member.name] = new Set()
    }
    return init
  })

  let cap = 0
  for (const member of members) {
    const mo = memberMonths[member.name] || {}
    for (const v of Object.values(mo)) cap += v
  }

  const buf = Math.round(load * (bufferPercent / 100))
  const overloaded = cap === 0 ? load > 0 : load > cap

  const handleSmartChange = useCallback((memberName, month, value) => {
    setManualMonths(prev => {
      const next = { ...prev }
      next[memberName] = new Set(prev[memberName])
      next[memberName].add(month)
      return next
    })

    onMonthChange(deckName, memberName, month, value)

    const touched = manualMonths[memberName] || new Set()
    const monthIdx = months.indexOf(month)
    for (let i = monthIdx + 1; i < months.length; i++) {
      const futureMonth = months[i]
      if (isPast(futureMonth)) continue
      if (touched.has(futureMonth)) continue
      onMonthChange(deckName, memberName, futureMonth, value)
    }
  }, [deckName, onMonthChange, manualMonths])

  return (
    <div className="w-[380px] shrink-0 h-full bg-grey-900 border-l border-y border-grey-500 rounded-l-[8px] flex flex-col shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-grey-600 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-grey-0">{deckName}</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={onFocus}
              title="Scroll to column"
              className="w-7 h-7 flex items-center justify-center rounded text-grey-400 hover:text-damp-300 hover:bg-grey-800 transition-colors"
            >
              <svg className="w-[16px] h-[16px]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.7273 1.82458C16.1864 1.75186 15.4604 1.75 14.375 1.75V2.81911e-06L14.4353 1.3886e-06C15.4445 -3.38974e-05 16.2892 -6.3464e-05 16.9605 0.0901818C17.6702 0.185603 18.3155 0.396117 18.8347 0.915294C19.3539 1.43447 19.5644 2.07982 19.6598 2.78955C19.7501 3.46079 19.75 4.30548 19.75 5.31471V5.375H18C18 4.28961 17.9981 3.56358 17.9254 3.02273C17.8561 2.50705 17.7371 2.29256 17.5973 2.15273C17.4574 2.0129 17.243 1.89391 16.7273 1.82458ZM5.31469 1.56741e-06L5.375 2.99792e-06V1.75C4.28961 1.75 3.56358 1.75186 3.02273 1.82458C2.50705 1.89391 2.29256 2.0129 2.15273 2.15273C2.0129 2.29256 1.89391 2.50705 1.82458 3.02273C1.75186 3.56358 1.75 4.28961 1.75 5.375H2.99792e-06L1.56741e-06 5.31469C-3.37781e-05 4.30547 -6.33448e-05 3.46078 0.0901818 2.78955C0.185603 2.07982 0.396117 1.43447 0.915294 0.915294C1.43447 0.396117 2.07982 0.185603 2.78955 0.0901818C3.46078 -6.33448e-05 4.30547 -3.37781e-05 5.31469 1.56741e-06ZM1.3886e-06 14.4353L2.81911e-06 14.375H1.75C1.75 15.4604 1.75186 16.1864 1.82458 16.7273C1.89391 17.243 2.0129 17.4574 2.15273 17.5973C2.29256 17.7371 2.50705 17.8561 3.02273 17.9254C3.56358 17.9981 4.28961 18 5.375 18V19.75H5.31471C4.30548 19.75 3.46079 19.7501 2.78955 19.6598C2.07982 19.5644 1.43447 19.3539 0.915294 18.8347C0.396117 18.3155 0.185603 17.6702 0.0901818 16.9605C-6.3464e-05 16.2892 -3.38974e-05 15.4445 1.3886e-06 14.4353ZM17.9254 16.7273C17.9981 16.1864 18 15.4604 18 14.375H19.75V14.4353C19.75 15.4445 19.7501 16.2892 19.6598 16.9605C19.5644 17.6702 19.3539 18.3155 18.8347 18.8347C18.3155 19.3539 17.6702 19.5644 16.9605 19.6598C16.2892 19.7501 15.4445 19.75 14.4353 19.75H14.375V18C15.4604 18 16.1864 17.9981 16.7273 17.9254C17.243 17.8561 17.4574 17.7371 17.5973 17.5973C17.7371 17.4574 17.8561 17.243 17.9254 16.7273Z" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded text-grey-400 hover:text-grey-100 hover:bg-grey-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-end gap-6" style={{ marginTop: 4 }}>
          <div>
            <div className="text-[11px] text-grey-300 uppercase tracking-wide">Capacity</div>
            <div className="text-[15px] font-bold text-emerald-400 tabular-nums">{cap}</div>
          </div>
          <div>
            <div className="text-[11px] text-grey-300 uppercase tracking-wide">Load</div>
            <div className={`text-[15px] font-bold tabular-nums ${overloaded ? 'text-cherry-400' : 'text-grey-100'}`}>{load}</div>
          </div>
          <div>
            <div className="text-[11px] text-grey-300 uppercase tracking-wide">Buffer</div>
            <div className="text-[15px] font-bold text-grey-200 tabular-nums">{buf} <span className="text-[12px] font-normal text-grey-400">({bufferPercent}%)</span></div>
          </div>
        </div>
      </div>

      {/* Member list */}
      <div className="flex-1 overflow-y-auto forecast-scroll p-4 space-y-3">
        {members.map((member) => {
          const mo = memberMonths[member.name] || {}
          const avgEffort = getAvgEffort(member.name)
          // Sum only current+future months for utilization calc
          const activeMoValues = futureMonths.map((m) => mo[m] ?? 0)
          const activeTotal = activeMoValues.reduce((s, v) => s + v, 0)
          const avgAssigned = futureMonths.length > 0 ? activeTotal / futureMonths.length : 0
          const utilPct = avgEffort > 0 ? Math.round((avgAssigned / avgEffort) * 100) : 0
          const utilColor = utilPct > 100 ? 'text-cherry-300' : utilPct >= 70 ? 'text-caramel-200' : utilPct > 0 ? 'text-emerald-300' : 'text-grey-450'
          return (
            <div key={member.name} className="bg-grey-800 rounded-lg p-3 pr-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-grey-650 flex items-center justify-center text-[10px] text-grey-200 font-medium uppercase">
                  {member.name.charAt(0)}
                </span>
                <span className="text-sm text-grey-50 font-medium">{member.name}</span>
                <span className="text-[11px] text-grey-300">~{avgEffort}/mo</span>
                <span className="text-[11px] text-grey-200 tabular-nums ml-auto">{activeTotal} assigned <span className={utilColor}>({utilPct}%)</span></span>
              </div>
              <div className="grid grid-cols-3 gap-y-3 gap-x-2">
                {months.map((m) => {
                  const past = isPast(m)
                  const val = mo[m] ?? 0
                  return (
                    <div key={m} className="flex flex-col items-center">
                      <div className={`text-[9px] mb-1 uppercase ${past ? 'text-grey-400' : 'text-grey-300'}`}>{fmtMonth(m)}</div>
                      {past ? (
                        <div className="w-[40px] h-[24px] flex items-center justify-center text-[12px] tabular-nums text-grey-300 bg-grey-750 rounded-[6px]">
                          {val > 0 ? val : '—'}
                        </div>
                      ) : (
                        <Stepper
                          value={val}
                          onChange={(v) => handleSmartChange(member.name, m, v)}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Extra capacity cards */}
        {extraCards.map((extra) => {
          const extraTotal = Object.values(extra.months).reduce((s, v) => s + v, 0)
          return (
            <div key={extra.id} className="bg-grey-800 rounded-lg p-3 pr-4 pb-4 group/extra">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-purple-700 flex items-center justify-center text-[10px] text-purple-200 font-medium">+</span>
                <span className="text-sm text-grey-50 font-medium">Additional capacity</span>
                <button
                  onClick={() => removeExtraCard(extra.id)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-grey-450 hover:bg-cherry-700 hover:text-cherry-100 transition-colors ml-1"
                  title="Remove"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <span className="text-[11px] text-grey-200 tabular-nums ml-auto">{extraTotal} assigned</span>
              </div>
              <div className="grid grid-cols-3 gap-y-3 gap-x-2">
                {futureMonths.map((m) => (
                  <div key={m} className="flex flex-col items-center">
                    <div className="text-[9px] mb-1 uppercase text-grey-300">{fmtMonth(m)}</div>
                    <Stepper
                      value={extra.months[m] ?? 0}
                      onChange={(v) => updateExtraMonth(extra.id, m, v)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Add button */}
        <button
          onClick={addExtraCard}
          className="w-full py-2.5 rounded-lg border border-dashed border-grey-500 text-sm text-grey-300 hover:text-grey-100 hover:border-grey-400 transition-colors"
        >
          + Additional capacity
        </button>
      </div>
    </div>
  )
}
