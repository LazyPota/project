import { Actor, HttpAgent } from '@dfinity/agent';

// Configuration (fallback only; prefer declarations' canisterId)
const fallbackCanisterId = import.meta.env.VITE_CANISTER_ID_AURA_BACKEND || 'rdmx6-jaaaa-aaaah-qdrva-cai';
const host = import.meta.env.VITE_DFX_NETWORK === 'local' ? 'http://127.0.0.1:4943' : 'https://ic0.app';

let backendPromise;

async function getBackend() {
  if (!backendPromise) {
    backendPromise = (async () => {
      // Import canister declarations via Vite alias using literal specifiers so Vite resolves them
      const { idlFactory } = await import('declarations/aura-backend/aura-backend.did.js').catch((e) => {
        console.error('[AURA] Failed to import declarations', didPath, e);
        throw new Error(
          'Canister declarations not found. Run "dfx generate aura-backend" at the repo root to create the "declarations" folder.'
        );
      });

      // Resolve canisterId from Vite env only (avoid importing declarations/index.js which uses process.env)
      const resolvedCanisterId = import.meta.env.VITE_CANISTER_ID_AURA_BACKEND || fallbackCanisterId;

      const agent = new HttpAgent({ host });

      if (import.meta.env.VITE_DFX_NETWORK === 'local') {
        try {
          await agent.fetchRootKey();
        } catch (err) {
          console.warn(
            'Unable to fetch root key. Ensure your local replica is running (dfx start).'
          );
          console.error(err);
        }
      }

      console.info('[AURA] Connecting to canister', {
        canisterId: resolvedCanisterId,
        host,
        network: import.meta.env.VITE_DFX_NETWORK || 'unknown'
      });
      return Actor.createActor(idlFactory, { agent, canisterId: resolvedCanisterId });
    })();
  }
  return backendPromise;
}

// API wrapper functions with error handling
export const getDashboardData = async () => {
  try {
    const backend = await getBackend();
    const result = await backend.getDashboardData();
    return result[0] || null; // Handle optional return
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
};

export const getLogs = async () => {
  try {
    const backend = await getBackend();
    return await backend.getLogs();
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw new Error('Failed to fetch logs');
  }
};

export const getSystemStatus = async () => {
  try {
    const backend = await getBackend();
    return await backend.getSystemStatus();
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw new Error('Failed to fetch system status');
  }
};

export const manualUpdate = async () => {
  try {
    const backend = await getBackend();
    return await backend.manualUpdate();
  } catch (error) {
    console.error('Error triggering manual update:', error);
    throw new Error('Failed to trigger manual update');
  }
};

export const clearLogs = async () => {
  try {
    const backend = await getBackend();
    return await backend.clearLogs();
  } catch (error) {
    console.error('Error clearing logs:', error);
    throw new Error('Failed to clear logs');
  }
};

export const setApiKey = async (key) => {
  try {
    const backend = await getBackend();
    const result = await backend.setApiKey(key);
    if ('err' in result) {
      throw new Error(result.err);
    }
    return result.ok;
  } catch (error) {
    console.error('Error setting API key:', error);
    throw new Error('Failed to set API key');
  }
};

export const healthCheck = async () => {
  try {
    const backend = await getBackend();
    return await backend.healthCheck();
  } catch (error) {
    console.error('Error checking health:', error);
    throw new Error('Failed to check system health');
  }
};

export const stopAutomatedCycle = async () => {
  try {
    const backend = await getBackend();
    return await backend.stopAutomatedCycle();
  } catch (error) {
    console.error('Error stopping automated cycle:', error);
    throw new Error('Failed to stop automated cycle');
  }
};

export const startCycle = async () => {
  try {
    const backend = await getBackend();
    return await backend.startCycle();
  } catch (error) {
    console.error('Error starting cycle:', error);
    throw new Error('Failed to start cycle');
  }
};

export const initialize = async () => {
  try {
    return await backend.initialize();
  } catch (error) {
    console.error('Error initializing system:', error);
    throw new Error('Failed to initialize system');
  }
};

// Connection status checker
export const checkConnection = async () => {
  try {
    await healthCheck();
    return true;
  } catch (error) {
    return false;
  }
};