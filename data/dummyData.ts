
import { Account, DashboardItem, SQLFile, TopQuery, OptimizationOpportunity, Warehouse, User, Widget, SimilarQuery, QueryListItem, QueryStatus, QueryType, QuerySeverity, StorageBreakdownItem, TopStorageConsumer, StorageGrowthPoint, UnusedTable, StorageActivityLogItem, StorageByTeamItem, DuplicateDataPattern, StorageOptimizationOpportunity, DataAgeDistributionItem, StorageTierItem, TieringOpportunityItem, TierForecastPoint, AnomalyAlertItem, SavingsProjection, Database, DatabaseTable, StorageByTypeItem, AssignedQuery, PullRequest, Notification, ActivityLog, SQLVersion, Recommendation, CollaborationEntry, Application } from '../types';

export const connectionsData: Account[] = [
    { id: 'acc-1', name: 'Finance Prod', identifier: 'acme.us-east-1', role: 'ACCOUNTADMIN', status: 'Connected', lastSynced: '2 mins ago', cost: 12500, tokens: 98000, warehousesCount: 12, usersCount: 8, storageGB: 45000, queriesCount: '12K', tablesCount: 120 },
    { id: 'acc-2', name: 'Account B', identifier: 'acme.us-east-2', role: 'SYSADMIN', status: 'Connected', lastSynced: '5 mins ago', cost: 8200, tokens: 85000, warehousesCount: 6, usersCount: 12, storageGB: 12400, queriesCount: '8K', tablesCount: 85 },
    { id: 'acc-3', name: 'Account C', identifier: 'acme.eu-west-1', role: 'SYSADMIN', status: 'Connected', lastSynced: '10 mins ago', cost: 7100, tokens: 68000, warehousesCount: 4, usersCount: 5, storageGB: 8200, queriesCount: '6K', tablesCount: 45 },
    { id: 'acc-4', name: 'Account D', identifier: 'acme.ap-south-1', role: 'SYSADMIN', status: 'Connected', lastSynced: '15 mins ago', cost: 3200, tokens: 48000, warehousesCount: 2, usersCount: 3, storageGB: 4100, queriesCount: '4K', tablesCount: 20 },
    { id: 'acc-5', name: 'Account E', identifier: 'acme.us-west-2', role: 'SYSADMIN', status: 'Connected', lastSynced: '20 mins ago', cost: 2600, tokens: 38000, warehousesCount: 3, usersCount: 4, storageGB: 2600, queriesCount: '3K', tablesCount: 32 },
    { id: 'acc-6', name: 'Account F', identifier: 'acme.ca-central-1', role: 'SYSADMIN', status: 'Connected', lastSynced: '30 mins ago', cost: 2100, tokens: 32000, warehousesCount: 2, usersCount: 2, storageGB: 1800, queriesCount: '2K', tablesCount: 18 },
    { id: 'acc-7', name: 'Account G', identifier: 'acme.sa-east-1', role: 'SYSADMIN', status: 'Connected', lastSynced: '1 hour ago', cost: 1400, tokens: 21000, warehousesCount: 1, usersCount: 1, storageGB: 1200, queriesCount: '1K', tablesCount: 10 },
    { id: 'acc-8', name: 'Account H', identifier: 'acme.me-south-1', role: 'SYSADMIN', status: 'Connected', lastSynced: '2 hours ago', cost: 800, tokens: 12000, warehousesCount: 1, usersCount: 1, storageGB: 800, queriesCount: '0.8K', tablesCount: 8 },
];

export const accountApplicationsData: Application[] = [
    { id: 'app-1', name: 'Production ETL', description: 'Primary data ingestion pipelines for core production databases.', totalCredits: 1542, warehouseCredits: 1420, storageCredits: 84, otherCredits: 38, queryCount: 4500, lastActive: '2 mins ago', insightCount: 0 },
    { id: 'app-2', name: 'Tableau BI Dashboards', description: 'User-facing executive and operational dashboards.', totalCredits: 821.5, warehouseCredits: 785, storageCredits: 21, otherCredits: 15.5, queryCount: 12400, lastActive: 'Just now', insightCount: 0 },
    { id: 'app-3', name: 'Log Ingestion Service', description: 'Internal service capturing system logs for monitoring.', totalCredits: 2104, warehouseCredits: 1852, storageCredits: 156, otherCredits: 96, queryCount: 86000, lastActive: '1 hour ago', insightCount: 0 },
    { id: 'app-4', name: 'SageMaker ML Model', description: 'Weekly model retraining job for sales forecasting.', totalCredits: 451, warehouseCredits: 420, storageCredits: 12, otherCredits: 19, queryCount: 120, lastActive: '3 days ago', insightCount: 0 },
    { id: 'app-5', name: 'Inventory Sync Job', description: 'Hourly sync from supply chain partners.', totalCredits: 128, warehouseCredits: 115, storageCredits: 8, otherCredits: 5, queryCount: 2400, lastActive: '45 mins ago', insightCount: 0 },
];

