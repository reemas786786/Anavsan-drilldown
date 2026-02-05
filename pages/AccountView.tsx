import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Account, SQLFile, BigScreenWidget, QueryListItem, PullRequest, User, QueryListFilters, SlowQueryFilters, BreadcrumbItem, Warehouse, AssignedQuery } from '../types';
import AccountOverviewDashboard from './AccountOverviewDashboard';
import { SimilarQueryPatternsView } from './QueryPerformanceView';
import { accountNavItems } from '../constants';
import Breadcrumb from '../components/Breadcrumb';
import { 
    IconChevronDown, 
} from '../constants';
import QueryListView from './QueryListView';
import StorageSummaryView from './StorageSummaryView';
import DatabasesView from './DatabasesView';
import QueryDetailView from './QueryDetailView';
import PullRequestsView from './PullRequestsView';
import PullRequestDetailView from './PullRequestDetailView';
import MyBranchesView from './Dashboard'; // Re-using Dashboard.tsx for MyBranchesView
import QueryVersionsView from './QueryWorkspace'; // Re-using QueryWorkspace.tsx for QueryVersionsView
import QueryAnalyzerView from './QueryAnalyzerView';
import QueryOptimizerView from './QueryOptimizerView';
import QuerySimulatorView from './QuerySimulatorView';
import SlowQueriesView from './SlowQueriesView';
import WarehouseOverview from './WarehouseOverview';
import AllWarehouses from './AllWarehouses';
import WarehouseDetailView from './WarehouseDetailView';
import ContextualSidebar from '../components/ContextualSidebar';
import ApplicationsView from './ApplicationsView';


interface AccountViewProps {
    account: Account;
    accounts: Account[];
    onSwitchAccount: (account: Account) => void;
    onBackToAccounts: () => void;
    backLabel?: string;
    sqlFiles: SQLFile[];
    onSaveQueryClick: (tag: string) => void;
    onSetBigScreenWidget: (widget: BigScreenWidget) => void;
    activePage: string;
    onPageChange: (page: string) => void;
    onShareQueryClick: (query: QueryListItem) => void;
    onPreviewQuery: (query: QueryListItem) => void;
    selectedQuery: QueryListItem | null;
    setSelectedQuery: (query: QueryListItem | null) => void;
    analyzingQuery: QueryListItem | null;
    onAnalyzeQuery: (query: QueryListItem | null, source: string) => void;
    onOptimizeQuery: (query: QueryListItem | null, source: string) => void;
    onSimulateQuery: (query: QueryListItem | null, source: string) => void;
    pullRequests: PullRequest[];
    selectedPullRequest: PullRequest | null;
    setSelectedPullRequest: (pr: PullRequest | null) => void;
    users: User[];
    navigationSource: string | null;
    selectedWarehouse: Warehouse | null;
    setSelectedWarehouse: (warehouse: Warehouse | null) => void;
    warehouses: Warehouse[];
    assignment?: AssignedQuery;
    currentUser: User | null;
    onUpdateAssignmentStatus: (assignmentId: string, status: any) => void;
    onAssignToEngineer: (query: QueryListItem) => void;
    onResolveAssignment: (assignmentId: string) => void;
    selectedApplicationId?: string | null;
    setSelectedApplicationId: (id: string | null) => void;
    breadcrumbItems: BreadcrumbItem[];
    onNavigateToRecommendations?: (filters: { search?: string; account?: string }) => void;
}

