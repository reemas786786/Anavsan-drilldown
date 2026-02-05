import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell, CartesianGrid 
} from 'recharts';
import { 
    connectionsData, 
    warehousesData, 
    databasesData, 
    usersData,
    spendTrendsData,
    storageGrowthData,
    databaseTablesData,
    recommendationsData,
    queryListData
} from '../data/dummyData';
import { Account } from '../types';
import { 
    IconSearch, 
    IconDotsVertical,
    IconView,
    IconSparkles,
    IconTrendingUp,
    IconChevronDown,
    IconLightbulb,
    IconArrowUp,
    IconArrowDown
} from '../constants';
import Pagination from '../components/Pagination';

type ResourceCategory = 'Accounts' | 'Compute' | 'Storage' | 'Applications' | 'Cortex' | 'User' | 'Queries';

const categories: { id: ResourceCategory; label: string }[] = [
    { id: 'Accounts', label: 'Accounts' },
    { id: 'Compute', label: 'Compute' },
    { id: 'Storage', label: 'Storage' },
    { id: 'Applications', label: 'Applications' },
    { id: 'Cortex', label: 'Cortex' },
    { id: 'User', label: 'Users' },
    { id: 'Queries', label: 'Queries' }
];

const applicationsData = [
    { id: 'app-1', name: 'Production ETL', accountName: 'Finance Prod', totalCredits: 15420, warehouseCredits: 14210, storageCredits: 840, otherCredits: 370 },
    { id: 'app-2', name: 'Tableau BI Dashboards', accountName: 'Account B', totalCredits: 8215, warehouseCredits: 7850, storageCredits: 210, otherCredits: 155 },
    { id: 'app-3', name: 'Log Ingestion Service', accountName: 'Finance Prod', totalCredits: 21040, warehouseCredits: 18520, storageCredits: 1560, otherCredits: 960 },
    { id: 'app-4', name: 'SageMaker ML Model', accountName: 'Account C', totalCredits: 4510, warehouseCredits: 4200, storageCredits: 120, otherCredits: 190 },
    { id: 'app-5', name: 'Inventory Sync Job', accountName: 'Account B', totalCredits: 1280, warehouseCredits: 1150, storageCredits: 80, otherCredits: 50 },
];

const cortexData = [
    { id: 'cx-1', name: 'Finance Prod', model: 'llama3-70b', tokens: '850K', credits: 1240, lastUsed: '2 mins ago' },
    { id: 'cx-2', name: 'Finance Prod', model: 'mistral-large', tokens: '1.2M', credits: 1850, lastUsed: '1 hour ago' },
    { id: 'cx-3', name: 'Account C', model: 'snowflake-arctic', tokens: '4.5M', credits: 4500, lastUsed: 'Just now' },
    { id: 'cx-4', name: 'Account B', model: 're-ranker', tokens: '240K', credits: 215, lastUsed: '10 mins ago' },
];

/**
 * Format numeric values to shorthand 'K' format for credits.
 */
const formatK = (val: any): string => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'number') {
        if (val >= 1000) {
            return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return val.toString();
    }
    return String(val);
};

interface ResourceSummaryProps {
    initialTab?: string;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
    onSelectAccount?: (account: Account, subPage?: string) => void;
    onSelectApplication?: (applicationName: string) => void;
}

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[13px] text-text-secondary font-medium whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

const WidgetCard: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-sm flex flex-col h-[400px]">
        <div className="mb-6">
            <h3 className="text-sm font-black text-text-strong uppercase tracking-widest">{title}</h3>
            <p className="text-xs text-text-secondary font-medium mt-1">{subtitle}</p>
        </div>
        <div className="flex-grow min-h-0">
            {children}
        </div>
    </div>
);

const ResourceSummary: React.FC<ResourceSummaryProps> = ({ initialTab, onNavigateToRecommendations, onSelectAccount, onSelectApplication }) => {
    const normalizedInitialTab = useMemo(() => {
        if (!initialTab) return 'Accounts';
        const found = categories.find(c => c.id === initialTab || c.label === initialTab);
        return (found?.id || 'Accounts') as ResourceCategory;
    }, [initialTab]);

    const [activeCategory, setActiveCategory] = useState<ResourceCategory>(normalizedInitialTab);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        setActiveCategory(normalizedInitialTab);
    }, [normalizedInitialTab]);

    const getInsightCount = (name: string) => {
        return recommendationsData.filter(r => r.affectedResource.toLowerCase().includes(name.toLowerCase())).length;
    };

    const tableData = useMemo(() => {
        const prepareData = (): any[] => {
            switch (activeCategory) {
                case 'Accounts':
                    return connectionsData.map(acc => ({
                        id: acc.id,
                        name: acc.name,
                        subName: acc.identifier,
                        totalRaw: acc.tokens,
                        computeRaw: Math.round(acc.tokens * 0.85),
                        storageRaw: 56,
                        cloudRaw: 2.4,
                        total: formatK(acc.tokens),
                        compute: formatK(Math.round(acc.tokens * 0.85)),
                        storage: formatK(56), 
                        cloud: formatK(2.4),
                        insights: getInsightCount(acc.name)
                    }));
                case 'Applications':
                    const groupedApps = applicationsData.reduce((acc: any, app) => {
                        if (!acc[app.accountName]) {
                            acc[app.accountName] = { 
                                name: app.accountName, 
                                appCount: 0, 
                                totalRaw: 0,
                                insights: 0
                            };
                        }
                        acc[app.accountName].appCount += 1;
                        acc[app.accountName].totalRaw += app.totalCredits;
                        acc[app.accountName].insights += getInsightCount(app.accountName);
                        return acc;
                    }, {});
                    return Object.values(groupedApps).map((item: any) => {
                        const conn = connectionsData.find(a => a.name === item.name);
                        return {
                            ...item,
                            id: conn?.id || item.name,
                            subName: conn?.identifier || '',
                            appCountRaw: item.appCount,
                            appCount: item.appCount.toString(),
                            total: formatK(item.totalRaw),
                            insights: item.insights
                        };
                    });
                case 'Compute':
                    return connectionsData.map((acc, idx) => {
                        const mockCredits = [4900, 4250, 3400, 2400, 1900, 1600, 1200, 800];
                        const baseVal = idx % 2 === 0 ? 56 : 26;
                        const computeCredits = mockCredits[idx % mockCredits.length];
                        const serverlessVal = 640; 
                        const totalCompute = (baseVal * 5) + computeCredits + 12 + serverlessVal; 
                        return {
                            id: acc.id,
                            name: acc.name,
                            subName: acc.identifier,
                            totalRaw: totalCompute,
                            total: formatK(totalCompute),
                            serverlessRaw: serverlessVal,
                            serverless: formatK(serverlessVal),
                            computeRaw: computeCredits,
                            compute: formatK(computeCredits),
                            insights: getInsightCount(acc.name)
                        };
                    });
                case 'Storage':
                    return connectionsData.map(acc => {
                        const storageCredits = Math.round(acc.tokens * 0.12);
                        const unusedGB = Math.round(acc.storageGB * (0.05 + Math.random() * 0.15));
                        return {
                            id: acc.id,
                            name: acc.name,
                            subName: acc.identifier,
                            totalRaw: storageCredits,
                            total: formatK(storageCredits),
                            sizeRaw: acc.storageGB,
                            size: acc.storageGB >= 1000 ? `${(acc.storageGB / 1000).toFixed(1)} TB` : `${acc.storageGB} GB`,
                            unusedRaw: unusedGB,
                            unused: unusedGB >= 1000 ? `${(unusedGB / 1000).toFixed(1)} TB` : `${unusedGB} GB`,
                            insights: getInsightCount(acc.name)
                        };
                    });
                case 'Cortex':
                    return connectionsData.map((acc, idx) => {
                        const modelCounts = [6, 4, 3, 2, 5, 1, 1, 1];
                        const count = modelCounts[idx % modelCounts.length];
                        const creditsRaw = [1850, 1240, 4500, 2100, 1100, 900, 400, 200][idx % 8];
                        return {
                            id: acc.id,
                            name: acc.name,
                            subName: acc.identifier,
                            modelRaw: count,
                            model: count.toString(),
                            tokens: ['1.2M', '850K', '4.5M', '2.1M', '1.1M', '900K', '400K', '200K'][idx % 8],
                            creditsRaw: creditsRaw,
                            credits: formatK(creditsRaw),
                            insights: getInsightCount(acc.name)
                        };
                    });
                case 'User':
                    return connectionsData.map(acc => ({
                        id: acc.id,
                        name: acc.name,
                        subName: acc.identifier,
                        userCountRaw: acc.usersCount,
                        userCount: acc.usersCount.toString(),
                        totalRaw: acc.tokens,
                        total: formatK(acc.tokens),
                        insights: getInsightCount(acc.name)
                    }));
                case 'Queries':
                    return connectionsData.map(acc => ({
                        id: acc.id,
                        name: acc.name,
                        subName: acc.identifier,
                        queriesCountRaw: parseInt(acc.queriesCount.replace('K', '')) * 1000,
                        queriesCount: acc.queriesCount,
                        totalRaw: acc.tokens,
                        total: formatK(acc.tokens),
                        insights: getInsightCount(acc.name)
                    }));
                default:
                    return connectionsData.map(acc => ({ 
                        id: acc.id, 
                        name: acc.name, 
                        subName: acc.identifier, 
                        totalRaw: acc.tokens, 
                        total: formatK(acc.tokens),
                        insights: getInsightCount(acc.name)
                    }));
            }
        };

        let rows: any[] = prepareData();

        rows = rows.filter((item: any) => {
            return (item.name || item.displayName || item.user || '').toLowerCase().includes(searchTerm.toLowerCase());
        });

        if (sortConfig) {
            rows.sort((a: any, b: any) => {
                const key = sortConfig.key.toLowerCase().split(' ')[0];
                let valA = a[key + 'Raw'] !== undefined ? a[key + 'Raw'] : a[key];
                let valB = b[key + 'Raw'] !== undefined ? b[key + 'Raw'] : b[key];
                if (key === 'account' && (activeCategory === 'Accounts' || activeCategory === 'Queries')) { valA = a.account || a.name; valB = b.account || b.name; }
                if (key === 'insights') { valA = a.insights; valB = b.insights; }
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const headers = (() => {
            switch (activeCategory) {
                case 'Accounts': return ['Account name', 'Total credits', 'Compute credits', 'Storage credits', 'Cloud service', 'Insights'];
                case 'Compute': return ['Account name', 'Total credits', 'Serverless', 'Warehouse', 'Insights'];
                case 'Storage': return ['Account name', 'Total credits', 'Total size', 'Unused table size', 'Insights'];
                case 'Cortex': return ['Account name', 'Model', 'Tokens', 'Credits', 'Insights'];
                case 'User': return ['Account name', 'User count', 'Total credits', 'Insights'];
                case 'Queries': return ['Account name', 'Queries count', 'Total credits', 'Insights'];
                case 'Applications': return ['Account name', 'Application count', 'Total credits', 'Insights'];
                default: return ['Entity', 'Total credits', 'Insights'];
            }
        })();

        return { headers, rows };
    }, [activeCategory, searchTerm, sortConfig]);

    const paginatedRows = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return tableData.rows.slice(startIndex, startIndex + itemsPerPage);
    }, [tableData.rows, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(tableData.rows.length / itemsPerPage);

    const activePills = useMemo(() => {
        switch (activeCategory) {
            case 'Accounts':
                return [
                    { label: 'Accounts', value: '8' },
                    { label: 'Total credits', value: '48.5K' },
                    { label: 'Compute', value: '44.25K' },
                    { label: 'Storage', value: '2.1K' },
                    { label: 'Cloud Service', value: '2.0K' }
                ];
            case 'Compute':
                return [
                    { label: 'Total credits', value: '44.25K' },
                    { label: 'Warehouse', value: '41.1K' },
                    { label: 'Serverless', value: '2.4K' },
                    { label: 'Total insights', value: '142' }
                ];
            case 'Storage':
                return [
                    { label: 'Total storage', value: '96.8 TB' },
                    { label: 'Storage credits', value: '2.1K' },
                    { label: 'Potential savings', value: '1.2K' },
                    { label: 'Total insights', value: '142' }
                ];
            case 'Cortex':
                return [
                    { label: 'Total tokens', value: '12.4M' },
                    { label: 'Cortex credits', value: '1.2K' },
                    { label: 'Active models', value: '4' }
                ];
            case 'User':
                return [
                    { label: 'Users', value: '43' }
                ];
            case 'Queries':
                return [
                    { label: 'Queries', value: '950' },
                    { label: 'Total credits', value: '48.5K' }
                ];
            case 'Applications':
                return [
                    { label: 'Total applications', value: '5' },
                    { label: 'Total credits', value: '50.5K' }
                ];
            default:
                return [
                    { label: 'Others', value: '1.5K' }
                ];
        }
    }, [activeCategory]);

    const bottomInsights = useMemo(() => {
        if (activeCategory === 'Applications') {
            const topApps = [...applicationsData].sort((a,b) => b.totalCredits - a.totalCredits);
            const totalWh = applicationsData.reduce((sum, a) => sum + a.warehouseCredits, 0);
            const totalSt = applicationsData.reduce((sum, a) => sum + a.storageCredits, 0);
            const totalOt = applicationsData.reduce((sum, a) => sum + a.otherCredits, 0);
            
            return [
                {
                    title: 'Top credits consuming application',
                    subtitle: 'Highest consumers across all organization accounts.',
                    chart: (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topApps} margin={{ left: 20, right: 20, top: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 600}} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 600}} />
                                <Tooltip cursor={{fill: 'rgba(105, 50, 213, 0.05)'}} />
                                <Bar dataKey="totalCredits" name="Credits" fill="#6932D5" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    )
                },
                {
                    title: 'Application Credits Mix',
                    subtitle: 'Aggregate cost distribution for application workloads.',
                    chart: (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={[
                                        { name: 'Compute', value: totalWh },
                                        { name: 'Storage', value: totalSt },
                                        { name: 'Others', value: totalOt }
                                    ]} 
                                    innerRadius={70} 
                                    outerRadius={100} 
                                    paddingAngle={8} 
                                    dataKey="value"
                                >
                                    <Cell fill="#6932D5" stroke="none" />
                                    <Cell fill="#A78BFA" stroke="none" />
                                    <Cell fill="#DDD6FE" stroke="none" />
                                </Pie>
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    )
                }
            ];
        }

        if (activeCategory === 'Storage') {
            const storageData = connectionsData.map(acc => ({ name: acc.name, size: acc.storageGB / 1000 }));
            const totalActive = connectionsData.reduce((sum, a) => sum + a.storageGB, 0);
            const totalUnused = Math.round(totalActive * 0.18);
            
            return [
                {
                    title: 'Top accounts by storage size',
                    subtitle: 'Ranking of organization accounts by TB volume.',
                    chart: (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={storageData.sort((a,b) => b.size - a.size)} layout="vertical" margin={{ left: 50, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                                <XAxis type="number" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 600}} />
                                <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#5A5A72', fontWeight: 600}} width={80} />
                                <Tooltip />
                                <Bar dataKey="size" name="Volume (TB)" fill="#6932D5" radius={[0, 4, 4, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    )
                },
                {
                    title: 'Organization Storage Health',
                    subtitle: 'Active data vs. potential stale data (Unused > 30d).',
                    chart: (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={[
                                        { name: 'Active Data', value: totalActive - totalUnused },
                                        { name: 'Potential Stale', value: totalUnused }
                                    ]} 
                                    innerRadius={70} 
                                    outerRadius={100} 
                                    paddingAngle={10} 
                                    dataKey="value"
                                >
                                    <Cell fill="#6932D5" />
                                    <Cell fill="#F87171" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )
                }
            ];
        }

        switch (activeCategory) {
            case 'Accounts':
            case 'Cortex':
            case 'Compute':
                return [
                    {
                        title: 'Consumption Trend',
                        subtitle: 'Last 14 days resource consumption patterns.',
                        chart: (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={spendTrendsData}>
                                    <defs>
                                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6932D5" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 600}} />
                                    <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#9A9AB2', fontWeight: 600}} />
                                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                    <Area type="monotone" dataKey="total" stroke="#6932D5" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )
                    },
                    {
                        title: 'Resource Mix',
                        subtitle: 'Distribution of service usage.',
                        chart: (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={[
                                            { name: 'Compute', value: 80 },
                                            { name: 'Storage', value: 10 },
                                            { name: 'Cortex', value: 10 }
                                        ]} 
                                        innerRadius={60} 
                                        outerRadius={90} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                    >
                                        <Cell fill="#6932D5" />
                                        <Cell fill="#A78BFA" />
                                        <Cell fill="#DDD6FE" />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )
                    }
                ];
            default:
                return [
                    { title: 'Resource Trend', subtitle: 'Analyzing patterns...', chart: <div className="h-full w-full bg-surface-nested rounded-2xl animate-pulse"></div> },
                    { title: 'Comparative Analysis', subtitle: 'Calculating metrics...', chart: <div className="h-full w-full bg-surface-nested rounded-2xl animate-pulse"></div> }
                ];
        }
    }, [activeCategory]);

    const handleAccountClick = (accountId: string) => {
        const account = connectionsData.find(acc => acc.id === accountId);
        if (account && onSelectAccount) {
            if (activeCategory === 'Applications') {
                onSelectAccount(account, 'Applications');
            } else if (activeCategory === 'Storage') {
                onSelectAccount(account, 'Storage summary');
            } else if (activeCategory === 'Cortex') {
                onSelectAccount(account, 'Cortex list');
            } else {
                onSelectAccount(account);
            }
        }
    };

    const getColumnWidth = (header: string) => {
        if (header === 'Account name' || header === 'Application name' || header === 'User name' || header === 'Table name' || header === 'Database') return 'w-auto min-w-[200px]';
        if (header === 'Query ID') return 'w-auto min-w-[240px]';
        if (header === 'Insights') return 'w-[120px]';
        return 'w-[140px]';
    };

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    return (
        <div className="min-h-full flex flex-col bg-background px-6 pt-4 pb-12 overflow-y-auto no-scrollbar">
            <div className="flex flex-col mb-8 flex-shrink-0">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Resource summary</h1>
                <div className="mt-6 border-b border-border-light flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
                            className={`pb-4 text-sm font-semibold transition-all relative whitespace-nowrap ${
                                activeCategory === cat.id 
                                ? 'text-primary font-bold' 
                                : 'text-text-muted hover:text-text-secondary'
                            }`}
                        >
                            {cat.label}
                            {activeCategory === cat.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8 overflow-x-auto no-scrollbar flex-shrink-0">
                {activePills.map((pill, idx) => (
                    <KPILabel key={idx} label={pill.label} value={pill.value} />
                ))}
            </div>

            <div className="bg-white rounded-[12px] border border-border-light shadow-sm mb-8 flex flex-col min-h-0">
                <div className="px-6 py-4 flex justify-end items-center border-b border-border-light bg-white rounded-t-[12px] z-[20] flex-shrink-0">
                    <div className="relative">
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-64 text-right"
                            placeholder="Search..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                            <tr>
                                {tableData.headers.map((h) => (
                                    <th 
                                        key={h} 
                                        onClick={() => requestSort(h)}
                                        className={`px-6 py-4 text-[11px] font-bold text-text-muted border-b border-border-light cursor-pointer select-none hover:text-primary transition-colors group ${getColumnWidth(h)} ${h === 'Insights' ? 'text-right' : ''}`}
                                    >
                                        <div className={`flex items-center gap-1 ${h === 'Insights' ? 'justify-end' : ''}`}>
                                            {h}
                                            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                                                {sortConfig?.key === h ? (
                                                    sortConfig.direction === 'asc' ? <IconArrowUp className="w-2.5 h-2.5" /> : <IconArrowDown className="w-2.5 h-2.5" />
                                                ) : (
                                                    <IconChevronDown className="w-2.5 h-2.5 opacity-30" />
                                                )}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {paginatedRows.map((row: any) => (
                                <tr key={row.id} className="hover:bg-surface-nested transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            {(activeCategory === 'Accounts' || activeCategory === 'Compute' || activeCategory === 'Storage' || activeCategory === 'User' || activeCategory === 'Queries' || activeCategory === 'Applications' || activeCategory === 'Cortex') ? (
                                                <button 
                                                    onClick={() => handleAccountClick(row.id)}
                                                    className="text-sm font-bold text-link text-left hover:underline decoration-primary/30 underline-offset-2"
                                                >
                                                    {row.name}
                                                </button>
                                            ) : (
                                                <span className="text-sm font-bold text-text-strong">{row.name}</span>
                                            )}
                                            {row.subName && <span className="text-xs text-text-muted font-mono mt-0.5">{row.subName}</span>}
                                        </div>
                                    </td>
                                    {tableData.headers.slice(1).map((h) => {
                                        if (h === 'Insights') {
                                            return (
                                                <td key={h} className={`px-6 py-5 text-right ${getColumnWidth(h)}`}>
                                                    <div className="flex items-center justify-end">
                                                        <button 
                                                            onClick={() => onNavigateToRecommendations?.({ search: row.name })}
                                                            className="inline-flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 hover:bg-primary/10 transition-colors"
                                                        >
                                                            <span className="text-xs font-black text-primary">{row.insights}</span>
                                                            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-tighter">Insights</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            );
                                        }

                                        const valKey = (() => {
                                            if (h === 'Total credits') return 'total';
                                            if (h === 'Total size') return 'size';
                                            if (h === 'Unused table size') return 'unused';
                                            if (h === 'Application count') return 'appCount';
                                            if (h === 'User count') return 'userCount';
                                            if (h === 'Queries count') return 'queriesCount';
                                            
                                            const keyMap: Record<string, string> = {
                                                'compute': 'compute',
                                                'storage': 'storage',
                                                'ai': 'ai',
                                                'auto': 'auto',
                                                'serverless': 'serverless',
                                                'data': 'ingest',
                                                'warehouse': 'compute',
                                                'search': 'search',
                                                'query': 'accelerate',
                                                'active': 'active',
                                                'staged': 'staged',
                                                'failsafe': 'failsafe',
                                                'hybrid': 'hybrid',
                                                'time': 'timetravel',
                                                'model': 'model'
                                            };
                                            const key = h.toLowerCase().split(' ')[0];
                                            return keyMap[key] || key;
                                        })();

                                        const val = row[valKey];
                                        
                                        return (
                                            <td key={h} className={`px-6 py-5 ${getColumnWidth(h)}`}>
                                                <span className="text-sm font-medium text-text-primary">
                                                    {val || '—'}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {tableData.rows.length > 10 && (
                    <div className="flex-shrink-0 bg-white border-t border-border-light">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={tableData.rows.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onDialogItemsPerPageChange={(size) => {
                                setItemsPerPage(size);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12 flex-shrink-0">
                {bottomInsights.map((insight, idx) => (
                    <WidgetCard key={idx} title={insight.title} subtitle={insight.subtitle}>
                        {insight.chart}
                    </WidgetCard>
                ))}
            </div>
        </div>
    );
};

export default ResourceSummary;