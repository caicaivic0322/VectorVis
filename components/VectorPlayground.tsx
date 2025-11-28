import React, { useState, useRef } from 'react';
import { Plus, Trash2, RefreshCw, ChevronRight, AlertTriangle, ArrowRight, Settings } from 'lucide-react';
import { ArrayElement } from '../types';

type VectorType = 'int' | 'double' | 'char' | 'string';

interface TypeConfig {
  label: string;
  size: number; // bytes
  placeholder: string;
  format: (val: string) => string;
}

const TYPE_CONFIGS: Record<VectorType, TypeConfig> = {
  int: { label: 'int', size: 4, placeholder: '10', format: v => v },
  double: { label: 'double', size: 8, placeholder: '3.14', format: v => v },
  char: { label: 'char', size: 1, placeholder: 'a', format: v => `'${v}'` },
  string: { label: 'string', size: 24, placeholder: 'hello', format: v => `"${v}"` } // 24 bytes is typical for std::string header on 64-bit
};

export const VectorPlayground: React.FC = () => {
  const [capacity, setCapacity] = useState(4);
  const [elements, setElements] = useState<ArrayElement<string>[]>([]); // Store everything as string internally
  const [log, setLog] = useState<string[]>(["系统初始化完成。Vector 已创建（为空）。"]);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  
  // New State for Type and Input
  const [selectedType, setSelectedType] = useState<VectorType>('int');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to generate fake memory address
  const getAddress = (index: number) => {
    const baseAddr = 7000;
    const offset = index * TYPE_CONFIGS[selectedType].size;
    return `0x${(baseAddr + offset).toString(16).toUpperCase()}`;
  };

  const addLog = (message: string) => {
    setLog(prev => [message, ...prev].slice(0, 5));
  };

  const handleTypeChange = (newType: VectorType) => {
    if (newType === selectedType) return;
    setSelectedType(newType);
    setElements([]);
    setCapacity(4);
    setInputValue('');
    addLog(`类型变更为 ${newType}。Vector 已重置。`);
  };

  const validateInput = (val: string, type: VectorType): boolean => {
    if (!val) return false;
    switch (type) {
      case 'int': return /^-?\d+$/.test(val);
      case 'double': return /^-?\d*\.?\d+$/.test(val);
      case 'char': return val.length === 1;
      case 'string': return true;
      default: return true;
    }
  };

  const handlePushBack = () => {
    if (!inputValue) {
      // Focus input if empty
      inputRef.current?.focus();
      return;
    }

    if (!validateInput(inputValue, selectedType)) {
      alert(`输入格式错误：请输入有效的 ${selectedType} 类型值。`);
      return;
    }

    const newElement: ArrayElement<string> = {
      id: Math.random().toString(36).substr(2, 9),
      value: inputValue,
      address: '',
      isNew: true
    };

    if (elements.length >= capacity) {
      // Expansion logic
      const newCapacity = capacity === 0 ? 1 : capacity * 2;
      setCapacity(newCapacity);
      addLog(`⚠️ 容量已满 (${capacity})。重新分配内存至大小：${newCapacity}。已将元素复制到新内存。`);
    } else {
      addLog(`push_back(${TYPE_CONFIGS[selectedType].format(inputValue)}): 在索引 ${elements.length} 处添加元素。`);
    }

    setElements(prev => [...prev, newElement]);
    setInputValue(''); // Clear input after add
    
    // Reset "new" status after animation
    setTimeout(() => {
      setElements(prev => prev.map(el => ({...el, isNew: false})));
    }, 500);

    // Keep focus on input for rapid entry
    setTimeout(() => {
        inputRef.current?.focus();
    }, 0);
  };

  const handlePopBack = () => {
    if (elements.length === 0) {
      addLog("❌ 错误：无法对空 vector 执行 pop_back()。");
      return;
    }
    setElements(prev => {
      const newArr = [...prev];
      newArr.pop();
      return newArr;
    });
    addLog(`pop_back(): 移除末尾元素。当前大小为 ${elements.length - 1}。`);
  };

  const handleClear = () => {
    setElements([]);
    addLog("clear(): 所有元素已移除。容量 (Capacity) 保持不变。");
  };

  const handleReset = () => {
    setElements([]);
    setCapacity(4);
    setInputValue('');
    setLog(["系统已重置。"]);
  };

  // Render memory slots (size + remaining capacity)
  const renderSlots = () => {
    const slots = [];
    const config = TYPE_CONFIGS[selectedType];

    for (let i = 0; i < capacity; i++) {
      const element = elements[i];
      const isOccupied = i < elements.length;
      const address = getAddress(i);

      slots.push(
        <div 
          key={i} 
          className={`relative group flex flex-col items-center justify-center w-16 md:w-24 transition-all duration-300 ${isOccupied ? 'opacity-100' : 'opacity-50'}`}
        >
          {/* Memory Address Label */}
          <span className="text-[10px] font-mono text-slate-400 mb-1">{address}</span>
          
          {/* The Cell */}
          <div 
            className={`
              w-16 h-16 md:w-24 md:h-20 border-2 rounded-lg flex items-center justify-center text-lg font-bold font-mono shadow-sm overflow-hidden
              transition-all duration-500 transform break-all p-1 text-center leading-tight
              ${isOccupied 
                ? 'bg-white border-blue-500 text-blue-600 z-10 scale-100' 
                : 'bg-slate-100 border-slate-300 border-dashed text-slate-300 scale-95'}
              ${element?.isNew ? 'ring-4 ring-green-400 bg-green-50 border-green-500 scale-110' : ''}
              ${highlightIndex === i ? 'ring-4 ring-amber-400 bg-amber-50' : ''}
            `}
          >
            {isOccupied ? config.format(element.value) : '?'}
          </div>

          {/* Index Label */}
          <span className="text-xs font-mono text-slate-500 mt-2">[{i}]</span>

          {/* Tooltip for Empty/Full */}
          <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-800 text-white px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none">
            {isOccupied ? '已占用 (Occupied)' : '预留内存 (Reserved)'}
          </div>
        </div>
      );
    }
    return slots;
  };

  const config = TYPE_CONFIGS[selectedType];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              操作面板
            </h2>
          </div>

          {/* Type Selection */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
              <Settings size={12} />
              数据类型 (Data Type)
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(Object.keys(TYPE_CONFIGS) as VectorType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-2 py-1.5 text-xs font-mono rounded transition-colors ${
                    selectedType === type
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-3">
             <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePushBack()}
                  placeholder={`输入 ${selectedType} 值 (例如: ${config.placeholder})`}
                  className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm shadow-sm"
                />
             </div>
             
             <button 
              onClick={handlePushBack}
              disabled={!inputValue && elements.length < capacity} // Allow pressing to trigger validation if desired, or disable
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-all active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              <span className="font-mono">push_back(val)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <button 
              onClick={handlePopBack}
              disabled={elements.length === 0}
              className="flex items-center justify-center space-x-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              <ArrowRight size={16} className="rotate-180" />
              <span className="font-mono text-sm">pop_back()</span>
            </button>
            <button 
              onClick={handleClear}
              disabled={elements.length === 0}
              className="flex items-center justify-center space-x-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              <Trash2 size={16} />
              <span className="font-mono text-sm">clear()</span>
            </button>
          </div>
          
          <div className="text-center">
             <button 
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-red-500 underline"
            >
              重置所有状态
            </button>
          </div>

          {/* Code Preview */}
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-blue-300 overflow-x-auto">
            <div className="text-slate-500 mb-1">// 当前状态 (Current State)</div>
            <div>vector&lt;<span className="text-pink-400">{selectedType}</span>&gt; v;</div>
            <div>v.size() == <span className="text-white">{elements.length}</span>;</div>
            <div>v.capacity() == <span className="text-amber-400">{capacity}</span>;</div>
            <div>
              v.data() == [<br/>
              &nbsp;&nbsp;{elements.length > 0 ? elements.map(e => config.format(e.value)).join(', ') : ''}<br/>
              ];
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Size" value={elements.length} desc="实际元素数量" color="blue" />
            <StatCard label="Capacity" value={capacity} desc="已分配内存空间" color="amber" />
            <StatCard label="Utilization" value={`${capacity > 0 ? Math.round((elements.length / capacity) * 100) : 0}%`} desc="内存利用率" color="emerald" />
            <StatCard label="Element Size" value={`${config.size} bytes`} desc={`sizeof(${selectedType})`} color="slate" />
          </div>

          {/* Visual Container */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">内存可视化 (Heap 堆空间)</h3>
                 <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-mono">
                    Type: {selectedType} ({config.size} bytes/block)
                 </span>
              </div>
              
              <div className="flex flex-wrap gap-4 items-start content-start">
                {renderSlots()}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-12 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white border-2 border-blue-500 rounded"></div>
                  <span>有效元素 (Size)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-100 border border-slate-300 border-dashed rounded"></div>
                  <span>预留空间 (Capacity - Size)</span>
                </div>
              </div>
            </div>

            {/* Warning for resize */}
            {elements.length === capacity && capacity > 0 && (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800">即将发生内存重新分配</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    当前 size 等于 capacity。下一次 push_back 将触发：
                    1. 开辟一块大小为 {capacity * 2} 的新内存区域。
                    2. 将现有 {elements.length} 个元素复制过去。
                    3. 释放旧内存。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Log */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">操作日志 (Operation Log)</h3>
            <ul className="space-y-2 font-mono text-xs">
              {log.map((entry, idx) => (
                <li key={idx} className={`flex items-start gap-2 ${idx === 0 ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                  <ChevronRight size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{label: string, value: string | number, desc: string, color: string}> = ({label, value, desc, color}) => {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    slate: 'text-slate-600 bg-slate-50',
  };

  return (
    <div className={`rounded-lg p-4 ${colorClasses[color] || colorClasses.slate}`}>
      <div className="text-xs font-medium opacity-70 uppercase">{label}</div>
      <div className="text-2xl font-bold font-mono my-1">{value}</div>
      <div className="text-[10px] opacity-80">{desc}</div>
    </div>
  );
};