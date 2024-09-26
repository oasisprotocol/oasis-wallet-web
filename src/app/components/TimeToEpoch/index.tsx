import * as React from 'react'

interface Props {
  currentEpoch?: number
  epoch: number
}

const estimatedEpochsPerHour = 1

const relativeFormat = new Intl.RelativeTimeFormat(process?.env?.NODE_ENV === 'test' ? 'en-US' : undefined)

export function TimeToEpoch(props: Props) {
  if (!props.currentEpoch) {
    return null
  }
  const remainingHours = (props.epoch - props.currentEpoch) / estimatedEpochsPerHour

  // TODO: add more thresholds if used for other than debonding
  const formattedRemainingTime =
    remainingHours > 48
      ? relativeFormat.format(Math.round(remainingHours / 24), 'day')
      : relativeFormat.format(remainingHours, 'hour')

  return <span>{formattedRemainingTime}</span>
}
