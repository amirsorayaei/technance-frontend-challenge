// Generate realistic BTC price mock data spanning a 5-second time frame
export const generateBTCMockData = () => {
  const data = [];
  const basePrice = 45000; // Starting price around $45,000
  const now = Date.now();
  const startTime = now - 5000; // 5 seconds ago

  // Generate data points every 200ms for 5 seconds (25 data points total)
  const interval = 200; // 200ms intervals
  const numPoints = 25;

  for (let i = 0; i < numPoints; i++) {
    const timestamp = startTime + i * interval;
    const volatility = 0.015; // 1.5% volatility
    const randomChange = (Math.random() - 0.5) * volatility;
    const price = basePrice * (1 + randomChange);

    data.push({
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
      timestamp: timestamp,
    });
  }

  return data;
};
