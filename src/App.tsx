import { useState } from 'react';
import { PassportProvider } from './hooks/usePassport';
import { ShrinkIntro } from './components/ShrinkIntro';
import { Zone } from './components/Zone';
import { Zookeeper } from './components/Zookeeper';
import { Passport } from './components/Passport';
import { Footer } from './components/Footer';
import { ZONES } from './data/zones';

export default function App() {
  const [entered, setEntered] = useState(false);

  return (
    <PassportProvider>
      <a href="#soil" className="skip-link">
        Skip to the tour
      </a>

      {/* Entrance hero (Zone 0) */}
      <ShrinkIntro onEnter={() => setEntered(true)} />

      {/* The descending journey. Rendered underneath; revealed on enter. */}
      <main id="journey" className={entered ? '' : 'motion-safe:opacity-95'}>
        {ZONES.map((zone) => (
          <Zone key={zone.id} zone={zone} />
        ))}
        <Zookeeper />
      </main>

      <Footer />
      <Passport />
    </PassportProvider>
  );
}
