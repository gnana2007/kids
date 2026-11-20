import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ProgressProvider } from './game/progress';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { CharacterSelection } from './pages/CharacterSelection';
import { WorldMapPage } from './pages/WorldMapPage';
import { Adventure } from './pages/Adventure';
import { Results } from './pages/Results';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <div className="flex min-h-full flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/characters" element={<CharacterSelection />} />
              <Route path="/world" element={<WorldMapPage />} />
              <Route path="/adventure/:missionId" element={<Adventure />} />
              <Route path="/results/:missionId" element={<Results />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="px-4 pb-6 pt-2 text-center text-[11px] text-white/40">
            CharacterVerse · a demo adventure game · characters are used as playful inspiration, not official artwork
          </footer>
        </div>
      </BrowserRouter>
    </ProgressProvider>
  );
}
