/* --- STATE --- */

export type NetworkType = 'local' | 'testnet' | 'mainnet'

export interface NetworkState {
  selectedNetwork: NetworkType

  /** Ticker symbol (ROSE, TEST, etc.) */
  ticker: string

  /** chainContext / Genesis Hash */
  chainContext?: string

  /** Current epoch */
  epoch?: number

  /** Minimum staking amount */
  minimumStakingAmount: number
}
