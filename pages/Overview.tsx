
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
    usageCreditsData, 
    resourceSnapshotData, 
    finopsRecommendations, 
    connectionsData, 
    warehousesData, 
    topQueriesForDashboard,
} from '../data/dummyData';
import { Account, User, BigScreenWidget, Page } from '../types';
import { IconDotsVertical, IconChevronDown, IconAdd, IconList, IconInfo } from '../constants';
import InfoTooltip from '../components/InfoTooltip';

interface OverviewProps {
    onSelectAccount: (account: Account) => void;
    onSelectUser: (user: User) => void;
    accounts: Account[];
    users: User[];
    onSetBigScreenWidget: (widget: BigScreenWidget) => void;
    currentUser: User | null;
    onNavigate: (page: Page, subPage?: string, state?: any) => void;
    onAddAccountClick?: () => void;
}

const WidgetCard: React.FC<{ 
    children: React.ReactNode, 
    title: string, 
    hasMenu?: boolean, 
    infoText?: string, 
    headerActions?: React.ReactNode,
    onTableView?: () => void
}> = ({ children, title, hasMenu = true, infoText, headerActions, onTableView }) => (
    <div className="bg-surface p-5 rounded-[12px] shadow-sm h-full flex flex-col border border-border-light">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-1.5">
                <h4 className="text-[13px] font-bold text-text-strong tracking-tight">{title}</h4>
                {infoText && <InfoTooltip text={infoText} />}
            </div>
            <div className="flex items-center gap-2">
                {headerActions}
                {onTableView && (
                    <button 
                        onClick={onTableView}
                        className="text-text-muted hover:text-primary transition-colors p-1"
                        title="View as table"
                    >
                        <IconList className="h-4 w-4" />
                    </button>
                )}
                {hasMenu && (
                    <button className="text-text-muted hover:text-text-primary transition-colors p-1">
                        <IconDotsVertical className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
        <div className="flex-grow">
            {children}
        </div>
    </div>
);

const SummaryMetricCard: React.FC<{ 
    label: string; 
    value: string; 
    subValue?: string; 
    onClick?: () => void 
}> = ({ label, value, subValue, onClick }) => (
    <button 
        onClick={onClick}
        className="bg-surface-nested p-4 rounded-[20px] border border-border-light flex flex-col justify-between h-[84px] flex-1 min-w-[140px] text-left hover:border-primary/30 transition-all group"
    >
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider group-hover:text-primary transition-colors">{label}</p>
        <div>
            <p className="text-xl font-black text-text-strong tracking-tight leading-none">{value}</p>
            {subValue && <p className="text-[10px] font-bold text-text-secondary mt-1">{subValue}</p>}
        </div>
    </button>
);

const DATE_RANGES = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 14 days', value: 14 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
];

const RecommendationItem: React.FC<{ rec: typeof finopsRecommendations[0] }> = ({ rec }) => {
    const getTagStyles = (tag: string) => {
        switch(tag.toLowerCase()) {
            case 'join': return 'bg-violet-100 text-violet-600';
            case 'table scan': return 'bg-cyan-100 text-cyan-600';
            case 'aggregation': return 'bg-blue-100 text-blue-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };
    
    return (
        <div className="p-4 rounded-xl bg-surface-nested border border-border-light/50 space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-text-strong font-mono">{rec.title}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${getTagStyles(rec.tag)}`}>{rec.tag}</span>
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed">{rec.description}</p>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface p-3 rounded-lg shadow-xl border border-border-color">
                <p className="text-xs font-bold text-text-strong mb-1">{label}</p>
                <p className="text-xs text-primary font-black">
                    {payload[0].value.toLocaleString()} <span className="text-[10px] text-text-muted uppercase">Credits (K)</span>
                </p>
            </div>
        );
    }
    return null;
};

const WavyGridBackground = () => (
    <div className="absolute bottom-0 left-0 right-0 h-[400px] pointer-events-none opacity-20 z-0 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 1440 400" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200C240 100 480 300 720 200C960 100 1200 300 1440 200V400H0V200Z" fill="none" stroke="url(#gridGradient)" strokeWidth="0.5" />
            <defs>
                <linearGradient id="gridGradient" x1="720" y1="0" x2="720" y2="400" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6932D5" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#6932D5" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const Overview: React.FC<OverviewProps> = ({ accounts, onSelectAccount, onAddAccountClick, onNavigate }) => {
    const [selectedRange, setSelectedRange] = useState(DATE_RANGES[1]);
    const [isRangeOpen, setIsRangeOpen] = useState(false);
    const rangeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (rangeRef.current && !rangeRef.current.contains(event.target as Node)) setIsRangeOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const topAccountsData = useMemo(() => connectionsData.map(acc => ({ name: acc.name, credits: acc.tokens / 1000 })), []);
    const topWarehousesData = useMemo(() => warehousesData.map(wh => ({ name: wh.name, credits: wh.tokens })), []);

    if (accounts.length === 0) {
        return (
            <div className="relative h-full w-full bg-white overflow-hidden flex flex-col">
                <WavyGridBackground />
                <div className="relative z-10 px-12 pt-20 max-w-6xl w-full">
                    <div className="space-y-4">
                        <h1 className="text-[40px] font-bold text-text-strong tracking-tight">Welcome to Anavsan</h1>
                        <p className="text-xl text-text-secondary font-medium">Your smart advisor for Snowflake cost optimization.</p>
                    </div>
                    <div className="mt-16 max-w-2xl">
                        <div className="bg-white border border-border-light rounded-[32px] p-10 shadow-xl shadow-primary/5">
                            <h2 className="text-2xl font-black text-text-strong">Get started with Snowflake</h2>
                            <p className="text-base text-text-secondary mt-4 leading-relaxed">
                                Anavsan helps you optimize Snowflake. Connect your account to see detailed analysis of your query spend, warehouse usage, and performance.
                            </p>
                            <div className="mt-10 flex justify-end">
                                <button 
                                    onClick={onAddAccountClick}
                                    className="bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-3 transition-all active:scale-95"
                                >
                                    <span className="text-lg">Connect account</span>
                                    <IconAdd className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 px-6 pb-12 pt-4 max-w-[1440px] mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Data cloud overview</h1>
                    <p className="text-sm text-text-secondary font-medium mt-1">Dec 2 to Dec 16 2025 (Last 14 days)</p>
                </div>
                <div className="relative" ref={rangeRef}>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-text-secondary">Data range</span>
                        <button 
                            onClick={() => setIsRangeOpen(!isRangeOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg text-sm text-text-primary font-bold border border-border-color shadow-sm"
                        >
                            {selectedRange.label}
                            <IconChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isRangeOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    {isRangeOpen && (
                        <div className="absolute right-0 mt-1 w-48 bg-surface rounded-xl shadow-2xl z-50 border border-border-color overflow-hidden py-1">
                            {DATE_RANGES.map(r => (
                                <button key={r.label} onClick={() => { setSelectedRange(r); setIsRangeOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-primary/5 transition-colors">{r.label}</button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Unified Resource Summary Widget */}
            <div className="bg-white rounded-[32px] border border-border-light shadow-sm p-5 flex flex-col gap-5">
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-sm font-black text-text-strong tracking-tight uppercase">Resource summary</h2>
                        <IconInfo className="w-4 h-4 text-text-muted" />
                    </div>
                    <IconDotsVertical className="w-5 h-5 text-text-muted" />
                </div>
                
                <div className="space-y-3">
                    {/* Row 1: Accounts, Applications, Compute, Storage, Cortex, Cloud Service */}
                    <div className="flex flex-wrap gap-3">
                        <SummaryMetricCard 
                            label="Accounts" 
                            value="8" 
                            subValue="48.5K Credits" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Accounts' })} 
                        />
                        <SummaryMetricCard 
                            label="Applications" 
                            value="4" 
                            subValue="3.5K Credits" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Applications' })} 
                        />
                        <SummaryMetricCard 
                            label="Compute" 
                            value="36" 
                            subValue="44.25K Credits" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Compute' })} 
                        />
                        <SummaryMetricCard 
                            label="Storage" 
                            value="36 TB" 
                            subValue="1.5K Credits" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Storage' })} 
                        />
                        <SummaryMetricCard 
                            label="Cortex" 
                            value="1.5K" 
                            subValue="Credits" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Cortex' })} 
                        />
                        <SummaryMetricCard 
                            label="Cloud service" 
                            value="1.5K" 
                            subValue="Credits" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Cloud Service' })} 
                        />
                    </div>
                    {/* Row 2: User, Queries, Table - Aligned with the left as shown in image */}
                    <div className="flex flex-wrap gap-3">
                        <SummaryMetricCard 
                            label="User" 
                            value="43" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'User' })} 
                        />
                        <SummaryMetricCard 
                            label="Queries" 
                            value="950" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Queries' })} 
                        />
                        <SummaryMetricCard 
                            label="Tables" 
                            value="865" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Table' })} 
                        />
                        <div className="flex-1 min-w-[140px] hidden lg:block"></div>
                        <div className="flex-1 min-w-[140px] hidden lg:block"></div>
                        <div className="flex-1 min-w-[140px] hidden lg:block"></div>
                    </div>
                </div>
            </div>

            <WidgetCard 
                title="Recommendations" 
                headerActions={<button onClick={() => onNavigate('Recommendations')} className="text-[11px] font-bold text-link hover:underline">View all</button>}
            >
                <div className="space-y-3">
                    {finopsRecommendations.map(rec => <RecommendationItem key={rec.id} rec={rec} />)}
                </div>
            </WidgetCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <WidgetCard title="Top accounts by credits" headerActions={<button onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Accounts' })} className="text-[11px] font-bold text-link hover:underline">View all</button>}>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topAccountsData} margin={{ left: 50, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" border-border-color horizontal={false} stroke="#E2DDEB" opacity={0.5} />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9A9AB2' }} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#5A5A72' }} width={80} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="credits" fill="#6932D5" radius={[0, 4, 4, 0]} barSize={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>
                
                <WidgetCard title="Top warehouse by credits" headerActions={<button onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Compute' })} className="text-[11px] font-bold text-link hover:underline">View all</button>}>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topWarehousesData} margin={{ left: 50, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2DDEB" opacity={0.5} />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9A9AB2' }} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#5A5A72' }} width={80} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="credits" fill="#6932D5" radius={[0, 4, 4, 0]} barSize={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>
            </div>
        </div>
    );
};

export default Overview;
