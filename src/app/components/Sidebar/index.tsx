import { walletActions } from 'app/state/wallet'
import { selectAddress, selectIsOpen } from 'app/state/wallet/selectors'
import {
  Avatar,
  Box,
  Button,
  Layer,
  Menu,
  Nav,
  ResponsiveContext,
  Sidebar as GSidebar,
  Text,
  Tip,
} from 'grommet'
import { Github, FormDown, Home, LineChart, Logout, Menu as MenuIcon, Money } from 'grommet-icons'
import * as React from 'react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Language } from '../../../styles/theme/icons/language/Language'
import { ThemeSwitcher } from '../ThemeSwitcher'
import logotype from '../../../../public/logo192.png'
import { languageLabels } from '../../../locales/i18n'
import { SettingsButton } from '../SettingsButton'

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
  const walletIsOpen = useSelector(selectIsOpen)
  const size = useContext(ResponsiveContext)
  const location = useLocation()
  const isActive = route ? route === location.pathname : false
  const isMediumSize = size === 'medium'

  if (!walletIsOpen && needsWalletOpen) {
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

export const smallSizeLogo = 30
export const mediumSizeLogo = 40

const SidebarHeader = (props: SidebarHeaderProps) => {
  const size = props.size
  const sizeLogo = {
    small: `${smallSizeLogo}px`,
    medium: `${mediumSizeLogo}px`,
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
          {size !== 'medium' && <Text>Oasis Wallet</Text>}
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

  const setLanguage = (ln: string) => {
    i18n.changeLanguage(ln)
  }

  const logout = () => {
    dispatch(walletActions.closeWallet())
    navigate('/')
  }

  return (
    <Nav gap="small">
      <ThemeSwitcher />
      <SidebarButton
        icon={<Logout />}
        label={t('menu.closeWallet', 'Close wallet')}
        needsWalletOpen={true}
        onClick={() => logout()}
      />

      <SidebarTooltip label="Language" isActive={false}>
        <Box pad="small" align={size === 'medium' ? 'center' : 'start'}>
          <Menu
            hoverIndicator={false}
            dropProps={{ align: { bottom: 'bottom', left: 'left' } }}
            items={languageLabels.map(([key, label]) => ({ label: label, onClick: () => setLanguage(key) }))}
          >
            <Box direction="row">
              <Box pad="small">
                <Language />
              </Box>
              {size !== 'medium' && (
                <>
                  <Box pad="small" flex="grow">
                    <Text>Language</Text>
                  </Box>
                  <Box pad="small">
                    <FormDown />
                  </Box>
                </>
              )}
            </Box>
          </Menu>
        </Box>
      </SidebarTooltip>
      <SettingsButton />
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
  }

  // Normal
  return (
    <Nav gap="small" pad="none">
      {menu.home}
      {menu.wallet}
      {menu.stake}
    </Nav>
  )
}

export function Sidebar() {
  const size = useContext(ResponsiveContext) as Size

  return (
    <GSidebar
      background="component-sidebar"
      header={<SidebarHeader size={size} />}
      footer={<SidebarFooter size={size} />}
      pad={{ left: 'none', right: 'none', vertical: 'medium' }}
      gap="small"
      width={size === 'medium' ? undefined : '220px'}
    >
      <SidebarMenuItems />
    </GSidebar>
  )
}

export const mobileHeaderZIndex = 3

export function Navigation() {
  const size = useContext(ResponsiveContext)
  const [sidebarVisible, setSidebarVisible] = React.useState(false)
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible)
  }

  const location = useLocation()
  React.useEffect(() => {
    // If the location changed, hide the sidebar
    setSidebarVisible(false)
  }, [location])

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
            zIndex: mobileHeaderZIndex,
          }}
        >
          <Button onClick={() => toggleSidebar()} icon={<MenuIcon />} focusIndicator={false} />
          <Box justify="center">
            <SidebarHeader size="small" />
          </Box>
        </Box>
      )}
      {size === 'small' && sidebarVisible && (
        <Layer
          position="left"
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
