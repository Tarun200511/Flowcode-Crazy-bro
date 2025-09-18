# 🚆 Railway Mission Control - AI Traffic Optimizer

A cutting-edge AI Agentic System for Train Traffic Optimization with a world-class mission control dashboard. This system provides real-time train monitoring, AI-powered recommendations, and interactive simulation capabilities for railway network optimization.

## 🌟 Features

### 🎯 Core Features
- **Interactive Live Map**: Real-time train tracking with status indicators
- **AI Recommendations Panel**: Smart suggestions from multiple AI agents
- **Real-time Status Dashboard**: KPI cards, charts, and network analytics
- **What-If Simulator**: Test scenarios before implementation
- **Alerts & Notifications**: Real-time system alerts and warnings
- **Mission Control Interface**: Dark, futuristic UI inspired by real control rooms

### 🤖 AI Agents
- **Data Collector**: Processes real-time train and network data
- **Schedule Optimizer**: Optimizes train schedules and routing
- **Conflict Resolver**: Resolves scheduling conflicts and bottlenecks
- **Congestion Predictor**: Predicts and prevents network congestion
- **System Coordinator**: Coordinates all agent activities

### 📊 Analytics & Monitoring
- Network performance metrics (delays, throughput, congestion)
- Train status distribution and trends
- Congestion hotspot analysis
- 24-hour network throughput tracking
- AI agent performance monitoring

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS with custom mission control theme
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: Zustand for global state
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for smooth transitions
- **Map**: Custom map implementation (Mapbox GL JS ready)

### Backend (Coming Soon)
- **API**: FastAPI with WebSocket support
- **AI Agents**: LangGraph/AutoGen framework
- **Database**: PostgreSQL with real-time subscriptions
- **Message Queue**: Redis for agent communication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd train_window
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional)
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Demo Mode

The application comes with comprehensive demo data including:
- **8 Active Trains** across major Indian routes (Mumbai-Delhi, Chennai-Kolkata, etc.)
- **8 Major Stations** (New Delhi, Mumbai CST, Chennai Central, etc.)
- **Multiple Track Sections** with different congestion levels
- **AI Recommendations** generated in real-time
- **System Alerts** for weather, maintenance, and emergencies

### Sample Trains
- Mumbai Rajdhani (Delayed - 15 min)
- Shatabdi Express (On Time)
- Kerala Express (On Time)
- Howrah Mail (Delayed - 25 min)
- Chennai Rajdhani (On Time)
- Firozpur Janata (Emergency Stop)

## 🎨 UI Components

### Mission Control Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│                    Header with System Status                │
├─────────────────────────────────────┬───────────────────────┤
│                                     │                       │
│           Live Train Map            │   AI Recommendations │
│        (Interactive, Real-time)     │      Panel            │
│                                     │                       │
├─────────────────────────────────────┼───────────────────────┤
│        Status Dashboard             │    Alerts Panel      │
│    (KPIs, Charts, Metrics)         │   (Notifications)     │
└─────────────────────────────────────┴───────────────────────┘
```

### Key Components
- **TrainMap**: Interactive map with train markers and station indicators
- **AIRecommendations**: Real-time AI suggestions with accept/reject actions
- **StatusDashboard**: KPI cards and analytics charts
- **AlertsPanel**: System alerts and notifications
- **SimulationModal**: What-if scenario testing
- **Header**: System status and navigation

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

### Map Configuration
To use real Mapbox maps, add your token to environment variables:
```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here
```

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

### Docker (Coming Soon)
```bash
docker build -t railway-mission-control .
docker run -p 3000:3000 railway-mission-control
```

## 🔮 Upcoming Features

### Backend Integration
- [ ] FastAPI backend with WebSocket real-time updates
- [ ] AI agent system with LangGraph
- [ ] PostgreSQL database integration
- [ ] Redis message queue for agent communication

### Enhanced AI Features
- [ ] Machine learning models for delay prediction
- [ ] Advanced route optimization algorithms
- [ ] Weather integration for proactive planning
- [ ] Passenger flow optimization

### Advanced UI Features
- [ ] 3D train visualization
- [ ] Voice commands and alerts
- [ ] Multi-language support
- [ ] Custom dashboard layouts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Indian Railways for inspiration
- Mission control interfaces from aerospace industry
- Open source community for amazing tools and libraries

---

**Built with ❤️ for the future of railway transportation**

*Experience the next generation of railway traffic management with AI-powered optimization and real-time control.*