export const databaseTablesData: DatabaseTable[] = [
    { id: 't-1', name: 'FACT_SALES', sizeGB: 12450, rows: 450000000, monthlyGrowth: 4.2 }, { id: 't-2', name: 'DIM_CUSTOMER', sizeGB: 850, rows: 12000000, monthlyGrowth: 1.5 }, { id: 't-3', name: 'FACT_ORDERS', sizeGB: 8400, rows: 280000000, monthlyGrowth: 3.8 }, { id: 't-4', name: 'STG_WEB_LOGS', sizeGB: 15600, rows: 1200000000, monthlyGrowth: 12.5 }, { id: 't-5', name: 'DIM_PRODUCT', sizeGB: 120, rows: 500000, monthlyGrowth: 0.2 }, { id: 't-6', name: 'DIM_DATE', sizeGB: 15, rows: 36500, monthlyGrowth: 0 }, { id: 't-7', name: 'FACT_INVENTORY', sizeGB: 3200, rows: 95000000, monthlyGrowth: 2.1 }, { id: 't-8', name: 'STG_CRM_DATA', sizeGB: 4200, rows: 65000000, monthlyGrowth: 5.5 }, { id: 't-9', name: 'DIM_STORE', sizeGB: 45, rows: 12000, monthlyGrowth: 0.1 }, { id: 't-10', name: 'FACT_MARKETING_ATTRIBUTION', sizeGB: 9800, rows: 150000000, monthlyGrowth: 8.2 }, { id: 't-11', name: 'TMP_MIGRATION_BACKUP', sizeGB: 25000, rows: 500000000, monthlyGrowth: -100 },
];

// --- QUERY LIST DATA ---
export const queryListData: QueryListItem[] = Array.from({ length: 200 }).map((_, i) => {
    const isFailed = Math.random() < 0.1;
    const tokens = Math.random() * 25 + 0.1;
    const totalSecs = Math.floor(Math.random() * 1400) + 10;
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    const durationDisplay = `${m}m ${s}s`;
    return { id: `01${Math.random().toString(16).substring(2, 10)}-${Math.random().toString(16).substring(2, 10)}`, status: isFailed ? 'Failed' : 'Success', costUSD: tokens * 2.5, costTokens: tokens, costCredits: tokens, duration: durationDisplay, warehouse: 'ANALYTICS_WH', estSavingsUSD: tokens * 0.15 * 2.5, estSavingsPercent: 15, queryText: "SELECT * FROM orders;", timestamp: new Date(Date.now() - (i * 1000 * 60 * 45)).toISOString(), type: ['SELECT'], user: 'Alice Johnson', bytesScanned: Math.floor(Math.random() * 5000000000), bytesWritten: Math.floor(Math.random() * 100000000), severity: 'Medium' };
});

// --- SEED RECOMMENDATIONS DATA ---
const insightTypes = ['Complex Join Pattern', 'Over-provisioned Sizing', 'Unexpected Cost Spike', 'Stale Objects', 'Latency Warning', 'Governance Violation'];

