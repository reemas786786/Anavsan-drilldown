
import React, { useState, useMemo } from 'react';
import { Warehouse } from '../types';
import { IconChevronLeft, IconLightbulb } from '../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { queryListData } from '../data/dummyData';
import Pagination from '../components/Pagination';

// --- PROPS INTERFACE ---
interface WarehouseDetailViewProps {
    warehouse: Warehouse;
    warehouses: Warehouse[];
    onSwitchWarehouse: (warehouse: Warehouse) => void;
    onBack: () => void;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
}

// --- HELPER & CHILD COMPONENTS ---

const DetailItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
    <div>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
        <div className="text-sm font-black text-text-primary mt-1">{value}</div>
    </div>
);

const StatusBadge: React.FC<{ status: Warehouse['status'] }> = ({ status }) => {
    const colorClasses: Record<Warehouse['status'], string> = {
        Running: 'bg-status-success-light text-status-success-dark',
        Active: 'bg-status-success-light text-status-success-dark',
        Suspended: 'bg-gray-200 text-gray-800',
        Idle: 'bg-status-info-light text-status-info-dark',
    };
    const dotClasses: Record<Warehouse['status'], string> = {
        Running: 'bg-status-success animate-pulse',
        Active: 'bg-status-success',
        Suspended: 'bg-gray-400',
        Idle: 'bg-status-info',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase rounded-full ${colorClasses[status]}`}>
            <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${dotClasses[status]}`}></span>
            {status}
        </span>
    );
};

const WarehouseAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name.split('_').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-[10px] font-black flex items-center justify-center flex-shrink-0 border border-primary/10">
            {initials}
        </div>
    );
};

