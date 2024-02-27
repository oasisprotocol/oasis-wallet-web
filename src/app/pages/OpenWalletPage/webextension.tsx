import React from 'react'
import { useHref } from 'react-router-dom'
import { openLedgerAccessPopup } from 'utils/webextension'
import { SelectOpenMethod } from './'
import { FromLedger } from './Features/FromLedger'

export function OpenWalletPageWebExtension() {
  const href = useHref('connect-device')

  return <SelectOpenMethod webExtensionLedgerAccess={() => openLedgerAccessPopup(href)} />
}

export function FromLedgerWebExtension() {
  const href = useHref('/open-wallet/connect-device')

  return <FromLedger webExtensionLedgerAccess={() => openLedgerAccessPopup(href)} disableBluetoothLedger />
}
