'use client'

import { ReactNode } from 'react'
import { Box, CssBaseline } from '@mui/material'
import Header from './Header'
import ProtectedPage from '../wrappers/protected-page'
import AppTheme from '../theme/AppTheme'
import { chartsCustomizations } from '../theme/customizations/charts'
import { dataGridCustomizations } from '../theme/customizations/dataGrid'
import { treeViewCustomizations } from '../theme/customizations/treeView'
import { datePickersCustomizations } from '../theme/customizations/datePickers'
import { useTheme } from '@mui/system'

const DRAWER_WIDTH = 280

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations
}

function BaseLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <div suppressHydrationWarning>
      <ProtectedPage>
        <AppTheme themeComponents={xThemeComponents}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Box
              component='main'
              sx={{
                flexGrow: 1,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
                boxSizing: 'border-box',
                p: 2,
                backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default'
              }}>
              <Header />
              <Box
                sx={{
                  width: '100%',
                  overflow: 'auto',
                  flex: 1
                }}>
                {children}
              </Box>
            </Box>
          </Box>
        </AppTheme>
      </ProtectedPage>
    </div>
  )
}

export default BaseLayout
