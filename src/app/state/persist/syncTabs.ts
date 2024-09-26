import {
  AnyAction,
  configureStore,
  ConfigureStoreOptions,
  Dispatch,
  EnhancedStore,
  Middleware,
} from '@reduxjs/toolkit'
import { isSyncingTabsSupported, needsSyncingTabs } from 'app/state/persist'
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
  Config as StateSyncConfig,
  withReduxStateSync,
} from 'redux-state-sync'
import { RootState } from 'types'
import { SyncedRootState } from 'app/state/persist/types'
import { AllActions, rootSlices } from '../../../store/slices'

/**
 * When opening a second tab it initially syncs these state slices.
 */
export function receiveInitialTabSyncState(
  prevState: RootState,
  initialSyncState: SyncedRootState,
): RootState {
  return {
    // Explicitly list every field instead of `...prevState` to force developers
    // to consider if their new slice should be synced.
    account: prevState.account,
    createWallet: prevState.createWallet,
    fatalError: prevState.fatalError,
    fiatOnramp: prevState.fiatOnramp,
    importAccounts: prevState.importAccounts,
    paraTimes: prevState.paraTimes,
    staking: prevState.staking,
    transaction: prevState.transaction,

    theme: initialSyncState.theme,
    wallet: initialSyncState.wallet,
    evmAccounts: initialSyncState.evmAccounts,
    contacts: initialSyncState.contacts,
    network: initialSyncState.network,
    persist: initialSyncState.persist,
  }
}

/**
 * When interacting with a second tab it syncs these actions.
 *
 * See caveat in {@link rootSlices.wallet.actions.updateBalance} about actions being synced
 * before {@link receiveInitialTabSyncState}!
 */
export const whitelistTabSyncActions: Record<AllActions, boolean> = {
  [rootSlices.contacts.actions.add.type]: true,
  [rootSlices.contacts.actions.update.type]: true,
  [rootSlices.contacts.actions.delete.type]: true,
  [rootSlices.evmAccounts.actions.add.type]: true,
  [rootSlices.evmAccounts.actions.delete.type]: true,
  [rootSlices.theme.actions.changeTheme.type]: true,
  [rootSlices.wallet.actions.walletOpened.type]: true,
  [rootSlices.wallet.actions.updateBalance.type]: true,
  [rootSlices.network.actions.networkSelected.type]: true,
  [rootSlices.network.actions.setChainContext.type]: true,
  [rootSlices.network.actions.getEpoch.type]: true,
  [rootSlices.network.actions.setEpoch.type]: true,
  [rootSlices.persist.actions.setUnlockedRootState.type]: true,
  [rootSlices.persist.actions.resetRootState.type]: true,
  [rootSlices.persist.actions.skipUnlocking.type]: true,

  // Require listing every action to force developers to consider if their new
  // actions should be persisted.
  [rootSlices.network.actions.initialNetworkSelected.type]: false,
  [rootSlices.network.actions.initializeNetwork.type]: false,
  [rootSlices.network.actions.selectNetwork.type]: false,
  [rootSlices.account.actions.accountError.type]: false,
  [rootSlices.account.actions.accountLoaded.type]: false,
  [rootSlices.account.actions.clearAccount.type]: false,
  [rootSlices.account.actions.closeAccountPage.type]: false,
  [rootSlices.account.actions.fetchAccount.type]: false,
  [rootSlices.account.actions.openAccountPage.type]: false,
  [rootSlices.account.actions.setLoading.type]: false,
  [rootSlices.account.actions.transactionsError.type]: false,
  [rootSlices.account.actions.transactionsLoaded.type]: false,
  [rootSlices.account.actions.addPendingTransaction.type]: false,
  [rootSlices.createWallet.actions.clear.type]: false,
  [rootSlices.createWallet.actions.generateMnemonic.type]: false,
  [rootSlices.createWallet.actions.setChecked.type]: false,
  [rootSlices.fiatOnramp.actions.setThirdPartyAcknowledged.type]: false,
  [rootSlices.fatalError.actions.setError.type]: false,
  [rootSlices.importAccounts.actions.accountGenerated.type]: false,
  [rootSlices.importAccounts.actions.accountsListed.type]: false,
  [rootSlices.importAccounts.actions.clear.type]: false,
  [rootSlices.importAccounts.actions.enumerateAccountsFromLedger.type]: false,
  [rootSlices.importAccounts.actions.enumerateAccountsFromMnemonic.type]: false,
  [rootSlices.importAccounts.actions.enumerateDevicesFromBleLedger.type]: false,
  [rootSlices.importAccounts.actions.enumerateMoreAccountsFromLedger.type]: false,
  [rootSlices.importAccounts.actions.operationFailed.type]: false,
  [rootSlices.importAccounts.actions.setBleDevices.type]: false,
  [rootSlices.importAccounts.actions.setPage.type]: false,
  [rootSlices.importAccounts.actions.setSelectedBleDevice.type]: false,
  [rootSlices.importAccounts.actions.setStep.type]: false,
  [rootSlices.importAccounts.actions.toggleAccount.type]: false,
  [rootSlices.importAccounts.actions.updateAccountBalance.type]: false,
  [rootSlices.paraTimes.actions.balanceLoaded.type]: false,
  [rootSlices.paraTimes.actions.clearTransactionForm.type]: false,
  [rootSlices.paraTimes.actions.fetchBalanceUsingEthPrivateKey.type]: false,
  [rootSlices.paraTimes.actions.fetchBalanceUsingOasisAddress.type]: false,
  [rootSlices.paraTimes.actions.navigateToAmount.type]: false,
  [rootSlices.paraTimes.actions.navigateToConfirmation.type]: false,
  [rootSlices.paraTimes.actions.navigateToDeposit.type]: false,
  [rootSlices.paraTimes.actions.navigateToParaTimes.type]: false,
  [rootSlices.paraTimes.actions.navigateToRecipient.type]: false,
  [rootSlices.paraTimes.actions.navigateToSummary.type]: false,
  [rootSlices.paraTimes.actions.navigateToWithdraw.type]: false,
  [rootSlices.paraTimes.actions.setTransactionForm.type]: false,
  [rootSlices.paraTimes.actions.submitTransaction.type]: false,
  [rootSlices.paraTimes.actions.transactionError.type]: false,
  [rootSlices.paraTimes.actions.transactionSubmitted.type]: false,
  [rootSlices.staking.actions.fetchAccount.type]: false,
  [rootSlices.staking.actions.setLoading.type]: false,
  [rootSlices.staking.actions.updateDelegations.type]: false,
  [rootSlices.staking.actions.updateDelegationsError.type]: false,
  [rootSlices.staking.actions.updateValidatorDetails.type]: false,
  [rootSlices.staking.actions.updateValidators.type]: false,
  [rootSlices.staking.actions.updateValidatorsError.type]: false,
  [rootSlices.staking.actions.validatorDeselected.type]: false,
  [rootSlices.staking.actions.validatorSelected.type]: false,
  [rootSlices.transaction.actions.abortTransaction.type]: false,
  [rootSlices.transaction.actions.addEscrow.type]: false,
  [rootSlices.transaction.actions.clearTransaction.type]: false,
  [rootSlices.transaction.actions.confirmTransaction.type]: false,
  [rootSlices.transaction.actions.paraTimeTransactionSent.type]: false,
  [rootSlices.transaction.actions.reclaimEscrow.type]: false,
  [rootSlices.transaction.actions.sendTransaction.type]: false,
  [rootSlices.transaction.actions.setStep.type]: false,
  [rootSlices.transaction.actions.transactionFailed.type]: false,
  [rootSlices.transaction.actions.transactionSent.type]: false,
  [rootSlices.transaction.actions.updateTransactionPreview.type]: false,
  [rootSlices.wallet.actions.deleteWallet.type]: false,
  [rootSlices.wallet.actions.fetchWallet.type]: false,
  [rootSlices.wallet.actions.openWalletFromMnemonic.type]: false,
  [rootSlices.wallet.actions.openWalletFromPrivateKey.type]: false,
  [rootSlices.wallet.actions.openWalletsFromLedger.type]: false,
  [rootSlices.wallet.actions.selectFirstWallet.type]: false,
  [rootSlices.wallet.actions.selectWallet.type]: false,
  [rootSlices.wallet.actions.setWalletName.type]: false,
  [rootSlices.persist.actions.deleteProfileAsync.type]: false,
  [rootSlices.persist.actions.finishV0Migration.type]: false,
  [rootSlices.persist.actions.lockAsync.type]: false,
  [rootSlices.persist.actions.resetWrongPassword.type]: false,
  [rootSlices.persist.actions.setHasV0StorageToMigrate.type]: false,
  [rootSlices.persist.actions.setPasswordAsync.type]: false,
  [rootSlices.persist.actions.setWrongPassword.type]: false,
  [rootSlices.persist.actions.unlockAsync.type]: false,
  [rootSlices.persist.actions.updatePasswordAsync.type]: false,
}

