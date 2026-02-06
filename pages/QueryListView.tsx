
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { queryListData as initialData, warehousesData } from '../data/dummyData';
import { QueryListItem, QueryListFilters } from '../types';
import { IconSearch, IconDotsVertical, IconView, IconBeaker, IconWand, IconShare, IconAdjustments, IconChevronDown, IconChevronLeft, IconChevronRight } from '../constants';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import DateRangeDropdown from '../components/DateRangeDropdown';
import ColumnSelector from '../components/ColumnSelector';

const allColumns = [
    { key: 'queryId', label: 'Query ID' },
    { key: 'credits', label: 'Credits' },
    { key: 'duration', label: 'Duration' },
    { key: 'warehouse', label: 'Warehouse' },
];

interface QueryListViewProps {
    onShareQueryClick: (query: QueryListItem) => void;
    onSelectQuery: (query: QueryListItem) => void;
    onAnalyzeQuery: (query: QueryListItem) => void;
    onOptimizeQuery: (query: QueryListItem) => void;
    onSimulateQuery: (query: QueryListItem) => void;
    filters: QueryListFilters;
    setFilters: React.Dispatch<React.SetStateAction<QueryListFilters>>;
}

const QueryListView: React.FC<QueryListViewProps> = ({
    onShareQueryClick,
    onSelectQuery,
    onAnalyzeQuery,
    onOptimizeQuery,
    onSimulateQuery,
    filters,
    setFilters,
}) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [searchVisible, setSearchVisible] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFilterChange = <K extends keyof QueryListFilters>(key: K, value: QueryListFilters[K]) => {
        setFilters(prev => ({ ...prev, [key]: value, currentPage: 1 }));
    };

    const paginatedData = useMemo(() => {
        return initialData.slice((filters.currentPage - 1) * filters.itemsPerPage, filters.currentPage * filters.itemsPerPage);
    }, [filters.currentPage, filters.itemsPerPage]);

    const totalPages = Math.ceil(initialData.length / filters.itemsPerPage);

    return (
        <div className="flex flex-col h-full bg-background space-y-3 px-6 pt-4 pb-12">
            <div className="flex-shrink-0 mb-8">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">All queries</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">View and analyze all queries executed in this account.</p>
            </div>
            
            <div className="bg-surface rounded-2xl flex flex-col flex-grow min-h-0 shadow-sm border border-border-light overflow-hidden">
                {/* Refined Filter Bar: Added relative z-20 and removed vertical clipping overflow */}
                <div className="px-4 py-3 flex items-center gap-6 text-[12px] text-text-secondary border-b border-border-light whitespace-nowrap overflow-visible relative z-20 bg-white">
                    <DateRangeDropdown selectedValue={filters.dateFilter} onChange={(val) => handleFilterChange('dateFilter', val)} />
                    
                    <div className="w-px h-3 bg-border-color hidden sm:block"></div>
                    
                    <MultiSelectDropdown 
                        label="Warehouse" 
                        options={warehousesData.map(w => w.name)} 
                        selectedOptions={filters.warehouseFilter} 
                        onChange={(val) => handleFilterChange('warehouseFilter', val)} 
                    />
                    
                    <div className="w-px h-3 bg-border-color hidden sm:block"></div>
                    
                    <MultiSelectDropdown 
                        label="Status" 
                        options={['Success', 'Failed']} 
                        selectedOptions={filters.statusFilter} 
                        onChange={(val) => handleFilterChange('statusFilter', val)} 
                    />

                    <div className="w-px h-3 bg-border-color hidden sm:block"></div>

                    <div className="flex items-center gap-2">
                        <span className="text-text-secondary">Filter</span>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        {searchVisible ? (
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="Search..." 
                                className="bg-background border-none rounded-full px-3 py-1 text-[11px] focus:ring-1 focus:ring-primary w-32"
                                onBlur={() => setSearchVisible(false)}
                            />
                        ) : (
                            <button onClick={() => setSearchVisible(true)} className="text-text-muted hover:text-primary transition-colors">
                                <IconSearch className="w-4 h-4" />
                            </button>
                        )}
                        <ColumnSelector 
                            columns={allColumns} 
                            visibleColumns={filters.visibleColumns} 
                            onVisibleColumnsChange={(cols) => handleFilterChange('visibleColumns', cols)} 
                            defaultColumns={['queryId']} 
                        />
                    </div>
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto flex-grow min-h-0 no-scrollbar">
                    <table className="w-full text-[13px] border-separate border-spacing-0">
                        <thead className="text-[11px] text-text-secondary uppercase font-bold sticky top-0 z-10 bg-white border-b border-border-light">
                            <tr>
                                <th className="px-6 py-4 text-left border-b border-border-light">Query ID</th>
                                <th className="px-6 py-4 text-left border-b border-border-light">Credits</th>
                                <th className="px-6 py-4 text-left border-b border-border-light">Duration</th>
                                <th className="px-6 py-4 text-left border-b border-border-light">Warehouse</th>
                                <th className="px-6 py-4 text-right border-b border-border-light"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {paginatedData.map((query, idx) => (
                                <tr key={query.id} className="group hover:bg-surface-hover transition-colors relative">
                                    <td className="px-6 py-4 relative">
                                        {/* Row accent bar */}
                                        <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r ${query.status === 'Success' ? 'bg-status-success' : 'bg-status-error'}`}></div>
                                        <button 
                                            onClick={() => onSelectQuery(query)}
                                            className="text-link hover:underline font-medium text-left truncate max-w-[200px] block"
                                        >
                                            {query.id}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 font-black text-text-strong">
                                        {query.costCredits.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {query.duration}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {query.warehouse}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block" ref={openMenuId === query.id ? menuRef : null}>
                                            <button 
                                                onClick={() => setOpenMenuId(openMenuId === query.id ? null : query.id)}
                                                className="p-1 rounded-full text-text-muted hover:text-primary transition-colors"
                                            >
                                                <IconDotsVertical className="h-5 w-5" />
                                            </button>
                                            {openMenuId === query.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl bg-surface shadow-xl z-20 border border-border-color overflow-hidden">
                                                    <div className="py-1">
                                                        <button onClick={() => { onSelectQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover"><IconView className="w-4 h-4"/> View details</button>
                                                        <button onClick={() => { onAnalyzeQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover"><IconSearch className="w-4 h-4"/> Analyze</button>
                                                        <button onClick={() => { onOptimizeQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover"><IconWand className="w-4 h-4"/> Optimize</button>
                                                        <button onClick={() => { onSimulateQuery(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover"><IconBeaker className="w-4 h-4"/> Simulate</button>
                                                        <div className="my-1 border-t border-border-color"></div>
                                                        <button onClick={() => { onShareQueryClick(query); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover"><IconShare className="w-4 h-4"/> Assign query</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Refined Pagination */}
                <div className="px-4 py-3 flex items-center justify-between bg-white border-t border-border-light text-[11px] font-medium text-text-secondary">
                    <div className="flex items-center gap-2">
                        <span>Items per page:</span>
                        <div className="relative group">
                            <select 
                                value={filters.itemsPerPage}
                                onChange={(e) => handleFilterChange('itemsPerPage', Number(e.target.value))}
                                className="appearance-none bg-transparent pr-4 font-bold text-text-strong cursor-pointer focus:outline-none"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <IconChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        <span>{((filters.currentPage - 1) * filters.itemsPerPage) + 1}–{Math.min(filters.currentPage * filters.itemsPerPage, initialData.length)} of {initialData.length} items</span>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="relative group">
                                    <select 
                                        value={filters.currentPage}
                                        onChange={(e) => handleFilterChange('currentPage', Number(e.target.value))}
                                        className="appearance-none bg-transparent pr-4 font-bold text-text-strong cursor-pointer focus:outline-none"
                                    >
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <option key={i} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                    <IconChevronDown className="w-3 h-3 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                <span className="text-text-muted">of {totalPages} pages</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    disabled={filters.currentPage === 1}
                                    onClick={() => handleFilterChange('currentPage', filters.currentPage - 1)}
                                    className="p-1 rounded hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <IconChevronLeft className="w-4 h-4" />
                                </button>
                                <button 
                                    disabled={filters.currentPage === totalPages}
                                    onClick={() => handleFilterChange('currentPage', filters.currentPage + 1)}
                                    className="p-1 rounded hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <IconChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryListView;