export const recommendationsData: Recommendation[] = Array.from({ length: 450 }).map((_, i) => {
    const targetPool = [
        ...connectionsData.map(a => ({ name: a.name, acc: a.name, type: 'Account' as const })),
        ...accountApplicationsData.map(a => ({ name: a.name, acc: connectionsData[i % connectionsData.length].name, type: 'Application' as const })),
        ...queryListData.slice(0, 40).map(q => ({ name: q.id, acc: connectionsData[i % connectionsData.length].name, type: 'Query' as const })),
        ...databaseTablesData.map(t => ({ name: t.name, acc: connectionsData[i % connectionsData.length].name, type: 'Database' as const }))
    ];
    
    const target = targetPool[(i * 7) % targetPool.length];
    
    return {
        id: `rec-${i + 1}`,
        resourceType: target.type,
        affectedResource: target.name,
        severity: i % 13 === 0 ? 'High' : i % 5 === 0 ? 'Medium' : 'Low',
        insightType: insightTypes[i % insightTypes.length],
        message: `Recommendation ${i + 1}: AI-powered insight for ${target.name}. Applying this could result in significant efficiency gains.`,
        detailedExplanation: `This insight was generated based on heuristics for ${target.name} during period of peak activity.`,
        timestamp: new Date(Date.now() - i * 1000 * 60 * 45).toISOString(),
        accountName: target.acc,
        status: i % 11 === 0 ? 'Resolved' : i % 7 === 0 ? 'In Progress' : 'New',
        metrics: { creditsBefore: 20 + i * 0.05, estimatedSavings: 8 + i * 0.02 }
    };
});

export const usageCreditsData = {
    total: "48,520",
    compute: "44,420",
    storage: "2,100",
    dataTransfer: "2,000"
};

export const resourceSnapshotData = [
    { label: 'Accounts', value: '8' },
    { label: 'Users', value: '12' },
    { label: 'Warehouses', value: '36' },
    { label: 'Queries', value: '46K' },
    { label: 'Storage', value: '96.79 TB' },
    { label: 'Tables', value: '100' },
];

export const finopsRecommendations = [
    { id: 'rec-1', title: '01c11857-3202-2cb8-0012-25ae00022aae', tag: 'join', description: 'A JOIN in this query has no join condition (at node [1]), which produces many more rows than the total number of rows that went in.' },
    { id: 'rec-2', title: '01c1060c-3202-2cb8-0012-25ae00020802', tag: 'Table scan', description: 'A JOIN in this query has no join condition (at node [1]), which produces many more rows than the total number of rows that went in.' },
    { id: 'rec-3', title: '01c1060b-3202-2cb8-0012-25ae000207ce', tag: 'Aggregation', description: 'A JOIN in this query has no join condition (at node [1]), which produces many more rows than the total number of rows that went in.' },
];

export const tokensTrendsData = [
    { date: 'Dec 1', tokens: 22 }, { date: 'Dec 2', tokens: 48 }, { date: 'Dec 3', tokens: 46 }, { date: 'Dec 4', tokens: 58 }, { date: 'Dec 5', tokens: 32 }, { date: 'Dec 6', tokens: 81 }, { date: 'Dec 7', tokens: 79 },
];

export const usersData: User[] = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice@anavsan.com', role: 'Admin', status: 'Active', dateAdded: '2023-01-15', cost: 1200, tokens: 480, organization: 'Anavsan Inc.' },
    { id: 'user-2', name: 'Bob Smith', email: 'bob@anavsan.com', role: 'Analyst', status: 'Active', dateAdded: '2023-03-20', cost: 850, tokens: 340, organization: 'Anavsan Inc.' },
    { id: 'user-3', name: 'Charlie Davis', email: 'charlie@anavsan.com', role: 'Viewer', status: 'Active', dateAdded: '2023-06-10', cost: 50, tokens: 20, organization: 'Anavsan Inc.' },
    { id: 'user-4', name: 'Diana Prince', email: 'diana@anavsan.com', role: 'Analyst', status: 'Suspended', dateAdded: '2023-02-01', cost: 0, tokens: 0, organization: 'Anavsan Inc.' },
    { id: 'user-finops', name: 'FinOps Specialist', email: 'finops@mail.com', role: 'FinOps', status: 'Active', dateAdded: '2024-01-01', cost: 0, tokens: 0, organization: 'Anavsan Inc.' },
    { id: 'user-dataengineer', name: 'Data Engineer', email: 'dataengineer@mail.com', role: 'DataEngineer', status: 'Active', dateAdded: '2024-01-01', cost: 0, tokens: 0, organization: 'Anavsan Inc.' },
];