const stateSyncConfig: StateSyncConfig = {
  channel: 'oasis_wallet_broadcast_channel',
  broadcastChannelOption: {
    type: 'native', // Prevent fallbacks to e.g. localStorage that would expose password.
  },
  whitelist: Object.entries(whitelistTabSyncActions)
    .filter(([_key, value]) => value)
    .map(([key, _value]) => key),
  prepareState: (state: RootState): SyncedRootState => {
    return {
      contacts: state.contacts,
      evmAccounts: state.evmAccounts,
      theme: state.theme,
      wallet: state.wallet,
      network: state.network,
      persist: state.persist,
    }
  },
}

/** Wrap configureStore with redux-state-sync if native BroadcastChannel is supported. */
export function configureStoreWithSyncTabs(
  options: ConfigureStoreOptions<RootState>,
): EnhancedStore<RootState, AnyAction, Middleware<unknown, RootState, Dispatch<AnyAction>>[]> {
  if (typeof options.middleware !== 'function') throw new Error('Unsupported type of options.middleware')
  if (typeof options.reducer !== 'function') throw new Error('Unsupported type of options.reducer')
  if (!needsSyncingTabs) {
    return configureStore(options)
  }
  if (!isSyncingTabsSupported) {
    if (!process.env.JEST_WORKER_ID) console.warn('Syncing between tabs is not supported')
    return configureStore(options)
  }

  const optionsMiddleware = options.middleware

  const store = configureStore({
    ...options,
    reducer: withReduxStateSync(options.reducer, receiveInitialTabSyncState),
    middleware: getDefaultMiddleware =>
      optionsMiddleware(getDefaultMiddleware).concat(createStateSyncMiddleware(stateSyncConfig)),
  })

  initStateWithPrevTab(store)
  return store
}
