
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Recommendation, ResourceType, SeverityImpact, Account, RecommendationStatus, QueryListItem, Warehouse } from '../types';
import { recommendationsData as initialData, connectionsData } from '../data/dummyData';
import { IconSearch, IconDotsVertical, IconArrowUp, IconArrowDown, IconInfo, IconChevronRight, IconChevronDown, IconClose, IconChevronLeft, IconWand, IconUser } from '../constants';
import Pagination from '../components/Pagination';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

// --- SUB-COMPONENTS ---

const SeverityBadge: React.FC<{ severity: SeverityImpact }> = ({ severity }) => {
    const colorClasses: Record<SeverityImpact, string> = {
        'High': 'bg-red-50 text-red-700 border-red-200',
        'High Cost': 'bg-red-50 text-red-700 border-red-200',
        'Medium': 'bg-amber-50 text-amber-800 border-amber-200',
        'Low': 'bg-slate-50 text-slate-700 border-slate-200',
        'Cost Saving': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'Performance Boost': 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${colorClasses[severity] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
            {severity}
        </span>
    );
};

const StatusBadge: React.FC<{ status: RecommendationStatus }> = ({ status }) => {
    const colorClasses: Record<RecommendationStatus, string> = {
        'New': 'bg-blue-50 text-blue-700 border-blue-200',
        'Read': 'bg-slate-50 text-slate-600 border-slate-200',
        'In Progress': 'bg-amber-50 text-amber-800 border-amber-200',
        'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-300',
        'Archived': 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

// --- NEW FULL SCREEN DETAIL VIEW ---

interface RecommendationDetailViewProps {
    recommendation: Recommendation;
    onBack: () => void;
    onUpdateStatus: (id: string, status: RecommendationStatus) => void;
    onAssign: (rec: Recommendation) => void;
    onOptimize: (rec: Recommendation) => void;
    onNavigateToQuery: (query: Partial<QueryListItem>) => void;
    onNavigateToWarehouse: (warehouse: Partial<Warehouse>) => void;
}

const RecommendationDetailView: React.FC<RecommendationDetailViewProps> = ({ 
    recommendation, 
    onBack, 
    onUpdateStatus,
    onAssign,
    onOptimize,
    onNavigateToQuery,
    onNavigateToWarehouse
}) => {
    const formatTimestamp = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
        });
    };

    const StatusOption: React.FC<{ status: RecommendationStatus }> = ({ status }) => (
        <button 
            onClick={() => onUpdateStatus(recommendation.id, status)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                recommendation.status === status 
                ? 'bg-primary text-white border-primary shadow-sm' 
                : 'bg-white text-text-secondary border-border-color hover:border-primary hover:text-primary'
            }`}
        >
            {status}
        </button>
    );

    const DetailItem = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</span>
            <span className="text-sm font-medium text-text-primary mt-1">{value}</span>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-background space-y-6">
            {/* Page Header */}
            <header className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onBack}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-text-secondary border border-border-light hover:bg-surface-hover transition-all shadow-sm flex-shrink-0"
                        >
                            <IconChevronLeft className="h-6 w-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-text-strong tracking-tight">Recommendation Details</h1>
                            <p className="text-sm text-text-secondary mt-0.5">Ref: {recommendation.id}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => onOptimize(recommendation)}
                            className="px-6 py-2.5 bg-white text-primary border-2 border-primary font-bold text-sm rounded-full hover:bg-primary/5 transition-all flex items-center gap-2"
                        >
                            <IconWand className="w-4 h-4" />
                            Optimize
                        </button>
                        <button 
                            onClick={() => onAssign(recommendation)}
                            className="px-8 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                        >
                            <IconUser className="w-4 h-4" />
                            Assign Task
                        </button>
                    </div>
                </div>
            </header>

            {/* Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto no-scrollbar pb-12">
                
                {/* Left Section: Information & Workflow */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-sm space-y-8">
                        <div>
                            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Workflow Status</h4>
                            <div className="flex flex-wrap gap-2">
                                {(['New', 'Read', 'In Progress', 'Resolved', 'Archived'] as RecommendationStatus[]).map(s => (
                                    <StatusOption key={s} status={s} />
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border-light">
                            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Insight Type</h4>
                            <p className="text-xl font-bold text-primary">{recommendation.insightType}</p>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Message Summary</h4>
                            <p className="text-text-primary text-base leading-relaxed font-medium">{recommendation.message}</p>
                        </div>

                        {recommendation.detailedExplanation && (
                            <div className="bg-surface-nested p-6 rounded-[20px] border border-border-light">
                                <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3">Detailed Explanation</h4>
                                <p className="text-text-secondary text-sm leading-relaxed italic">{recommendation.detailedExplanation}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-8 rounded-[24px] border border-border-light shadow-sm">
                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6">Technical Impact Context</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(recommendation.resourceType === 'Query' || recommendation.resourceType === 'Application' || recommendation.resourceType === 'Database') && (
                                <>
                                    <div className="p-5 bg-background rounded-2xl flex flex-col items-center justify-center text-center border border-border-light">
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Baseline Usage</p>
                                        <p className="text-2xl font-black text-text-strong">{recommendation.metrics?.creditsBefore?.toFixed(2) || '0.00'} <span className="text-xs font-bold text-text-muted">cr</span></p>
                                    </div>
                                    <div className="p-5 bg-status-success-light rounded-2xl flex flex-col items-center justify-center text-center border border-status-success/10">
                                        <p className="text-[10px] text-status-success-dark font-bold uppercase tracking-widest mb-1">Estimated Savings</p>
                                        <p className="text-2xl font-black text-status-success-dark">-{recommendation.metrics?.estimatedSavings?.toFixed(2) || '0.00'} <span className="text-xs font-bold opacity-60">cr</span></p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section: Metadata & Resource Link */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-[24px] border border-border-light shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-light pb-4">Metadata</h4>
                        <div className="space-y-6">
                            <DetailItem label="Resource Type" value={recommendation.resourceType} />
                            <DetailItem label="Account" value={recommendation.accountName} />
                            <DetailItem label="Severity" value={<SeverityBadge severity={recommendation.severity} />} />
                            <DetailItem label="Created At" value={formatTimestamp(recommendation.timestamp)} />
                        </div>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-[24px] border border-primary/10 space-y-4">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Affected Resource</h4>
                        <div className="bg-white/50 p-4 rounded-xl border border-primary/5">
                            <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Resource ID/Name</p>
                            <span className="text-xs font-mono font-bold text-text-primary block truncate mb-4" title={recommendation.affectedResource}>
                                {recommendation.affectedResource}
                            </span>
                            <button 
                                onClick={() => {
                                    if (recommendation.resourceType === 'Query') onNavigateToQuery({ id: recommendation.affectedResource });
                                    if (recommendation.resourceType === 'Warehouse') onNavigateToWarehouse({ name: recommendation.affectedResource });
                                }}
                                className="w-full bg-white text-primary font-bold text-xs py-2 rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                View full profile
                                <IconChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---

const Recommendations: React.FC<{ 
    accounts: Account[];
    initialFilters?: { search?: string; account?: string };
    onNavigateToQuery: (query: Partial<QueryListItem>) => void;
    onNavigateToWarehouse: (warehouse: Partial<Warehouse>) => void;
    onAssignTask?: (recommendation: Recommendation) => void;
    selectedRecommendation: Recommendation | null;
    onSelectRecommendation: (rec: Recommendation | null) => void;
}> = ({ accounts, initialFilters, onNavigateToQuery, onNavigateToWarehouse, onAssignTask, selectedRecommendation, onSelectRecommendation }) => {
    const [data, setData] = useState<Recommendation[]>(initialData);
    const [search, setSearch] = useState('');
    const [isContextual, setIsContextual] = useState(false);
    const [resourceTypeFilter, setResourceTypeFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [accountFilter, setAccountFilter] = useState<string[]>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const [sortConfig, setSortConfig] = useState<{ key: keyof Recommendation; direction: 'ascending' | 'descending' } | null>({ key: 'timestamp', direction: 'descending' });

    useEffect(() => {
        if (initialFilters?.search || initialFilters?.account) {
            if (initialFilters.search) setSearch(initialFilters.search);
            if (initialFilters.account) setAccountFilter([initialFilters.account]);
            
            setIsContextual(true);
            setCurrentPage(1); 
        }
    }, [initialFilters]);

    const handleClearContext = () => {
        setSearch('');
        setAccountFilter([]);
        setIsContextual(false);
        setCurrentPage(1);
    };

    const filteredAndSortedData = useMemo(() => {
        let filtered = data.filter(rec => {
            if (isContextual && search) {
                const searchLower = search.toLowerCase();
                const isExactMatch = rec.affectedResource.toLowerCase() === searchLower || rec.accountName.toLowerCase() === searchLower;
                if (!isExactMatch) return false;
            } else if (search && !(
                rec.affectedResource.toLowerCase().includes(search.toLowerCase()) ||
                rec.message.toLowerCase().includes(search.toLowerCase()) ||
                rec.insightType.toLowerCase().includes(search.toLowerCase()) ||
                rec.resourceType.toLowerCase().includes(search.toLowerCase())
            )) return false;

            if (resourceTypeFilter.length > 0 && !resourceTypeFilter.includes(rec.resourceType)) return false;
            if (statusFilter.length > 0 && !statusFilter.includes(rec.status)) return false;
            if (accountFilter.length > 0 && !accountFilter.includes(rec.accountName)) return false;

            return true;
        });

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [data, search, resourceTypeFilter, statusFilter, accountFilter, sortConfig, isContextual]);

    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedData, currentPage, itemsPerPage]);

    const handleUpdateStatus = (id: string, status: RecommendationStatus) => {
        setData(prev => prev.map(rec => rec.id === id ? { ...rec, status } : rec));
        if (selectedRecommendation?.id === id) {
            onSelectRecommendation({ ...selectedRecommendation, status });
        }
    };

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const accountOptions = useMemo(() => connectionsData.map(a => a.name), []);

    const contextTagLabel = useMemo(() => {
        if (!isContextual) return null;
        if (initialFilters?.account) return initialFilters.account;
        if (initialFilters?.search) return initialFilters.search;
        return "Applied Filters";
    }, [isContextual, initialFilters]);

    // If a recommendation is selected, render the Detail View instead of the List View
    if (selectedRecommendation) {
        return (
            <div className="px-6 pt-4 pb-12 h-full overflow-hidden">
                <RecommendationDetailView 
                    recommendation={selectedRecommendation}
                    onBack={() => onSelectRecommendation(null)}
                    onUpdateStatus={handleUpdateStatus}
                    onAssign={(rec) => onAssignTask?.(rec)}
                    onOptimize={(rec) => {
                        console.log('Optimize triggered for:', rec.id);
                    }}
                    onNavigateToQuery={onNavigateToQuery}
                    onNavigateToWarehouse={onNavigateToWarehouse}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background space-y-4 px-6 pt-4 pb-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Recommendations</h1>
                    <p className="text-sm text-text-secondary font-medium mt-1">
                        Optimize your Snowflake environment with AI-powered insights tailored for performance, cost-efficiency, and operational excellence.
                    </p>
                </div>
                {isContextual && (
                    <div className="flex items-center gap-2 bg-primary/10 pl-3 pr-1 py-1 rounded-full border border-primary/20 animate-in fade-in slide-in-from-right-4 duration-300">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">CONTEXT:</span>
                        <span className="text-xs font-bold text-text-strong">{contextTagLabel}</span>
                        <button onClick={handleClearContext} className="p-1 hover:bg-primary/20 rounded-full text-primary">
                            <IconClose className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-surface rounded-2xl shadow-sm overflow-hidden border border-border-light flex flex-col min-h-0">
                <div className="px-4 py-3 flex items-center gap-5 text-xs text-text-secondary border-b border-border-light flex-shrink-0">
                    <MultiSelectDropdown 
                        label="Account" 
                        options={accountOptions} 
                        selectedOptions={accountFilter} 
                        onChange={setAccountFilter} 
                        selectionMode="single" 
                    />
                    <div className="w-px h-3 bg-border-color"></div>
                    <MultiSelectDropdown 
                        label="Resource" 
                        options={['Query', 'Warehouse', 'Storage', 'Database', 'User', 'Application', 'Account']} 
                        selectedOptions={resourceTypeFilter} 
                        onChange={setResourceTypeFilter} 
                    />
                    <div className="w-px h-3 bg-border-color"></div>
                    <MultiSelectDropdown 
                        label="Status" 
                        options={['New', 'Read', 'In Progress', 'Resolved', 'Archived']} 
                        selectedOptions={statusFilter} 
                        onChange={setStatusFilter} 
                    />
                    
                    <div className="relative flex-grow ml-auto" style={{maxWidth: '240px'}}>
                        <IconSearch className="h-3.5 w-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="search" 
                            value={search} 
                            onChange={e => handleSearchChange(e.target.value)} 
                            placeholder="Search..." 
                            className="w-full pl-8 pr-4 py-1.5 bg-background border-transparent rounded-full text-[10px] font-medium focus:ring-1 focus:ring-primary" 
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow min-h-0">
                    <table className="w-full text-[12px] border-separate border-spacing-0">
                        <thead className="text-[10px] text-text-secondary uppercase tracking-widest sticky top-0 z-10 bg-[#F8F9FA] border-b border-border-color">
                            <tr>
                                <th className="px-5 py-3 font-bold text-left border-b border-border-color">Type</th>
                                <th className="px-5 py-3 font-bold text-left border-b border-border-color">Resource</th>
                                <th className="px-5 py-3 font-bold text-left border-b border-border-color">Recommendation</th>
                                <th className="px-5 py-3 font-bold text-left border-b border-border-color">Status</th>
                                <th className="px-5 py-3 font-bold text-right border-b border-border-color">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {paginatedData.length > 0 ? paginatedData.map((rec) => (
                                <tr 
                                    key={rec.id} 
                                    onClick={() => onSelectRecommendation(rec)}
                                    className="hover:bg-surface-nested transition-colors cursor-pointer group"
                                >
                                    <td className="px-5 py-4 font-bold text-text-primary border-b border-border-light">{rec.resourceType}</td>
                                    <td className="px-5 py-4 font-mono text-[11px] text-text-primary max-w-[160px] truncate border-b border-border-light" title={rec.affectedResource}>{rec.affectedResource}</td>
                                    <td className="px-5 py-4 max-w-xs truncate border-b border-border-light text-text-secondary" title={rec.message}>{rec.message}</td>
                                    <td className="px-5 py-4 border-b border-border-light"><StatusBadge status={rec.status} /></td>
                                    <td className="px-5 py-4 text-right border-b border-border-light">
                                        <button className="p-1.5 rounded-full border border-border-color text-text-muted group-hover:text-primary group-hover:border-primary transition-colors" title="View Details">
                                            <IconInfo className="h-3.5 w-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-surface-nested rounded-full flex items-center justify-center mb-4 border border-border-light">
                                                <IconSearch className="w-6 h-6 text-text-muted" />
                                            </div>
                                            <p className="text-sm font-bold text-text-strong">No recommendations found</p>
                                            <p className="text-xs text-text-secondary mt-1">Try adjusting your filters or search criteria.</p>
                                            {isContextual && (
                                                <button onClick={handleClearContext} className="mt-4 text-xs font-bold text-primary hover:underline underline-offset-4">
                                                    Clear contextual filter
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex-shrink-0">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredAndSortedData.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={(page) => setCurrentPage(page)}
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

export default Recommendations;
