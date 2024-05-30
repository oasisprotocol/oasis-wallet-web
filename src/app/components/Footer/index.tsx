import { Anchor } from 'grommet/es6/components/Anchor'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import React, { memo, useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { selectHasAccounts } from 'app/state/wallet/selectors'
import { intlDateTimeFormat } from '../DateFormatter/intlDateTimeFormat'
import { backend } from 'vendors/backend'
import { BackendAPIs } from 'config'
import { MobileFooterNavigation } from '../MobileFooterNavigation'
import { mobileFooterNavigationHeight } from '../../../styles/theme/elementSizes'
import { Button } from 'grommet/es6/components/Button'

const githubLink = 'https://github.com/oasisprotocol/oasis-wallet-web/'
const githubReleaseLink = (tag: string) => `${githubLink}releases/tag/${tag}`
const buildTime =
  process.env.REACT_APP_BUILD_DATETIME &&
  `${intlDateTimeFormat(Number(process.env.REACT_APP_BUILD_DATETIME))}`

function NoReleaseLink() {
  return <>-</>
}

export const Footer = memo(() => {
  const walletHasAccounts = useSelector(selectHasAccounts)
  const isMobile = React.useContext(ResponsiveContext) === 'small'
  const { t } = useTranslation()
  const [showCommitLink, setShowCommitLink] = useState(false)

  const toggleCommitLink = () => {
    setShowCommitLink(!showCommitLink)
  }

  const backendToLabel = {
    [BackendAPIs.OasisMonitor]: t(
      'footer.poweredBy.oasismonitor',
      'Powered by Oasis Monitor API & Oasis gRPC',
    ),
    [BackendAPIs.OasisScan]: t('footer.poweredBy.oasisscan', 'Powered by Oasis Scan API & Oasis gRPC'),
  }
  const poweredByLabel = backendToLabel[backend()]
  const responsiveSize = isMobile ? 'small' : 'medium'

  return (
    <Box
      as="footer"
      direction="column"
      justify="center"
      align="center"
      round="5px"
      pad={{
        horizontal: 'medium',
        top: isMobile ? '1rem' : 'medium',
        bottom: isMobile && walletHasAccounts ? mobileFooterNavigationHeight : 'none',
      }}
      margin={{ bottom: 'large' }}
    >
      <Text size={responsiveSize} textAlign="center" margin={{ bottom: isMobile ? 'small' : 'none' }}>
        <Trans
          i18nKey="footer.github"
          t={t}
          components={{
            GithubLink: <Anchor href={githubLink} target="_blank" rel="noopener noreferrer" />,
          }}
          defaults="ROSE Wallet is fully <GithubLink>open source</GithubLink>"
        />
        {poweredByLabel && (
          <Box margin={{ right: 'xsmall', left: 'xsmall' }} style={{ display: 'inline-block' }}>
            {poweredByLabel}
          </Box>
        )}
      </Text>
      {process.env.REACT_APP_BUILD_DATETIME && process.env.REACT_APP_BUILD_SHA && (
        <Text size="small" textAlign="center" margin={{ top: 'small' }}>
          <span>
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
          </span>
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
              CommitLink: (
                <span>
                  <Button
                    onClick={toggleCommitLink}
                    label={
                      showCommitLink
                        ? t('footer.hideDetails', '[hide details]')
                        : t('footer.showDetails', '[show details]')
                    }
                    plain
                    color="link"
                  />
                  <span>
                    {showCommitLink && process.env.REACT_APP_BUILD_SHA && (
                      <span>
                        <br />
                        (commit:
                        <Anchor
                          href={`${githubLink}commit/${process.env.REACT_APP_BUILD_SHA}`}
                          label={process.env.REACT_APP_BUILD_SHA.substring(0, 7)}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                        ) built at {buildTime}
                      </span>
                    )}
                  </span>
                </span>
              ),
            }}
            defaults="Version: <ReleaseLink/> <CommitLink/>"
          />
        </Text>
      )}
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
    </Box>
  )
})

export const PageFooter = () => {
  const isMobile = useContext(ResponsiveContext) === 'small'
  const walletHasAccounts = useSelector(selectHasAccounts)

  return (
    <>
      {walletHasAccounts && isMobile ? (
        // Footer for opened wallet is rendered in Settings tab in Profile dropdown
        <Box pad="xlarge">
          <MobileFooterNavigation />
        </Box>
      ) : (
        <Footer />
      )}
    </>
  )
}
