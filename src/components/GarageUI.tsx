import { useState, useEffect, useMemo } from 'react'
import { useNuiEvent } from '../hooks/useNuiEvent'
import { fetchNui } from '../utils/fetchNui'
import { Vehicle, Player, GarageConfig } from '../types'

type FilterType = 'all' | 'garaged' | 'outside' | 'impounded'

const GarageUI = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [garageName, setGarageName] = useState('Garage')
  const [config, setConfig] = useState<Partial<GarageConfig>>({
    fee: 0,
    isJob: false,
    personalVehicleSharing: { enabled: false, maxShares: 0 },
    nicknames: false,
    mileage: false,
  })

  useNuiEvent<GarageConfig>('openUI', (data) => {
    setGarageName(data.garageName)
    setVehicles(data.vehicles || [])
    setPlayers(data.players || [])
    setSelectedVehicle(data.vehicles?.[0] || null)
    setConfig({
      fee: data.fee,
      isJob: data.isJob,
      personalVehicleSharing: data.personalVehicleSharing,
      nicknames: data.nicknames,
      mileage: data.mileage,
    })
  })

  useNuiEvent<{ vehicles: Vehicle[] }>('updateVehicles', (data) => {
    setVehicles(data.vehicles)
    if (selectedVehicle) {
      const updated = data.vehicles.find(v => v.id === selectedVehicle.id)
      if (updated) setSelectedVehicle(updated)
    }
  })

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles

    if (filter !== 'all') {
      filtered = filtered.filter(v => v.status === filter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.plate.toLowerCase().includes(query) ||
        v.nickname?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [vehicles, filter, searchQuery])

  const counts = useMemo(() => ({
    all: vehicles.length,
    garaged: vehicles.filter(v => v.status === 'garaged').length,
    outside: vehicles.filter(v => v.status === 'outside').length,
    impounded: vehicles.filter(v => v.status === 'impounded').length,
  }), [vehicles])

  const handleClose = () => fetchNui('closeUI')
  const handleDriveVehicle = () => {
    if (selectedVehicle) fetchNui('driveVehicle', { vehicleId: selectedVehicle.id })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'garaged': return 'text-green-400'
      case 'outside': return 'text-orange-400'
      case 'impounded': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="w-full max-w-[1400px] h-[800px]">
      <div className="bg-black text-white rounded-lg shadow-2xl border border-fivem-gray-border flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-fivem-gray-border">
          <h1 className="text-xl font-bold">{garageName}</h1>
          <button onClick={handleClose} className="p-2 hover:text-red-400 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-fivem-gray-border">
              <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-fivem-gray border border-fivem-gray-border rounded-md text-sm focus:border-blue-500 outline-none"
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {(['all', 'garaged', 'outside', 'impounded'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 px-4 py-2 bg-fivem-gray border rounded-md text-sm transition-all ${
                      filter === f
                        ? f === 'all' ? 'border-blue-500' : f === 'garaged' ? 'border-green-500' : f === 'outside' ? 'border-orange-500' : 'border-red-500'
                        : 'border-fivem-gray-border hover:bg-fivem-gray-light'
                    }`}
                  >
                    <span className="capitalize">{f}</span>
                    <span className="ml-2 bg-fivem-gray-border px-2 py-0.5 rounded-full text-xs">{counts[f]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`bg-fivem-gray border rounded-lg p-4 cursor-pointer transition-all hover:bg-fivem-gray-light hover:-translate-y-0.5 ${
                      selectedVehicle?.id === vehicle.id ? 'border-blue-500 bg-blue-950' : 'border-fivem-gray-border'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">
                          {vehicle.nickname || vehicle.name}
                          {vehicle.nickname && <span className="text-xs text-gray-400 ml-1">({vehicle.name})</span>}
                        </h3>
                        <p className="text-sm text-gray-400">{vehicle.plate}</p>
                      </div>
                      {vehicle.isFavorite && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-1 rounded-full bg-black/30 capitalize ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                      {vehicle.shared && (
                        <svg className="text-blue-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedVehicle && (
            <div className="w-[400px] bg-fivem-gray border-l border-fivem-gray-border flex flex-col">
              <div className="p-4 border-b border-fivem-gray-border">
                <h2 className="text-xl font-bold">
                  {selectedVehicle.nickname || selectedVehicle.name}
                  {selectedVehicle.nickname && <span className="text-sm text-gray-400 ml-1">({selectedVehicle.name})</span>}
                </h2>
                <p className={`text-sm mt-1 capitalize ${getStatusColor(selectedVehicle.status)}`}>
                  {selectedVehicle.status}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded font-bold text-sm">{selectedVehicle.plate}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {config.mileage && selectedVehicle.mileage !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mileage</span>
                    <span className="font-medium">{selectedVehicle.mileage.toFixed(1)} km</span>
                  </div>
                )}
                {selectedVehicle.fuel !== undefined && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Fuel</span>
                      <span className="font-medium">{selectedVehicle.fuel}%</span>
                    </div>
                    <div className="h-2 bg-fivem-gray-border rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${selectedVehicle.fuel}%` }} />
                    </div>
                  </div>
                )}
                {selectedVehicle.engine !== undefined && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Engine</span>
                      <span className="font-medium">{selectedVehicle.engine}%</span>
                    </div>
                    <div className="h-2 bg-fivem-gray-border rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${selectedVehicle.engine}%` }} />
                    </div>
                  </div>
                )}
                {selectedVehicle.body !== undefined && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Body</span>
                      <span className="font-medium">{selectedVehicle.body}%</span>
                    </div>
                    <div className="h-2 bg-fivem-gray-border rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${selectedVehicle.body}%` }} />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDriveVehicle}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-colors mt-6"
                >
                  {selectedVehicle.status === 'garaged' ? 'Drive Vehicle' :
                   selectedVehicle.status === 'outside' ? 'Track Vehicle' :
                   config.fee === 0 ? 'Transfer for Free' : `Transfer ($${config.fee})`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GarageUI