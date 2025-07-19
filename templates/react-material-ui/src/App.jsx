import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Paper,
  Chip,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Speed as SpeedIcon,
  Palette as PaletteIcon,
  Build as BuildIcon
} from '@mui/icons-material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* App Bar */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {{Project Name}}
            </Typography>
            <Chip label="Material-UI" color="secondary" size="small" />
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Header */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom>
                  Welcome to {{Project Name}}
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  A modern React application with Material-UI
                </Typography>
              </Paper>
            </Grid>

            {/* Counter Card */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Interactive Counter
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, my: 2 }}>
                    <IconButton
                      color="error"
                      onClick={() => setCount(count - 1)}
                      size="large"
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h3" component="span">
                      {count}
                    </Typography>
                    <IconButton
                      color="success"
                      onClick={() => setCount(count + 1)}
                      size="large"
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setCount(0)}
                    size="small"
                  >
                    Reset
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Features Card */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Features
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SpeedIcon color="primary" />
                        <Typography variant="body1">
                          Fast Development with Vite
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaletteIcon color="secondary" />
                        <Typography variant="body1">
                          Material-UI Components
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BuildIcon color="action" />
                        <Typography variant="body1">
                          ESLint, Prettier & Husky
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Getting Started */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Getting Started
                </Typography>
                <Typography variant="body1" paragraph>
                  This template includes React, Vite, and Material-UI. Start building your amazing application!
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" sx={{ mr: 1 }}>
                    Get Started
                  </Button>
                  <Button variant="outlined">
                    Learn More
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App 