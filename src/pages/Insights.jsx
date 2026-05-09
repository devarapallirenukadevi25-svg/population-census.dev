import { Brain, Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger';

const InsightCard = ({ icon: Icon, title, description, type }) => (
  <StaggerItem
    hover
    className={`glass-panel p-6 rounded-3xl relative overflow-hidden border-t-2 ${
      type === 'warning' ? 'border-t-amber-highlight' : 
      type === 'positive' ? 'border-t-aurora-green' : 'border-t-blue-400'
    }`}
  >
    <div className={`absolute top-0 right-0 p-6 opacity-10 ${
      type === 'warning' ? 'text-amber-highlight' : 
      type === 'positive' ? 'text-aurora-green' : 'text-blue-400'
    }`}>
      <Icon className="w-24 h-24" />
    </div>
    
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-full mb-6 flex items-center justify-center bg-white/5 ${
        type === 'warning' ? 'text-amber-highlight' : 
        type === 'positive' ? 'text-aurora-green' : 'text-blue-400'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </StaggerItem>
);

const Insights = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-4 rounded-full glass-panel mb-6 border border-white/10 shadow-[0_0_30px_rgba(60,224,166,0.15)]">
          <Brain className="w-8 h-8 text-aurora-green" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">AI Demographic Insights</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Our advanced predictive models analyze thousands of data points to bring you actionable intelligence on global population shifts.
        </p>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard 
          icon={AlertTriangle}
          type="warning"
          title="Aging Populations in East Asia"
          description="By 2050, over 35% of the population in Japan, South Korea, and China will be over the age of 65, leading to unprecedented economic restructuring needs."
        />
        <InsightCard 
          icon={TrendingUp}
          type="positive"
          title="African Youth Dividend"
          description="Sub-Saharan Africa holds the world's youngest population. If coupled with educational investments, this demographic dividend could drive global growth for the next century."
        />
        <InsightCard 
          icon={Sparkles}
          type="info"
          title="Urbanization Megatrend"
          description="We predict 68% of the global population will live in urban areas by 2050. This rapid shift requires smart city infrastructure and sustainable housing models."
        />
        <InsightCard 
          icon={Brain}
          type="info"
          title="Climate Migration"
          description="AI models predict up to 1.2 billion people could be displaced globally by 2050 due to climate change and natural disasters, heavily impacting coastal regions."
        />
      </StaggerContainer>
    </div>
  );
};

export default Insights;
