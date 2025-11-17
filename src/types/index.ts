export interface Vehicle {
  id: string
  name: string
  plate: string
  status: 'garaged' | 'outside' | 'impounded'
  fuel?: number
  engine?: number
  body?: number
  mileage?: number
  nickname?: string
  isFavorite?: boolean
  model?: string
  shared?: boolean
}

export interface Player {
  id: number
  name: string
}

export interface SharedPlayer {
  id: number
  name: string
}

export interface GarageConfig {
  garageName: string
  vehicles: Vehicle[]
  players: Player[]
  fee: number
  isJob: boolean
  personalVehicleSharing: {
    enabled: boolean
    maxShares: number
  }
  nicknames: boolean
  mileage: boolean
}

export interface Garage {
  id: string
  name: string
  type: 'personal' | 'job'
  coords: string[]
  jobs?: string[]
  showBlip: boolean
  blipSprite?: number
  blipColor?: number
  blipScale?: number
  range?: number
}