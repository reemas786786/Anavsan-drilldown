import React, { useState, useMemo, useEffect, useRef } from 'react';
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

type ResourceCategory = 'Accounts' | 'Applications' | 'Compute' | 'Storage' | 'Cortex' | 'Cloud Service' | 'User' | 'Queries' | 'Table';

const categories: { id: ResourceCategory; label: string }[] = [
    { id: 'Accounts', label: 'Accounts' },
    { id: 'Applications', label: 'Applications' },
    { id: 'Compute', label: 'Compute' },
    { id: 'Storage', label: 'Storage' },
    { id: 'Cortex', label: 'Cortex' },
    { id: 'Cloud Service', label: 'Cloud services' },
    { id: 'User', label: 'Users' },
    { id: 'Queries', label: 'Queries' },
    { id: 'Table', label: 'Tables' }
];

const applicationsData = [
    { id: 'app-1', name: 'Production ETL', accountName: 'Finance Prod', totalCredits: 15420, warehouseCredits: 14210, storageCredits: 840, otherCredits: 370 },
    { id: 'app-2', name: 'Tableau BI Dashboards', accountName: 'Marketing Dev', totalCredits: 8215, warehouseCredits: 7850, storageCredits: 210, otherCredits: 155 },
    { id: 'app-3', name: 'Log Ingestion Service', accountName: 'Finance Prod', totalCredits: 21040, warehouseCredits: 18520, storageCredits: 1560, otherCredits: 960 },
    { id: 'app-4', name: 'SageMaker ML Model', accountName: 'Data Sci Lab', totalCredits: 4510, warehouseCredits: 4200, storageCredits: 120, otherCredits: 190 },
    { id: 'app-5', name: 'Inventory Sync Job', accountName: 'Marketing Dev', totalCredits: 1280, warehouseCredits: 1150, storageCredits: 80, otherCredits: 50 },
];

const cloudServiceData = [
    { id: 'cs-1', name: 'Finance Prod', totalCredits: 12450, computeCredits: 124000, ratio: '10.0%', billedCredits: 0, savings: 1245 },
    { id: 'cs-2', name: 'Marketing Dev', totalCredits: 4520, computeCredits: 21000, ratio: '21.5%', billedCredits: 2420, savings: 0 },
    { id: 'cs-3', name: 'Data Sci Lab', totalCredits: 8810, computeCredits: 85000, ratio: '10.3%', billedCredits: 310, savings: 520 },
    { id: 'cs-4', name: 'Sales BI', totalCredits: 1240, computeCredits: 45000, ratio: '2.7%', billedCredits: 0, savings: 3260 },
];

const cortexData = [
    { id: 'cx-1', name: 'Finance Prod', model: 'llama3-70b', tokens: '850K', credits: 1240, lastUsed: '2 mins ago' },
    { id: 'cx-2', name: 'Finance Prod', model: 'mistral-large', tokens: '1.2M', credits: 1850, lastUsed: '1 hour ago' },
    { id: 'cx-3', name: 'Data Sci Lab', model: 'snowflake-arctic', tokens: '4.5M', credits: 4500, lastUsed: 'Just now' },
    { id: 'cx-4', name: 'Marketing Dev', model: 're-ranker', tokens: '240K', credits: 215, lastUsed: '10 mins ago' },
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
        return val + 'K';
    }
    return String(val);
};

interface ResourceSummaryProps {
    initialTab?: string;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
    onSelectAccount?: (account: Account) => void;
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
    const [selectedAccount, setSelectedAccount] = useState('All');
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const accountMenuRef = useRef<HTMLDivElement>(null);

    const accountOptions = useMemo(() => ['All', ...connectionsData.map(a => a.name)], []);

