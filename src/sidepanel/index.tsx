import { createRoot } from 'react-dom/client';
import { SidePanel } from './SidePanel';
import './sidepanel.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
}