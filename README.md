# 🚗 Hoax Garage UI - FiveM

Modern garage management UI for FiveM built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?logo=tailwind-css)

## ✨ Features

- 🚗 **Vehicle Management** - Browse, search, and filter your vehicles
- ⭐ **Favorites** - Mark your favorite vehicles for quick access
- 🏷️ **Nicknames** - Set custom nicknames for your vehicles
- 👥 **Sharing System** - Share vehicles with other players
- 📍 **GPS Tracking** - Track vehicles that are outside the garage
- 💰 **Impound System** - Retrieve impounded vehicles with fee support
- 📊 **Vehicle Stats** - View fuel, engine, body condition, and mileage
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🌐 **Translation Ready** - Easily add multi-language support

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/hoaxik/hoax-garage-ui.git
cd hoax-garage-ui

# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build
```

The built files will be in the `build` folder, ready to use in your FiveM resource.

## 📦 FiveM Integration

### Opening the UI from Lua

```lua
SendNUIMessage({
  type = 'openUI',
  garageName = 'Main Garage',
  vehicles = {
    {
      id = '1',
      name = 'Adder',
      plate = 'ABC123',
      status = 'garaged',
      fuel = 85,
      engine = 95,
      body = 90,
      mileage = 1234.5,
      isFavorite = true
    }
  },
  players = {},
  fee = 500,
  isJob = false,
  personalVehicleSharing = { enabled = true, maxShares = 3 },
  nicknames = true,
  mileage = true
})

SetNuiFocus(true, true)
```

### Registering NUI Callbacks

```lua
RegisterNUICallback('closeUI', function(data, cb)
  SetNuiFocus(false, false)
  cb('ok')
end)

RegisterNUICallback('driveVehicle', function(data, cb)
  local vehicleId = data.vehicleId
  -- Your vehicle spawn logic
  cb('ok')
end)
```

## 📁 Project Structure

```
hoax-garage-ui/
├── src/
│   ├── components/
│   │   └── GarageUI.tsx
│   ├── hooks/
│   │   └── useNuiEvent.ts
│   ├── utils/
│   │   └── fetchNui.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 📄 License

MIT

## 🙏 Credits

Created by **HoaX**