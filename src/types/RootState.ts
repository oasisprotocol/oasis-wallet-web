// import { GithubRepoFormState } from 'app/pages/HomePage/Features/GithubRepoForm/slice/types';
import { ThemeState } from 'styles/theme/slice/types'
import { WalletState } from 'app/state/wallet/types'
import { CreateWalletState } from 'app/pages/CreateWalletPage/slice/types'
import { AccountState } from 'app/state/account/types'
import { NetworkState } from 'app/state/network/types'
import { TransactionState } from 'app/state/transaction/types'
import { ImportAccountsState } from 'app/state/importaccounts/types'
import { StakingState } from 'app/state/staking/types'
import { FatalErrorState } from 'app/state/fatalerror/types'
import { SettingsState } from '../app/components/SettingsDialog/slice/types'
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

export interface RootState {
  theme: ThemeState
  wallet: WalletState
  createWallet: CreateWalletState
  account: AccountState
  network: NetworkState
  transaction: TransactionState
  importAccounts: ImportAccountsState
  staking: StakingState
  fatalError: FatalErrorState
  settings: SettingsState
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T
export type DeepPartialRootState = DeepPartial<RootState>
