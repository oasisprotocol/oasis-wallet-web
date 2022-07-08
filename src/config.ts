import { BackendAPIs } from 'vendors/backend'
import { NetworkType } from 'app/state/network/types'

type BackendAPIsUrls = {
  [key in BackendAPIs]: {
    explorer: string
    blockExplorer: string
    blockExplorerParatimes?: string
  }
}

type BackendAPIsConfig = {
  [key in NetworkType]: BackendAPIsUrls
}

type GrpcApiConfig = {
  [key in NetworkType]: string
}

export const grpcApi: GrpcApiConfig = {
  mainnet: 'https://grpc.oasis.dev',
  testnet: 'https://testnet.grpc.oasis.dev',
  local: 'http://localhost:42280',
}

export const config: BackendAPIsConfig = {
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
  },
  testnet: {
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
    [BackendAPIs.OasisMonitor]: {
      explorer: 'http://localhost:9001',
      blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
    },
    [BackendAPIs.OasisScan]: {
      explorer: 'http://localhost:9001',
      blockExplorer: 'http://localhost:9001/data/transactions?operation_id={{txHash}}',
    },
  },
}
