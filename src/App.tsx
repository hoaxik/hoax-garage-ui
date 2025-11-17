import { useState, useEffect } from 'react'
import GarageUI from './components/GarageUI'
import { useNuiEvent } from './hooks/useNuiEvent'
import { fetchNui } from './utils/fetchNui'

function App() {
  const [visible, setVisible] = useState(false)

  useNuiEvent('openUI', () => setVisible(true))
  useNuiEvent('closeUI', () => setVisible(false))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        fetchNui('closeUI')
        setVisible(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [visible])

  if (!visible) return null

  return <GarageUI />
}

export default App