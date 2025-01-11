import Big from 'big.js';
import { CandlestickData, createChart, CrosshairMode } from 'lightweight-charts';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useKlineApi } from '../../hooks/useKlineApi';
import { useSocket } from '../../hooks/useSocket';
import { TKline } from '../../models/chartData.model';
import { EInterval } from '../../models/interval.enum';
import { v4 as uuidv4 } from 'uuid';
import ResolutionSection from './resolutionSection/ResolutionSection';

import './TradingViewChart.scss';

type TTradingViewChartProps = {
  height: number;
  width: number;
};

const TradingViewChart: React.FC<TTradingViewChartProps> = ({ height = 500, width = 800 }: any) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const [selectedResolution, setSelectedResolution] = useState<EInterval>(EInterval.m1);
  const { fetchedData, isLoading, fetchData } = useKlineApi();

  const apiDataToKline: (data: TKline) => CandlestickData = useCallback(
    ({ open, close, high, low, openTime }: TKline) => {
      return {
        open: Big(open).toNumber(),
        close: Big(close).toNumber(),
        high: Big(high).toNumber(),
        low: Big(low).toNumber(),
        time: openTime as any,
      };
    },
    []
  );

  const socketDataToKline = ({ o, c, h, l, t }: { [key: string]: any }) => {
    return {
      open: Big(o).toNumber(),
      close: Big(c).toNumber(),
      high: Big(h).toNumber(),
      low: Big(l).toNumber(),
      time: t as any,
    };
  };

  const handleSocketOpen = useCallback(() => {
    socketSend(
      JSON.stringify({
        method: 'SUBSCRIBE',
        params: [`btcusdt@kline_${selectedResolution}@+08:00`],
        id: uuidv4(),
      })
    );
  }, []);

  const handleSocketClose = useCallback(() => {}, []);
  const handleSocketMessage = useCallback((event: MessageEvent) => {
    const incomingData = JSON.parse(event.data).data;
    if (!incomingData) {
      return;
    }

    const newCandle = socketDataToKline(JSON.parse(event.data).data.k);

    if (!candlestickSeriesRef.current) {
      return;
    }

    (candlestickSeriesRef?.current as any).update(newCandle);
  }, []);

  const handleSocketError = useCallback(() => {}, []);

  const { socketSend, closeSocket } = useSocket({
    url: import.meta.env.VITE_BINANCE_WS_URL,
    handleConnectionOpen: handleSocketOpen,
    handleConnectionClose: handleSocketClose,
    handleMessage: handleSocketMessage,
    handleError: handleSocketError,
  });

  useEffect(() => {
    fetchData(selectedResolution);
  }, [fetchData, selectedResolution]);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current as any, {
      width,
      height,
      autoSize: true,
      layout: {
        background: { type: 'Solid' as any, color: '#0e1d2b' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2c3e50' },
        horzLines: { color: '#2c3e50' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      timeScale: {
        borderColor: '#2c3e50',
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4caf50',
      downColor: '#f44336',
      borderDownColor: '#f44336',
      borderUpColor: '#4caf50',
      wickDownColor: '#f44336',
      wickUpColor: '#4caf50',
    });

    candlestickSeries.setData(fetchedData.map((d) => apiDataToKline(d)));

    chartRef.current = chart as any;
    candlestickSeriesRef.current = candlestickSeries as any;

    return () => {
      console.log('chart removed');
      
      chart.remove();
    };
  }, [fetchedData, height, width, apiDataToKline, closeSocket]);

  useEffect(() => {
    return () => {
      console.log('stream closed');
      
      closeSocket();
    };
  }, []);

  const handleResolutionChange = useCallback(
    (resolution: EInterval) => {
      // Binance socket's broken, below is what should work if the socket works
      // socketSend(
      //   JSON.stringify({
      //     method: 'UNSUBSCRIBE',
      //     params: [`btcusdt@kline_${selectedResolution}@+0:00`],
      //     id: uuidv4(),
      //   })
      // );

      // socketSend(
      //   JSON.stringify({
      //     method: 'SUBSCRIBE',
      //     params: [`btcusdt@kline_${resolution}@+08:00`],
      //     id: uuidv4(),
      //   })
      // );

      setSelectedResolution(resolution);
    },
    [socketSend]
  );

  return (
    <div>
      <ResolutionSection
        selectedResolution={selectedResolution}
        onResolutionChange={(resolution) => {
          handleResolutionChange(resolution);
        }}
      />
      <div
        ref={chartContainerRef}
        className={'chart-container ' + (isLoading ? 'is-loading' : '')}
      />
    </div>
  );
};

export default TradingViewChart;