const CreditTrendChart: React.FC = () => {
    const data = [
      { date: 'Oct 10', credits: 1.2 }, { date: 'Oct 11', credits: 1.5 }, { date: 'Oct 12', credits: 1.1 },
      { date: 'Oct 13', credits: 1.8 }, { date: 'Oct 14', credits: 2.0 }, { date: 'Oct 15', credits: 1.7 },
      { date: 'Oct 16', credits: 2.2 },
    ];
    return (
        <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-sm">
            <h3 className="text-[11px] font-black text-text-strong uppercase tracking-widest mb-6">Credit Trend (Last 7 Days)</h3>
            <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="date" stroke="#9A9AB2" fontSize={10} axisLine={false} tickLine={false} tick={{fontWeight: 700}} />
                        <YAxis stroke="#9A9AB2" fontSize={10} unit="cr" axisLine={false} tickLine={false} tick={{fontWeight: 700}} />
                        <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <defs>
                            <linearGradient id="creditGradientDetail" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6932D5" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="credits" stroke="#6932D5" strokeWidth={3} fillOpacity={1} fill="url(#creditGradientDetail)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const PrivilegesTable: React.FC = () => {
    const privileges = [
        { role: 'SYSADMIN', privilege: 'OWNERSHIP', grantedTo: 'ROLE' },
        { role: 'ACCOUNTADMIN', privilege: 'ALL', grantedTo: 'ROLE' },
        { role: 'ANALYST_ROLE', privilege: 'USAGE', grantedTo: 'ROLE' },
    ];
    return (
        <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-sm">
            <h3 className="text-[11px] font-black text-text-strong uppercase tracking-widest mb-6">Privileges</h3>
            <div className="overflow-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-[10px] text-text-muted font-black uppercase tracking-widest sticky top-0 bg-white z-10 border-b border-border-light">
                        <tr>
                            <th className="py-2 px-3">Role</th>
                            <th className="py-2 px-3">Privilege</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                        {privileges.map((p, i) => (
                            <tr key={i} className="hover:bg-surface-nested group">
                                <td className="py-3 px-3 font-bold text-text-primary group-hover:text-primary transition-colors">{p.role}</td>
                                <td className="py-3 px-3 text-text-secondary font-medium">{p.privilege}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const QueryHistoryTable: React.FC<{ warehouseName: string }> = ({ warehouseName }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const queries = useMemo(() => queryListData.filter(q => q.warehouse === warehouseName), [warehouseName]);

    const totalPages = Math.ceil(queries.length / itemsPerPage);
    const paginatedQueries = queries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    return (
        <div className="bg-white rounded-[24px] flex flex-col min-h-[500px] border border-border-light shadow-sm overflow-hidden">
            <div className="overflow-y-auto flex-grow min-h-0 no-scrollbar">
                <table className="w-full text-sm border-separate border-spacing-0">
                    <thead className="bg-[#F8F9FA] sticky top-0 z-10 text-[10px] font-black text-text-muted uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4 text-left border-b border-border-light">Query ID</th>
                            <th className="px-6 py-4 text-left border-b border-border-light">User</th>
                            <th className="px-6 py-4 text-left border-b border-border-light">Duration</th>
                            <th className="px-6 py-4 text-left border-b border-border-light">Credits</th>
                            <th className="px-6 py-4 text-right border-b border-border-light">Start Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light bg-white">
                        {paginatedQueries.map(q => (
                            <tr key={q.id} className="hover:bg-surface-nested group transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-link font-bold">{q.id.substring(7, 13).toUpperCase()}</td>
                                <td className="px-6 py-4 font-bold text-text-primary">{q.user}</td>
                                <td className="px-6 py-4 text-text-secondary font-medium">{q.duration}</td>
                                <td className="px-6 py-4 font-black text-text-strong">{q.costTokens.toFixed(3)} cr</td>
                                <td className="px-6 py-4 text-right text-text-muted font-bold whitespace-nowrap">{new Date(q.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                        {paginatedQueries.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-text-muted italic">No query history found for this warehouse.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {queries.length > itemsPerPage && (
                <div className="flex-shrink-0 bg-white border-t border-border-light">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={queries.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
const WarehouseDetailView: React.FC<WarehouseDetailViewProps> = ({ warehouse, onBack, onNavigateToRecommendations }) => {
    const [activeTab, setActiveTab] = useState<'Details' | 'Query History'>('Details');

    const insightCount = useMemo(() => warehouse.health === 'Optimized' ? 0 : Math.floor(Math.random() * 3) + 1, [warehouse]);

    return (
        <div className="flex flex-col h-full bg-background overflow-y-auto no-scrollbar px-6 pt-4 pb-12">
            <div className="max-w-[1440px] mx-auto w-full space-y-8">
                {/* Header Section */}
                <header className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={onBack} 
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-text-secondary border border-border-light hover:bg-surface-hover transition-all shadow-sm flex-shrink-0"
                                aria-label="Back to All Warehouses"
                            >
                                <IconChevronLeft className="h-6 w-6" />
                            </button>
                            
                            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white border border-border-light shadow-sm">
                                <WarehouseAvatar name={warehouse.name} />
                                <div className="text-left">
                                    <h1 className="text-xl font-black text-text-strong tracking-tight">{warehouse.name}</h1>
                                    <div className="flex items-center gap-2 mt-0.5">
                                         <StatusBadge status={warehouse.status} />
                                         <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{warehouse.size}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Action Area: AI Banner */}
                        <div className="hidden lg:flex items-center gap-4 bg-[#150A2B] text-white pl-6 pr-2 py-2 rounded-2xl shadow-xl border border-white/5 animate-in fade-in slide-in-from-right-4 duration-500">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Platform AI</span>
                                <span className="text-xs font-bold text-gray-200">
                                    {insightCount > 0 ? `Detected ${insightCount} optimizations for this cluster.` : 'Operational health is optimized.'}
                                </span>
                             </div>
                             {insightCount > 0 && (
                                <button 
                                    onClick={() => onNavigateToRecommendations?.({ search: warehouse.name })}
                                    className="ml-4 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                                    title="View insights"
                                >
                                    <IconLightbulb className="w-5 h-5 text-primary" />
                                </button>
                             )}
                        </div>
                    </div>

                    {/* Horizontal Tab Navigation */}
                    <div className="flex border-b border-border-light overflow-x-auto no-scrollbar gap-8">
                        {(['Details', 'Query History'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'text-primary' 
                                    : 'text-text-muted hover:text-text-secondary'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300" />
                                )}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Content Area */}
                <main className="animate-in fade-in duration-500">
                    {activeTab === 'Details' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Column: Metadata & Config */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-sm space-y-8">
                                    <h3 className="text-sm font-black text-text-strong uppercase tracking-[0.2em] border-b border-border-light pb-4">Configurations</h3>
                                    <div className="grid grid-cols-1 gap-y-8">
                                        <DetailItem label="Size" value={warehouse.size} />
                                        <DetailItem label="Auto Suspend" value="600 seconds" />
                                        <DetailItem label="Auto Resume" value="Enabled" />
                                        <DetailItem label="Scaling Policy" value="STANDARD" />
                                        <DetailItem label="Clusters" value="1 Min / 1 Max" />
                                        <DetailItem label="Resumed On" value="3 hours ago" />
                                    </div>
                                </div>
                                <PrivilegesTable />
                            </div>

                            {/* Right Column: Consumption & Trends */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-1">Credits Consumed</h3>
                                        <p className="text-3xl font-black text-text-primary tracking-tight">
                                            {warehouse.tokens.toLocaleString()} <span className="text-lg font-medium text-text-secondary">cr</span>
                                        </p>
                                    </div>
                                    <div className="h-px w-full md:h-12 md:w-px bg-border-light"></div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-1">Peak Utilization</h3>
                                        <p className="text-3xl font-black text-text-primary tracking-tight">
                                            {warehouse.peakUtilization}%
                                        </p>
                                    </div>
                                    <div className="h-px w-full md:h-12 md:w-px bg-border-light"></div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-1">Queries Run</h3>
                                        <p className="text-3xl font-black text-text-primary tracking-tight">
                                            {warehouse.queriesExecuted.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <CreditTrendChart />
                            </div>
                        </div>
                    ) : (
                        <QueryHistoryTable warehouseName={warehouse.name} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default WarehouseDetailView;
