import { useState } from 'react'
import {
  Container,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#28a745',
    },
  },
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              mb: 2
            }}>
              Welcome to {{Project Name}}
            </Typography>
            <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              A modern React application with Material-UI
            </Typography>
          </Box>

          {/* Main Content */}
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            mb: 4
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* Getting Started */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ mb: 2, color: '#333' }}>
                  Getting Started
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                  This template includes React, Vite, and Material-UI. Start building your amazing application!
                </Typography>
              </Box>

              {/* Counter Example */}
              <Card sx={{ 
                bgcolor: '#f8f9fa', 
                borderRadius: 2, 
                mb: 4,
                textAlign: 'center'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, color: '#333' }}>
                    Interactive Counter
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 2, 
                    mb: 2 
                  }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setCount(count - 1)}
                      sx={{ minWidth: '48px', height: '48px' }}
                    >
                      -
                    </Button>
                    <Typography variant="h3" component="span" sx={{ 
                      fontWeight: 'bold', 
                      color: '#333',
                      minWidth: '3rem'
                    }}>
                      {count}
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => setCount(count + 1)}
                      sx={{ minWidth: '48px', height: '48px' }}
                    >
                      +
                    </Button>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => setCount(0)}
                  >
                    Reset
                  </Button>
                </CardContent>
              </Card>

              {/* Features */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" component="h2" sx={{ mb: 3, color: '#333' }}>
                  Features
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ 
                      bgcolor: '#e3f2fd', 
                      borderRadius: 2,
                      textAlign: 'center',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h3" sx={{ mb: 1 }}>⚡</Typography>
                        <Typography variant="h6" component="h4" sx={{ mb: 1, color: '#333' }}>
                          Fast Development
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          Hot module replacement and fast refresh for rapid development
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ 
                      bgcolor: '#f3e5f5', 
                      borderRadius: 2,
                      textAlign: 'center',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h3" sx={{ mb: 1 }}>🎨</Typography>
                        <Typography variant="h6" component="h4" sx={{ mb: 1, color: '#333' }}>
                          Material-UI
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          Beautiful and accessible React components
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ 
                      bgcolor: '#e8f5e8', 
                      borderRadius: 2,
                      textAlign: 'center',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h3" sx={{ mb: 1 }}>🔧</Typography>
                        <Typography variant="h6" component="h4" sx={{ mb: 1, color: '#333' }}>
                          Modern Tooling
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          ESLint, Prettier, and Husky for code quality
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
            <Typography variant="body1">
              Built with ❤️ using React + Material-UI
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App 