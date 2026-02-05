
import React, { useState, useMemo, useEffect } from 'react';
import { Warehouse, WarehouseHealth } from '../types';
import { IconArrowUp, IconArrowDown, IconSearch, IconSparkles, IconInfo } from '../constants';
import Pagination from '../components/Pagination';
import DateRangeDropdown from '../components/DateRangeDropdown';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

const StatusBadge: React.FC<{ status: Warehouse['status'] }> = ({ status }) => {
    const colorClasses: Record<Warehouse['status'], string> = {
        Running: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        Active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        Suspended: 'bg-slate-100 text-slate-700 border-slate-200',
        Idle: 'bg-blue-50 text-blue-800 border-blue-200',
    };
    const dotClasses: Record<Warehouse['status'], string> = {
        Running: 'bg-emerald-600 animate-pulse',
        Active: 'bg-emerald-600',
        Suspended: 'bg-slate-400',
        Idle: 'bg-blue-600',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border ${colorClasses[status]}`}>
            <span className={`w-1.5 h-1.5 mr-2 rounded-full ${dotClasses[status]}`}></span>
            {status}
        </span>
    );
};

const HealthBadge: React.FC<{ health: WarehouseHealth }> = ({ health }) => {
    const styles = {
        'Optimized': 'bg-emerald-50 text-emerald-800 border-emerald-200',
        'Under-utilized': 'bg-amber-50 text-amber-900 border-amber-200',
        'Over-provisioned': 'bg-red-50 text-red-900 border-red-200',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase rounded border ${styles[health]}`}>
            {health.replace('-', ' ')}
        </span>
    );
};

interface AllWarehousesProps {
    warehouses: Warehouse[];
    onSelectWarehouse: (warehouse: Warehouse) => void;
}

const AllWarehouses: React.FC<AllWarehousesProps> = ({ warehouses, onSelectWarehouse }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Warehouse; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('All');
    const [sizeFilter, setSizeFilter] = useState<string[]>([]);
    const [healthFilter, setHealthFilter] = useState<string[]>([]);

    const warehouseSizes = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large'];
    const healthOptions = ['Optimized', 'Under-utilized', 'Over-provisioned'];

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sizeFilter, healthFilter, itemsPerPage]);

    const filteredAndSortedWarehouses = useMemo(() => {
        let filtered = warehouses.filter(wh => {
            if (search && !wh.name.toLowerCase().includes(search.toLowerCase())) return false;
            if (sizeFilter.length > 0 && !sizeFilter.includes(wh.size)) return false;
            if (healthFilter.length > 0 && !healthFilter.includes(wh.health)) return false;
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
    }, [warehouses, search, sizeFilter, healthFilter, sortConfig]);

    const totalPages = Math.ceil(filteredAndSortedWarehouses.length / itemsPerPage);
    const paginatedData = useMemo(() => filteredAndSortedWarehouses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredAndSortedWarehouses, currentPage, itemsPerPage]);

    const requestSort = (key: keyof Warehouse) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ columnKey: keyof Warehouse }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        return sortConfig.direction === 'ascending' ? <IconArrowUp className="w-4 h-4 ml-1" /> : <IconArrowDown className="w-4 h-4 ml-1" />;
    };

    return (
        <div className="px-6 pt-4 pb-12 flex flex-col space-y-3">
            <div className="mb-8">
                <h1 className="text-[28px] font-bold text-text-strong tracking-tight">Warehouse Inventory</h1>
                <p className="text-sm text-text-secondary font-medium mt-1">Monitor health, sizing, and automated optimization suggestions for all Snowflake clusters.</p>
            </div>
            <div className="bg-surface rounded-xl flex flex-col shadow-sm border border-border-light overflow-hidden">
                <div className="p-2 mb-2 flex-shrink-0 flex items-center gap-x-4 border-b border-border-color">
                    <div className="pl-2"><DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} /></div>
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown label="Size" options={warehouseSizes} selectedOptions={sizeFilter} onChange={setSizeFilter} selectionMode="single" />
                    <div className="h-4 w-px bg-border-color"></div>
                    <MultiSelectDropdown label="Health Status" options={healthOptions} selectedOptions={healthFilter} onChange={setHealthFilter} selectionMode="single" />
                    <div className="relative flex-grow ml-auto">
                        <IconSearch className="h-4 w-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search warehouses..."
                            className="w-full pl-9 pr-4 py-1.5 bg-background border-transparent rounded-full text-[11px] font-medium focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                        <thead className="text-[10px] text-text-secondary uppercase tracking-widest sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-bold text-left border-b border-border-color"><button onClick={() => requestSort('name')} className="group flex items-center">Warehouse <SortIcon columnKey="name" /></button></th>
                                <th scope="col" className="px-6 py-4 font-bold text-left border-b border-border-color"><button onClick={() => requestSort('health')} className="group flex items-center">Health <SortIcon columnKey="health" /></button></th>
                                <th scope="col" className="px-6 py-4 font-bold text-left border-b border-border-color"><button onClick={() => requestSort('size')} className="group flex items-center">Size <SortIcon columnKey="size" /></button></th>
                                <th scope="col" className="px-6 py-4 font-bold text-left border-b border-border-color"><button onClick={() => requestSort('status')} className="group flex items-center">Status <SortIcon columnKey="status" /></button></th>
                                <th scope="col" className="px-6 py-4 font-bold text-left border-b border-border-color"><button onClick={() => requestSort('credits')} className="group flex items-center">Usage <SortIcon columnKey="credits" /></button></th>
                                <th scope="col" className="px-6 py-4 font-bold text-right border-b border-border-color">AI Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary bg-white">
                            {paginatedData.map(wh => (
                                <tr key={wh.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested group">
                                    <td className="px-6 py-3 font-bold text-link whitespace-nowrap">
                                        <button onClick={() => onSelectWarehouse(wh)} className="hover:underline focus:outline-none">
                                            {wh.name}
                                        </button>
                                    </td>
                                    <td className="px-6 py-3">
                                        <HealthBadge health={wh.health} />
                                    </td>
                                    <td className="px-6 py-3 font-medium">{wh.size}</td>
                                    <td className="px-6 py-3"><StatusBadge status={wh.status} /></td>
                                    <td className="px-6 py-3 font-bold text-text-primary">{wh.credits.toLocaleString()} cr</td>
                                    <td className="px-6 py-3 text-right">
                                        {wh.health !== 'Optimized' ? (
                                            <div className="flex justify-end gap-2">
                                                <div className="relative group/note">
                                                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/20">
                                                        <IconSparkles className="w-4 h-4" />
                                                    </button>
                                                    <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-sidebar-topbar text-white text-[11px] rounded-xl shadow-xl opacity-0 invisible group-hover/note:opacity-100 group-hover/note:visible transition-all z-50 pointer-events-none">
                                                        <p className="font-black text-primary mb-1 uppercase tracking-widest">Anavsan Insight</p>
                                                        {wh.optimizationNote}
                                                        <div className="absolute top-full right-4 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-sidebar-topbar"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-emerald-600 font-bold uppercase mr-2">Optimized</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredAndSortedWarehouses.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                />
            </div>
        </div>
    );
};

export default AllWarehouses;
