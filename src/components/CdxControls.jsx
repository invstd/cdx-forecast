import { useState } from 'react'

/*
 * CDX Button classes (from Codecks design: initial → hover → pressed)
 */
export const cdxBtnClass = 'inline-grid place-items-center rounded-[6px] border border-purple-450 bg-grey-700 text-purple-200 leading-none transition-all hover:bg-purple-700 hover:border-purple-400 hover:text-purple-50 active:bg-purple-600 active:border-purple-400'

/*
 * CDX Input: dark bg, purple border, rounded, focus ring
 */
export const cdxInputClass = 'bg-grey-800 border border-purple-450 rounded-[6px] text-purple-100 tabular-nums text-center outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-400/30'

export function Stepper({ value, onChange, step = 1, formatValue, className = '', readOnly = false, hoverButtons = false, size = 24, inputWidth = 40, vertical = false }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))
  const display = formatValue ? formatValue(value) : value
  const canDecrease = value > 0

  const btnVisibility = readOnly
    ? 'invisible'
    : hoverButtons
      ? 'opacity-0 group-hover/stepper:opacity-100'
      : ''

  const minusBtn = (
    <button
      onClick={!readOnly && canDecrease ? () => onChange(Math.max(0, value - step)) : undefined}
      className={`text-[16px] ${cdxBtnClass} ${btnVisibility} ${!readOnly && !canDecrease ? 'opacity-30 !cursor-default' : ''}`}
      style={{ width: size, height: size }}
    >−</button>
  )

  const plusBtn = (
    <button
      onClick={readOnly ? undefined : () => onChange(value + step)}
      className={`text-[16px] ${cdxBtnClass} ${btnVisibility}`}
      style={{ width: size, height: size }}
    >+</button>
  )

  const inputEl = editing && !readOnly ? (
    <input
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => { onChange(Math.max(0, parseFloat(draft) || 0)); setEditing(false) }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { onChange(Math.max(0, parseFloat(draft) || 0)); setEditing(false) }
        if (e.key === 'Escape') setEditing(false)
      }}
      className={`text-[12px] ${cdxInputClass}`}
      style={vertical ? { width: size * 2 + 3, height: size } : { width: inputWidth, height: size }}
    />
  ) : readOnly ? (
    <span className="tabular-nums text-sm text-grey-200 text-center" style={{ minWidth: inputWidth }}>{display}</span>
  ) : (
    <button
      onClick={() => { setDraft(String(value)); setEditing(true) }}
      className={`text-[12px] ${cdxInputClass} cursor-pointer hover:border-purple-300`}
      style={vertical ? { width: size * 2 + 3, height: size } : { width: inputWidth, height: size }}
    >
      {display}
    </button>
  )

  if (vertical) {
    return (
      <div className={`inline-flex flex-col items-center group/stepper ${className}`} style={{ gap: 6 }}>
        {inputEl}
        <div className="inline-flex items-center gap-[3px]">
          {minusBtn}
          {plusBtn}
        </div>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-[3px] group/stepper ${className}`}>
      {minusBtn}
      {inputEl}
      {plusBtn}
    </div>
  )
}
