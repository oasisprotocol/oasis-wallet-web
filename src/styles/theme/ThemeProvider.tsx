import { grommet, Grommet, ThemeType } from 'grommet'
import { deepMerge } from 'grommet/utils'
import * as React from 'react'
import { createTheme as dataTableCreateTheme, IDataTableStyles, ITheme } from 'react-data-table-component'
import { useSelector } from 'react-redux'

import { selectTheme } from './slice/selectors'

/**
 * React-data-table by default sets its own background and text colors
 * we make sure that they do not override grommet's
 */
dataTableCreateTheme('blank', {
  background: { default: 'false' },
  highlightOnHover: {
    default: '#88888833',
    text: 'false',
  },
  text: {
    primary: 'false',
    secondary: 'false',
    disabled: 'false',
  },
  sortFocus: {
    default: 'false',
  },
  divider: { default: '#AAAAAAaa' },
} as Partial<ITheme>)

export const dataTableStyles: IDataTableStyles = {
  headCells: {
    style: {
      fontSize: '18px',
    },
  },
  rows: {
    style: {
      fontSize: '16x',
    },
  },
}

const grommetCustomTheme: ThemeType = {
  button: {
    primary: {
      background: {
        dark: 'red',
        light: 'green',
      },
    },
    // default: {
    //   background: {
    //     dark: '#7D4CDB',
    //     light: '#7D4CDB',
    //   },
    // },
  },
  global: {
    colors: {
      oasisIndigo: '#310081',
      oasisMinty: '#4CD4A9',
      oasisLightGray: '#ececec',
      brand: {
        light: '#0092f6',
        dark: '#0092f6bb',
      },
      oasisBlue2: '#4db3f9',
      oasisBlue3: '#26a2f8',
      'status-ok': '#4cd4a9',
      'status-error': '#ff4212',
      'status-warning': '#f4ce4b',
      'background-oasis-blue': {
        dark: '#0f477b',
        light: '#0092f6',
      },
      neutral: {
        dark: '#310081FF',
        light: '#310081FF',
      },
      'neutral-2': {
        dark: '#0092f6bb',
        light: '#0092f6bb',
      },
      'background-back': {
        dark: '#1A1A2e',
        light: '#EFEFEF',
      },
      'background-front': {
        dark: '#16213e',
        light: '#FFFFFF',
      },
      'background-front-lighter': {
        dark: '#222938',
        light: '#FFFFFF',
      },
      'background-front-border': {
        dark: '#111111',
        light: '#EDEDED',
      },
      'background-contrast': {
        dark: '#FFFFFF08',
        light: '#11111108',
      },
      'background-contrast-2': {
        dark: '#FFFFFF33',
        light: '#11111133',
      },
      'background-custom': {
        dark: '#0E5265',
        light: '#00C8FF',
      },
      'component-toolbar': {
        dark: '#0f346088',
        light: '#26a2f844',
      },
      'component-sidebar': {
        dark: '#16213e',
        light: '#fafafa',
      },
      'successful-label': {
        dark: '#6FFFB0',
        light: '#3fa900',
      },
    },
    font: {
      family: 'Rubik',
    },
    opacity: {
      weak: 0.25,
    },
  },
}
export const ThemeProvider = (props: { children: React.ReactChild }) => {
  const theme = deepMerge(grommet, grommetCustomTheme)
  const mode = useSelector(selectTheme)

  return (
    <Grommet theme={theme} themeMode={mode} style={{ minHeight: '100vh' }}>
      {React.Children.only(props.children)}
    </Grommet>
  )
}
