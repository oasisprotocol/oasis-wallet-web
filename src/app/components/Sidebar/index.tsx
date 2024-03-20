import { selectAddress, selectHasAccounts } from 'app/state/wallet/selectors'
import { Avatar } from 'grommet/es6/components/Avatar'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Layer } from 'grommet/es6/components/Layer'
import { Menu } from 'grommet/es6/components/Menu'
import { Nav } from 'grommet/es6/components/Nav'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Sidebar as GSidebar } from 'grommet/es6/components/Sidebar'
import { Text } from 'grommet/es6/components/Text'
import { Tip } from 'grommet/es6/components/Tip'
import { Github } from 'grommet-icons/es6/icons/Github'
import { FormDown } from 'grommet-icons/es6/icons/FormDown'
import { Home } from 'grommet-icons/es6/icons/Home'
import { Inherit } from 'grommet-icons/es6/icons/Inherit'
import { LineChart } from 'grommet-icons/es6/icons/LineChart'
import { Lock } from 'grommet-icons/es6/icons/Lock'
import { Logout } from 'grommet-icons/es6/icons/Logout'
import { Menu as MenuIcon } from 'grommet-icons/es6/icons/Menu'
import { Money } from 'grommet-icons/es6/icons/Money'
import { CreditCard } from 'grommet-icons/es6/icons/CreditCard'
import * as React from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Language } from '../../../styles/theme/icons/language/Language'
import { useParaTimesNavigation } from 'app/pages/ParaTimesPage/useParaTimesNavigation'
import { ThemeSwitcher } from '../ThemeSwitcher'
import logotype from '../../../../public/logo192.png'
import { languageLabels } from '../../../locales/i18n'
import { selectIsLockableOrCloseable } from 'app/state/selectIsLockableOrCloseable'
import { persistActions } from 'app/state/persist'
import { IS_FIAT_ONRAMP_ENABLED } from '../../pages/FiatOnrampPage/isEnabled'
import {
  sidebarSmallSizeLogo,
  sidebarMediumSizeLogo,
  mobileToolbarZIndex,
} from '../../../styles/theme/elementSizes'

const SidebarTooltip = (props: { children: React.ReactNode; isActive: boolean; label: string }) => {
  const size = useContext(ResponsiveContext)
  const isMediumSize = size === 'medium'
  const tooltip = (
    <Box
      pad={{ vertical: 'small', right: 'medium' }}
      margin="none"
      background={props.isActive ? 'background-oasis-blue' : 'component-sidebar'}
      round={{ size: 'medium', corner: 'right' }}
    >
      {props.label}
    </Box>
  )
  return (
    <Tip content={isMediumSize ? tooltip : undefined} dropProps={{ align: { left: 'right' } }} plain={true}>
      {props.children}
    </Tip>
  )
}

interface SidebarButtonBaseProps {
  needsWalletOpen?: boolean
  icon: JSX.Element
  label: string
}

type SidebarButtonProps = SidebarButtonBaseProps &
  (
    | { route: string; newTab?: boolean; onClick?: undefined }
    | {
        route?: undefined
        newTab?: undefined
        onClick: React.MouseEventHandler<HTMLButtonElement> & React.MouseEventHandler<HTMLAnchorElement>
      }
  )