export const sqlFilesData: SQLFile[] = [
    { id: 'file-1', name: 'monthly_spend_report.sql', accountId: 'acc-1', accountName: 'Finance Prod', createdDate: '2023-11-01', versions: [ { id: 'v1-1', version: 1, date: '2023-11-01', description: 'Initial version', user: 'Alice Johnson', tag: 'Analyzed', sql: 'SELECT * FROM spend_data;' }, { id: 'v1-2', version: 2, date: '2023-11-05', description: 'Added filters', user: 'Bob Smith', tag: 'Optimized', sql: 'SELECT * FROM spend_data WHERE month = "Nov";' } ] }
];

export const warehousesData: Warehouse[] = [
    { id: 'wh-1', name: 'Finance Prod', size: 'Large', avgUtilization: 65, peakUtilization: 92, status: 'Running', cost: 4500, tokens: 98, credits: 98, queriesExecuted: 12500, lastActive: 'Just now', health: 'Optimized' },
    { id: 'wh-2', name: 'Marketing Dev', size: 'Small', avgUtilization: 12, peakUtilization: 45, status: 'Active', cost: 1200, tokens: 12, credits: 12, queriesExecuted: 800, lastActive: '10 mins ago', health: 'Under-utilized', optimizationNote: 'Active 24/7 with < 15% average load. Suspend interval should be decreased to 60s.' },
    { id: 'wh-3', name: 'Data Science WH', size: 'X-Large', avgUtilization: 45, peakUtilization: 78, status: 'Running', cost: 2800, tokens: 88, credits: 88, queriesExecuted: 8400, lastActive: '2 mins ago', health: 'Over-provisioned', optimizationNote: '95th percentile of queries finish under 5s. Recommend downsizing to Large to save ~40% monthly.' },
    { id: 'wh-4', name: 'Sales BI', size: 'Small', avgUtilization: 30, peakUtilization: 50, status: 'Idle', cost: 1200, tokens: 48, credits: 48, queriesExecuted: 4200, lastActive: '15 mins ago', health: 'Optimized' },
    { id: 'wh-5', name: 'ETL Standard', size: 'Medium', avgUtilization: 82, peakUtilization: 98, status: 'Running', cost: 3200, tokens: 62, credits: 62, queriesExecuted: 15200, lastActive: 'Just now', health: 'Optimized' },
];

export const dashboardsData: DashboardItem[] = [
    { id: 'dash-1', title: 'Executive Overview', createdOn: '2023-01-10', description: 'High-level cost and performance metrics.', widgets: [] },
];

export const topQueriesForDashboard = [
    { name: 'Finance Prod', credits: 98 }, { name: 'Account B', credits: 88 }, { name: 'Account C', credits: 72 }, { name: 'Account D', credits: 48 }, { name: 'Account E', credits: 38 }, { name: 'Account F', credits: 32 }, { name: 'Account G', credits: 21 }, { name: 'Account H', credits: 12 },
];

export const assignedQueriesData: AssignedQuery[] = [
    {
        id: 'aq-1',
        queryId: '0-1765',
        queryText: 'SELECT * FROM FINANCE_PROD.PUBLIC.TRANSACTIONS WHERE DATE > current_date() - 365;',
        assignedBy: 'Admin',
        assignedTo: 'Bob Williams',
        priority: 'High',
        status: 'Assigned',
        message: 'This query is consuming 12k credits, check for joins and partition pruning opportunities.',
        assignedOn: '2025-12-10T10:00:00Z',
        cost: 0.50,
        tokens: 0.20,
        credits: 0.20,
        warehouse: 'COMPUTE_WH',
        history: []
    },
    {
        id: 'aq-2',
        queryId: '15-176',
        queryText: 'SELECT name, sum(amount) FROM raw_data GROUP BY 1;',
        assignedBy: 'Admin',
        assignedTo: 'Bob Williams',
        priority: 'High',
        status: 'Assigned',
        message: 'Bob, this query is showing high disk spilling. Can you refactor to use a smaller working set?',
        assignedOn: '2025-12-11T14:30:00Z',
        cost: 1.25,
        tokens: 0.54,
        credits: 0.54,
        warehouse: 'DATA_SCI_WH',
        history: []
    },
    {
        id: 'aq-3',
        queryId: '5-1765',
        queryText: 'INSERT INTO analytics.daily_stats SELECT ...',
        assignedBy: 'Admin',
        assignedTo: 'Frank White',
        priority: 'Medium',
        status: 'In progress',
        message: 'Seeing high execution time on this one. Can we optimize the source views?',
        assignedOn: '2025-12-08T09:15:00Z',
        cost: 0.65,
        tokens: 0.26,
        credits: 0.26,
        warehouse: 'ETL_WH',
        history: []
    },
    {
        id: 'aq-4',
        queryId: '10-176',
        queryText: 'SELECT COUNT(*) FROM audit_logs;',
        assignedBy: 'Admin',
        assignedTo: 'Bob Williams',
        priority: 'Low',
        status: 'Optimized',
        message: 'This one is done. Great work!',
        assignedOn: '2025-12-06T16:45:00Z',
        cost: 1.50,
        tokens: 0.60,
        credits: 0.60,
        warehouse: 'COMPUTE_WH',
        history: []
    }
];

