import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">静态 vs 动态</h2>
        <p className="text-slate-500">
          C++ 提供了原始数组和标准模板库 (STL) 容器。了解它们的区别对于编写高效、安全的代码至关重要。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Static Array Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-100 p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-200 rounded text-xs font-mono">int arr[10];</span>
              静态数组 (C-Style)
            </h3>
          </div>
          <div className="p-6 flex-grow space-y-4">
            <FeatureRow 
              icon={<X className="text-red-500" size={20} />}
              title="固定大小"
              desc="编译时必须确定大小，运行时无法改变。"
            />
            <FeatureRow 
              icon={<X className="text-red-500" size={20} />}
              title="手动内存管理"
              desc="如果使用 new 分配，必须手动 delete，否则造成内存泄漏。"
            />
            <FeatureRow 
              icon={<X className="text-red-500" size={20} />}
              title="安全性低"
              desc="无边界检查，容易发生越界访问导致程序崩溃。"
            />
            <FeatureRow 
              icon={<Check className="text-green-500" size={20} />}
              title="高性能"
              desc="无额外开销，直接访问内存地址，速度极快。"
            />
          </div>
          <div className="bg-slate-50 p-4 text-xs font-mono border-t border-slate-200">
            int arr[5] = {'{1, 2, 3, 4, 5}'};<br/>
            // arr[5] = 6; // 未定义行为! (Undefined Behavior)
          </div>
        </div>

        {/* Dynamic Vector Card */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-blue-500 overflow-hidden flex flex-col transform md:-translate-y-2">
          <div className="bg-blue-600 p-4 border-b border-blue-700 text-white">
            <h3 className="font-bold flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-700 rounded text-xs font-mono">std::vector&lt;int&gt;</span>
              动态数组 (STL Vector)
            </h3>
          </div>
          <div className="p-6 flex-grow space-y-4">
            <FeatureRow 
              icon={<Check className="text-blue-500" size={20} />}
              title="动态大小"
              desc="自动扩容。使用 push_back() 随意添加元素。"
            />
             <FeatureRow 
              icon={<Check className="text-blue-500" size={20} />}
              title="自动内存管理"
              desc="遵循 RAII 原则，离开作用域自动释放内存。"
            />
            <FeatureRow 
              icon={<Check className="text-blue-500" size={20} />}
              title="功能丰富"
              desc="提供 size(), empty(), insert(), clear() 等大量成员函数。"
            />
            <FeatureRow 
              icon={<Check className="text-blue-500" size={20} />}
              title="安全访问"
              desc="提供 at() 方法进行边界检查，抛出异常而非崩溃。"
            />
          </div>
          <div className="bg-blue-50 p-4 text-xs font-mono border-t border-blue-100 text-blue-900">
            vector&lt;int&gt; v = {'{1, 2, 3}'};<br/>
            v.push_back(4); // OK，自动扩容
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">特性</th>
              <th className="px-6 py-4">静态数组</th>
              <th className="px-6 py-4">std::vector</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-4 font-medium text-slate-700">声明方式</td>
              <td className="px-6 py-4 font-mono text-slate-500">int a[10];</td>
              <td className="px-6 py-4 font-mono text-blue-600">vector&lt;int&gt; v(10);</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-slate-700">获取长度</td>
              <td className="px-6 py-4 text-slate-500">sizeof(a)/sizeof(a[0])</td>
              <td className="px-6 py-4 text-blue-600 font-mono">v.size()</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-slate-700">添加元素</td>
              <td className="px-6 py-4 text-slate-500">不支持 (必须手动移位)</td>
              <td className="px-6 py-4 text-blue-600 font-mono">v.push_back(val)</td>
            </tr>
             <tr>
              <td className="px-6 py-4 font-medium text-slate-700">清空数据</td>
              <td className="px-6 py-4 text-slate-500">手动循环赋值</td>
              <td className="px-6 py-4 text-blue-600 font-mono">v.clear()</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FeatureRow: React.FC<{icon: React.ReactNode, title: string, desc: string}> = ({icon, title, desc}) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 flex-shrink-0 bg-slate-50 p-1.5 rounded-full">{icon}</div>
    <div>
      <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </div>
);