export const SidebarButton = ({
  needsWalletOpen,
  icon,
  label,
  route,
  newTab,
  onClick,
  ...rest
}: SidebarButtonProps) => {
  const walletHasAccounts = useSelector(selectHasAccounts)
  const size = useContext(ResponsiveContext)
  const location = useLocation()
  const isActive = route ? route === location.pathname : false
  const isMediumSize = size === 'medium'

  if (!walletHasAccounts && needsWalletOpen) {
    return null
  }

  const component = (
    <Box
      pad={{ vertical: 'small', left: isMediumSize ? 'none' : 'medium' }}
      background={isActive ? 'background-oasis-blue' : undefined}
      responsive={false}
      direction="row"
      gap="medium"
      justify={isMediumSize ? 'center' : 'start'}
    >
      {/* eslint-disable-next-line no-restricted-syntax -- icon is not a plain text node */}
      {icon}
      {!isMediumSize && <Text>{label}</Text>}
    </Box>
  )

  if (route) {
    const isAbsoluteUrl =
      route.startsWith('https://') || route.startsWith('http://') || route.startsWith('//')
    if (!newTab && isAbsoluteUrl) {
      throw new Error('Must use newTab with absolute URLs. React-router Link component uses relative routes.')
    }

    return (
      <SidebarTooltip label={label} isActive={isActive}>
        {newTab ? (
          <a aria-label={label} href={route} target="_blank" rel="noopener" {...rest}>
            {component}
          </a>
        ) : (
          <NavLink aria-label={label} to={route} {...rest}>
            {component}
          </NavLink>
        )}
      </SidebarTooltip>
    )
  } else {
    return (
      <SidebarTooltip label={label} isActive={isActive}>
        <Button a11yTitle={label} fill="horizontal" onClick={onClick} {...rest}>
          {component}
        </Button>
      </SidebarTooltip>
    )
  }
}

type Size = 'small' | 'medium' | 'large'

interface SidebarHeaderProps {
  size: Size
}

interface SidebarFooterProps {
  size: Size
}

const SidebarHeader = (props: SidebarHeaderProps) => {
  const size = props.size
  const sizeLogo = {
    small: `${sidebarSmallSizeLogo}px`,
    medium: `${sidebarMediumSizeLogo}px`,
    large: 'medium',
  }

  return (
    <Box
      align="center"
      margin={{ bottom: size !== 'small' ? 'medium' : undefined }}
      pad="medium"
      alignSelf={size === 'large' ? undefined : 'center'}
    >
      <Link to="/">
        <Box align="center" direction="row" gap="small">
          <Avatar src={logotype} size={sizeLogo[size]} />
          {size !== 'medium' && <Text>ROSE Wallet</Text>}
        </Box>
      </Link>
    </Box>
  )
}

const SidebarFooter = (props: SidebarFooterProps) => {
  const { t, i18n } = useTranslation()
  const size = props.size
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLockableOrCloseable = useSelector(selectIsLockableOrCloseable)

  const setLanguage = (ln: string) => {
    i18n.changeLanguage(ln)
  }

  const closeWallet = () => {
    navigate('/')
    dispatch(persistActions.lockAsync())
  }
  const lockProfile = () => {
    dispatch(persistActions.lockAsync())
  }

  return (
    <Nav gap="small">
      {!isLockableOrCloseable && <ThemeSwitcher />}
      {isLockableOrCloseable === 'closeable' && (
        <SidebarButton
          icon={<Logout />}
          label={t('menu.closeWallet', 'Close wallet')}
          onClick={() => closeWallet()}
        />
      )}
      {isLockableOrCloseable === 'unlockable' && (
        <SidebarButton
          icon={<Logout />}
          label={t('menu.unlockProfile', 'Unlock profile')}
          onClick={() => closeWallet()}
        />
      )}
      {isLockableOrCloseable === 'lockable' && (
        <SidebarButton
          icon={<Lock />}
          label={t('menu.lockProfile', 'Lock profile')}
          onClick={() => lockProfile()}
        />
      )}

      {size === 'small' && (
        <SidebarTooltip label="Language" isActive={false}>
          <Box pad="small" align="start">
            <Menu
              hoverIndicator={false}
              dropProps={{ align: { bottom: 'bottom', left: 'left' } }}
              items={languageLabels.map(([key, label]) => ({
                label: label,
                onClick: () => setLanguage(key),
              }))}
              a11yTitle="Language"
            >
              <Box direction="row">
                <Box pad="small">
                  <Language />
                </Box>
                <Box pad="small" flex="grow">
                  {/* Intentionally not translated */}
                  <Text>Language</Text>
                </Box>
                <Box pad="small">
                  <FormDown />
                </Box>
              </Box>
            </Menu>
          </Box>
        </SidebarTooltip>
      )}
      <SidebarButton
        icon={<Github />}
        label="GitHub"
        route="https://github.com/oasisprotocol/oasis-wallet-web"
        newTab
      ></SidebarButton>
    </Nav>
  )
}

