import { useState, useRef, useEffect } from 'react'

// Priority icons extracted from Codecks sprite (prio_a/b/c_24_stroke)
const PrioLowIcon = () => (
  <svg width="20" height="20" className="shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M12 12.58 4 8v4c0 .36.2.7.52.87l6.51 3.6a2 2 0 0 0 1.94 0l6.51-3.6a1 1 0 0 0 .52-.88V8l-8 4.58Z" />
  </svg>
)

const PrioMediumIcon = () => (
  <svg width="20" height="20" className="shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M20 10.44V6l-8 4.44L4 6v4.44m16 0-8 4.28-8-4.28m16 0v4.07a1 1 0 0 1-.56.9l-6.57 3.17a2 2 0 0 1-1.74 0L4.56 15.4a1 1 0 0 1-.56-.9v-4.07" />
  </svg>
)

const PrioHighIcon = () => (
  <svg width="20" height="20" className="shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M20 8.37V4l-8 4.37L4 4v4.37m16 0-8 4.21-8-4.2m16 0v4.6M4 8.39v4.6m0 0 8 3.81 8-3.8m-16 0v3.5a1 1 0 0 0 .56.9l6.57 3.19a2 2 0 0 0 1.74 0l6.57-3.2a1 1 0 0 0 .56-.9v-3.5" />
  </svg>
)

const priorityConfig = [
  { key: 'c', label: 'Low', Icon: PrioLowIcon },
  { key: 'b', label: 'Medium', Icon: PrioMediumIcon },
  { key: 'a', label: 'High', Icon: PrioHighIcon },
]

export default function Toolbar({
  activePriorities,
  onTogglePriority,
  onClearPriorities,
  selectedMilestone,
  onSelectMilestone,
  milestones,
}) {
  const [msOpen, setMsOpen] = useState(false)
  const [msSearch, setMsSearch] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filteredMilestones = milestones.filter((m) =>
    m.toLowerCase().includes(msSearch.toLowerCase())
  )

  return (
    <header className="flex items-center gap-6 pl-10 pr-5 py-3 bg-grey-850">
      {/* Title with project icon */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-[3px] shrink-0" style={{ background: 'linear-gradient(135deg, #b8e648 0%, #5abd4a 100%)' }} />
        <h1 className="text-lg font-bold text-grey-50 whitespace-nowrap">CE2 Forecast</h1>
      </div>

      {/* Milestone picker */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setMsOpen(!msOpen)}
          className="flex items-center gap-1.5 h-[32px] px-2 border border-purple-400 rounded text-sm font-bold text-purple-100 cursor-pointer hover:border-purple-300 transition-colors"
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              selectedMilestone ? 'bg-ocean-400' : 'bg-grey-500'
            }`}
          />
          <span>
            {selectedMilestone || 'None'}
          </span>
          <svg
            className="w-3 h-3 ml-0.5 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {msOpen && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-grey-850 border border-grey-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-grey-700">
              <div className="text-[10px] uppercase tracking-wider text-grey-450 mb-1.5 px-1">
                Pick Milestone
              </div>
              <input
                autoFocus
                value={msSearch}
                onChange={(e) => setMsSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-grey-900 border border-grey-700 rounded px-2 py-1 text-sm text-grey-100 placeholder:text-grey-550 outline-none focus:border-grey-500"
              />
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              <button
                onClick={() => { onSelectMilestone(null); setMsOpen(false); setMsSearch('') }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-grey-750 transition-colors ${
                  !selectedMilestone ? 'text-grey-0 font-medium' : 'text-grey-300'
                }`}
              >
                None
              </button>
              {filteredMilestones.map((m) => (
                <button
                  key={m}
                  onClick={() => { onSelectMilestone(m); setMsOpen(false); setMsSearch('') }}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-grey-750 transition-colors ${
                    selectedMilestone === m ? 'text-grey-0 font-medium' : 'text-grey-300'
                  }`}
                >
                  {m}
                </button>
              ))}
              {filteredMilestones.length === 0 && (
                <div className="px-3 py-2 text-sm text-grey-500">No milestones found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Priority filters — square buttons with chevron icons, matching Codecks */}
      <div className="flex items-center gap-1.5">
        {priorityConfig.map(({ key, label, Icon }) => {
          const active = activePriorities.has(key)
          return (
            <button
              key={key}
              onClick={() => onTogglePriority(key)}
              className={`flex flex-col items-center justify-center w-[68px] px-3 py-2 border rounded-md text-purple-100 cursor-pointer transition-colors ${
                active
                  ? 'bg-grey-800 border-purple-400'
                  : 'bg-grey-850 border-grey-600 hover:border-grey-450'
              }`}
            >
              <Icon />
              <span className="text-[11px] mt-0.5">{label}</span>
            </button>
          )
        })}
      </div>

      {/* Spacer + close button */}
      <div className="flex-1" />
      <button className="w-7 h-7 flex items-center justify-center rounded text-grey-400 hover:text-grey-100 hover:bg-grey-800 transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>
  )
}
