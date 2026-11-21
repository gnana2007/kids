import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// No StrictMode: a Phaser game owns the canvas and must not be double-mounted.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
