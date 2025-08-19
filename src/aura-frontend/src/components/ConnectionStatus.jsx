import React from 'react';
import { FaWifi, FaWifiSlash, FaExclamationTriangle } from 'react-icons/fa';

const ConnectionStatus = ({ connected, error, onRetry }) => {
  if (connected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
        <FaWifi className="text-xs" />
        Connected
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm">
        <FaWifiSlash className="text-xs" />
        Disconnected
      </div>
      {error && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-xs hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
          title="Retry connection"
        >
          <FaExclamationTriangle className="text-xs" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;