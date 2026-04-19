import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Store, Smartphone, Printer, Shield, 
  Settings, Wifi, RefreshCw, AlertTriangle,
  CheckCircle2, Plus, ArrowRight, ExternalLink,
  Keyboard, Monitor
} from 'lucide-react';
export default function ManagerOperations() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('outlets');

  const allOutlets = [
    { id: 'o1', name: 'Downtown Branch', status: 'Optimal', terminals: 4, manager: 'Self', alerts: 0 },
    { id: 'o2', name: 'Westside Mall', status: 'High Traffic', terminals: 2, manager: 'Arthur Curry', alerts: 1 },
    { id: 'o3', name: 'East Riverside', status: 'Maintenance', terminals: 1, manager: 'Diana Prince', alerts: 0 },
  ];

  const outlets = allOutlets.filter(o => o.id === user?.outletId);

  const devices = [
    { name: 'POS Terminal #1', type: 'Terminal', status: 'Online', battery: '92%', lastSync: '2 mins ago' },
    { name: 'Epson TM-T88VI', type: 'Printer', status: 'Online', paper: '85%', lastSync: 'Connected' },
    { name: 'Pax A920 Pro', type: 'Payment', status: 'Offline', battery: '12%', lastSync: '1 hour ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Outlet Operations</h1>
          <p className="text-slate-500 font-medium">Global control and system configuration.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
           <button 
             onClick={() => setActiveTab('outlets')}
             className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
               activeTab === 'outlets' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'
             }`}
           >
             Outlets
           </button>
           <button 
             onClick={() => setActiveTab('hardware')}
             className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
               activeTab === 'hardware' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'
             }`}
           >
             Hardware
           </button>
        </div>
      </div>

      {activeTab === 'outlets' ? (
        <div className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {outlets.map((outlet) => (
                 <div key={outlet.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Store className="w-7 h-7" />
                       </div>
                       <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                         outlet.status === 'Optimal' ? 'bg-emerald-50 text-emerald-600' : 
                         outlet.status === 'Maintenance' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                       }`}>
                          {outlet.status}
                       </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">{outlet.name}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{outlet.manager}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                       <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Terminals</p>
                          <p className="text-lg font-black text-slate-900">{outlet.terminals}</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Alerts</p>
                          <p className={`text-lg font-black ${outlet.alerts > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{outlet.alerts}</p>
                       </div>
                    </div>

                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors">
                       Manage Outlet <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              ))}
      
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900">Device Monitoring</h3>
                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors"><RefreshCw className="w-4 h-4" /></button>
                 </div>
                 <div className="divide-y divide-slate-50">
                    {devices.map((device, i) => (
                       <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-6">
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                               device.status === 'Online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                             }`}>
                                {device.type === 'Terminal' ? <Smartphone className="w-7 h-7" /> : 
                                 device.type === 'Printer' ? <Printer className="w-7 h-7" /> : <Keyboard className="w-7 h-7" />}
                             </div>
                             <div>
                                <p className="font-black text-slate-900 text-lg">{device.name}</p>
                                <div className="flex items-center gap-3 mt-1">
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{device.type}</span>
                                   <div className="w-1 h-1 rounded-full bg-slate-300" />
                                   <span className={`text-[10px] font-black uppercase ${device.status === 'Online' ? 'text-emerald-600' : 'text-rose-600'}`}>{device.status}</span>
                                </div>
                             </div>
                          </div>
                          <div className="text-right">
                             {device.battery && (
                                <p className="text-xs font-black text-slate-900">{device.battery} <span className="text-slate-400 font-bold ml-1">BATTERY</span></p>
                             )}
                             {device.paper && (
                                <p className="text-xs font-black text-slate-900">{device.paper} <span className="text-slate-400 font-bold ml-1">PAPER</span></p>
                             )}
                             <p className="text-[10px] font-bold text-slate-400 mt-1">{device.lastSync}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
                 <h3 className="font-black mb-8 text-lg">System Health</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Wifi className="w-5 h-5 text-emerald-400" />
                          <span className="font-bold">Cloud Sync</span>
                       </div>
                       <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-indigo-400" />
                          <span className="font-bold">Encrypted Link</span>
                       </div>
                       <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 mt-8">
                       <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-black uppercase">Low Ink Notice</span>
                       </div>
                       <p className="text-sm opacity-60">Terminal #2 printer paper is at 15%. Replace soon to avoid downtime.</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                 <h3 className="font-black text-slate-900 mb-6">Quick Actions</h3>
                 <div className="space-y-3">
                    <button className="w-full p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl flex items-center justify-between transition-all group">
                       <span className="text-sm font-black uppercase tracking-widest">Test All Printers</span>
                       <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button className="w-full p-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl flex items-center justify-between transition-all group">
                       <span className="text-sm font-black uppercase tracking-widest">Global Restock</span>
                       <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
