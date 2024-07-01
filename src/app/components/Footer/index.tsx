import { Anchor } from 'grommet/es6/components/Anchor'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import React, { memo, useContext } from 'react'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { selectHasAccounts } from 'app/state/wallet/selectors'
import { intlDateTimeFormat } from '../DateFormatter/intlDateTimeFormat'
import { backend } from 'vendors/backend'
import { BackendAPIs } from 'config'
import { mobileFooterNavigationHeight } from '../../../styles/theme/elementSizes'
import { t } from 'i18next'

const githubLink = 'https://github.com/oasisprotocol/oasis-wallet-web/'
const githubReleaseLink = (tag: string) => `${githubLink}releases/tag/${tag}`

function NoReleaseLink() {
  return <>-</>
}

export const Footer = memo(() => {
  const walletHasAccounts = useSelector(selectHasAccounts)
  const responsiveContext = useContext(ResponsiveContext)
  const isMobileOrTablet = responsiveContext === 'small' || responsiveContext === 'medium'
  const { t } = useTranslation()

  const backendToLabel = {
    [BackendAPIs.OasisMonitor]: t('footer.poweredBy.oasismonitor', 'Oasis Monitor API & Oasis gRPC'),
    [BackendAPIs.OasisScan]: t('footer.poweredBy.oasisscan', 'Oasis Scan API & Oasis gRPC'),
  }
  const poweredByLabel = backendToLabel[backend()]

  return (
    <Box
      as="footer"
      direction={isMobileOrTablet ? 'column' : 'row'}
      justify={isMobileOrTablet ? 'center' : 'between'}
      align="center"
      round="5px"
      pad={{
        horizontal: 'medium',
        top: isMobileOrTablet ? '1rem' : 'medium',
        bottom: isMobileOrTablet && walletHasAccounts ? mobileFooterNavigationHeight : 'none',
      }}
      margin={{ bottom: 'large' }}
      data-testid="footer"
      gap={isMobileOrTablet ? '0' : '20px'}
    >
      <Box style={{ flex: 1, alignSelf: isMobileOrTablet ? 'center ' : 'flex-start' }}>
        <Text
          size="small"
          textAlign={isMobileOrTablet ? 'center' : 'start'}
          margin={{ bottom: isMobileOrTablet ? 'small' : 'none' }}
          style={{ display: 'inline-flex', flexDirection: isMobileOrTablet ? 'column' : 'row' }}
        >
          <span>
            <Trans
              i18nKey="footer.github"
              t={t}
              components={{
                GithubLink: <Anchor href={githubLink} target="_blank" rel="noopener noreferrer" />,
              }}
              values={{
                poweredBy: poweredByLabel,
              }}
              defaults="ROSE Wallet is <GithubLink>open source</GithubLink> and powered by"
            />
            {isMobileOrTablet ? <br /> : <span> </span>}
            <span>{poweredByLabel}</span>
          </span>
        </Text>
      </Box>
      {process.env.REACT_APP_BUILD_DATETIME && process.env.REACT_APP_BUILD_SHA && (
        <Box style={{ flex: 1, alignSelf: isMobileOrTablet ? 'center ' : 'flex-start' }}>
          <Text
            size="small"
            textAlign={isMobileOrTablet ? 'center' : 'end'}
            margin={{ top: isMobileOrTablet ? 'small' : 'none' }}
          >
            {isMobileOrTablet ? (
              <>
                <TermsAndConditions />
                <Version />
              </>
            ) : (
              <>
                <Version />
                <TermsAndConditions />
              </>
            )}
          </Text>
        </Box>
      )}
      {isMobileOrTablet && (
        <Text size="small" textAlign="center" margin={{ top: 'small' }}>
          <Trans
            i18nKey="footer.feedback"
            t={t}
            components={{
              EmailLink: <Anchor href="mailto:wallet@oasisprotocol.org" />,
            }}
            defaults="We’d love your feedback at <EmailLink>wallet@oasisprotocol.org</EmailLink>"
          />
        </Text>
      )}
    </Box>
  )
})

const TermsAndConditions = () => {
  const responsiveContext = useContext(ResponsiveContext)
  const isMobileOrTablet = responsiveContext === 'small' || responsiveContext === 'medium'

  return (
    <Box style={{ display: 'inline-flex', flexDirection: isMobileOrTablet ? 'row' : 'row-reverse' }}>
      <Trans
        i18nKey="footer.terms"
        t={t}
        components={{
          TermsLink: (
            <Anchor href="https://wallet.oasis.io/t-c.pdf" target="_blank" rel="noopener noreferrer" />
          ),
        }}
        defaults="<TermsLink>Terms and Conditions</TermsLink>"
      />
      <Box margin={{ right: 'xsmall', left: 'xsmall' }} style={{ display: 'inline-block' }}>
        |
      </Box>
    </Box>
  )
}

const Version = () => {
  const responsiveContext = useContext(ResponsiveContext)
  const isMobileOrTablet = responsiveContext === 'small' || responsiveContext === 'medium'

  if (!process.env.REACT_APP_BUILD_SHA) {
    return null
  }

  return (
    <span>
      <Trans
        i18nKey="footer.version"
        t={t}
        components={{
          ReleaseLink: process.env.REACT_APP_BUILD_VERSION ? (
            <Anchor
              href={githubReleaseLink(process.env.REACT_APP_BUILD_VERSION)}
              label={process.env.REACT_APP_BUILD_VERSION.replace('v', '')}
              target="_blank"
              rel="noopener noreferrer"
            />
          ) : (
            <NoReleaseLink />
          ),
        }}
        values={{
          buildTime: intlDateTimeFormat(Number(process.env.REACT_APP_BUILD_DATETIME)),
        }}
        defaults="Version: <ReleaseLink/>"
      />
      {isMobileOrTablet ? <br /> : <span> </span>}
      <Trans
        i18nKey="footer.buildDetails"
        t={t}
        components={{
          CommitLink: (
            <Anchor
              href={`${githubLink}commit/${process.env.REACT_APP_BUILD_SHA}`}
              label={process.env.REACT_APP_BUILD_SHA.substring(0, 7)}
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
        }}
        values={{
          buildTime: intlDateTimeFormat(Number(process.env.REACT_APP_BUILD_DATETIME)),
        }}
        defaults="(commit: <CommitLink/>) built at {{buildTime}}"
      />
    </span>
  )
}
