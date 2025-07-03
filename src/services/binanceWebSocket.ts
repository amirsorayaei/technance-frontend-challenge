// Binance WebSocket API Service for Live BTC Price Data
// Based on: https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams

export interface PriceDataPoint {
  timestamp: number;
  price: number;
}

export interface BinanceTickerData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // First trade(F)-1 price
  c: string; // Last price
  Q: string; // Last quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade Id
  n: number; // Total number of trades
}

export interface BinanceKlineData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: {
    t: number; // Kline start time
    T: number; // Kline close time
    s: string; // Symbol
    i: string; // Interval
    f: number; // First trade ID
    L: number; // Last trade ID
    o: string; // Open price
    c: string; // Close price
    h: string; // High price
    l: string; // Low price
    v: string; // Base asset volume
    n: number; // Number of trades
    x: boolean; // Is this kline closed?
    q: string; // Quote asset volume
    V: string; // Taker buy base asset volume
    Q: string; // Taker buy quote asset volume
    B: string; // Ignore
  };
}

export interface BinanceTradeData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  b: number; // Buyer order ID
  a: number; // Seller order ID
  T: number; // Trade time
  m: boolean; // Is the buyer the market maker?
  M: boolean; // Ignore
}

export type WebSocketEventType = "ticker" | "kline" | "trade" | "depth";

export type WebSocketMessageData =
  | BinanceTickerData
  | BinanceKlineData
  | BinanceTradeData
  | Record<string, unknown>;

export interface WebSocketConfig {
  symbol?: string;
  interval?: string;
  eventType?: WebSocketEventType;
  onMessage?: (data: WebSocketMessageData) => void;
  onError?: (error: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onOpen?: (event: Event) => void;
}

class BinanceWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private subscriptions: Set<string> = new Set();
  private onPriceUpdateCallback: ((data: PriceDataPoint) => void) | null = null;

  // Base WebSocket URL
  private readonly BASE_URL = "wss://stream.binance.com:9443";

  /**
   * Connect to Binance WebSocket stream
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const url = `${this.BASE_URL}/ws/btcusdt@ticker`;
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log("Binance WebSocket connected");
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("Binance WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log(
            "Binance WebSocket disconnected:",
            event.code,
            event.reason
          );
          this.isConnected = false;

          // Attempt to reconnect if not a clean close
          if (
            event.code !== 1000 &&
            this.reconnectAttempts < this.maxReconnectAttempts
          ) {
            this.scheduleReconnect();
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Subscribe to BTCUSDT ticker stream for live price updates
   */
  public subscribeToBTCTicker(
    onPriceUpdate: (data: PriceDataPoint) => void
  ): void {
    this.onPriceUpdateCallback = onPriceUpdate;

    if (this.ws && this.isConnected) {
      this.subscriptions.add("btcusdt@ticker");
    }
  }

  /**
   * Disconnect from WebSocket
   */
  public disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, "User initiated disconnect");
    }
    this.cleanup();
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Private methods

  private handleMessage(
    data: BinanceTickerData | Record<string, unknown>
  ): void {
    // Handle ping/pong
    if ("ping" in data && data.ping) {
      this.sendPong(data.ping);
      return;
    }

    // Handle subscription responses
    if ("result" in data && data.result !== undefined) {
      console.log("Subscription response:", data);
      return;
    }

    // Handle error messages
    if ("code" in data && data.code !== undefined) {
      console.error("Binance WebSocket error:", data);
      return;
    }

    // Handle ticker data
    if ("e" in data && data.e === "24hrTicker" && "E" in data && "c" in data) {
      const priceData: PriceDataPoint = {
        timestamp: data.E as number,
        price: parseFloat(data.c as string),
      };

      if (this.onPriceUpdateCallback) {
        this.onPriceUpdateCallback(priceData);
      }
    }
  }

  private sendPong(pingPayload: unknown): void {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify({ pong: pingPayload }));
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`
    );

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error("Reconnection failed:", error);
      });
    }, delay);
  }

  private cleanup(): void {
    this.subscriptions.clear();
    this.onPriceUpdateCallback = null;
  }
}

// Export singleton instance
export const binanceWebSocket = new BinanceWebSocketService();

// Export the class for custom instances
export default BinanceWebSocketService;
