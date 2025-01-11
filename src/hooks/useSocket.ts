import { useEffect, useMemo } from 'react';

type TUseSocketProps = {
  url: string;
  retry?: boolean;
  handleConnectionOpen: (args: any) => void;
  handleConnectionClose: (args: any) => void;
  handleMessage: (args: any) => void;
  handleError: (args: any) => void;
};

export const useSocket: (props: TUseSocketProps) => {
  socketSend: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  closeSocket: (code?: number, reason?: string) => void;
  readyState: () => number;
} = ({ url, handleConnectionOpen, handleConnectionClose, handleMessage, handleError }) => {
  const socket = useMemo(() => {
    return new WebSocket(url);
  }, [url]);

  const readyState = () => {
    return socket.readyState;
  }

  const socketSend = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeSocket = (code?: number, reason?: string) => {
    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CLOSING) {
      socket.close(code, reason);
    }
  };

  useEffect(() => {
    socket.addEventListener('error', handleError);
    socket.addEventListener('open', handleConnectionOpen);
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('close', handleConnectionClose);

    return () => {
      console.log('clean up socket event listeners');
      
      socket.removeEventListener('error', handleError);
      socket.removeEventListener('open', handleConnectionOpen);
      socket.removeEventListener('message', handleMessage);
      socket.removeEventListener('close', handleConnectionClose);
    };
  }, [handleConnectionClose, handleConnectionOpen, handleError, handleMessage, socket]);

  return { socketSend, closeSocket, readyState };
};
