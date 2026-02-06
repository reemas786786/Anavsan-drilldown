
import React, { useState, useMemo } from 'react';
import { workloadsData, recommendationsData } from '../data/dummyData';
import { IconSearch, IconChevronRight } from '../constants';
import Pagination from '../components/Pagination';

const KPILabel: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white px-5 py-2.5 rounded-full border border-border-light shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:border-primary/30">
        <span className="text-[12px] text-text-secondary font-bold whitespace-nowrap">{label}:</span>
        <span className="text-[13px] font-black text-text-strong whitespace-nowrap">{value}</span>
    </div>
);

interface WorkloadsListViewProps {
    accountName: string;
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
}

const WorkloadsListView: React.FC<WorkloadsListViewProps> = ({ accountName, onNavigateToRecommendations }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Mock data expansion for a single account view
    const localWorkloads = useMemo(() => [
        { id: 'w-1', name: 'Production ETL', warehouse: 'ETL_WH', credits: 42500, queries: 12400, runtime: '4.2s', idle: '8%', type: 'Ingestion' },
        { id: 'w-2', name: 'Executive BI Dashboards', warehouse: 'ANALYTICS_WH', credits: 12400, queries: 45000, runtime: '1.8s', idle: '12%', type: 'Reporting' },
        { id: 'w-3', name: 'ML Training Pipeline', warehouse: 'ML_WH', credits: 3500, queries: 80, runtime: '150.4s', idle: '24%', type: 'Data Science' },
        { id: 'w-4', name: 'Ad-hoc Data Discovery', warehouse: 'COMPUTE_WH', credits: 2100, queries: 1200, runtime: '6.5s', idle: '42%', type: 'Exploration' },
        { id: 'w-5', name: 'Nightly Sync Jobs', warehouse: 'LOAD_WH', credits: 1800, queries: 800, runtime: '8.2s', idle: '15%', type: 'Integration' },
    ], []);

    const filteredWorkloads = useMemo(() => {
        return localWorkloads.filter(w => 
            w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            w.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, localWorkloads]);

    const globalMetrics = useMemo(() => {
        const totalCredits = filteredWorkloads.reduce((sum, w) => sum + w.credits, 0);
        const totalQueries = filteredWorkloads.reduce((sum, w) => sum + w.queries, 0);
        return {
            total: filteredWorkloads.length.toString(),
            credits: totalCredits.toLocaleString(),
            queries: (totalQueries / 1000).toFixed(1) + 'K',
            avgIdle: '16%'
        };
    }, [filteredWorkloads]);

    const paginatedRows = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredWorkloads.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredWorkloads, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredWorkloads.length / itemsPerPage);

    return (
        <div className="flex flex-col h-full bg-background px-6 pt-4 pb-12 space-y-4">
            <div className="flex-shrink-0 mb-8">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Workloads</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">Monitor and optimize performance categories for this account.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                <KPILabel label="Active Workloads" value={globalMetrics.total} />
                <KPILabel label="Total Spend" value={`${globalMetrics.credits} cr`} />
                <KPILabel label="Total Queries" value={globalMetrics.queries} />
                <KPILabel label="Avg. Efficiency" value="84%" />
            </div>

            <div className="bg-white rounded-[12px] border border-border-light shadow-sm overflow-hidden flex flex-col flex-grow min-h-0">
                <div className="px-6 py-4 flex justify-between items-center border-b border-border-light bg-white flex-shrink-0">
                    <div className="relative">
                        <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 outline-none pr-8 placeholder:text-text-muted w-64 text-right"
                            placeholder="Search workloads..."
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow min-h-0 no-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-[#F8F9FA] sticky top-0 z-10 font-bold uppercase tracking-widest text-[10px] text-text-muted">
                            <tr>
                                <th className="px-6 py-4 border-b border-border-light">Workload name</th>
                                <th className="px-6 py-4 border-b border-border-light">Warehouse</th>
                                <th className="px-6 py-4 border-b border-border-light">Type</th>
                                <th className="px-6 py-4 border-b border-border-light">Credits</th>
                                <th className="px-6 py-4 border-b border-border-light">Queries</th>
                                <th className="px-6 py-4 border-b border-border-light">Avg. Runtime</th>
                                <th className="px-6 py-4 border-b border-border-light">Idle %</th>
                                <th className="px-6 py-4 border-b border-border-light text-right">Insights</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border-light">
                            {paginatedRows.map(row => (
                                <tr key={row.id} className="hover:bg-surface-nested transition-colors group">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-text-strong">{row.name}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-link cursor-pointer hover:underline">{row.warehouse}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-black uppercase text-text-muted bg-surface-nested px-2 py-1 rounded border border-border-light">{row.type}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-text-strong">{row.credits.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-text-secondary">{row.queries.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-medium text-text-secondary">{row.runtime}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-sm font-bold ${parseInt(row.idle) > 20 ? 'text-status-warning' : 'text-text-primary'}`}>{row.idle}</span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => onNavigateToRecommendations?.({ search: row.name })}
                                                className="inline-flex items-center gap-1 bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm"
                                            >
                                                <span className="text-xs font-black">{Math.floor(Math.random() * 5) + 1}</span>
                                                <span className="text-[9px] font-bold uppercase">Insights</span>
                                            </button>
                                            <button className="p-2 rounded-full hover:bg-primary/10 text-text-muted group-hover:text-primary transition-all">
                                                <IconChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex-shrink-0 bg-white border-t border-border-light">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredWorkloads.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkloadsListView;
