import React, { useState } from 'react';
import { Type, Delete, Save } from 'lucide-react';

export const StringPlayground: React.FC = () => {
  const [text, setText] = useState("Hello");
  const [capacity, setCapacity] = useState(15); // SSO usually handles small strings, but we simulate heap logic for clarity

  // Handler for input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setText(newVal);
    // Simple simulated capacity logic for display
    if (newVal.length >= capacity) {
      setCapacity(Math.max(newVal.length * 2, 15));
    }
  };

  const methods = [
    { name: 'length()', val: text.length, desc: '字符数量' },
    { name: 'size()', val: text.length, desc: '同 length()' },
    { name: 'capacity()', val: capacity, desc: '分配的存储空间' },
    { name: 'empty()', val: text.length === 0 ? 'true' : 'false', desc: '是否为空' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">输入字符串内容</label>
        <div className="flex gap-4">
          <div className="relative flex-grow">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              value={text}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg shadow-sm"
              placeholder="请输入内容..."
            />
          </div>
          <button 
            onClick={() => setText("")}
            className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Delete size={18} />
            清空 (Clear)
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          提示: 尝试输入更长的文本观察 capacity 的变化。std::string 内部也维护了一个动态字符数组。
        </p>
      </div>

      {/* Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Method Results */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
             <h3 className="font-bold text-slate-700">属性概览</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {methods.map((m) => (
              <div key={m.name} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <div className="font-mono text-blue-600 font-semibold">{m.name}</div>
                  <div className="text-xs text-slate-400">{m.desc}</div>
                </div>
                <div className="font-mono text-lg font-bold text-slate-800">{m.val}</div>
              </div>
            ))}
            <div className="px-6 py-4 flex justify-between items-center bg-slate-50">
               <div>
                  <div className="font-mono text-purple-600 font-semibold">s[{text.length > 0 ? 0 : '0'}]</div>
                  <div className="text-xs text-slate-400">首字符</div>
                </div>
                <div className="font-mono text-lg font-bold text-slate-800">
                   {text.length > 0 ? `'${text[0]}'` : 'undefined'}
                </div>
            </div>
            <div className="px-6 py-4 flex justify-between items-center bg-slate-50">
               <div>
                  <div className="font-mono text-purple-600 font-semibold">s.back()</div>
                  <div className="text-xs text-slate-400">尾字符</div>
                </div>
                <div className="font-mono text-lg font-bold text-slate-800">
                   {text.length > 0 ? `'${text[text.length-1]}'` : 'undefined'}
                </div>
            </div>
          </div>
        </div>

        {/* Memory View */}
        <div className="lg:col-span-2 space-y-4">
           {/* Character Array View */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">内部缓冲区可视化 (Internal Buffer)</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: capacity }).map((_, i) => {
                  const char = text[i];
                  const isTerminator = i === text.length;
                  const isAllocated = i <= text.length; // Including null terminator space

                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className={`
                          w-12 h-14 border-2 rounded flex flex-col items-center justify-center font-mono relative
                          ${char ? 'bg-purple-50 border-purple-400 text-purple-700' : ''}
                          ${isTerminator ? 'bg-slate-100 border-slate-300 text-slate-400' : ''}
                          ${!char && !isTerminator ? 'bg-white border-slate-100 border-dashed opacity-50' : ''}
                        `}
                      >
                         <span className="text-lg font-bold">{char || (isTerminator ? '\\0' : '')}</span>
                         {char && <span className="text-[10px] text-purple-300 mt-1">{char.charCodeAt(0)}</span>}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">{i}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-slate-500 flex gap-4">
                 <span className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-400 rounded-full"></div> 字符内容</span>
                 <span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-300 rounded-full"></div> 空终止符 (\0)</span>
                 <span className="flex items-center gap-1"><div className="w-2 h-2 border border-slate-300 border-dashed rounded-full"></div> 未使用 Capacity</span>
              </div>
           </div>

           {/* Code Snippet */}
           <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm text-slate-300">
             <div className="flex items-center justify-between mb-2">
                <span className="text-green-400">// 对应 C++ 代码</span>
             </div>
             <p><span className="text-purple-400">string</span> s = <span className="text-orange-300">"{text}"</span>;</p>
             <p>s.length(); <span className="text-slate-500">// 返回 {text.length}</span></p>
             <p>s += <span className="text-orange-300">"!"</span>; <span className="text-slate-500">// 追加字符</span></p>
             <p className="mt-2 text-slate-500 italic">/* std::string 自动管理空终止符 '\0' 以兼容 C 风格字符串。 */</p>
           </div>
        </div>
      </div>
    </div>
  );
};