const MobileNav: React.FC<{
    activePage: string;
    onPageChange: (page: string) => void;
    accountNavItems: any[];
}> = ({ activePage, onPageChange, accountNavItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={navRef} className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left px-4 py-2 rounded-lg bg-surface-nested border border-border-color">
                <span className="font-semibold text-text-primary">{activePage}</span>
                <IconChevronDown className={`h-5 w-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-surface rounded-lg shadow-lg mt-1 z-20 border border-border-color">
                    <ul className="py-1">
                        {accountNavItems.map(item => (
                            <React.Fragment key={item.name}>
                                {item.children.length === 0 ? (
                                    <li>
                                        <button onClick={() => { onPageChange(item.name); setIsOpen(false); }} className={`w-full text-left px-4 py-2 text-sm font-medium ${activePage === item.name ? 'text-primary bg-primary/10' : 'text-text-strong'}`}>
                                            {item.name}
                                        </button>
                                    </li>
                                ) : (
                                    <>
                                        <li className="px-4 pt-2 pb-1 text-xs font-bold uppercase text-text-muted">{item.name}</li>
                                        {item.children.map((child: any) => (
                                            <li key={child.name}>
                                                <button onClick={() => { onPageChange(child.name); setIsOpen(false); }} className={`w-full text-left pl-6 pr-4 py-2 text-sm ${activePage === child.name ? 'text-primary font-semibold' : 'text-text-secondary'}`}>
                                                    {child.name}
                                                </button>
                                            </li>
                                        ))}
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const AccountView: React.FC<AccountViewProps> = ({ account, accounts, onSwitchAccount, onBackToAccounts, backLabel, sqlFiles, onSaveQueryClick, onSetBigScreenWidget, activePage, onPageChange, onShareQueryClick, onPreviewQuery, selectedQuery, setSelectedQuery, analyzingQuery, onAnalyzeQuery, onOptimizeQuery, onSimulateQuery, pullRequests, selectedPullRequest, setSelectedPullRequest, users, navigationSource, selectedWarehouse, setSelectedWarehouse, warehouses, assignment, currentUser, onUpdateAssignmentStatus, onAssignToEngineer, onResolveAssignment, selectedApplicationId, setSelectedApplicationId, breadcrumbItems, onNavigateToRecommendations }) => {
    const [selectedDatabaseId, setSelectedDatabaseId] = useState<string | null>(null);
    
    // State for All Queries filters
    const [allQueriesFilters, setAllQueriesFilters] = useState<QueryListFilters>({
        search: '',
        dateFilter: '7d',
        userFilter: [],
        statusFilter: [],
        warehouseFilter: [],
        queryTypeFilter: [],
        durationFilter: { min: null, max: null },
        currentPage: 1,
        itemsPerPage: 10,
        visibleColumns: ['queryId', 'user', 'warehouse', 'duration', 'bytesScanned', 'cost', 'startTime', 'actions'],
    });

    // State for Slow Queries filters
    const [slowQueriesFilters, setSlowQueriesFilters] = useState<SlowQueryFilters>({
        search: '',
        dateFilter: '7d',
        warehouseFilter: [],
        severityFilter: ['Medium', 'High'],
    });

    const handleSelectDatabaseFromSummary = (databaseId: string) => {
        onPageChange('Databases');
        if (databaseId === '__view_all__') {
            setSelectedDatabaseId(null);
        } else {
            setSelectedDatabaseId(databaseId);
        }
    };

    const handleBackToDbList = () => {
        setSelectedDatabaseId(null);
    };

    const handleBackFromTool = () => {
        onPageChange(navigationSource || 'All queries');
        onAnalyzeQuery(null, ''); // This clears the analyzingQuery state and source
    };

    const handleSidebarPageChange = (newPage: string) => {
        // If we are currently on application detail and clicking anywhere on sidebar (or just Applications),
        // we should reset the application selection.
        if (selectedApplicationId) {
            setSelectedApplicationId(null);
        }
        onPageChange(newPage);
    };

    const isDatabaseDetailView = activePage === 'Databases' && !!selectedDatabaseId;
    
    const renderContent = () => {
        if (selectedWarehouse) {
            return <WarehouseDetailView 
                warehouse={selectedWarehouse} 
                onBack={() => setSelectedWarehouse(null)} 
                warehouses={warehouses}
                onSwitchWarehouse={setSelectedWarehouse}
            />;
        }
        if (selectedPullRequest) {
            return <PullRequestDetailView pullRequest={selectedPullRequest} onBack={() => setSelectedPullRequest(null)} users={users} />;
        }
        if (selectedQuery) {
            return <QueryDetailView 
                query={selectedQuery} 
                onBack={() => setSelectedQuery(null)} 
                onAnalyzeQuery={onAnalyzeQuery}
                onOptimizeQuery={onOptimizeQuery}
                onSimulateQuery={onSimulateQuery}
                sourcePage={activePage}
                assignment={assignment}
                currentUser={currentUser}
                onUpdateAssignmentStatus={onUpdateAssignmentStatus}
                onAssignToEngineer={onAssignToEngineer}
                onResolveAssignment={onResolveAssignment}
            />;
        }

        if (activePage.includes("Similar query patterns")) {
            return <SimilarQueryPatternsView />;
        }

        switch (activePage) {
            case 'Account overview':
                return <AccountOverviewDashboard account={account} />;
            case 'Applications':
                return <ApplicationsView 
                    selectedAppId={selectedApplicationId} 
                    onSelectApp={setSelectedApplicationId} 
                    onNavigateToRecommendations={onNavigateToRecommendations} 
                />;
            case 'Overview':
                return <WarehouseOverview warehouses={warehouses} onSelectWarehouse={setSelectedWarehouse} />;
            case 'All Warehouses':
                return <AllWarehouses warehouses={warehouses} onSelectWarehouse={setSelectedWarehouse} />;
            case 'My Branches':
                return <MyBranchesView />;
            case 'Query Versions':
                return <QueryVersionsView sqlFiles={sqlFiles} />;
            case 'Query analyzer':
                return <QueryAnalyzerView
                    query={analyzingQuery}
                    onBack={handleBackFromTool}
                    onSaveClick={onSaveQueryClick}
                    onBrowseQueries={() => onPageChange('All queries')}
                    onOptimizeQuery={(q) => onOptimizeQuery(q, 'Query analyzer')}
                />;
            case 'Query optimizer':
                return <QueryOptimizerView
                    query={analyzingQuery}
                    onBack={handleBackFromTool}
                    onSaveClick={onSaveQueryClick}
                    onSimulateQuery={(q) => onSimulateQuery(q, 'Query optimizer')}
                />;
            case 'Query simulator':
                 return <QuerySimulatorView
                    query={analyzingQuery}
                    onBack={handleBackFromTool}
                    onSaveClick={onSaveQueryClick}
                />;
            case 'Pull Requests':
                return <PullRequestsView pullRequests={pullRequests} onSelectPullRequest={setSelectedPullRequest} />;
            case 'All queries':
                 return <QueryListView 
                    onShareQueryClick={onShareQueryClick} 
                    onSelectQuery={setSelectedQuery} 
                    onAnalyzeQuery={(q) => onAnalyzeQuery(q, 'All queries')}
                    onOptimizeQuery={(q) => onAnalyzeQuery(q, 'All queries')}
                    onSimulateQuery={(q) => onAnalyzeQuery(q, 'All queries')}
                    filters={allQueriesFilters}
                    setFilters={setAllQueriesFilters}
                 />;
            case 'Slow queries':
                return <SlowQueriesView 
                    onAnalyzeQuery={(q) => onAnalyzeQuery(q, 'Slow queries')}
                    onOptimizeQuery={(q) => onAnalyzeQuery(q, 'Slow queries')}
                    onSimulateQuery={(q) => onAnalyzeQuery(q, 'Slow queries')}
                    onPreviewQuery={onPreviewQuery}
                    filters={slowQueriesFilters}
                    setFilters={setSlowQueriesFilters}
                />;
            case 'Storage summary':
                return <StorageSummaryView onSelectDatabase={handleSelectDatabaseFromSummary} onSetBigScreenWidget={onSetBigScreenWidget} />;
            case 'Databases':
                return <DatabasesView selectedDatabaseId={selectedDatabaseId} onSelectDatabase={setSelectedDatabaseId} onBackToList={handleBackToDbList} />;
            default:
                return <div className="px-6 pt-4 pb-12"><h1 className="text-xl font-bold">{activePage}</h1><p>Content for this page is under construction.</p></div>;
        }
    };
    
    const isListView = ['All queries', 'Slow queries', 'Similar query patterns', 'Query analyzer', 'Query optimizer', 'Query simulator', 'All Warehouses', 'Applications'].includes(activePage);

    return (
        <div className="flex h-full bg-background">
            {/* Contextual Sidebar */}
            {!isDatabaseDetailView && !selectedQuery && !selectedPullRequest && !selectedWarehouse && (
                <ContextualSidebar
                    account={account}
                    accounts={accounts}
                    onSwitchAccount={onSwitchAccount}
                    activePage={activePage}
                    onPageChange={handleSidebarPageChange}
                    onBackToAccounts={onBackToAccounts}
                    backLabel={backLabel}
                    selectedApplicationId={selectedApplicationId}
                />
            )}

            {/* Main Content */}
            <main className={`flex-1 flex flex-col overflow-hidden bg-background`}>
                {/* Breadcrumb row: placed right of sidebar, beneath header */}
                {!isDatabaseDetailView && !selectedQuery && !selectedPullRequest && !selectedWarehouse && (
                    <div className="bg-surface shadow-sm flex-shrink-0 z-10 border-b border-border-light">
                        <div className="h-[42px] px-6 flex items-center">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>
                )}
                
                <div className={`flex-1 ${isListView ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
                    {!isDatabaseDetailView && !selectedQuery && !selectedPullRequest && !selectedWarehouse && (
                        <div className="lg:hidden p-4 pb-0">
                            <MobileNav activePage={activePage} onPageChange={handleSidebarPageChange} accountNavItems={accountNavItems} />
                        </div>
                    )}
                    <div className={`h-full ${isDatabaseDetailView || selectedQuery || selectedPullRequest || selectedWarehouse || isListView ? "" : "px-6 pt-4 pb-12"}`}>
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountView;