import React, { useState } from 'react';
import { ViewMode } from './types';
import { VectorPlayground } from './components/VectorPlayground';
import { StringPlayground } from './components/StringPlayground';
import { ComparisonTable } from './components/ComparisonTable';
import { Layout, Box, Type, Scale } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.VECTOR);

  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">C++ 动态数组可视化</h1>
              <p className="text-xs text-slate-400 font-mono">std::vector & std::string</p>
            </div>
          </div>
          
          <nav className="flex space-x-1">
            <NavButton 
              active={currentView === ViewMode.VECTOR} 
              onClick={() => setCurrentView(ViewMode.VECTOR)}
              icon={<Scale size={18} />}
              label="Vector (整数)"
            />
            <NavButton 
              active={currentView === ViewMode.STRING} 
              onClick={() => setCurrentView(ViewMode.STRING)}
              icon={<Type size={18} />}
              label="String (字符串)"
            />
            <NavButton 
              active={currentView === ViewMode.COMPARISON} 
              onClick={() => setCurrentView(ViewMode.COMPARISON)}
              icon={<Layout size={18} />}
              label="对比分析"
            />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {currentView === ViewMode.VECTOR && (
            <VectorPlayground />
          )}

          {currentView === ViewMode.STRING && (
            <StringPlayground />
          )}

          {currentView === ViewMode.COMPARISON && (
            <ComparisonTable />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>第13章 动态数组可视化演示 | 基于 C++ 标准模板库 (STL)</p>
        </div>
      </footer>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      active 
        ? 'bg-blue-600 text-white shadow-sm' 
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;