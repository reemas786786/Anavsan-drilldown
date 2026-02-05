
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, Legend } from 'recharts';
import { 
    usageCreditsData, 
    resourceSnapshotData, 
    finopsRecommendations, 
    connectionsData, 
    warehousesData, 
    spendTrendsData,
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
    <div className="bg-surface p-6 rounded-[24px] shadow-sm flex flex-col border border-border-light">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-1.5">
                <h4 className="text-[14px] font-bold text-text-strong tracking-tight uppercase tracking-[0.05em]">{title}</h4>
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
        className="bg-surface-nested p-4 rounded-[16px] border border-border-light flex flex-col h-[90px] text-left hover:border-primary/40 hover:bg-surface-hover transition-all group shadow-sm w-full"
    >
        <p className="text-[10px] font-bold text-[#9A9AB2] uppercase tracking-widest group-hover:text-primary transition-colors">{label}</p>
        <div className="mt-auto">
            <p className="text-[18px] font-black text-[#161616] tracking-tight leading-none">{value}</p>
            {subValue && <p className="text-[10px] font-bold text-[#5A5A72] mt-1 uppercase tracking-tight">{subValue}</p>}
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
        const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
        return (
            <div className="bg-surface p-3 rounded-lg shadow-xl border border-border-color min-w-[160px]">
                <p className="text-xs font-bold text-text-strong mb-2 border-b border-border-light pb-1">{label}</p>
                <div className="space-y-1.5 mb-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-[10px] font-medium text-text-secondary">{entry.name}:</span>
                            </div>
                            <span className="text-[10px] font-black text-text-strong">{entry.value.toLocaleString()} cr</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between border-t border-border-light pt-1.5 mt-1.5">
                    <span className="text-[10px] font-black text-text-muted uppercase">Total Credits</span>
                    <span className="text-xs font-black text-primary">{total.toLocaleString()} cr</span>
                </div>
            </div>
        );
    }
    return null;
};

