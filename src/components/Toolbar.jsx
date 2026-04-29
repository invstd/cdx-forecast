import { useState, useRef, useEffect } from 'react'

export default function Toolbar({
  scenarios,
  selectedScenario,
  onSelectScenario,
  onAddScenario,
  onRenameScenario,
  onDeleteScenario,
  onSaveScenario,
  onResetScenario,
  onResetToDefaults,
  isDirty,
  selectedMilestone,
  onSelectMilestone,
  milestones,
}) {
  const [msOpen, setMsOpen] = useState(false)
  const [msSearch, setMsSearch] = useState('')
  const [scOpen, setScOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [editName, setEditName] = useState('')
  const msRef = useRef(null)
  const scRef = useRef(null)
  const addRef = useRef(null)
  const editRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (msRef.current && !msRef.current.contains(e.target)) setMsOpen(false)
      if (scRef.current && !scRef.current.contains(e.target)) setScOpen(false)
      if (addRef.current && !addRef.current.contains(e.target)) { setAddOpen(false); setNewName('') }
      if (editRef.current && !editRef.current.contains(e.target)) setEditOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filteredMilestones = milestones.filter((m) =>
    m.toLowerCase().includes(msSearch.toLowerCase())
  )

  const activeScenario = scenarios.find((s) => s.id === selectedScenario)

  const handleSave = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    onAddScenario(trimmed)
    setNewName('')
    setAddOpen(false)
  }

  const handleEditSave = () => {
    const trimmed = editName.trim()
    if (!trimmed || !selectedScenario) return
    onRenameScenario(selectedScenario, trimmed)
    setEditOpen(false)
  }

  const handleDelete = () => {
    if (!selectedScenario) return
    onDeleteScenario(selectedScenario)
    setEditOpen(false)
  }

  const openEdit = () => {
    if (!activeScenario) return
    setEditName(activeScenario.name)
    setEditOpen(true)
    setAddOpen(false)
  }

  const openAdd = () => {
    setAddOpen(!addOpen)
    setNewName('')
    setEditOpen(false)
  }

  return (
    <header className="flex items-end gap-4 pl-10 pr-5 pt-6 pb-3 bg-grey-850">
      {/* Title with project icon */}
      <div className="flex items-center gap-2 pb-1.5 mr-4 mt-3.5">
        <div className="w-5 h-5 rounded-[3px] shrink-0" style={{ background: 'linear-gradient(135deg, #b8e648 0%, #5abd4a 100%)' }} />
        <h1 className="text-lg font-bold text-grey-50 whitespace-nowrap">CE2 Forecast</h1>
      </div>

      {/* Milestone picker */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-grey-300 px-0.5 mb-[-2px]">Milestone</label>
        <div className="relative w-[240px]" ref={msRef}>
          <button
            onClick={() => setMsOpen(!msOpen)}
            className="flex items-center gap-1.5 w-full h-[32px] px-2 border border-purple-400 rounded text-sm font-bold text-purple-100 cursor-pointer hover:border-purple-300 transition-colors"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                selectedMilestone ? 'bg-ocean-400' : 'bg-grey-500'
              }`}
            />
            <span className="truncate min-w-0 flex-1 text-left">
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
            <div className="absolute top-full left-0 mt-1 w-[240px] bg-grey-850 border border-grey-700 rounded-lg shadow-xl z-50 overflow-hidden">
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
      </div>

      {/* Scenario picker + edit + add */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-grey-300 px-0.5 mb-[-2px]">Scenario</label>
        <div className="flex items-center gap-1.5">
          <div className="relative w-[240px]" ref={scRef}>
            <button
              onClick={scenarios.length > 0 ? () => setScOpen(!scOpen) : undefined}
              className={`flex items-center gap-1.5 w-full h-[32px] px-2 border rounded text-sm font-bold transition-colors ${
                scenarios.length > 0
                  ? 'border-purple-400 text-purple-100 cursor-pointer hover:border-purple-300'
                  : 'border-grey-500 text-grey-500 cursor-default'
              }`}
            >
              <span className="truncate min-w-0 flex-1 text-left">
                {activeScenario?.name || (scenarios.length > 0 ? 'Select Scenario' : 'None created yet')}
              </span>
              <svg
                className="w-3 h-3 shrink-0 opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {scOpen && (
              <div className="absolute top-full left-0 mt-1 w-[240px] bg-grey-850 border border-grey-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-grey-700">
                  <div className="text-[10px] uppercase tracking-wider text-grey-450">
                    Pick Scenario
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto py-1">
                  {scenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { onSelectScenario(s.id); setScOpen(false) }}
                      className={`w-full text-left px-3 py-1.5 text-sm truncate hover:bg-grey-750 transition-colors ${
                        selectedScenario === s.id ? 'text-grey-0 font-medium' : 'text-grey-300'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {activeScenario && isDirty ? (
            <>
              {/* Save button */}
              <button
                onClick={onSaveScenario}
                className="shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded border border-emerald-500 bg-emerald-600 text-white cursor-pointer hover:bg-emerald-500 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </button>
              {/* Reset button */}
              <button
                onClick={onResetScenario}
                className="shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded border border-purple-400 text-purple-100 cursor-pointer hover:border-purple-300 hover:text-purple-50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              </button>
            </>
          ) : (
            <>
              {/* Edit button */}
              <div className="relative" ref={editRef}>
                <button
                  onClick={editOpen ? () => setEditOpen(false) : openEdit}
                  disabled={!activeScenario}
                  className={`shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded border transition-all ${
                    activeScenario
                      ? 'border-purple-400 text-purple-100 cursor-pointer hover:border-purple-300 hover:text-purple-50'
                      : 'border-grey-500 text-grey-500 cursor-default'
                  }`}
                >
                  <svg
                    className="w-4 h-4 transition-transform duration-200"
                    style={{ transform: editOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {editOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                    )}
                  </svg>
                </button>

                {editOpen && (
                  <div className="absolute top-full right-0 mt-1 w-[240px] bg-grey-850 border border-grey-600 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-3 flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider text-grey-300 px-0.5 mb-[-2px]">Edit Scenario</label>
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditOpen(false) }}
                        placeholder="Scenario name..."
                        className="w-full h-[32px] px-2 border border-purple-400 rounded text-sm font-bold text-purple-100 placeholder:text-grey-350 placeholder:font-normal outline-none focus:border-purple-300 bg-transparent"
                      />
                      <div className="flex items-center justify-between mt-1">
                        <button
                          onClick={handleDelete}
                          className="shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded text-cherry-300 border border-cherry-400/40 cursor-pointer hover:bg-cherry-400/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { onResetToDefaults(); setEditOpen(false) }}
                            className="shrink-0 h-[32px] px-3 rounded text-sm text-grey-100 border border-grey-600 cursor-pointer hover:border-grey-500 hover:text-grey-0 transition-colors"
                          >
                            Reset values
                          </button>
                          <button
                            onClick={handleEditSave}
                            disabled={!editName.trim()}
                            className="shrink-0 h-[32px] px-3 rounded text-sm font-bold text-white bg-purple-400 cursor-pointer hover:bg-purple-300 transition-colors disabled:opacity-40 disabled:cursor-default"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add button */}
              <div className="relative" ref={addRef}>
                <button
                  onClick={openAdd}
                  className="shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded bg-purple-400 cursor-pointer hover:bg-purple-300 transition-all"
                >
                  <svg
                    className="w-4 h-4 text-white transition-transform duration-200"
                    style={{ transform: addOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>

                {addOpen && (
              <div className="absolute top-full right-0 mt-1 w-[240px] bg-grey-850 border border-grey-600 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="p-3 flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wider text-grey-300 px-0.5 mb-[-2px]">New Scenario</label>
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setAddOpen(false); setNewName('') } }}
                    placeholder="Scenario name..."
                    className="w-full h-[32px] px-2 border border-purple-400 rounded text-sm font-bold text-purple-100 placeholder:text-grey-350 placeholder:font-normal outline-none focus:border-purple-300 bg-transparent"
                  />
                  <button
                    onClick={handleSave}
                    disabled={!newName.trim()}
                    className="h-[32px] mt-1 rounded text-sm font-bold text-white bg-purple-400 cursor-pointer hover:bg-purple-300 transition-colors disabled:opacity-40 disabled:cursor-default"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
            </>
          )}
        </div>
      </div>

      {/* Spacer + close button */}
      <div className="flex-1" />
      <button className="w-7 h-7 mb-1 flex items-center justify-center rounded text-grey-400 hover:text-grey-100 hover:bg-grey-800 transition-colors">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>
  )
}