export const pullRequestsData: PullRequest[] = [];
export const notificationsData: Notification[] = [];
export const activityLogsData: ActivityLog[] = [];
export const accountSpend = { cost: { monthly: 12500, forecasted: 15000 }, tokens: { monthly: 80000, forecasted: 95000 } };
export const topQueriesData: TopQuery[] = [];
export const accountCostBreakdown = [ { name: 'Warehouse', cost: 10500, tokens: 42000, percentage: 84, color: '#6932D5' }, { name: 'Storage', cost: 2000, tokens: 8000, percentage: 16, color: '#A78BFA' } ];
export const spendTrendsData = [
    { date: 'Dec 1', total: 1200, warehouse: 1000, storage: 200 }, { date: 'Dec 2', total: 1500, warehouse: 1300, storage: 200 }, { date: 'Dec 3', total: 1100, warehouse: 900, storage: 200 }, { date: 'Dec 4', total: 1800, warehouse: 1600, storage: 200 }, { date: 'Dec 5', total: 1400, warehouse: 1200, storage: 200 }, { date: 'Dec 6', total: 1300, warehouse: 1100, storage: 200 }, { date: 'Dec 7', total: 1600, warehouse: 1400, storage: 200 },
];
export const availableWidgetsData = [
    { widgetId: 'total-spend', title: 'Total Spend', type: 'StatCard', description: 'Displays current vs forecasted month spend.', tags: ['Cost', 'Executive'], layout: { w: 1, h: 1 } },
    { widgetId: 'spend-breakdown', title: 'Spend Breakdown', type: 'DonutChart', description: 'Compute vs Storage distribution.', tags: ['Cost'], layout: { w: 1, h: 2 } },
    { widgetId: 'cost-by-warehouse', title: 'Cost by Warehouse', type: 'BarChart', description: 'Ranking of warehouses by cost.', tags: ['Warehouse', 'Performance'], layout: { w: 2, h: 2 } },
];
export const overviewMetrics = { cost: { current: 45000, forecasted: 52000 }, tokens: { current: 120000, forecasted: 145000 } };
export const costBreakdownData = [ { name: 'Warehouse', cost: 38000, tokens: 102000, percentage: 85, color: '#6932D5' }, { name: 'Storage', cost: 7000, tokens: 18000, percentage: 15, color: '#A78BFA' } ];
export const similarQueriesData: SimilarQuery[] = [];
export const totalStorageMetrics = { totalSizeGB: 96000, totalCost: 2500 };
export const storageGrowthForecast = { nextMonthSizeGB: 105000, nextMonthCost: 2800 };
export const topStorageConsumersData: TopStorageConsumer[] = [];
export const storageGrowthData = [
    { date: 'Dec 1', 'Active Storage (GB)': 92000, 'Time Travel (GB)': 4000 }, { date: 'Dec 2', 'Active Storage (GB)': 92500, 'Time Travel (GB)': 4100 }, { date: 'Dec 3', 'Active Storage (GB)': 93000, 'Time Travel (GB)': 4050 }, { date: 'Dec 4', 'Active Storage (GB)': 93800, 'Time Travel (GB)': 4200 }, { date: 'Dec 5', 'Active Storage (GB)': 94500, 'Time Travel (GB)': 4300 }, { date: 'Dec 6', 'Active Storage (GB)': 95500, 'Time Travel (GB)': 4400 }, { date: 'Dec 7', 'Active Storage (GB)': 96000, 'Time Travel (GB)': 4500 },
];
export const storageSummaryData = { totalStorageGB: 96790, totalSpend: 2500 };
export const databasesData: Database[] = [
    { id: 'db-1', name: 'SNOWFLAKE', sizeGB: 120, cost: 450, tableCount: 45, userCount: 12, users: [ { id: 'user-1', name: 'Alice Johnson' }, { id: 'user-2', name: 'Bob Smith' } ] },
    { id: 'db-2', name: 'FINANCE_PROD', sizeGB: 45000, cost: 1200, tableCount: 120, userCount: 8, users: [ { id: 'user-1', name: 'Alice Johnson' }, { id: 'user-finops', name: 'FinOps Specialist' } ] },
    { id: 'db-3', name: 'MARKETING_DATA', sizeGB: 22000, cost: 650, tableCount: 85, userCount: 15, users: [ { id: 'user-2', name: 'Bob Smith' }, { id: 'user-3', name: 'Charlie Davis' } ] },
];

