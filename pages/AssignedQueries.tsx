
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AssignedQuery, AssignmentStatus, AssignmentPriority, User } from '../types';
import { 
    IconDotsVertical, 
    IconSearch, 
    IconAdjustments, 
    IconClipboardList, 
    IconChevronDown 
} from '../constants';
import Pagination from '../components/Pagination';
import DateRangeDropdown from '../components/DateRangeDropdown';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

// --- SUB-COMPONENTS ---

const KPICard: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
    <div className="bg-white px-8 py-4 rounded-[16px] border border-border-light shadow-sm min-w-[140px] flex flex-col justify-center gap-1 transition-all hover:border-primary/30 group">
        <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider group-hover:text-primary transition-colors">
            {label}:
        </span>
        <span className="text-[18px] font-black text-text-strong tracking-tight leading-none">
            {value}
        </span>
    </div>
);

const PriorityBadge: React.FC<{ priority: AssignmentPriority }> = ({ priority }) => {
    const colorClasses = {
        Low: 'bg-slate-50 text-slate-700 border-slate-200',
        Medium: 'bg-amber-50 text-amber-800 border-amber-200',
        High: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${colorClasses[priority]}`}>
            {priority}
        </span>
    );
};

const StatusBadge: React.FC<{ status: AssignmentStatus }> = ({ status }) => {
    const colorClasses: Record<string, string> = {
        'Assigned': 'bg-blue-50 text-blue-700 border-blue-200',
        'In progress': 'bg-amber-50 text-amber-800 border-amber-200',
        'Optimized': 'bg-emerald-50 text-emerald-700 border-emerald-300',
        'Cannot be optimized': 'bg-red-50 text-red-700 border-red-200',
        'Needs clarification': 'bg-purple-50 text-purple-700 border-purple-200',
    };
    
    // Mapping for UI consistency with the requested Pending/Resolved naming if necessary
    const displayStatus = status === 'Assigned' ? 'PENDING' : status.toUpperCase();
    
    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${colorClasses[status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
            {displayStatus}
        </span>
    );
};

interface AssignedQueriesProps {
    assignedQueries: AssignedQuery[];
    currentUser: User | null;
    onViewQuery: (queryId: string) => void;
    onResolveQuery: (id: string) => void;
}

const AssignedQueries: React.FC<AssignedQueriesProps> = ({ assignedQueries, currentUser, onViewQuery, onResolveQuery }) => {
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('All');
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const stats = useMemo(() => {
        return {
            total: assignedQueries.length,
            high: assignedQueries.filter(q => q.priority === 'High').length,
            medium: assignedQueries.filter(q => q.priority === 'Medium').length,
            low: assignedQueries.filter(q => q.priority === 'Low').length,
        };
    }, [assignedQueries]);

    const filteredQueries = useMemo(() => {
        return assignedQueries.filter(q => {
            if (search && !(
                q.queryId.toLowerCase().includes(search.toLowerCase()) ||
                q.message.toLowerCase().includes(search.toLowerCase()) ||
                q.assignedTo.toLowerCase().includes(search.toLowerCase())
            )) return false;

            if (priorityFilter.length > 0 && !priorityFilter.includes(q.priority)) return false;
            if (statusFilter.length > 0 && !statusFilter.includes(q.status)) return false;

            return true;
        });
    }, [assignedQueries, search, priorityFilter, statusFilter]);

    const totalPages = Math.ceil(filteredQueries.length / itemsPerPage);
    const paginatedData = filteredQueries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="flex flex-col h-full bg-background px-6 pt-4 pb-12 space-y-6">
            <header className="flex-shrink-0">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Assigned Queries</h1>
                <p className="text-sm text-text-secondary mt-1">Track queries that have been assigned to you or by you for optimization.</p>
            </header>

            {/* Filter Bar Row */}
            <div className="px-6 py-2 flex items-center justify-between whitespace-nowrap text-[13px] text-text-secondary">
                <div className="flex items-center gap-8">
                    <DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} />
                    
                    <div className="w-px h-4 bg-border-color"></div>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-text-muted font-medium">Priority:</span>
                        <MultiSelectDropdown 
                            label="All" 
                            options={['Low', 'Medium', 'High']} 
                            selectedOptions={priorityFilter} 
                            onChange={setPriorityFilter} 
                            selectionMode="single"
                            layout="inline"
                        />
                    </div>

                    <div className="w-px h-4 bg-border-color"></div>

                    <div className="flex items-center gap-3">
                        <span className="text-text-muted font-medium">Status:</span>
                        <MultiSelectDropdown 
                            label="All" 
                            options={['Assigned', 'In progress', 'Optimized', 'Cannot be optimized', 'Needs clarification']} 
                            selectedOptions={statusFilter} 
                            onChange={setStatusFilter} 
                            selectionMode="single"
                            layout="inline"
                        />
                    </div>

                    <div className="w-px h-4 bg-border-color"></div>

                    <div className="flex items-center gap-3">
                        <span className="text-text-muted font-medium">Assignee:</span>
                        <MultiSelectDropdown 
                            label="All" 
                            options={[...new Set(assignedQueries.map(q => q.assignedTo))]} 
                            selectedOptions={[]} 
                            onChange={() => {}} 
                            selectionMode="single"
                            layout="inline"
                        />
                    </div>
                </div>

                <div className="relative w-72">
                    <IconSearch className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="search" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search query or message..."
                        className="w-full bg-[#F2F4F7] border-none rounded-lg py-2 pl-4 pr-10 text-[13px] font-medium focus:ring-1 focus:ring-primary placeholder:text-text-muted"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[12px] border border-border-light shadow-sm flex flex-col overflow-hidden flex-grow min-h-0">
                {/* Table Section */}
                <div className="overflow-y-auto flex-grow min-h-0 no-scrollbar">
                    {filteredQueries.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-20 text-center">
                            <div className="w-16 h-16 bg-surface-nested rounded-full flex items-center justify-center mb-4">
                                <IconClipboardList className="w-8 h-8 text-text-muted" />
                            </div>
                            <h3 className="text-base font-bold text-text-strong">No assigned queries found</h3>
                            <p className="text-sm text-text-secondary mt-1">There are no queries matching your search or filters.</p>
                        </div>
                    ) : (
                        <table className="w-full text-[13px] text-left border-separate border-spacing-0">
                            <thead className="bg-[#E0E2E5] sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-text-strong tracking-tight w-[150px]">Query ID</th>
                                    <th className="px-6 py-4 font-bold text-text-strong tracking-tight">Description</th>
                                    <th className="px-6 py-4 font-bold text-text-strong tracking-tight w-[120px]">Credits</th>
                                    <th className="px-6 py-4 font-bold text-text-strong tracking-tight w-[150px]">Assigned To</th>
                                    <th className="px-6 py-4 font-bold text-text-strong tracking-tight w-[120px]">Priority &darr;</th>
                                    <th className="px-6 py-4 font-bold text-text-strong tracking-tight w-[120px]">Status</th>
                                    <th className="px-6 py-4 font-bold text-text-strong tracking-tight w-[150px]">Assigned Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {paginatedData.map((query) => (
                                    <tr 
                                        key={query.id} 
                                        className="hover:bg-surface-nested group transition-colors relative border-b border-border-light"
                                    >
                                        <td className="px-6 py-5">
                                            <button 
                                                onClick={() => onViewQuery(query.queryId)}
                                                className="text-link font-medium hover:underline text-left truncate block w-full"
                                                title={query.queryId}
                                            >
                                                {query.queryId}
                                            </button>
                                        </td>
                                        <td className="px-6 py-5 text-text-secondary italic">
                                            <span className="truncate block max-w-md" title={query.message}>
                                                "{query.message}"
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-bold text-text-strong">
                                            {query.credits.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-5 text-text-primary">
                                            {query.assignedTo}
                                        </td>
                                        <td className="px-6 py-5">
                                            <PriorityBadge priority={query.priority} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={query.status} />
                                        </td>
                                        <td className="px-6 py-5 text-text-muted font-medium whitespace-nowrap">
                                            {new Date(query.assignedOn).toLocaleDateString('en-US', {
                                                month: '2-digit',
                                                day: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="flex-shrink-0 border-t border-border-light">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredQueries.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default AssignedQueries;
