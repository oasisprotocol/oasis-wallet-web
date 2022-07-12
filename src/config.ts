import { BackendAPIs } from 'vendors/backend'
import { NetworkType } from 'app/state/network/types'

type BackendApiUrls = {
  explorer: string
  blockExplorer: string
  blockExplorerParatimes?: string
}

type BackendProviders = {
  grpc: string
  [BackendAPIs.OasisMonitor]: BackendApiUrls
  [BackendAPIs.OasisScan]: BackendApiUrls
}

type BackendConfig = {
  [key in NetworkType]: BackendProviders
}

export const config: BackendConfig = {
  mainnet: {
    [BackendAPIs.OasisMonitor]: {
      explorer: 'https://monitor.oasis.dev',
      blockExplorer: 'https://oasismonitor.com/operation/{{txHash}}',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'https://api.oasisscan.com/mainnet',
      blockExplorer: 'https://oasisscan.com/transactions/{{txHash}}',
      blockExplorerParatimes: 'https://oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
    },
    grpc: 'https://grpc.oasis.dev',
  },
  testnet: {
    grpc: 'https://testnet.grpc.oasis.dev',
    [BackendAPIs.OasisMonitor]: {
      explorer: 'https://monitor.oasis.dev/api/testnet',
      blockExplorer: 'https://testnet.oasismonitor.com/operation/{{txHash}}',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'https://api.oasisscan.com/testnet',
      blockExplorer: 'https://testnet.oasisscan.com/transactions/{{txHash}}',
      blockExplorerParatimes:
        'https://testnet.oasisscan.com/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
    },
  },
  local: {
    grpc: 'http://localhost:42280',
    [BackendAPIs.OasisMonitor]: {
      explorer: 'http://localhost:9001',
      blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'http://localhost:9001',
      blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
      blockExplorerParatimes:
        'http://localhost:9001/data/paratimes/transactions/{{txHash}}?runtime={{runtimeId}}',
    },
  },
}
