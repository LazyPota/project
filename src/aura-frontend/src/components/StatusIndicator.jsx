import React from 'react';
import { FaCircle, FaWifi, FaWifiSlash } from 'react-icons/fa';

const StatusIndicator = ({ 
  connected, 
  systemActive, 
  lastUpdate, 
  cycleCount 
}) => {
  const getStatusColor = () => {
    if (!connected) return 'text-red-500';
    if (systemActive) return 'text-green-500';
    return 'text-yellow-500';
  };

  const getStatusText = () => {
    if (!connected) return 'Disconnected';
    if (systemActive) return 'Active';
    return 'Inactive';
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        {connected ? (
          <FaWifi className="text-green-500" />
        ) : (
          <FaWifiSlash className="text-red-500" />
        )}
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* System Status */}
      <div className="flex items-center gap-2">
        <FaCircle className={`text-xs ${getStatusColor()}`} />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {getStatusText()}
        </span>
      </div>

      {/* Cycle Count */}
      {connected && (
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Cycles: <span className="font-medium">{cycleCount || 0}</span>
        </div>
      )}

      {/* Last Update */}
      {connected && lastUpdate && (
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Updated: {new Date(Number(lastUpdate) / 1000000).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;