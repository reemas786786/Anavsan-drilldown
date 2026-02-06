import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
    connectionsData, 
    recommendationsData,
    cortexModelsData,
    workloadsData,
    servicesData
} from '../data/dummyData';
import { Account, ResourceType } from '../types';
import { 
    IconSearch, 
    IconChevronDown,
    IconArrowUp,
    IconArrowDown
} from '../constants';
import Pagination from '../components/Pagination';
import InfoTooltip from '../components/InfoTooltip';

type ResourceCategory = 'Accounts' | 'Compute' | 'Storage' | 'Applications' | 'Workloads' | 'Services' | 'Cortex' | 'User' | 'Queries';

const categories: { id: ResourceCategory; label: string }[] = [
    { id: 'Accounts', label: 'Accounts' },
    { id: 'Compute', label: 'Compute' },
    { id: 'Storage', label: 'Storage' },
    { id: 'Applications', label: 'Applications' },
    { id: 'Workloads', label: 'Workloads' },
    { id: 'Services', label: 'Services' },
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

    const handleAccountClickByName = (accountName: string) => {
        const account = connectionsData.find(acc => acc.name === accountName);
        if (account && onSelectAccount) {
            onSelectAccount(account);
        }
    };

    const getInsightCount = (accountName: string, category: ResourceCategory, resourceName?: string) => {
        const typesForCategory: Record<ResourceCategory, ResourceType[]> = {
            'Accounts': ['Account', 'All'],
            'Compute': ['Query', 'Warehouse'],
            'Storage': ['Storage', 'Database'],
            'Applications': ['Application'],
            'Workloads': ['Warehouse', 'Query'],
            'Services': ['Account'],
            'Cortex': ['Query'],
            'User': ['User'],
            'Queries': ['Query']
        };
        
        const relevantTypes = typesForCategory[category] || ['All'];

        const count = recommendationsData.filter(r => {
            const matchesAccount = r.accountName.toLowerCase().includes(accountName.toLowerCase()) || 
                                   r.affectedResource.toLowerCase().includes(accountName.toLowerCase());
            const matchesResource = resourceName ? r.affectedResource.toLowerCase().includes(resourceName.toLowerCase()) : true;
            const matchesType = relevantTypes.includes(r.resourceType) || r.resourceType === 'All';
            return matchesAccount && matchesType && matchesResource;
        }).length;

        return count > 0 ? count : Math.floor(Math.random() * 5) + 2;
    };

    const tableData = useMemo(() => {
        const prepareData = (): any[] => {
            switch (activeCategory) {
                case 'Workloads':
                    return workloadsData.map(wl => ({
                        ...wl,
                        accountName: wl.account, 
                        accountIdentifier: connectionsData.find(c => c.name === wl.account)?.identifier || 'acme.snowflakecomputing.com',
                        totalRaw: wl.credits,
                        creditsFormatted: wl.credits.toLocaleString(),
                        queriesFormatted: wl.queryCount.toLocaleString(),
                        insights: getInsightCount(wl.account, 'Workloads')
                    }));
                case 'Services':
                    return servicesData.map(svc => ({
                        ...svc,
                        accountName: svc.account,
                        accountIdentifier: connectionsData.find(c => c.name === svc.account)?.identifier || 'acme.snowflakecomputing.com',
                        totalRaw: svc.credits,
                        creditsFormatted: svc.credits.toLocaleString(),
                        queriesFormatted: svc.queryCount.toLocaleString(),
                        insights: getInsightCount(svc.account, 'Services', svc.type)
                    }));
                case 'Accounts':
                    return connectionsData.map(acc => ({
                        id: acc.id,
                        accountName: acc.name,
                        accountIdentifier: acc.identifier,
                        totalRaw: acc.tokens,
                        computeRaw: Math.round(acc.tokens * 0.85),
                        storageRaw: 56,
                        cloudRaw: 2.4,
                        total: formatK(acc.tokens),
                        compute: formatK(Math.round(acc.tokens * 0.85)),
                        storage: formatK(56), 
                        cloud: formatK(2.4),
                        insights: getInsightCount(acc.name, 'Accounts')
                    }));
                case 'Applications':
                    return applicationsData.map(app => ({
                        id: app.id,
                        accountName: app.accountName,
                        accountIdentifier: connectionsData.find(c => c.name === app.accountName)?.identifier || 'acme.snowflakecomputing.com',
                        appName: app.name,
                        totalRaw: app.totalCredits,
                        total: formatK(app.totalCredits),
                        computeRaw: app.warehouseCredits,
                        compute: formatK(app.warehouseCredits),
                        storageRaw: app.storageCredits,
                        storage: formatK(app.storageCredits),
                        insights: getInsightCount(app.accountName, 'Applications', app.name)
                    }));
                case 'Compute':
                    return connectionsData.map((acc, idx) => {
                        const mockCredits = [4900, 4250, 3400, 2400, 1900, 1600, 1200, 800];
                        const computeCredits = mockCredits[idx % mockCredits.length];
                        const serverlessVal = 640; 
                        return {
                            id: acc.id,
                            accountName: acc.name,
                            accountIdentifier: acc.identifier,
                            totalRaw: computeCredits + serverlessVal,
                            total: formatK(computeCredits + serverlessVal),
                            serverlessRaw: serverlessVal,
                            serverless: formatK(serverlessVal),
                            computeRaw: computeCredits,
                            compute: formatK(computeCredits),
                            insights: getInsightCount(acc.name, 'Compute')
                        };
                    });
                case 'Storage':
                    return connectionsData.map(acc => {
                        const storageCredits = Math.round(acc.tokens * 0.12);
                        const unusedGB = Math.round(acc.storageGB * (0.05 + Math.random() * 0.15));
                        return {
                            id: acc.id,
                            accountName: acc.name,
                            accountIdentifier: acc.identifier,
                            totalRaw: storageCredits,
                            total: formatK(storageCredits),
                            sizeRaw: acc.storageGB,
                            size: acc.storageGB >= 1000 ? `${(acc.storageGB / 1000).toFixed(1)} TB` : `${acc.storageGB} GB`,
                            unusedRaw: unusedGB,
                            unused: unusedGB >= 1000 ? `${(unusedGB / 1000).toFixed(1)} TB` : `${unusedGB} GB`,
                            insights: getInsightCount(acc.name, 'Storage')
                        };
                    });
                case 'Cortex':
                    return cortexModelsData.map(model => ({
                        id: model.id,
                        accountName: 'Finance Prod',
                        accountIdentifier: 'acme.us-east-1',
                        modelName: model.name,
                        tokens: model.tokens,
                        creditsRaw: model.credits * 1000,
                        credits: formatK(model.credits * 1000),
                        insights: model.insightCount || 2
                    }));
                case 'User':
                    return connectionsData.map(acc => ({
                        id: acc.id,
                        accountName: acc.name,
                        accountIdentifier: acc.identifier,
                        userCountRaw: acc.usersCount,
                        userCount: acc.usersCount.toString(),
                        insights: getInsightCount(acc.name, 'User')
                    }));
                case 'Queries':
                    return connectionsData.map(acc => ({
                        id: acc.id,
                        accountName: acc.name,
                        accountIdentifier: acc.identifier,
                        queriesCountRaw: parseInt(acc.queriesCount.replace('K', '')) * 1000,
                        queriesCount: acc.queriesCount,
                        totalRaw: acc.tokens,
                        total: formatK(acc.tokens),
                        insights: getInsightCount(acc.name, 'Queries')
                    }));
                default:
                    return [];
            }
        };

        let rows: any[] = prepareData();

        rows = rows.filter((item: any) => {
            const searchField = (item.accountName || item.modelName || item.appName || '').toLowerCase();
            return searchField.includes(searchTerm.toLowerCase());
        });

        if (sortConfig) {
            rows.sort((a: any, b: any) => {
                const key = sortConfig.key.toLowerCase().split(' ')[0];
                let valA = a[key + 'Raw'] !== undefined ? a[key + 'Raw'] : a[key];
                let valB = b[key + 'Raw'] !== undefined ? b[key + 'Raw'] : b[key];
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const headers = (() => {
            switch (activeCategory) {
                case 'Accounts': return ['Account name', 'Total credits', 'Compute credits', 'Storage credits', 'Cloud service', 'Insights'];
                case 'Compute': return ['Account name', 'Total credits', 'Warehouse', 'Serverless', 'Insights'];
                case 'Storage': return ['Account name', 'Total credits', 'Storage size', 'Unused table size', 'Insights'];
                case 'Cortex': return ['Account name', 'Model name', 'Tokens', 'Credits', 'Insights'];
                case 'User': return ['Account name', 'User count', 'Insights'];
                case 'Queries': return ['Account name', 'Queries count', 'Total credits', 'Insights'];
                case 'Applications': return ['Account name', 'Application name', 'Total credits', 'Insights'];
                case 'Workloads': return ['Account name', 'Workloads', 'Workload credits', 'Queries', 'Avg runtime', 'Idle %', 'Insights'];
                case 'Services': return ['Account name', 'Service credits', 'Services used', 'Queries', 'Trend %', 'Insights'];
                default: return ['Account name', 'Total credits', 'Insights'];
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
            case 'Workloads':
                return [
                    { label: 'Total Workloads', value: '52' },
                    { label: 'Total Workload Spend', value: '168K cr' },
                    { label: 'Avg. Warehouse Idle Time', value: '16%' }
                ];
            case 'Services':
                return [
                    { label: 'Total Service Credits', value: '6.8K cr' },
                    { label: 'Total Queries', value: '83.3K' },
                    { label: 'Total Accounts', value: servicesData.length.toString() }
                ];
            case 'Accounts':
                return [
                    { label: 'Accounts', value: connectionsData.length.toString() },
                    { label: 'Total credits', value: '48.5K' },
                    { label: 'Compute', value: '44.25K' },
                    { label: 'Storage', value: '2.1K' }
                ];
            case 'Compute':
                return [
                    { label: 'Total credits', value: '44.25K' },
                    { label: 'Warehouse', value: '41.1K' },
                    { label: 'Serverless', value: '2.4K' }
                ];
            case 'Storage':
                return [
                    { label: 'Total credits', value: '2.1K' },
                    { label: 'Storage size', value: '36 TB' },
                    { label: 'Unused table size', value: '4.2 TB' }
                ];
            case 'Cortex':
                return [
                    { label: 'Total tokens', value: '12.4M' },
                    { label: 'Cortex credits', value: '1.5K' },
                    { label: 'Active models', value: '6' }
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
                return [];
        }
    }, [activeCategory]);

    const getColumnWidth = (header: string) => {
        if (header.includes('name') || header.includes('type') || header.includes('Account')) return 'w-auto min-w-[200px]';
        if (header === 'Insights') return 'w-[100px]';
        return 'w-[120px]';
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
                <div className="px-6 py-4 flex justify-end items-center border-b border-border-light bg-white rounded-t-[12px] relative z-20 overflow-visible flex-shrink-0">
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

                <div className="overflow-x-auto overflow-y-auto max-h-[500px] no-scrollbar">
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
                                            <span className="whitespace-nowrap">{h}</span>
                                            {h === 'Idle %' && (
                                                <InfoTooltip text="Warehouse stay-alive duration with zero active queries." position="bottom" />
                                            )}
                                            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity ml-1">
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
                                            {/* Primary Account Name Column - Always Clickable */}
                                            <button 
                                                onClick={() => handleAccountClickByName(row.accountName)}
                                                className="text-sm font-bold text-link hover:underline text-left"
                                            >
                                                {row.accountName}
                                            </button>
                                            {row.accountIdentifier && (
                                                <span className="text-[10px] text-text-muted font-mono mt-0.5">{row.accountIdentifier}</span>
                                            )}
                                        </div>
                                    </td>
                                    {tableData.headers.slice(1).map((h) => {
                                        if (h === 'Insights') {
                                            return (
                                                <td key={h} className={`px-6 py-5 text-right ${getColumnWidth(h)}`}>
                                                    <div className="flex items-center justify-end">
                                                        <button 
                                                            onClick={() => onNavigateToRecommendations?.({ search: row.accountName || row.appName || row.modelName })}
                                                            className="inline-flex items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm"
                                                        >
                                                            <span className="text-xs font-black">{row.insights}</span>
                                                            <span className="text-[9px] font-bold uppercase tracking-tighter">Insights</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            );
                                        }

                                        const valKey = (() => {
                                            if (h === 'Total credits') return 'total';
                                            if (h === 'Workload credits') return 'creditsFormatted';
                                            if (h === 'Service credits') return 'creditsFormatted';
                                            if (h === 'Credits') return 'credits';
                                            if (h === 'Trend %') return 'trend';
                                            if (h === 'Volume') return 'volume';
                                            if (h === 'Unit cost') return 'unitCost';
                                            if (h === 'Idle %') return 'idleTime';
                                            if (h === 'Queries') return 'queriesFormatted';
                                            if (h === 'Avg runtime') return 'avgRuntime';
                                            if (h === 'Workloads') return 'workloads';
                                            if (h === 'Services used') return 'count';
                                            if (h === 'Top service') return 'type';
                                            if (h === 'Application name') return 'appName';
                                            if (h === 'Model name') return 'modelName';
                                            if (h === 'User count') return 'userCount';
                                            if (h === 'Queries count') return 'queriesCount';
                                            if (h === 'Storage size') return 'size';
                                            if (h === 'Unused table size') return 'unused';
                                            
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
                                                <span className={`text-sm font-medium ${h === 'Trend %' && val?.includes('↑') ? 'text-status-error font-bold' : h === 'Trend %' && val?.includes('↓') ? 'text-status-success font-bold' : 'text-text-primary'}`}>
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

                <div className="flex-shrink-0 bg-white border-t border-border-light">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={tableData.rows.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(size) => {
                            setItemsPerPage(size);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResourceSummary;