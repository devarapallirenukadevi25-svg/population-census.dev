import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, TrendingUp, HeartPulse, Building2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger';

const data = [
  { year: '1950', pop: 2.5 },
  { year: '1970', pop: 3.7 },
  { year: '1990', pop: 5.3 },
  { year: '2010', pop: 6.9 },
  { year: '2023', pop: 8.0 },
  { year: '2050', pop: 9.7 },
];

const StatCard = ({ icon: Icon, label, value, trend, trendUp }) => (
  <StaggerItem hover className="glass-panel p-6 rounded-2xl">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <Icon className="w-6 h-6 text-aurora-green" />
      </div>
      {trend && (
        <span className={`text-sm font-medium ${trendUp ? 'text-aurora-green' : 'text-red-400'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-gray-400 text-sm mb-1">{label}</p>
    <h3 className="text-2xl font-bold text-white">{value}</h3>
  </StaggerItem>
);

const CountryDetails = () => {
  const { id } = useParams();
  const countryName = id === 'world' ? 'Global Overview' : `Country: ${id}`;

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/globe" className="p-2 rounded-full glass-panel hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{countryName}</h1>
          <p className="text-gray-400 text-sm">Census Data & Projections</p>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Users} label="Total Population" value="8,045,311,447" trend="+0.88%" trendUp={true} />
        <StatCard icon={TrendingUp} label="Density (P/km^2)" value="61.4" trend="+1.2%" trendUp={true} />
        <StatCard icon={HeartPulse} label="Life Expectancy" value="73.4 Years" trend="+0.3%" trendUp={true} />
        <StatCard icon={Building2} label="Urban Population" value="57%" trend="+1.5%" trendUp={true} />
      </StaggerContainer>

      <StaggerContainer className="flex-1">
        <StaggerItem className="h-full glass-panel rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-earth-dark/50 z-0 pointer-events-none" />
          <div className="relative z-10 h-full flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6">Population Growth Timeline (Billions)</h2>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3CE0A6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3CE0A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="year" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(18, 22, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#3CE0A6' }}
                  />
                  <Area type="monotone" dataKey="pop" stroke="#3CE0A6" strokeWidth={3} fillOpacity={1} fill="url(#colorPop)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
};

export default CountryDetails;
