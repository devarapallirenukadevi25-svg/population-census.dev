import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger';

const data = [
  { subject: 'Population Growth', A: 120, B: 110, fullMark: 150 },
  { subject: 'Urbanization', A: 98, B: 130, fullMark: 150 },
  { subject: 'Life Expectancy', A: 86, B: 130, fullMark: 150 },
  { subject: 'Density', A: 99, B: 100, fullMark: 150 },
  { subject: 'Birth Rate', A: 85, B: 90, fullMark: 150 },
  { subject: 'Migration', A: 65, B: 85, fullMark: 150 },
];

const CompareCountries = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Compare Regions</h1>
          <p className="text-gray-400">Side-by-side demographic analysis</p>
        </div>
        <div className="flex gap-4">
          <select className="glass-panel px-4 py-2 rounded-xl text-white outline-none appearance-none cursor-pointer">
            <option value="IN">India</option>
            <option value="CN">China</option>
            <option value="US">United States</option>
          </select>
          <span className="text-gray-500 py-2">vs</span>
          <select className="glass-panel px-4 py-2 rounded-xl text-white outline-none appearance-none cursor-pointer">
            <option value="CN">China</option>
            <option value="IN">India</option>
            <option value="US">United States</option>
          </select>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <StaggerItem className="glass-panel rounded-3xl p-6 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Demographic Radar</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="India" dataKey="A" stroke="#3CE0A6" fill="#3CE0A6" fillOpacity={0.3} />
                <Radar name="China" dataKey="B" stroke="#FFB347" fill="#FFB347" fillOpacity={0.3} />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(18, 22, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </StaggerItem>

        <div className="flex flex-col gap-6">
          {[
            { label: 'Total Population', valA: '1.428B', valB: '1.425B', pA: '50.1%', pB: '49.9%' },
            { label: 'Median Age', valA: '28.2 yrs', valB: '38.4 yrs', pA: '42%', pB: '58%' },
            { label: 'Urban Population', valA: '36%', valB: '63%', pA: '36%', pB: '64%' }
          ].map((stat) => (
            <StaggerItem key={stat.label} hover className="glass-panel rounded-2xl p-6">
              <h4 className="text-gray-400 text-sm mb-4 text-center">{stat.label}</h4>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-aurora-green">{stat.valA}</span>
                <span className="text-xl font-bold text-amber-highlight">{stat.valB}</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden flex bg-white/5">
                <div className="bg-aurora-green h-full" style={{ width: stat.pA }}></div>
                <div className="bg-amber-highlight h-full" style={{ width: stat.pB }}></div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </div>
  );
};

export default CompareCountries;
