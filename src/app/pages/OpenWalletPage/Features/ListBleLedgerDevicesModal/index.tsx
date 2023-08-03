import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AlertBox } from 'app/components/AlertBox'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { ModalHeader } from 'app/components/Header'
import { ImportAccountsStepFormatter } from 'app/components/ImportAccountsStepFormatter'
import { ResponsiveLayer } from 'app/components/ResponsiveLayer'
import {
  selectBleDevices,
  selectError,
  selectImportAccountsStep,
  selectSelectedBleDevice,
} from 'app/state/importaccounts/selectors'
import { ImportAccountsStep } from 'app/state/importaccounts/types'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Spinner } from 'grommet/es6/components/Spinner'
import { Text } from 'grommet/es6/components/Text'
import { ScanResult } from '@capacitor-community/bluetooth-le'
import { CheckBox } from 'grommet/es6/components/CheckBox'
import { importAccountsActions } from '../../../../state/importaccounts'

interface ImportAccountsSelectorSelectorProps {
  devices: ScanResult[]
}

function DevicesSelector({ devices }: ImportAccountsSelectorSelectorProps) {
  const dispatch = useDispatch()
  const selectedBleDevice = useSelector(selectSelectedBleDevice)
  const selectBleDevice = (scanResult: ScanResult) =>
    dispatch(importAccountsActions.setSelectedBleDevice(scanResult))

  return (
    <Box gap="small">
      {devices.map(d => (
        <Box
          key={d.device.deviceId}
          round="5px"
          pad="small"
          flex="grow"
          fill="horizontal"
          role="checkbox"
          hoverIndicator={{ background: 'brand' }}
          direction="row"
          onClick={() => {
            selectBleDevice(d)
          }}
        >
          <Box alignSelf="center" pad={{ left: 'small', right: 'medium' }}>
            <CheckBox checked={selectedBleDevice?.device.deviceId === d.device.deviceId} hidden />
          </Box>
          <Box flex="grow" gap="xsmall">
            <Box>
              <Text weight="bold">{d.device.name}</Text>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

interface ListBleLedgerDevicesModalProps {
  abort: () => void
  next: () => void
}

export function ListBleLedgerDevicesModal(props: ListBleLedgerDevicesModalProps) {
  const { t } = useTranslation()
  const bleDevices = useSelector(selectBleDevices)
  const selectedBleDevice = useSelector(selectSelectedBleDevice)
  const error = useSelector(selectError)
  const step = useSelector(selectImportAccountsStep)

  const isBusyImporting = step !== ImportAccountsStep.Idle
  const cancelDisabled = isBusyImporting && !error
  const confirmDisabled = isBusyImporting || !selectedBleDevice

  return (
    <ResponsiveLayer onEsc={props.abort} onClickOutside={props.abort} modal background="background-front">
      <Box width="800px" pad="medium">
        <ModalHeader>{t('openWallet.importAccounts.selectLedgerDevice', 'Select Ledger device')}</ModalHeader>

        <Box style={{ minHeight: '525px' }}>
          <DevicesSelector devices={bleDevices} />
          {![ImportAccountsStep.Idle, ImportAccountsStep.LoadingBleDevices].includes(step) && (
            <Box direction="row" gap="medium" alignContent="center" pad={{ top: 'small' }}>
              <Spinner size="medium" />
              <Box alignSelf="center">
                <Text size="xlarge">
                  <ImportAccountsStepFormatter step={step} />
                </Text>
              </Box>
            </Box>
          )}
          {![ImportAccountsStep.LoadingBleDevices].includes(step) && !bleDevices.length && (
            <Box direction="row" gap="medium" alignContent="center" pad={{ top: 'small' }}>
              <Box alignSelf="center">
                <Text size="xlarge">
                  {t('openWallet.importAccounts.NoBLEDevicesFound', 'No Bluetooth devices found')}
                </Text>
              </Box>
            </Box>
          )}
          {error && (
            <AlertBox status="error">
              <ErrorFormatter code={error.code} message={error.message} />
            </AlertBox>
          )}
        </Box>
        <Box direction="row" gap="small" justify="between" pad={{ top: 'medium' }}>
          <Button
            secondary
            label={t('common.cancel', 'Cancel')}
            onClick={props.abort}
            disabled={cancelDisabled}
          />
          <Button
            type="submit"
            primary
            data-testid="ledger-open-accounts"
            label={t('openWallet.importAccounts.openWallets', 'Open')}
            onClick={props.next}
            disabled={confirmDisabled}
          />
        </Box>
      </Box>
    </ResponsiveLayer>
  )
}
