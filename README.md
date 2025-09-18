# 🚆 Railway Mission Control - Howrah-Kharagpur Line

A comprehensive AI-powered Railway Traffic Management System featuring real-time train monitoring, intelligent recommendations, and interactive signaling visualization for the Howrah-Kharagpur railway line (100km corridor).

## 🌟 Features

### 🚂 Real-Time Railway Operations
- **Interactive Railway Signaling**: Live visualization of Howrah-Kharagpur line with 23 active trains
- **Live Train Tracking**: Real-time positions, speeds, delays, and status updates
- **Signal Management**: Automatic signal state updates based on train proximity
- **Track Section Monitoring**: 8 track sections with occupancy and status visualization
- **Station Operations**: 9 stations from Howrah Junction to Kharagpur with platform details

### 🤖 AI-Powered Recommendations
- **HWH-KGP Traffic Controller**: Priority signal management for delayed trains
- **KGP Section Optimizer**: Route optimization and congestion management  
- **Track Maintenance AI**: Proactive maintenance scheduling and alerts
- **EMU Schedule Optimizer**: Local train coordination and platform management
- **Real-time Impact Analysis**: Delay reduction, congestion relief, and savings calculations

### 📊 Live Network Analytics
- **Performance Metrics**: On-time percentage, average delays, train utilization
- **Infrastructure Status**: Track section occupancy, signal states, maintenance alerts
- **AI Agent Monitoring**: Live status of all AI optimization agents
- **Network Overview**: Comprehensive dashboard accessible via header dropdown

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS with custom mission control theme
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: Zustand for global state
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for smooth transitions
- **Visualization**: Custom SVG-based railway signaling with pan/zoom controls
- **Real-time Updates**: Live data simulation with 5-second refresh intervals

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tarun200511/Flowcode-Crazy-bro.git
   cd Flowcode-Crazy-bro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚂 Howrah-Kharagpur Line Data

The system operates with real-time data from the Howrah-Kharagpur railway corridor:

### 🚉 Stations (9 Total)
- **HWH** - Howrah Junction (0 km) - 23 platforms
- **SHE** - Shalimar (8 km) - 4 platforms  
- **ULU** - Uluberia (25 km) - 3 platforms
- **BGA** - Bagnan (32 km) - 2 platforms
- **MCA** - Mecheda (45 km) - 3 platforms
- **TMZ** - Tamluk (58 km) - 2 platforms
- **HLZ** - Haldia (72 km) - 2 platforms
- **MDN** - Midnapore (85 km) - 3 platforms
- **KGP** - Kharagpur (100 km) - 10 platforms

### 🚆 Live Trains (23 Active)
- **Express Trains**: Howrah Mail, Hirakhand Express, Kamakhya Express, Ispat Express
- **EMU Locals**: Multiple suburban services between HWH-KGP
- **Goods Trains**: Freight services with maintenance monitoring
- **Real-time Status**: Live positions, speeds, delays, and operational status

## 🎨 UI Components

### Mission Control Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Header: Alerts Dropdown | Network Status | System Status   │
├─────────────────────────────────────┬───────────────────────┤
│                                     │                       │
│    Interactive Railway Signaling    │   AI Recommendations │
│     (Howrah-Kharagpur Line)         │    (Real-time Grid)   │
│   • Live train positions (23)       │  • Priority signals  │
│   • Signal states (auto-update)     │  • Route optimization│
│   • Track section monitoring        │  • Maintenance alerts│
│   • Pan/zoom controls               │  • Impact metrics    │
│                                     │                       │
└─────────────────────────────────────┴───────────────────────┘
```

### Key Components
- **InteractiveRailwaySignaling**: SVG-based HWH-KGP line visualization with live trains
- **AIRecommendations**: Grid layout with tailored railway optimization suggestions
- **NetworkStatusDropdown**: Comprehensive network metrics in header dropdown
- **AlertsDropdown**: System alerts and notifications accessible from header
- **Header**: System branding, dropdowns, and operational status display

## 🔧 Configuration

### Theme Customization
The mission control theme can be customized in `tailwind.config.js`:
```javascript
colors: {
  'control-bg': '#0a0a0b',      // Main background
  'control-panel': '#1a1a1b',   // Panel background
  'status-green': '#00ff88',    // On-time status
  'status-orange': '#ff8800',   // Delayed status
  'status-red': '#ff3333',      // Emergency status
  'ai-glow': '#00d4ff',         // AI accent color
}
```

### Data Configuration
The system uses real-time simulation data for the Howrah-Kharagpur line:
- Train positions update every 5 seconds
- Signal states automatically adjust based on train proximity  
- Performance metrics calculated from live train data
- All recommendations based on actual railway operational scenarios

## 📱 Responsive Design

The dashboard is optimized for:
- **Desktop**: Full mission control experience
- **Tablet**: Responsive layout with collapsible panels
- **Mobile**: Simplified view with essential controls

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Vercel Deployment
The application is optimized for Vercel deployment:
```bash
npm run build
# Deploy to Vercel or any Next.js hosting platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Indian Railways Howrah-Kharagpur line for real-world inspiration
- Railway signaling systems and control room interfaces
- Open source community for amazing tools and libraries

---

**Built with ❤️ for intelligent railway operations**

*Real-time railway traffic management with AI-powered optimization for the Howrah-Kharagpur corridor.*
