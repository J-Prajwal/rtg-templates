interface HeroLightProps {
  libraries?: string[];
}
export const HeroLight = ({ libraries = [{{RTG_LIBRARIES}}] }: HeroLightProps) => {
  return (
    <>
      <style>{`
        .hero-light-grid {
          background-image: 
            linear-gradient(to right, hsl(0 0% 90%) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(0 0% 90%) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
        
        .hero-light-gradient-bg {
          background: 
            radial-gradient(circle at 30% 20%, hsl(210 100% 97%) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, hsl(200 100% 96%) 0%, transparent 50%),
            linear-gradient(135deg, hsl(0 0% 99%) 0%, hsl(210 20% 98%) 30%, hsl(220 30% 97%) 70%, hsl(0 0% 99%) 100%);
        }
        
        .hero-light-gradient-primary {
          background: linear-gradient(135deg, hsl(200 100% 50%) 0%, hsl(220 100% 55%) 50%, hsl(280 100% 50%) 100%);
        }
        
        .hero-light-gradient-secondary {
          background: linear-gradient(135deg, hsl(300 100% 55%) 0%, hsl(320 100% 60%) 50%, hsl(260 100% 55%) 100%);
        }
        
        .hero-light-gradient-tertiary {
          background: linear-gradient(135deg, hsl(180 100% 45%) 0%, hsl(200 100% 50%) 50%, hsl(240 100% 55%) 100%);
        }
        
        .hero-light-gradient-accent {
          background: linear-gradient(135deg, hsl(200 100% 50% / 0.1), hsl(195 100% 55% / 0.1));
        }
        
        .hero-light-gradient-text {
          background: linear-gradient(135deg, hsl(200 100% 40%) 0%, hsl(220 100% 45%) 30%, hsl(280 100% 40%) 70%, hsl(320 100% 45%) 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 8s ease-in-out infinite;
        }
        
        .hero-light-glow-primary {
          box-shadow: 0 0 40px hsl(200 100% 50% / 0.2);
        }
        
        .hero-light-floating-1 {
          animation: hero-pulse 2s infinite;
        }
        
        .hero-light-floating-2 {
          animation: hero-pulse 2s infinite;
          animation-delay: 1s;
        }
        
        @keyframes hero-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-rotate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
        }
        
        .hero-light-button-hover:hover {
          box-shadow: 0 0 40px hsl(200 100% 50% / 0.2);
          transform: scale(1.05);
        }
        
        .hero-light-code-bg {
          background-color: hsl(0 0% 98%);
        }
        
        .hero-light-code-text {
          color: hsl(210 20% 25%);
        }
        
        .hero-light-code-keyword {
          color: hsl(220 90% 40%);
        }
        
        .hero-light-code-string {
          color: hsl(160 70% 35%);
        }
        
        .hero-light-transition-smooth {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Component-specific styles */
        .hero-light-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .hero-light-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, transparent 0%, hsl(0 0% 100% / 0.3) 70%);
          z-index: 1;
        }

        .hero-light-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          text-align: center;
          position: relative;
          z-index: 10;
        }
        
        .hero-light-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg at 50% 50%, transparent, hsl(200 100% 50% / 0.02), transparent, hsl(280 100% 55% / 0.02), transparent);
          animation: rotate 20s linear infinite;
          z-index: -1;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-light-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid hsl(200 100% 50% / 0.3);
          border-radius: 2rem;
          font-size: 0.875rem;
          color: hsl(200 100% 30%);
          background: linear-gradient(135deg, hsl(200 100% 50% / 0.08), hsl(280 100% 55% / 0.08));
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 20px hsl(200 100% 50% / 0.08), inset 0 1px 0 hsl(200 100% 50% / 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-light-badge:hover {
          background: linear-gradient(135deg, hsl(200 100% 50% / 0.15), hsl(280 100% 55% / 0.15));
          transform: translateY(-1px);
          box-shadow: 0 6px 25px hsl(200 100% 50% / 0.12), inset 0 1px 0 hsl(200 100% 50% / 0.2);
        }

        .hero-light-badge-icon {
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
          fill: currentColor;
        }

        .hero-light-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          text-shadow: 0 0 30px hsl(200 100% 50% / 0.2);
          background-size: 200% 200%;
        }

        .hero-light-subtitle {
          font-size: 1.25rem;
          color: hsl(215 25% 35%);
          margin-bottom: 1rem;
          max-width: 48rem;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-light-description {
          font-size: 1.125rem;
          color: hsl(215 25% 45%);
          margin-bottom: 2rem;
          max-width: 32rem;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-light-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .hero-light-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: none;
          font-size: 1rem;
        }

        .hero-light-button-primary {
          background: linear-gradient(135deg, hsl(200 100% 50%) 0%, hsl(220 100% 55%) 50%, hsl(280 100% 50%) 100%);
          color: white;
          border: 1px solid hsl(200 100% 45% / 0.3);
        }

        .hero-light-button-primary:hover {
          box-shadow: 0 0 40px hsl(200 100% 50% / 0.3), 0 0 80px hsl(280 100% 55% / 0.15);
          transform: scale(1.05) translateY(-2px);
        }

        .hero-light-button-outline {
          background: hsl(200 100% 50% / 0.03);
          color: hsl(200 100% 35%);
          border: 1px solid hsl(200 100% 50% / 0.2);
          backdrop-filter: blur(10px);
        }

        .hero-light-button-outline:hover {
          background: linear-gradient(135deg, hsl(200 100% 50% / 0.08), hsl(280 100% 55% / 0.08));
          box-shadow: 0 0 30px hsl(200 100% 50% / 0.2), 0 0 60px hsl(280 100% 55% / 0.1);
          transform: scale(1.05) translateY(-2px);
          border-color: hsl(200 100% 50% / 0.4);
        }

        .hero-light-button-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.5rem;
          fill: currentColor;
        }

        .hero-light-code-preview {
          max-width: 28rem;
          margin: 0 auto;
          padding: 1rem;
          border-radius: 1rem;
          border: 1px solid hsl(200 100% 50% / 0.2);
          backdrop-filter: blur(20px);
          background: linear-gradient(135deg, hsl(0 0% 98% / 0.9), hsl(210 20% 97% / 0.8));
          box-shadow: inset 0 1px 0 hsl(200 100% 50% / 0.05), 0 4px 20px hsl(200 100% 50% / 0.08);
        }

        .hero-light-code-dots {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .hero-light-code-dot {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
        }

        .hero-light-code-dot-red {
          background-color: hsl(0 84.2% 60.2%);
        }

        .hero-light-code-dot-yellow {
          background-color: hsl(47.9 95.8% 53.1%);
        }

        .hero-light-code-dot-blue {
          background-color: hsl(200 100% 50%);
        }

        .hero-light-code {
          font-size: 0.875rem;
          text-align: left;
          display: block;
          width: 100%;
        }
        
        .hero-light-code-line {
          display: block;
          margin: 0;
          line-height: 1.4;
        }
        
        .hero-light-code-line:not(:last-child) {
          margin-bottom: 0.25rem;
        }

        .hero-light-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 4rem;
          max-width: 32rem;
          margin-left: auto;
          margin-right: auto;
          padding: 1.5rem;
          background: linear-gradient(135deg, hsl(200 100% 50% / 0.03), hsl(280 100% 55% / 0.03));
          border-radius: 1rem;
          backdrop-filter: blur(20px);
          border: 1px solid hsl(200 100% 50% / 0.08);
        }

        .hero-light-stat {
          text-align: center;
        }

        .hero-light-stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }

        .hero-light-stat-number-primary {
          color: hsl(200 100% 40%);
        }

        .hero-light-stat-number-accent {
          color: hsl(47.9 95.8% 45%);
        }

        .hero-light-stat-label {
          font-size: 0.875rem;
          color: hsl(215 25% 45%);
        }

        .hero-light-background-grid {
          position: absolute;
          inset: 0;
          opacity: 0.3;
        }

        .hero-light-floating-element {
          position: absolute;
          border-radius: 50%;
          filter: blur(3rem);
        }

        .hero-light-floating-1 {
          top: 5rem;
          left: 5rem;
          width: 8rem;
          height: 8rem;
          animation: hero-pulse 4s infinite, float-rotate 20s linear infinite;
        }

        .hero-light-floating-2 {
          bottom: 5rem;
          right: 5rem;
          width: 10rem;
          height: 10rem;
          animation: hero-pulse 6s infinite, float-rotate 25s linear infinite reverse;
        }
        
        .hero-light-floating-3 {
          top: 60%;
          left: 10%;
          width: 6rem;
          height: 6rem;
          animation: hero-pulse 5s infinite, float-rotate 30s linear infinite;
        }
        
        .hero-light-floating-4 {
          top: 20%;
          right: 15%;
          width: 12rem;
          height: 12rem;
          animation: hero-pulse 7s infinite, float-rotate 35s linear infinite reverse;
          opacity: 0.5;
        }

        /* Responsive design */
        @media (min-width: 640px) {
          .hero-light-buttons {
            flex-direction: row;
          }
        }

        @media (min-width: 768px) {
          .hero-light-title {
            font-size: 4.5rem;
          }

          .hero-light-subtitle {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <section className="hero-light-section hero-light-gradient-bg">
        {/* Animated background grid */}
        <div className="hero-light-background-grid hero-light-grid" />

        {/* Floating elements */}
        <div className="hero-light-floating-element hero-light-gradient-primary hero-light-floating-1" />
        <div className="hero-light-floating-element hero-light-gradient-primary hero-light-floating-2" />
        <div className="hero-light-floating-element hero-light-gradient-secondary hero-light-floating-3" />
        <div className="hero-light-floating-element hero-light-gradient-tertiary hero-light-floating-4" />

        <div className="hero-light-container">
          <span className="hero-light-badge">
            <svg
              className="hero-light-badge-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
            </svg>
            Ready-to-Go Templates
          </span>

          <h1 className="hero-light-title hero-light-gradient-text">RTG-Template</h1>

          <p className="hero-light-subtitle">Production-level React & TypeScript boilerplates that save hours of setup time</p>

          <p className="hero-light-description">
            Skip the boring configuration. Start building amazing applications with pre-configured templates featuring the best UI libraries and development
            tools.
          </p>

          <div className="hero-light-buttons">
            <a 
              href="https://fe-rtg-templates.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hero-light-button hero-light-button-primary"
            >
              View Documentation
            </a>

            <a 
              href="https://www.npmjs.com/package/rtg-template" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hero-light-button hero-light-button-outline"
            >
              <svg className="hero-light-button-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.10-10.382h-3.456L12.04 19.17H5.113z" />
              </svg>
              View on NPM
            </a>
          </div>

          {/* Code preview */}
          <div className="hero-light-code-preview hero-light-code-bg hero-light-glow-primary">
            <div className="hero-light-code-dots">
              <div className="hero-light-code-dot hero-light-code-dot-red" />
              <div className="hero-light-code-dot hero-light-code-dot-yellow" />
              <div className="hero-light-code-dot hero-light-code-dot-blue" />
            </div>
            <code className="hero-light-code hero-light-code-text">
              <div className="hero-light-code-line">
                <span style={{ color: "hsl(215 25% 45%)" }}>$</span> <span className="hero-light-code-keyword">npm</span>{" "}
                <span className="hero-light-code-string">install</span> <span style={{ color: "hsl(210 20% 20%)" }}>rtg-template</span>
              </div>
              {libraries.map((lib, index) => (
                <div key={index} className="hero-light-code-line">
                  <span style={{ color: "hsl(160 70% 35%)" }}>✓</span> <span style={{ color: "hsl(210 20% 20%)" }}>{lib}</span>
                </div>
              ))}
            </code>
          </div>

          {/* Stats */}
          <div className="hero-light-stats">
            <div className="hero-light-stat">
              <div className="hero-light-stat-number hero-light-stat-number-primary">30+</div>
              <div className="hero-light-stat-label">Templates</div>
            </div>
            <div className="hero-light-stat">
              <div className="hero-light-stat-number hero-light-stat-number-accent"> {"<"} 2min</div>
              <div className="hero-light-stat-label">Setup Time</div>
            </div>
            <div className="hero-light-stat">
              <div className="hero-light-stat-number hero-light-stat-number-primary">100%</div>
              <div className="hero-light-stat-label">Production Ready</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