const CreditsTrendWidget: React.FC = () => {
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

    const trendData = useMemo(() => {
        return spendTrendsData.slice(-selectedRange.value);
    }, [selectedRange]);

    return (
        <WidgetCard 
            title="Credits Trend" 
            headerActions={
                <div className="relative" ref={rangeRef}>
                    <button 
                        onClick={() => setIsRangeOpen(!isRangeOpen)}
                        className="flex items-center gap-2 px-3 py-1 bg-background rounded-lg text-[11px] text-text-primary font-bold border border-border-color shadow-sm"
                    >
                        {selectedRange.label}
                        <IconChevronDown className={`w-3 h-3 text-text-muted transition-transform ${isRangeOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isRangeOpen && (
                        <div className="absolute right-0 mt-1 w-32 bg-surface rounded-lg shadow-xl z-50 border border-border-color overflow-hidden py-1">
                            {DATE_RANGES.map(r => (
                                <button key={r.label} onClick={() => { setSelectedRange(r); setIsRangeOpen(false); }} className="w-full text-left px-3 py-1.5 text-[11px] font-medium hover:bg-primary/5 transition-colors">{r.label}</button>
                            ))}
                        </div>
                    )}
                </div>
            }
        >
            <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6932D5" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.5} />
                        <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 700}} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 700}} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="total" stroke="#6932D5" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </WidgetCard>
    );
};

const WavyGridBackground = () => (
    <div className="absolute bottom-0 left-0 right-0 h-[400px] pointer-events-none opacity-20 z-0 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 1440 400" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200C240 100 480 300 720 200C960 100 1200 300 1440 200V400H0V200Z" fill="none" stroke="url(#gridGradient)" strokeWidth="0.5" />
            <defs>
                <linearGradient id="gridGradient" x1="720" y1="0" x2="720" y2="400" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6932D5" stopOpacity={0.5} />
                    <stop offset="1" stopColor="#6932D5" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

// Custom Y-Axis tick to allow navigation when clicking account names
const CustomYAxisTick = (props: any) => {
    const { x, y, payload, onSelect } = props;
    // Find the corresponding account object from connectionsData
    const account = connectionsData.find(acc => acc.name === payload.value);

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={-10}
                y={0}
                dy={4}
                textAnchor="end"
                fill="#5A5A72"
                fontSize={10}
                fontWeight={700}
                style={{ cursor: 'pointer', outline: 'none' }}
                className="hover:fill-primary transition-colors"
                onClick={() => account && onSelect(account)}
            >
                {payload.value.length > 12 ? `${payload.value.substring(0, 12)}...` : payload.value}
            </text>
        </g>
    );
};

const Overview: React.FC<OverviewProps> = ({ accounts, onSelectAccount, onAddAccountClick, onNavigate }) => {
    // derive breakdowns for stacked bar
    const topAccountsData = useMemo(() => connectionsData.map(acc => {
        const total = acc.tokens / 1000;
        return {
            name: acc.name,
            warehouse: total * 0.82,
            storage: total * 0.12,
            cloud: total * 0.06
        };
    }), []);

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
        <div className="space-y-8 px-6 pb-20 pt-4 max-w-[1440px] mx-auto">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Data cloud overview</h1>
                    <p className="text-sm text-text-secondary font-medium mt-1">Snapshot of your organization's Snowflake consumption.</p>
                </div>
            </div>

            {/* Single Column Widget Stack */}
            <div className="space-y-8">
                {/* 1. Resource Summary */}
                <div className="bg-white rounded-[24px] border border-border-light shadow-sm p-6 flex flex-col gap-6">
                    <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[14px] font-semibold text-text-primary tracking-tight uppercase tracking-[0.05em]">Resource summary</h2>
                            <IconInfo className="w-4 h-4 text-[#9A9AB2]" />
                        </div>
                        <button className="p-1 rounded-full hover:bg-surface-nested transition-colors text-[#9A9AB2]">
                            <IconDotsVertical className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <SummaryMetricCard 
                            label="Accounts" 
                            value="8" 
                            subValue="48.5K Credits" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Accounts' })} 
                        />
                        <SummaryMetricCard 
                            label="Compute" 
                            value="44.25K" 
                            subValue="Credits"
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Compute' })} 
                        />
                        <SummaryMetricCard 
                            label="Storage" 
                            value="36 TB" 
                            subValue="1.5K Credits" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Storage' })} 
                        />
                        <SummaryMetricCard 
                            label="Applications" 
                            value="4" 
                            subValue="3.5K Credits" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Applications' })} 
                        />
                        <SummaryMetricCard 
                            label="Cortex" 
                            value="1.5K" 
                            subValue="Credits" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Cortex' })} 
                        />
                        <SummaryMetricCard 
                            label="Users" 
                            value="43" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'User' })} 
                        />
                        <SummaryMetricCard 
                            label="Queries" 
                            value="950" 
                            onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Queries' })} 
                        />
                    </div>
                </div>

                {/* 2. Recommendations */}
                <WidgetCard 
                    title="Recommendations" 
                    headerActions={<button onClick={() => onNavigate('Recommendations')} className="text-[11px] font-bold text-link hover:underline">View all</button>}
                >
                    <div className="space-y-4">
                        {finopsRecommendations.map(rec => <RecommendationItem key={rec.id} rec={rec} />)}
                    </div>
                </WidgetCard>

                {/* 3. Top accounts by credits */}
                <WidgetCard 
                    title="Top accounts by credits" 
                    headerActions={<button onClick={() => onNavigate('Resource Summary', undefined, { tab: 'Accounts' })} className="text-[11px] font-bold text-link hover:underline">View all</button>}
                >
                    <div className="h-[350px] flex flex-col">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={topAccountsData} margin={{ left: 50, right: 30, top: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDEB" opacity={0.5} />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9A9AB2' }} />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    width={120} 
                                    tick={<CustomYAxisTick onSelect={onSelectAccount} />}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Legend 
                                    verticalAlign="bottom" 
                                    align="center" 
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                />
                                <Bar dataKey="warehouse" name="Warehouse" stackId="a" fill="#6932D5" barSize={16} />
                                <Bar dataKey="storage" name="Storage" stackId="a" fill="#A78BFA" barSize={16} />
                                <Bar dataKey="cloud" name="Cloud Service" stackId="a" fill="#C4B5FD" radius={[0, 4, 4, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </WidgetCard>

                {/* 4. Credits Trend */}
                <CreditsTrendWidget />
            </div>
        </div>
    );
};

export default Overview;
