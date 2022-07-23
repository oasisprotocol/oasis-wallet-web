/**
 *
 * ShortAddress
 *
 * Used to render short address or hash.
 */
import * as React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  address: string
}

export function ShortAddress(props: Props) {
  const { t } = useTranslation()

  const a = props.address
  const short = props.address ? `${a.slice(0, 10)}...${a.slice(-8)}` : t('common.unavailable', 'Unavailable')
  return <>{short}</>
}
