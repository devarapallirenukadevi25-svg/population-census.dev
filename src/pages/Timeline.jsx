import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger';

const data = [
  { year: '1950', actual: 2.5, projected: null, growthRate: 1.8 },
  { year: '1970', actual: 3.7, projected: null, growthRate: 2.1 },
  { year: '1990', actual: 5.3, projected: null, growthRate: 1.7 },
  { year: '2010', actual: 6.9, projected: null, growthRate: 1.2 },
  { year: '2023', actual: 8.0, projected: 8.0, growthRate: 0.9 },
  { year: '2050', actual: null, projected: 9.7, growthRate: 0.5 },
  { year: '2080', actual: null, projected: 10.4, growthRate: 0.1 },
  { year: '2100', actual: null, projected: 10.3, growthRate: -0.1 },
];

const Timeline = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(2023);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Population Time Machine</h1>
        <p className="text-gray-400">Journey from 1950 to 2100</p>
      </div>

      <StaggerContainer className="flex flex-1 flex-col">
        <StaggerItem className="glass-panel p-8 rounded-3xl mb-8 flex flex-col items-center">
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-aurora-green to-amber-highlight mb-8">
            {currentYear}
          </h2>
          
          <div className="w-full max-w-3xl flex items-center gap-6 mb-8">
            <button className="p-3 rounded-full hover:bg-white/10 text-white transition-colors">
              <SkipBack className="w-6 h-6" />
            </button>
            <button 
              className="p-4 rounded-full bg-aurora-green text-earth-dark hover:bg-teal-400 transition-colors shadow-[0_0_20px_rgba(60,224,166,0.4)]"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
            </button>
            <button className="p-3 rounded-full hover:bg-white/10 text-white transition-colors">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full max-w-4xl px-4">
            <input 
              type="range" 
              min="1950" 
              max="2100" 
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="w-full accent-aurora-green h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-4 text-sm text-gray-500 font-medium">
              <span>1950</span>
              <span>2023</span>
              <span>2100</span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="h-full glass-panel rounded-3xl p-6 min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Historical Data & Projections</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" />
              <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" label={{ value: 'Billions', angle: -90, position: 'insideLeft', fill: '#666' }} />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" label={{ value: 'Growth Rate (%)', angle: 90, position: 'insideRight', fill: '#666' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(18, 22, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar yAxisId="left" dataKey="actual" name="Historical" fill="#3CE0A6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="projected" name="Projected" fill="#FFB347" radius={[4, 4, 0, 0]} fillOpacity={0.6} />
              <Line yAxisId="right" type="monotone" dataKey="growthRate" name="Growth Rate %" stroke="#fff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
};

export default Timeline;
