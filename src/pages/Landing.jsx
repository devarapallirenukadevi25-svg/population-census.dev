import { Link } from 'react-router-dom';
import { ArrowRight, Globe2, Activity } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger';

const Landing = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-earth-dark/50 to-earth-dark z-0" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <StaggerContainer className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6 border-white/10">
            <Activity className="w-4 h-4 text-aurora-green" />
            <span className="text-sm font-medium text-gray-300 tracking-wider uppercase">Live Global Demographics</span>
          </div>
          
          <StaggerItem as="h1" className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            <span className="block text-white">Discover</span>
            <span className="text-gradient-aurora">Populens</span>
          </StaggerItem>
          
          <StaggerItem as="p" className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-12">
            An immersive interactive world map and population census platform. Explore humanity's past, present, and future.
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <StaggerItem className="w-full sm:w-auto">
            <Link to="/globe" className="glass-button px-8 py-4 flex items-center gap-3 w-full sm:w-auto justify-center group">
              <Globe2 className="w-5 h-5 text-aurora-green group-hover:animate-spin-slow" />
              <span className="text-lg font-medium text-white">Enter the Globe</span>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors group-hover:translate-x-1" />
            </Link>
          </StaggerItem>
          
          <StaggerItem className="w-full sm:w-auto">
            <Link to="/insights" className="px-8 py-4 flex items-center gap-3 w-full sm:w-auto justify-center rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300 text-gray-300 hover:text-white">
              <span className="text-lg font-medium">AI Insights</span>
            </Link>
          </StaggerItem>
        </StaggerContainer>
      </div>
      
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(60,224,166,0.1),transparent_48%),linear-gradient(180deg,transparent_0%,rgba(9,11,14,0.86)_100%)]" />
    </div>
  );
};

export default Landing;
