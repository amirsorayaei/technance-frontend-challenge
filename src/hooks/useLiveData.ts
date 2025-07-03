import { useState, useEffect, useCallback } from "react";
import { binanceWebSocket } from "../services/binanceWebSocket";
import type { PriceDataPoint } from "../services/binanceWebSocket";
import type { DataPoint } from "../types/chart";

export const useLiveData = (maxDataPoints: number = 25) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handlePriceUpdate = useCallback(
    (priceData: PriceDataPoint) => {
      setData((prevData) => {
        const newDataPoint: DataPoint = {
          timestamp: priceData.timestamp,
          price: priceData.price,
        };

        const updatedData = [...prevData, newDataPoint];

        // Keep only the last maxDataPoints
        if (updatedData.length > maxDataPoints) {
          return updatedData.slice(-maxDataPoints);
        }

        return updatedData;
      });
    },
    [maxDataPoints]
  );

  useEffect(() => {
    let mounted = true;

    const connectWebSocket = async () => {
      try {
        await binanceWebSocket.connect();

        if (mounted) {
          setIsConnected(true);
          setIsLoading(false);

          // Subscribe to price updates
          binanceWebSocket.subscribeToBTCTicker(handlePriceUpdate);
        }
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    connectWebSocket();

    return () => {
      mounted = false;
      binanceWebSocket.disconnect();
    };
  }, [handlePriceUpdate]);

  return {
    data,
    isConnected,
    isLoading,
  };
};
