import { useState } from 'react'
import styled from 'styled-components'

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
`

const MainContent = styled.main`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`

const Section = styled.section`
  margin-bottom: 2rem;
`

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`

const Description = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
`

const CounterCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`

const CounterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 1rem;
`

const CounterDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
`

const CounterValue = styled.span`
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  min-width: 3rem;
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

const PrimaryButton = styled(Button)`
  background: #007bff;
  color: white;
  
  &:hover {
    background: #0056b3;
  }
`

const DangerButton = styled(Button)`
  background: #dc3545;
  color: white;
  
  &:hover {
    background: #c82333;
  }
`

const SuccessButton = styled(Button)`
  background: #28a745;
  color: white;
  
  &:hover {
    background: #218838;
  }
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`

const FeatureCard = styled.div`
  background: ${props => props.bgColor || '#f8f9fa'};
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

const FeatureTitle = styled.h4`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`

const FeatureDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`

const Footer = styled.footer`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2rem;
`

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppContainer>
      <Container>
        {/* Header */}
        <Header>
          <Title>Welcome to {{Project Name}}</Title>
          <Subtitle>A modern React application with Styled Components</Subtitle>
        </Header>

        {/* Main Content */}
        <MainContent>
          <Section>
            <SectionTitle>Getting Started</SectionTitle>
            <Description>
              This template includes React, Vite, and Styled Components. Start building your amazing application!
            </Description>
          </Section>

          {/* Counter Example */}
          <CounterCard>
            <CounterTitle>Interactive Counter</CounterTitle>
            <CounterDisplay>
              <DangerButton onClick={() => setCount(count - 1)}>
                -
              </DangerButton>
              <CounterValue>{count}</CounterValue>
              <SuccessButton onClick={() => setCount(count + 1)}>
                +
              </SuccessButton>
            </CounterDisplay>
            <PrimaryButton onClick={() => setCount(0)}>
              Reset
            </PrimaryButton>
          </CounterCard>

          {/* Features */}
          <Section>
            <SectionTitle>Features</SectionTitle>
            <FeaturesGrid>
              <FeatureCard bgColor="#e3f2fd">
                <FeatureIcon>⚡</FeatureIcon>
                <FeatureTitle>Fast Development</FeatureTitle>
                <FeatureDescription>
                  Hot module replacement and fast refresh for rapid development
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard bgColor="#f3e5f5">
                <FeatureIcon>🎨</FeatureIcon>
                <FeatureTitle>Styled Components</FeatureTitle>
                <FeatureDescription>
                  CSS-in-JS styling with component-based architecture
                </FeatureDescription>
              </FeatureCard>
              <FeatureCard bgColor="#e8f5e8">
                <FeatureIcon>🔧</FeatureIcon>
                <FeatureTitle>Modern Tooling</FeatureTitle>
                <FeatureDescription>
                  ESLint, Prettier, and Husky for code quality
                </FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </Section>
        </MainContent>

        {/* Footer */}
        <Footer>
          <p>Built with ❤️ using React + Styled Components</p>
        </Footer>
      </Container>
    </AppContainer>
  )
}

export default App 