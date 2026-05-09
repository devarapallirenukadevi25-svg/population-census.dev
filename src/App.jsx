import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import GlobeExplorer from './pages/GlobeExplorer';
import CountryDetails from './pages/CountryDetails';
import CompareCountries from './pages/CompareCountries';
import Insights from './pages/Insights';
import Timeline from './pages/Timeline';
import Settings from './pages/Settings';
import BackgroundParticles from './components/BackgroundParticles';

function App() {
  return (
    <Router>
      <BackgroundParticles />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/globe" element={<GlobeExplorer />} />
          <Route path="/country/:id" element={<CountryDetails />} />
          <Route path="/compare" element={<CompareCountries />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