function SidebarMenuItems() {
  const address = useSelector(selectAddress)
  const { t } = useTranslation()
  const { getParaTimesRoutePath, paraTimesRouteLabel } = useParaTimesNavigation()
  const menu = {
    home: <SidebarButton icon={<Home />} label={t('menu.home', 'Home')} route="/" data-testid="nav-home" />,
    wallet: (
      <SidebarButton
        icon={<Money />}
        label={t('menu.wallet', 'Wallet')}
        needsWalletOpen={true}
        route={`/account/${address}`}
        data-testid="nav-myaccount"
      />
    ),
    stake: (
      <SidebarButton
        icon={<LineChart />}
        label={t('menu.stake', 'Stake')}
        needsWalletOpen={true}
        route={`/account/${address}/stake`}
        data-testid="nav-stake"
      />
    ),
    paraTimes: (
      <SidebarButton
        icon={<Inherit />}
        label={paraTimesRouteLabel}
        needsWalletOpen={true}
        route={getParaTimesRoutePath(address!)}
        data-testid="nav-paratime"
      />
    ),
    fiatOnramp: (
      <SidebarButton
        icon={<CreditCard />}
        label={t('menu.fiatOnramp', 'Buy')}
        needsWalletOpen={true}
        route={`/account/${address}/fiat`}
      />
    ),
  }

  return (
    <Nav gap="small" pad="none">
      {menu.home}
      {menu.wallet}
      {menu.stake}
      {menu.paraTimes}
      {/* eslint-disable-next-line no-restricted-syntax -- menu.fiatOnramp is not a plain text node */}
      {IS_FIAT_ONRAMP_ENABLED && menu.fiatOnramp}
    </Nav>
  )
}

export function Sidebar() {
  const size = useContext(ResponsiveContext) as Size

  return (
    <GSidebar
      background="component-sidebar"
      header={size !== 'small' ? <SidebarHeader size={size} /> : undefined}
      footer={<SidebarFooter size={size} />}
      pad={{ left: 'none', right: 'none', vertical: 'medium' }}
      gap="small"
      width={size === 'medium' ? undefined : '220px'}
    >
      <SidebarMenuItems />
    </GSidebar>
  )
}

export function Navigation() {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)
  const [sidebarVisible, setSidebarVisible] = React.useState(false)
  const isLockableOrCloseable = useSelector(selectIsLockableOrCloseable)
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const location = useLocation()
  React.useEffect(() => {
    // If the location changed, hide the sidebar
    setSidebarVisible(false)
  }, [location])
  const hasMenuOnRightSide = !isLockableOrCloseable || isLockableOrCloseable === 'unlockable'

  return (
    <>
      {size === 'small' && (
        <Box
          background="background-front"
          border={{ color: 'background-contrast', side: 'bottom' }}
          height="64px"
          fill="horizontal"
          direction="row"
          style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: mobileToolbarZIndex,
            flexDirection: hasMenuOnRightSide ? 'row-reverse' : 'row',
            justifyContent: hasMenuOnRightSide ? 'space-between' : 'flex-start',
          }}
        >
          {hasMenuOnRightSide && (
            <Button
              onClick={() => toggleSidebar()}
              a11yTitle={t('menu.openMenu', 'Menu')}
              icon={<MenuIcon />}
              focusIndicator={false}
            />
          )}
          <Box justify="center">
            <SidebarHeader size="small" />
          </Box>
        </Box>
      )}
      {size === 'small' && sidebarVisible && (
        <Layer
          position="right"
          onClickOutside={toggleSidebar}
          onEsc={toggleSidebar}
          full="vertical"
          modal
          animation="slide"
          responsive={false}
        >
          <Sidebar />
        </Layer>
      )}
      {size !== 'small' && <Sidebar />}
    </>
  )
}
