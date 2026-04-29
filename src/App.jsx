import { useState, useCallback, useRef } from 'react'
import Toolbar from './components/Toolbar'
import ForecastTable from './components/ForecastTable'
import { milestones, scenarios as defaultScenarios } from './data/sampleData'

function App() {
  const [scenarioList, setScenarioList] = useState(defaultScenarios)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [selectedMilestone, setSelectedMilestone] = useState(null)
  const [bufferPercent, setBufferPercent] = useState(20)
  const [isDirty, setIsDirty] = useState(false)
  const tableRef = useRef(null)
  const scenarioListRef = useRef(scenarioList)
  scenarioListRef.current = scenarioList

  const handleTableChange = useCallback(() => {
    setIsDirty(true)
  }, [])

  const handleBufferChange = useCallback((val) => {
    setBufferPercent(val)
    setIsDirty(true)
  }, [])

  const selectScenario = useCallback((id) => {
    const scenario = scenarioListRef.current.find((s) => s.id === id)
    if (scenario?.data) {
      tableRef.current?.loadSnapshot(scenario.data)
      setBufferPercent(scenario.data.bufferPercent ?? 20)
    }
    setSelectedScenario(id)
    setIsDirty(false)

  }, [])

  const addScenario = useCallback((name) => {
    const id = `scenario-${Date.now()}`
    const snapshot = tableRef.current?.getSnapshot()
    const data = { ...(snapshot ?? {}), bufferPercent }
    setScenarioList((prev) => [...prev, { id, name, data }])
    setSelectedScenario(id)
    setIsDirty(false)

  }, [bufferPercent])

  const saveScenario = useCallback(() => {
    if (!selectedScenario) return
    const snapshot = tableRef.current?.getSnapshot()
    const data = { ...(snapshot ?? {}), bufferPercent }
    setScenarioList((prev) =>
      prev.map((s) => s.id === selectedScenario ? { ...s, data } : s)
    )
    setIsDirty(false)

  }, [selectedScenario, bufferPercent])

  const resetScenario = useCallback(() => {
    if (!selectedScenario) return
    const scenario = scenarioListRef.current.find((s) => s.id === selectedScenario)
    if (scenario?.data) {
      tableRef.current?.loadSnapshot(scenario.data)
      setBufferPercent(scenario.data.bufferPercent ?? 20)
    }
    setIsDirty(false)

  }, [selectedScenario])

  const resetToDefaults = useCallback(() => {
    if (!selectedScenario) return
    tableRef.current?.loadSnapshot(null)
    setBufferPercent(20)
    const data = {
      cardValueOverrides: {},
      cardMultipliers: {},
      disabledCards: [],
      journeyOffCards: [],
      memberMonthOverrides: null,
      bufferPercent: 20,
    }
    setScenarioList((prev) =>
      prev.map((s) => s.id === selectedScenario ? { ...s, data } : s)
    )
    setIsDirty(false)
  }, [selectedScenario])

  const renameScenario = useCallback((id, name) => {
    setScenarioList((prev) => prev.map((s) => s.id === id ? { ...s, name } : s))
  }, [])

  const deleteScenario = useCallback((id) => {
    setScenarioList((prev) => prev.filter((s) => s.id !== id))
    setSelectedScenario((prev) => {
      if (prev === id) {
        setIsDirty(false)
    
        return null
      }
      return prev
    })
  }, [])

  return (
    <div className="h-screen flex flex-col bg-grey-850 text-grey-50 overflow-hidden">
      <Toolbar
        scenarios={scenarioList}
        selectedScenario={selectedScenario}
        onSelectScenario={selectScenario}
        onAddScenario={addScenario}
        onRenameScenario={renameScenario}
        onDeleteScenario={deleteScenario}
        onSaveScenario={saveScenario}
        onResetScenario={resetScenario}
        onResetToDefaults={resetToDefaults}
        isDirty={isDirty}
        selectedMilestone={selectedMilestone}
        onSelectMilestone={setSelectedMilestone}
        milestones={milestones}
      />
      <div className="pl-10 pr-5 pt-3" style={{ maxHeight: 'calc(100vh - 60px - 12px - 60px)' }}>
        <ForecastTable
          ref={tableRef}
          activePriorities={new Set()}
          selectedMilestone={selectedMilestone}
          bufferPercent={bufferPercent}
          onBufferChange={handleBufferChange}
          onChange={handleTableChange}
        />
      </div>
    </div>
  )
}

export default App
