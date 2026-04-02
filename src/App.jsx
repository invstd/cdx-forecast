import { useState, useCallback } from 'react'
import Toolbar from './components/Toolbar'
import ForecastTable from './components/ForecastTable'
import { milestones } from './data/sampleData'

function App() {
  const [activePriorities, setActivePriorities] = useState(new Set())
  const [selectedMilestone, setSelectedMilestone] = useState(null)
  const [bufferPercent, setBufferPercent] = useState(20)

  const togglePriority = useCallback((key) => {
    setActivePriorities((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }, [])

  const clearPriorities = useCallback(() => {
    setActivePriorities(new Set())
  }, [])

  return (
    <div className="h-screen flex flex-col bg-grey-850 text-grey-50 overflow-hidden">
      <Toolbar
        activePriorities={activePriorities}
        onTogglePriority={togglePriority}
        onClearPriorities={clearPriorities}
        selectedMilestone={selectedMilestone}
        onSelectMilestone={setSelectedMilestone}
        milestones={milestones}
      />
      <div className="flex-1 min-h-0 flex flex-col pl-10 pr-5 pt-3 pb-[60px]">
        <ForecastTable
          activePriorities={activePriorities}
          selectedMilestone={selectedMilestone}
          bufferPercent={bufferPercent}
          onBufferChange={setBufferPercent}
        />
      </div>
    </div>
  )
}

export default App
