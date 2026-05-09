import { Bell, Eye, Database } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '../components/motion/Stagger';

const SettingToggle = ({ label, description, defaultChecked }) => (
  <StaggerItem hover className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
    <div>
      <h4 className="text-white font-medium">{label}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aurora-green"></div>
    </label>
  </StaggerItem>
);

const Settings = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-gray-400">Customize your Populens experience</p>
      </div>

      <StaggerContainer className="space-y-8">
        <section>
          <h3 className="flex items-center gap-2 text-xl font-semibold text-white mb-4 pb-2 border-b border-white/10">
            <Eye className="w-5 h-5 text-aurora-green" /> Visuals
          </h3>
          <div className="grid gap-4">
            <SettingToggle label="Cinematic Mode" description="Enable post-processing effects and ambient particles" defaultChecked={true} />
            <SettingToggle label="High-Resolution Globe" description="Download 4K textures for Earth map (requires more bandwidth)" defaultChecked={false} />
            <SettingToggle label="Reduce Animations" description="Disable UI transitions for better performance" defaultChecked={false} />
          </div>
        </section>

        <section>
          <h3 className="flex items-center gap-2 text-xl font-semibold text-white mb-4 pb-2 border-b border-white/10">
            <Database className="w-5 h-5 text-aurora-green" /> Data & Analytics
          </h3>
          <div className="grid gap-4">
            <SettingToggle label="Live Data Streaming" description="Stream real-time population estimates continuously" defaultChecked={true} />
            <SettingToggle label="Show Projections by Default" description="Always display AI predictions on charts" defaultChecked={true} />
          </div>
        </section>

        <section>
          <h3 className="flex items-center gap-2 text-xl font-semibold text-white mb-4 pb-2 border-b border-white/10">
            <Bell className="w-5 h-5 text-aurora-green" /> Notifications
          </h3>
          <div className="grid gap-4">
            <SettingToggle label="Major Demographic Shifts" description="Alerts when a country crosses a billion mark" defaultChecked={true} />
            <SettingToggle label="AI Insights Digest" description="Weekly summary of predictive analytics" defaultChecked={false} />
          </div>
        </section>

        <div className="pt-8 flex justify-end">
          <button className="glass-button px-8 py-3 text-white font-medium text-sm">
            Save Changes
          </button>
        </div>
      </StaggerContainer>
    </div>
  );
};

export default Settings;
