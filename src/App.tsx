import { Counter } from './features/Counter.tsx';
import { Greeting } from './features/Greeting.tsx';
import { Notes } from './features/Notes.tsx';

const routes = {
  '/': Greeting,
  '/counter': Counter,
  '/notes': Notes,
} as const;

export function App() {
  const Page = routes[window.location.pathname as keyof typeof routes] ?? Greeting;

  return (
    <div className="page">
      <header className="nav">
        <img src="/e2e-lockup-32-white.svg" alt="e2e" width={109} height={32} />
        <nav>
          <a href="/">Hello</a> · <a href="/counter">Counter</a> · <a href="/notes">Notes</a>
        </nav>
      </header>

      <main className="hero">
        <Page />
      </main>

      <footer className="footer">Example app for e2e. The tests live in tests/.</footer>
    </div>
  );
}
