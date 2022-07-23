import { Box, Text } from 'grommet'
import * as React from 'react'
import type { Icon } from 'grommet-icons/icons'

interface InfoBoxProps {
  icon: Icon
  label: string
  value: string | React.ReactNode
}

export function InfoBox({ icon: IconComponent, label, value }: InfoBoxProps) {
  return (
    <Box
      direction="row"
      gap="small"
      hoverIndicator={{ color: 'background-contrast' }}
      pad={{ horizontal: 'small', bottom: 'small' }}
    >
      <Box fill="vertical" align="center" justify="center" alignSelf="center" pad={{ right: 'xsmall' }}>
        <IconComponent color="brand" size="20px" />
      </Box>

      <Box justify="center">
        <Text weight="bold">{label}</Text>
        <Text>{value}</Text>
      </Box>
    </Box>
  )
}