export const storageByTypeData: StorageByTypeItem[] = [
    { type: 'Active Storage', storageGB: 85000, cost: 2100, color: '#6932D5' }, { type: 'Time Travel', storageGB: 8000, cost: 300, color: '#A78BFA' }, { type: 'Fail-safe', storageGB: 3790, cost: 100, color: '#DDD6FE' }
];
export const dataAgeDistributionData: DataAgeDistributionItem[] = [
    { ageBucket: '< 30 days', sizeGB: 45000 }, { ageBucket: '30-60 days', sizeGB: 22000 }, { ageBucket: '60-90 days', sizeGB: 15000 }, { ageBucket: '90-180 days', sizeGB: 8000 }, { ageBucket: '> 180 days', sizeGB: 6790 },
];
export const storageByTierData: { current: StorageTierItem[], recommended: StorageTierItem[] } = {
    current: [ { name: 'Hot', value: 85, color: '#DC2626' }, { name: 'Warm', value: 10, color: '#F59E0B' }, { name: 'Cold', value: 5, color: '#2563EB' }, ],
    recommended: [ { name: 'Hot', value: 40, color: '#DC2626' }, { name: 'Warm', value: 35, color: '#F59E0B' }, { name: 'Cold', value: 25, color: '#2563EB' }, ]
};
export const tieringOpportunitiesData: TieringOpportunityItem[] = [
    { id: 't-opt-1', tableName: 'LOG_EVENTS_ARCHIVE', size: '1.2 TB', currentTier: 'Hot', recommendedTier: 'Cold', potentialSavings: 450 }, { id: 't-opt-2', tableName: 'TEMP_STAGE_TABLE', size: '450 GB', currentTier: 'Hot', recommendedTier: 'Warm', potentialSavings: 120 }, { id: 't-opt-3', tableName: 'HISTORICAL_SALES_2022', size: '2.8 TB', currentTier: 'Warm', recommendedTier: 'Cold', potentialSavings: 380 },
];
export const policyComplianceData = { compliancePercentage: 68 };
export const costSpendForecastData = [
    { day: 1, actual: 1200, forecast: 1250 }, { day: 5, actual: 5800, forecast: 6000 }, { day: 10, actual: 11500, forecast: 12000 }, { day: 15, actual: 18200, forecast: 18500 }, { day: 20, actual: 24100, forecast: 24500 }, { day: 25, actual: 29800, forecast: 30500 }, { day: 30, actual: 0, forecast: 37000 },
];
export const costForecastByTierData: TierForecastPoint[] = [
    { month: 'Jan', Hot: 1200, Warm: 300, Cold: 100 }, { month: 'Feb', Hot: 1250, Warm: 320, Cold: 110 }, { month: 'Mar', Hot: 1300, Warm: 350, Cold: 120 }, { month: 'Apr', Hot: 1350, Warm: 380, Cold: 130 }, { month: 'May', Hot: 1400, Warm: 410, Cold: 140 }, { month: 'Jun', Hot: 1450, Warm: 450, Cold: 150 },
];
export const costAnomalyAlertsData: AnomalyAlertItem[] = [
    { id: 'anom-1', tableName: 'WEBSITE_LOGS', projection: 'Storage grew 400% in 24h. Projected cost increase: +$450/mo.' }, { id: 'anom-2', tableName: 'USER_SESSIONS', projection: 'Unusual deletion pattern detected. Time travel storage spiked by 2.1 TB.' },
];
export const costSavingsProjectionData: SavingsProjection = { message: "By applying all recommended storage tiering and archival policies, you can reduce your storage spend by", savingsPercentage: 24 };
