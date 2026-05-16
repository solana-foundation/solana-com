export function PredictionMarketsAnimations() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

          .pmh-page { font-family: 'Outfit', sans-serif; }
          .pmh-page h1, .pmh-page h2, .pmh-page h3, .pmh-page h4 { font-family: 'Syne', sans-serif; letter-spacing: -0.02em; }
          .pmh-page .font-mono { font-family: 'JetBrains Mono', monospace !important; }

          /* === SECTION AMBIENT EFFECTS === */
          @keyframes sectionTicker {
            0% { transform: translateX(-100%); opacity: 0; }
            5% { opacity: 0.1; }
            95% { opacity: 0.1; }
            100% { transform: translateX(400%); opacity: 0; }
          }
          @keyframes sectionGlow {
            0%, 100% { opacity: 0.02; transform: scale(0.9); }
            50% { opacity: 0.06; transform: scale(1.15); }
          }
          @keyframes sectionSpark {
            0% { opacity: 0; transform: translateY(0) scale(1); }
            8% { opacity: 0.5; }
            30% { opacity: 0; transform: translateY(-50px) scale(0.2); }
            100% { opacity: 0; }
          }
          @keyframes miniChartDraw {
            0% { stroke-dashoffset: 500; opacity: 0; }
            8% { opacity: 0.08; }
            40% { stroke-dashoffset: 0; opacity: 0.08; }
            50% { opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes floatCandle {
            0%, 100% { opacity: 0.06; transform: translateY(0); }
            50% { opacity: 0.1; transform: translateY(-8px); }
          }

          /* === ANIMATED BORDERS === */
          @keyframes borderGlow {
            0%, 100% { border-color: rgba(20, 241, 149, 0.3); box-shadow: 0 0 15px rgba(20, 241, 149, 0.08); }
            25% { border-color: rgba(153, 69, 255, 0.3); box-shadow: 0 0 15px rgba(153, 69, 255, 0.08); }
            50% { border-color: rgba(3, 225, 255, 0.3); box-shadow: 0 0 15px rgba(3, 225, 255, 0.08); }
            75% { border-color: rgba(249, 63, 220, 0.3); box-shadow: 0 0 15px rgba(249, 63, 220, 0.08); }
          }

          /* === HERO TEXT === */
          @keyframes textGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* === BUTTON ORBS === */
          @keyframes orbPulse {
            0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.3); }
          }
          @keyframes orbPulse2 {
            0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.55; transform: translate(-50%, -50%) scale(1.2); }
          }

          /* === EFFECTS FADE-IN: lets animations stagger before revealing === */
          @keyframes effectsFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }

          /* === HERO TEXT GLOW === */
          @keyframes heroTextGlow {
            0%, 100% { text-shadow: 0 0 30px rgba(20, 241, 149, 0.3), 0 0 80px rgba(20, 241, 149, 0.1); }
            25% { text-shadow: 0 0 30px rgba(153, 69, 255, 0.3), 0 0 80px rgba(153, 69, 255, 0.1); }
            50% { text-shadow: 0 0 30px rgba(3, 225, 255, 0.3), 0 0 80px rgba(3, 225, 255, 0.1); }
            75% { text-shadow: 0 0 30px rgba(249, 63, 220, 0.3), 0 0 80px rgba(249, 63, 220, 0.1); }
          }

          /* === COUNTDOWN PULSE === */
          @keyframes countdownPulse {
            0%, 100% { opacity: 1; text-shadow: 0 0 8px rgba(20, 241, 149, 0.3); }
            50% { opacity: 0.7; text-shadow: 0 0 20px rgba(20, 241, 149, 0.6); }
          }

          .pmh-hero-title {
            background: linear-gradient(90deg, #14F195, #9945FF, #03E1FF, #F93FDC, #14F195, #9945FF);
            background-size: 300% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: textGradient 6s ease-in-out infinite;
          }

          .pmh-card {
            animation: borderGlow 5s linear infinite;
          }

          /* === ROCKETS: price pumps shooting upward === */
          @keyframes rocketUp1 {
            0% { transform: translateY(100vh) scaleY(0.3); opacity: 0; }
            5% { opacity: 0.8; transform: translateY(80vh) scaleY(1); }
            15% { opacity: 1; transform: translateY(20vh) scaleY(1.5); }
            20% { opacity: 0.9; transform: translateY(5vh) scaleY(2); }
            25% { opacity: 0; transform: translateY(-10vh) scaleY(0.5); }
            100% { opacity: 0; transform: translateY(-10vh) scaleY(0.5); }
          }
          @keyframes rocketUp2 {
            0%, 30% { opacity: 0; transform: translateY(100vh) scaleY(0.3); }
            35% { opacity: 0.7; transform: translateY(70vh) scaleY(1); }
            45% { opacity: 1; transform: translateY(15vh) scaleY(1.8); }
            50% { opacity: 0.6; transform: translateY(0vh) scaleY(2.2); }
            55% { opacity: 0; transform: translateY(-15vh) scaleY(0.3); }
            100% { opacity: 0; transform: translateY(-15vh) scaleY(0.3); }
          }
          @keyframes rocketUp3 {
            0%, 55% { opacity: 0; transform: translateY(100vh) scaleY(0.3); }
            60% { opacity: 0.9; transform: translateY(60vh) scaleY(1.2); }
            70% { opacity: 1; transform: translateY(10vh) scaleY(1.6); }
            75% { opacity: 0.5; transform: translateY(-5vh) scaleY(2); }
            80% { opacity: 0; transform: translateY(-20vh) scaleY(0.2); }
            100% { opacity: 0; transform: translateY(-20vh) scaleY(0.2); }
          }

          /* === CRASHES: price dumps slamming down === */
          @keyframes crashDown1 {
            0%, 20% { opacity: 0; transform: translateY(-20vh) scaleY(0.3); }
            25% { opacity: 0.6; transform: translateY(0vh) scaleY(1); }
            30% { opacity: 1; transform: translateY(60vh) scaleY(2); }
            33% { opacity: 1; transform: translateY(85vh) scaleY(2.5); }
            36% { opacity: 0.8; transform: translateY(90vh) scaleY(1); }
            38% { opacity: 0; transform: translateY(90vh) scaleY(0.2); }
            100% { opacity: 0; transform: translateY(90vh) scaleY(0.2); }
          }
          @keyframes crashDown2 {
            0%, 65% { opacity: 0; transform: translateY(-10vh) scaleY(0.3); }
            70% { opacity: 0.7; transform: translateY(10vh) scaleY(1.2); }
            77% { opacity: 1; transform: translateY(70vh) scaleY(2.2); }
            80% { opacity: 0.9; transform: translateY(88vh) scaleY(1.5); }
            83% { opacity: 0; transform: translateY(95vh) scaleY(0.2); }
            100% { opacity: 0; transform: translateY(95vh) scaleY(0.2); }
          }

          /* === IMPACT FLASHES: bright burst on crash/pump peak === */
          @keyframes impactFlash1 {
            0%, 19% { opacity: 0; transform: scale(0.3); }
            20% { opacity: 0; transform: scale(0.3); }
            22% { opacity: 0.9; transform: scale(1.8); }
            26% { opacity: 0; transform: scale(2.5); }
            100% { opacity: 0; transform: scale(2.5); }
          }
          @keyframes impactFlash2 {
            0%, 32% { opacity: 0; transform: scale(0.2); }
            34% { opacity: 0.8; transform: scale(2); }
            38% { opacity: 0; transform: scale(3); }
            100% { opacity: 0; transform: scale(3); }
          }
          @keyframes impactFlash3 {
            0%, 73% { opacity: 0; transform: scale(0.3); }
            75% { opacity: 1; transform: scale(1.5); }
            79% { opacity: 0; transform: scale(2.8); }
            100% { opacity: 0; transform: scale(2.8); }
          }

          /* === AMBIENT DRIFT: slow-moving market fog === */
          @keyframes fogDrift1 {
            0% { transform: translate(0, 0) scale(1); opacity: 0.15; }
            33% { transform: translate(80px, -40px) scale(1.2); opacity: 0.25; }
            66% { transform: translate(-60px, 30px) scale(0.9); opacity: 0.12; }
            100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          }
          @keyframes fogDrift2 {
            0% { transform: translate(0, 0) scale(1); opacity: 0.12; }
            50% { transform: translate(-90px, 50px) scale(1.3); opacity: 0.22; }
            100% { transform: translate(0, 0) scale(1); opacity: 0.12; }
          }

          /* === TICKER LINES: horizontal streaks like a price ticker === */
          @keyframes tickerStreak1 {
            0% { transform: translateX(-100%) scaleX(0.5); opacity: 0; }
            10% { opacity: 0.6; transform: translateX(-30%) scaleX(1); }
            30% { opacity: 0.3; transform: translateX(100%) scaleX(1.5); }
            35% { opacity: 0; transform: translateX(120%) scaleX(0.3); }
            100% { opacity: 0; }
          }
          @keyframes tickerStreak2 {
            0%, 40% { transform: translateX(200%) scaleX(0.5); opacity: 0; }
            50% { opacity: 0.5; transform: translateX(80%) scaleX(1); }
            65% { opacity: 0.2; transform: translateX(-100%) scaleX(1.8); }
            70% { opacity: 0; transform: translateX(-120%) scaleX(0.2); }
            100% { opacity: 0; }
          }
          @keyframes tickerStreak3 {
            0%, 60% { transform: translateX(-150%) scaleX(0.3); opacity: 0; }
            65% { opacity: 0.7; transform: translateX(-50%) scaleX(1); }
            80% { opacity: 0.2; transform: translateX(150%) scaleX(2); }
            85% { opacity: 0; }
            100% { opacity: 0; }
          }

          /* === SPARK PARTICLES: tiny fast sparks === */
          @keyframes spark1 {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            5% { opacity: 1; }
            15% { transform: translate(40px, -80px) scale(0.3); opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes spark2 {
            0%, 25% { transform: translate(0, 0) scale(1); opacity: 0; }
            30% { opacity: 1; }
            40% { transform: translate(-60px, -100px) scale(0.2); opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes spark3 {
            0%, 50% { transform: translate(0, 0) scale(1); opacity: 0; }
            55% { opacity: 0.9; }
            65% { transform: translate(30px, -120px) scale(0.1); opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes spark4 {
            0%, 70% { transform: translate(0, 0) scale(1); opacity: 0; }
            75% { opacity: 1; }
            85% { transform: translate(-40px, -90px) scale(0.2); opacity: 0; }
            100% { opacity: 0; }
          }

          /* === EXTRA ROCKET VARIANTS === */
          @keyframes rocketUp4 {
            0%, 10% { opacity: 0; transform: translateY(100vh) scaleY(0.2); }
            14% { opacity: 1; transform: translateY(50vh) scaleY(1.4); }
            18% { opacity: 0.8; transform: translateY(5vh) scaleY(2.5); }
            22% { opacity: 0; transform: translateY(-15vh) scaleY(0.3); }
            100% { opacity: 0; }
          }
          @keyframes rocketUp5 {
            0%, 40% { opacity: 0; transform: translateY(100vh) scaleY(0.3); }
            44% { opacity: 0.9; transform: translateY(65vh) scaleY(1); }
            52% { opacity: 1; transform: translateY(8vh) scaleY(2); }
            56% { opacity: 0; transform: translateY(-12vh) scaleY(0.4); }
            100% { opacity: 0; }
          }

          /* === EXTRA CRASH VARIANT === */
          @keyframes crashDown3 {
            0%, 40% { opacity: 0; transform: translateY(-15vh) scaleY(0.2); }
            44% { opacity: 0.8; transform: translateY(5vh) scaleY(1); }
            50% { opacity: 1; transform: translateY(75vh) scaleY(2.8); }
            53% { opacity: 0.6; transform: translateY(92vh) scaleY(1); }
            56% { opacity: 0; transform: translateY(95vh) scaleY(0.1); }
            100% { opacity: 0; }
          }

          /* === DIAGONAL STREAKS: chaotic angled lines === */
          @keyframes diagStreak1 {
            0% { transform: translate(-100vw, 100vh) rotate(-35deg) scaleX(0.5); opacity: 0; }
            8% { opacity: 0.7; }
            20% { transform: translate(100vw, -100vh) rotate(-35deg) scaleX(1.5); opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes diagStreak2 {
            0%, 45% { transform: translate(100vw, 100vh) rotate(35deg) scaleX(0.3); opacity: 0; }
            53% { opacity: 0.6; }
            65% { transform: translate(-100vw, -100vh) rotate(35deg) scaleX(1.2); opacity: 0; }
            100% { opacity: 0; }
          }

          /* === SCREEN FLASH: full-screen bright pulse === */
          @keyframes screenFlash {
            0%, 88% { opacity: 0; }
            89% { opacity: 0.06; }
            90% { opacity: 0; }
            95% { opacity: 0.04; }
            96% { opacity: 0; }
            100% { opacity: 0; }
          }

          /* === CANDLESTICK CHARTS (fast draw, quick fade) === */
          @keyframes chartDraw {
            0% { stroke-dashoffset: 2000; opacity: 0; }
            4% { opacity: 0.5; }
            28% { stroke-dashoffset: 0; opacity: 0.5; }
            36% { stroke-dashoffset: 0; opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes chartDraw2 {
            0%, 12% { stroke-dashoffset: 2000; opacity: 0; }
            16% { opacity: 0.45; }
            42% { stroke-dashoffset: 0; opacity: 0.45; }
            50% { stroke-dashoffset: 0; opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes chartDraw3 {
            0%, 25% { stroke-dashoffset: 1500; opacity: 0; }
            29% { opacity: 0.35; }
            55% { stroke-dashoffset: 0; opacity: 0.35; }
            63% { stroke-dashoffset: 0; opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes candlePulse {
            0% { opacity: 0; }
            5% { opacity: 0.55; }
            28% { opacity: 0.55; }
            36% { opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes candlePulse2 {
            0%, 12% { opacity: 0; }
            17% { opacity: 0.5; }
            42% { opacity: 0.5; }
            50% { opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes candlePulse3 {
            0%, 25% { opacity: 0; }
            30% { opacity: 0.45; }
            55% { opacity: 0.45; }
            63% { opacity: 0; }
            100% { opacity: 0; }
          }

          /* === SCANLINE GLITCH === */
          @keyframes scanGlitch {
            0%, 100% { opacity: 0.015; }
            20% { opacity: 0.04; }
            21% { opacity: 0.08; }
            22% { opacity: 0.02; }
            60% { opacity: 0.015; }
            80% { opacity: 0.06; }
            81% { opacity: 0.015; }
          }
        `,
      }}
    />
  );
}
