export enum WalletType {
  Ledger = 'ledger',
  PrivateKey = 'private_key',
  Mnemonic = 'mnemonic',
  ParaTime = 'paratime',
}

/**
 * WalletBalance
 *
 * We stock the amounts as strings to work around
 * poor bigint support in JS
 *
 */
export interface WalletBalance {
  available: string
  escrow: string
  debonding: string
  total: string
}

export interface BalanceUpdatePayload {
  walletId: number
  balance: WalletBalance
}

export interface Wallet {
  id: number
  publicKey: string
  address: string
  type: WalletType
  path?: number[]
  privateKey?: string
  balance: WalletBalance
}

export interface AddWalletPayload extends Wallet {
  selectImmediately: boolean
}

/* --- STATE --- */
export interface WalletState {
  isOpen: boolean
  selectedWallet?: number
  wallets: { [id: number]: Wallet }
}
