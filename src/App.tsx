import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MirrorRequestPage from './pages/MirrorRequestPage';
import ConfigPage from './pages/ConfigPage';
import ECRExplorerPage from './pages/ECRExplorerPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MirrorRequestPage />} />
        <Route path="config" element={<ConfigPage />} />
        <Route path="ecr" element={<ECRExplorerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
