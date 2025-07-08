# DeTrade Chart Panel - Technance Frontend Challenge

A modern, interactive Bitcoin price chart application that displays real-time price data from Binance WebSocket API. Built with React, TypeScript, and D3.js for smooth animations and responsive design.

## 🌐 Live Demo

**Try it out now:** [https://amirsorayaei.github.io/technance-frontend-challenge/](https://amirsorayaei.github.io/technance-frontend-challenge/)

Experience the real-time Bitcoin price chart with live data from Binance WebSocket API.

## 🚀 Features

- **Real-time Bitcoin Price Data**: Live price updates via Binance WebSocket API
- **Interactive Chart**: Smooth animated line chart built with D3.js
- **Responsive Design**: Modern UI with gradient backgrounds and smooth animations
- **Connection Status**: Real-time connection status indicator
- **TypeScript**: Fully typed for better development experience
- **Modern Stack**: Built with React 19, Vite, and SCSS

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS with CSS Modules
- **Charts**: D3.js for data visualization
- **Animations**: React Spring for smooth transitions
- **Real-time Data**: Binance WebSocket API
- **Linting**: ESLint with TypeScript support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd technance-frontend-challenge
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Chart/          # D3.js chart component
│   ├── ChartPanel/     # Main chart panel wrapper
│   ├── LiveChart/      # Live chart implementation
│   └── LivePriceCard/  # Price display card
├── hooks/              # Custom React hooks
│   └── useLiveData.ts  # WebSocket data management
├── services/           # External service integrations
│   └── binanceWebSocket.ts  # Binance WebSocket API
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
└── assets/             # Static assets
```

## 🔧 Available Scripts

- `yarn dev` - Start development server with hot reload
- `yarn build` - Build for production
- `yarn lint` - Run ESLint to check code quality
- `yarn preview` - Preview production build locally

## 🌐 API Integration

The application connects to Binance WebSocket API to receive real-time Bitcoin price data:

- **WebSocket Endpoint**: `wss://stream.binance.com:9443/ws/btcusdt@ticker`
- **Data Format**: 24-hour ticker statistics
- **Update Frequency**: Real-time as data becomes available
- **Reconnection**: Automatic reconnection with exponential backoff

## 🎨 Key Components

### ChartPanel
The main component that orchestrates the chart display and connection status.

### Chart
A D3.js-based chart component that renders the price data with:
- Smooth line animations
- Responsive grid
- Interactive price indicators
- Custom styling with golden theme

### useLiveData Hook
Manages WebSocket connection and data flow:
- Handles connection lifecycle
- Manages data state
- Provides loading and connection status

## 🎯 Features in Detail

### Real-time Data Flow
1. WebSocket connection to Binance API
2. Automatic data parsing and formatting
3. State management with React hooks
4. Smooth chart updates with animations

### Responsive Design
- Mobile-friendly layout
- Adaptive chart dimensions
- Touch-friendly interactions
- Modern gradient backgrounds

### Error Handling
- WebSocket reconnection logic
- Graceful error handling
- User-friendly status indicators
- Fallback data when needed

## 🔒 Environment Setup

No environment variables are required for basic functionality. The application connects directly to Binance's public WebSocket API.

## 🚀 Deployment

### Build for Production
```bash
yarn build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deploy Options
- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload the `dist/` contents to an S3 bucket

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Modular component architecture

### Performance Considerations
- Efficient D3.js rendering
- Optimized WebSocket handling
- Minimal re-renders with React hooks
- Lazy loading where appropriate

## 📄 License

This project is part of the Technance Frontend Challenge. Please refer to the challenge requirements for usage terms.

## 🙏 Acknowledgments

- [Binance API](https://developers.binance.com/) for real-time data
- [D3.js](https://d3js.org/) for chart visualization
- [React Spring](https://react-spring.dev/) for animations
- [Vite](https://vitejs.dev/) for fast development experience