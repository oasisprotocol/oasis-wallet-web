import { useContext } from 'react'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Box } from 'grommet/es6/components/Box'
import { ThemeSelect } from 'app/components/ThemeSwitcher'
import { LanguageSelect } from 'app/components/LanguageSelect'
import { Footer } from 'app/components/Footer'

export const Settings = () => {
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <Box gap="small" style={{ flex: 1, justifyContent: 'space-between' }}>
      <Box>
        <LanguageSelect />
        <ThemeSelect />
      </Box>
      {isMobile && <Footer />}
    </Box>
  )
}