    useEffect(() => {
        setActiveCategory(normalizedInitialTab);
    }, [normalizedInitialTab]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInsightCount = (name: string) => {
        // Strictly filter recommendations by resource name to ensure badge matches results screen
        return recommendationsData.filter(r => r.affectedResource.toLowerCase() === name.toLowerCase()).length;
    };

    const tableContent = useMemo(() => {
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
                case 'Compute':
                    return connectionsData.map((acc, idx) => {
                        const mockCredits = [4900, 4250, 3400, 2400, 1900, 1600, 1200, 800];
                        const baseVal = idx % 2 === 0 ? 56 : 26;
                        return {
                            id: acc.id,
                            name: acc.name,
                            subName: acc.identifier,
                            aiRaw: baseVal,
                            autoRaw: baseVal,
                            serverlessRaw: baseVal,
                            ingestRaw: baseVal,
                            computeRaw: mockCredits[idx % mockCredits.length],
                            searchRaw: baseVal,
                            ai: formatK(baseVal),
                            auto: formatK(baseVal),
                            serverless: formatK(baseVal),
                            ingest: formatK(baseVal),
                            compute: formatK(mockCredits[idx % mockCredits.length]),
                            search: formatK(baseVal),
                            insights: getInsightCount(acc.name)
                        };
                    });
                case 'Storage':
                    return connectionsData.map(acc => ({
                        id: acc.id,
                        name: acc.name,
                        subName: acc.identifier,
                        totalRaw: Math.round(acc.tokens * 0.15),
                        activeRaw: 56,
                        stagedRaw: 12,
                        failsafeRaw: 8,
                        hybridRaw: 4,
                        timetravelRaw: 14,
                        total: formatK(Math.round(acc.tokens * 0.15)),
                        active: formatK(56),
                        staged: formatK(12),
                        failsafe: formatK(8),
                        hybrid: formatK(4),
                        timetravel: formatK(14),
                        insights: getInsightCount(acc.name)
                    }));
                case 'Cloud Service':
                    return cloudServiceData.map(cs => ({
                        id: cs.id,
                        name: cs.name,
                        subName: 'Metadata/DDL usage',
                        totalRaw: cs.totalCredits,
                        computeRaw: cs.computeCredits,
                        ratioRaw: parseFloat(cs.ratio),
                        billedRaw: cs.billedCredits,
                        total: formatK(cs.totalCredits),
                        compute: formatK(cs.computeCredits),
                        ratio: cs.ratio,
                        billed: formatK(cs.billedCredits),
                        insights: getInsightCount(cs.name)
                    }));
                case 'Cortex':
                    return cortexData.map(cx => ({
                        id: cx.id,
                        name: cx.name,
                        subName: cx.model,
                        tokens: cx.tokens,
                        creditsRaw: cx.credits,
                        credits: formatK(cx.credits),
                        insights: getInsightCount(cx.name)
                    }));
                case 'User':
                    return usersData.map(u => ({
                        id: u.id,
                        name: u.name,
                        subName: u.email,
                        role: u.role,
                        totalRaw: u.tokens,
                        total: formatK(u.tokens),
                        insights: getInsightCount(u.name)
                    }));
                case 'Queries':
                    return queryListData.slice(0, 50).map(q => ({
                        id: q.id,
                        name: q.id.length > 20 ? `${q.id.substring(0, 15)}...` : q.id,
                        subName: q.id,
                        account: connectionsData[Math.floor(Math.random() * connectionsData.length)].name, // Mock account association
                        totalRaw: q.costCredits,
                        total: q.costCredits.toFixed(2),
                        warehouse: q.warehouse,
                        duration: q.duration,
                        status: q.status,
                        insights: getInsightCount(q.id)
                    }));
                case 'Table':
                    return databaseTablesData.map(t => ({
                        id: t.id,
                        name: t.name,
                        subName: 'Primary Schema',
                        rowsRaw: t.rows,
                        sizeRaw: t.sizeGB,
                        rows: t.rows.toLocaleString(),
                        size: t.sizeGB.toLocaleString(),
                        insights: getInsightCount(t.name)
                    }));
                case 'Applications':
                    return applicationsData.map(app => ({
                        id: app.id,
                        name: app.name,
                        account: app.accountName,
                        totalRaw: app.totalCredits,
                        warehouseRaw: app.warehouseCredits,
                        storageRaw: app.storageCredits,
                        total: formatK(app.totalCredits),
                        warehouse: formatK(app.warehouseCredits),
                        storage: formatK(app.storageCredits),
                        insights: getInsightCount(app.name)
                    }));
                default:
                    return connectionsData.map(acc => ({ 
                        id: acc.id, 
                        name: acc.name, 
                        subName: 'Standard node', 
                        totalRaw: acc.tokens,
                        total: formatK(acc.tokens),
                        insights: getInsightCount(acc.name)
                    }));
            }
        };

        let rows: any[] = prepareData();

        // Apply Search and Account filters
        rows = rows.filter((item: any) => {
            const matchesSearch = (item.name || item.displayName || item.user || '').toLowerCase().includes(searchTerm.toLowerCase());
            let matchesAccount = true;
            if (selectedAccount !== 'All') {
                const itemAccount = item.accountName || item.account || ( (activeCategory === 'Cortex' || activeCategory === 'Cloud Service' || activeCategory === 'Accounts' || activeCategory === 'Compute' || activeCategory === 'Storage') ? item.name : null);
                matchesAccount = itemAccount === selectedAccount;
            }
            return matchesSearch && matchesAccount;
        });

        // Apply Sorting
        if (sortConfig) {
            rows.sort((a: any, b: any) => {
                const key = sortConfig.key.toLowerCase().split(' ')[0];
                let valA = a[key + 'Raw'] !== undefined ? a[key + 'Raw'] : a[key];
                let valB = b[key + 'Raw'] !== undefined ? b[key + 'Raw'] : b[key];
                if (key === 'account' && (activeCategory === 'Accounts' || activeCategory === 'Queries')) { valA = a.account || a.name; valB = b.account || b.name; }
                if (key === 'application' && activeCategory === 'Applications') { valA = a.name; valB = b.name; }
                if (key === 'insights') { valA = a.insights; valB = b.insights; }
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const headers = (() => {
            switch (activeCategory) {
                case 'Accounts': return ['Account name', 'Total credits', 'Compute credits', 'Storage credits', 'Cloud service', 'Insights'];
                case 'Compute': return ['Account name', 'AI service', 'Auto clustering', 'Serverless task', 'Data ingest', 'Warehouse', 'Search optimized', 'Insights'];
                case 'Storage': return ['Account name', 'Total credits', 'Active bytes credits', 'Staged bytes credits', 'Failsafe credits', 'Hybrid credits', 'Time travel', 'Insights'];
                case 'Cloud Service': return ['Account name', 'CS Credits', 'Compute credits', 'Ratio', 'Billed credits', 'Insights'];
                case 'Cortex': return ['Account name', 'Model', 'Tokens', 'Credits', 'Insights'];
                case 'User': return ['User name', 'Role', 'Total credits', 'Insights'];
                case 'Queries': return ['Query ID', 'Account name', 'Total credits', 'Warehouse', 'Duration', 'Insights'];
                case 'Table': return ['Table name', 'Rows', 'Size (GB)', 'Insights'];
                case 'Applications': return ['Application name', 'Account', 'Total credits', 'Warehouse', 'Storage', 'Insights'];
                default: return ['Entity', 'Total credits', 'Insights'];
            }
        })();

        return { headers, rows };
    }, [activeCategory, searchTerm, selectedAccount, sortConfig]);

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
                    { label: 'Total compute credits', value: '44.25K' },
                    { label: 'Warehouse usage', value: '41.1K' },
                    { label: 'Serverless task', value: '2.4K' },
                    { label: 'Auto clustering', value: '0.75K' }
                ];
            case 'Storage':
                return [
                    { label: 'Storage', value: '36 TB' },
                    { label: 'Storage credits', value: '1.5K' }
                ];
            case 'Cloud Service':
                return [
                    { label: 'CS credits', value: '2.0K' },
                    { label: 'Billed', value: '450' },
                    { label: 'Adjustment savings', value: '1.55K' }
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
                    { label: 'Queries', value: '950' }
                ];
            case 'Table':
                return [
                    { label: 'Tables', value: '865' }
                ];
            case 'Applications':
                return [
                    { label: 'Total applications', value: '5' },
                    { label: 'Total credits', value: '504.65' },
                    { label: 'Warehouse', value: '459.30' },
                    { label: 'Storage', value: '28.10' },
                    { label: 'Others', value: '17.25' }
                ];
            default:
                return [
                    { label: 'Others', value: '1.5K' }
                ];
        }
    }, [activeCategory]);

    const bottomInsights = useMemo(() => {
        switch (activeCategory) {
            case 'Accounts':
            case 'Applications':
            case 'Cloud Service':
            case 'Cortex':
            case 'Compute':
            case 'Storage':
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
                                            { name: 'Cloud/Cortex', value: 10 }
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
            onSelectAccount(account);
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
    };

    return (
        <div className="min-h-full flex flex-col bg-background px-6 pt-4 pb-12 overflow-y-auto no-scrollbar">
            <div className="flex flex-col mb-8 flex-shrink-0">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Resource summary</h1>
                <div className="mt-6 border-b border-border-light flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
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
                <div className="px-6 py-4 flex justify-between items-center border-b border-border-light bg-white rounded-t-[12px] z-[20] flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-text-secondary">Account</span>
                        <div className="relative" ref={accountMenuRef}>
                            <button 
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-nested text-sm font-bold text-text-primary border border-border-light transition-all"
                            >
                                {selectedAccount}
                                <IconChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isAccountMenuOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-border-color py-1 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                    {accountOptions.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => { setSelectedAccount(opt); setIsAccountMenuOpen(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-primary/5 transition-colors ${selectedAccount === opt ? 'font-bold text-primary bg-primary/5' : 'text-text-secondary'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-px h-4 bg-border-color" />
                    </div>
                    <div className="relative">
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-64 text-right"
                            placeholder="Search..."
                        />
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10">
                            <tr>
                                {tableContent.headers.map((h) => (
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
                            {tableContent.rows.map((row: any) => (
                                <tr key={row.id} className="hover:bg-surface-nested transition-colors group">
                                    <td className="px-6 py-5 relative">
                                        {activeCategory === 'Queries' && (
                                            <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r ${row.status === 'Success' ? 'bg-status-success' : 'bg-status-error'}`}></div>
                                        )}
                                        <div className="flex flex-col">
                                            {activeCategory === 'Accounts' || activeCategory === 'Compute' || activeCategory === 'Storage' ? (
                                                <button 
                                                    onClick={() => handleAccountClick(row.id)}
                                                    className="text-sm font-bold text-link text-left hover:underline decoration-primary/30 underline-offset-2"
                                                >
                                                    {row.name}
                                                </button>
                                            ) : activeCategory === 'Applications' ? (
                                                <button 
                                                    onClick={() => onSelectApplication?.(row.name)}
                                                    className="text-sm font-bold text-link text-left hover:underline decoration-primary/30 underline-offset-2"
                                                >
                                                    {row.name}
                                                </button>
                                            ) : activeCategory === 'Queries' ? (
                                                <button 
                                                    className="text-sm font-medium text-link text-left hover:underline font-mono"
                                                >
                                                    {row.name}
                                                </button>
                                            ) : (
                                                <span className="text-sm font-bold text-text-strong">{row.name}</span>
                                            )}
                                            {row.subName && activeCategory !== 'Queries' && <span className="text-xs text-text-muted font-normal mt-0.5">{row.subName}</span>}
                                        </div>
                                    </td>
                                    {tableContent.headers.slice(1).map((h) => {
                                        if (h === 'Insights') {
                                            return (
                                                <td key={h} className={`px-6 py-5 text-right ${getColumnWidth(h)}`}>
                                                    <div className="flex items-center justify-end">
                                                        <button 
                                                            onClick={() => {
                                                                if (activeCategory === 'Queries') {
                                                                    onNavigateToRecommendations?.({ search: row.subName });
                                                                } else {
                                                                    onNavigateToRecommendations?.({ search: row.name });
                                                                }
                                                            }}
                                                            className="inline-flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 hover:bg-primary/10 transition-colors"
                                                        >
                                                            <span className="text-xs font-black text-primary">{row.insights}</span>
                                                            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-tighter">Insights</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            );
                                        }

                                        const key = h.toLowerCase().split(' ')[0];
                                        const val = row[
                                            key === 'cs' ? 'total' : 
                                            key === 'account' ? 'account' : 
                                            key === 'compute' || key === 'warehouse' ? (activeCategory === 'Queries' ? 'warehouse' : 'compute') : 
                                            key === 'ratio' ? 'ratio' : 
                                            key === 'billed' ? 'billed' : 
                                            key === 'model' ? 'subName' : 
                                            key === 'tokens' ? 'tokens' : 
                                            key === 'credits' ? 'credits' : 
                                            key === 'total' ? 'total' : 
                                            key === 'storage' ? 'storage' : 
                                            key === 'other' || key === 'others' ? 'others' : 
                                            key === 'queries' ? 'queries' : 
                                            key === 'role' ? 'role' : 
                                            key === 'size' ? 'size' : 
                                            key === 'cost' ? 'cost' : 
                                            key === 'efficiency' ? 'efficiency' : 
                                            key === 'savings' ? 'savings' : 
                                            key === 'rows' ? 'rows' : 
                                            key === 'growth' ? 'growth' : 
                                            key === 'cloud' ? 'cloud' :
                                            key === 'ai' ? 'ai' :
                                            key === 'auto' ? 'auto' :
                                            key === 'serverless' ? 'serverless' :
                                            key === 'data' ? 'ingest' :
                                            key === 'search' ? 'search' :
                                            key === 'active' ? 'active' :
                                            key === 'staged' ? 'staged' :
                                            key === 'failsafe' ? 'failsafe' :
                                            key === 'hybrid' ? 'hybrid' :
                                            key === 'time' ? 'timetravel' : 
                                            key === 'duration' ? 'duration' : key
                                        ];
                                        return (
                                            <td key={h} className={`px-6 py-5 ${getColumnWidth(h)}`}>
                                                <span className={`text-sm font-medium ${h === 'Others' && activeCategory === 'Applications' ? 'text-text-secondary' : 'text-text-primary'}`}>
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