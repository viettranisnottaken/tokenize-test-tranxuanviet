import { useEnvironment } from './useEnviromnent';
import { EInterval } from '../models/interval.enum';
import { useCallback, useState } from 'react';
import { TKline } from '../models/chartData.model';

type TUseKlineApi = {
  maxRetryCount: number;
  timeZone: string;
};
export const useKlineApi: (props?: Partial<TUseKlineApi>) => {
  isLoading: boolean;
  fetchedData: TKline[];
  error: any;
  fetchData: (interval: EInterval) => Promise<TKline[]>;
} = ({ maxRetryCount = 3, timeZone = '7' } = {}) => {
  const [fetchedData, setFetchedData] = useState<TKline[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { VITE_BINANCE_API_URL } = useEnvironment();
  const url = `${VITE_BINANCE_API_URL}/api/v3/klines`;

  const transformData = (klineData: any[]): TKline[] => {
    return klineData.map((d) => ({
      openTime: d[0],
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
      volume: d[5],
      closeTime: d[6],
      quoteAccessVolume: d[7],
      tradeCount: d[8],
    }));
  };

  const getKlineData = useCallback(
    async (interval: EInterval, symbol = 'BTCUSDT', retryCount = maxRetryCount) => {
      setIsLoading(true);

      const params = new URLSearchParams({
        symbol,
        interval,
        timeZone,
        limit: '1000',
        endTime: `${new Date().getTime()}`,
      });

      const request = new Request(url + '?' + params.toString(), {
        method: 'GET',
      });

      try {
        const response = await fetch(request, {});
        const jsonizedData = await response.json();

        const transformedData = transformData(jsonizedData);

        setFetchedData(transformedData);
        setIsLoading(false);

        return transformedData;
      } catch (error) {
        if (retryCount > 0) {
          return getKlineData(interval, symbol, retryCount - 1);
        } else {
          console.error(error);
          setIsLoading(false);
          setFetchedData(fetchedData ?? null);
          setError(error);

          return [];
        }
      }
    },
    [url, maxRetryCount, timeZone]
  );

  return { isLoading, fetchedData, error, fetchData: getKlineData };
};
