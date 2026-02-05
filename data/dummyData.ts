
import { 
    Account, DashboardItem, SQLFile, TopQuery, OptimizationOpportunity, Warehouse, User, Widget, 
    SimilarQuery, QueryListItem, QueryStatus, QueryType, QuerySeverity, StorageBreakdownItem, 
    TopStorageConsumer, StorageGrowthPoint, UnusedTable, StorageActivityLogItem, StorageByTeamItem, 
    DuplicateDataPattern, StorageOptimizationOpportunity, DataAgeDistributionItem, StorageTierItem, 
    TieringOpportunityItem, TierForecastPoint, AnomalyAlertItem, SavingsProjection, Database, 
    DatabaseTable, StorageByTypeItem, AssignedQuery, PullRequest, Notification, ActivityLog, 
    SQLVersion, Recommendation, CollaborationEntry, Application, CortexModel,
    ResourceType, SeverityImpact, RecommendationStatus
} from '../types';

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

export const cortexModelsData: CortexModel[] = [
    { id: 'm-1', name: 'llama3-70b', category: 'LLM', tokens: '850K', credits: 1.2, lastUsed: '2 mins ago', requestCount: 12450 },
    { id: 'm-2', name: 'mistral-large', category: 'LLM', tokens: '1.2M', credits: 1.9, lastUsed: '1 hour ago', requestCount: 18200 },
    { id: 'm-3', name: 'snowflake-arctic', category: 'LLM', tokens: '4.5M', credits: 4.5, lastUsed: 'Just now', requestCount: 45000 },
    { id: 'm-4', name: 're-ranker', category: 'Reranking', tokens: '240K', credits: 0.2, lastUsed: '10 mins ago', requestCount: 2150 },
    { id: 'm-5', name: 'text-embedding-gecko', category: 'Embedding', tokens: '3.1M', credits: 0.8, lastUsed: '4 hours ago', requestCount: 12400 },
    { id: 'm-6', name: 'jamba-instruct', category: 'LLM', tokens: '150K', credits: 0.4, lastUsed: '1 day ago', requestCount: 1500 },
];

export const accountApplicationsData: Application[] = [
    { id: 'app-1', name: 'Production ETL', description: 'Primary data ingestion pipelines for core production databases.', totalCredits: 1542, warehouseCredits: 1420, storageCredits: 84, otherCredits: 38, queryCount: 4500, lastActive: '2 mins ago', insightCount: 0 },
    { id: 'app-2', name: 'Tableau BI Dashboards', description: 'User-facing executive and operational dashboards.', totalCredits: 821.5, warehouseCredits: 785, storageCredits: 21, otherCredits: 15.5, queryCount: 12400, lastActive: 'Just now', insightCount: 0 },
    { id: 'app-3', name: 'Log Ingestion Service', description: 'Internal service capturing system logs for monitoring.', totalCredits: 2104, warehouseCredits: 1852, storageCredits: 156, otherCredits: 96, queryCount: 86000, lastActive: '1 hour ago', insightCount: 0 },
    { id: 'app-4', name: 'SageMaker ML Model', description: 'Weekly model retraining job for sales forecasting.', totalCredits: 451, warehouseCredits: 420, storageCredits: 12, otherCredits: 19, queryCount: 120, lastActive: '3 days ago', insightCount: 0 },
    { id: 'app-5', name: 'Inventory Sync Job', description: 'Hourly sync from supply chain partners.', totalCredits: 128, warehouseCredits: 115, storageCredits: 8, otherCredits: 5, queryCount: 2400, lastActive: '45 mins ago', insightCount: 0 },
];

export const sqlFilesData: SQLFile[] = [];
export const usersData: User[] = [
    { id: 'u-1', name: 'FinOps Admin', email: 'finops@mail.com', role: 'Admin', status: 'Active', dateAdded: '2023-01-01', cost: 1200, tokens: 5000 },
];
export const dashboardsData: DashboardItem[] = [];
export const assignedQueriesData: AssignedQuery[] = [];
export const pullRequestsData: PullRequest[] = [];
export const notificationsData: Notification[] = [];
export const activityLogsData: ActivityLog[] = [];
export const warehousesData: Warehouse[] = [
    { id: 'wh-1', name: 'COMPUTE_WH', size: 'Medium', avgUtilization: 45, peakUtilization: 85, status: 'Active', cost: 4500, tokens: 1800, credits: 1800, queriesExecuted: 1250, lastActive: '2 mins ago', health: 'Optimized', optimizationNote: 'This warehouse is currently running at peak efficiency.' },
    { id: 'wh-2', name: 'ETL_WH', size: 'Large', avgUtilization: 12, peakUtilization: 25, status: 'Active', cost: 8200, tokens: 3200, credits: 3200, queriesExecuted: 850, lastActive: 'Just now', health: 'Under-utilized', optimizationNote: 'Average utilization is very low. Consider reducing size to Medium to save approx. 1200 credits/mo.' },
    { id: 'wh-3', name: 'ANALYTICS_WH', size: 'X-Small', avgUtilization: 92, peakUtilization: 100, status: 'Active', cost: 1400, tokens: 600, credits: 600, queriesExecuted: 15000, lastActive: '10 mins ago', health: 'Over-provisioned', optimizationNote: 'High queuing detected. Upgrading to Small may improve concurrency and reduce execution latency.' }
];
export const queryListData: QueryListItem[] = [
    { id: 'q-9482103', status: 'Success', costUSD: 12.50, costTokens: 4.5, costCredits: 4.5, duration: '00:02:30', warehouse: 'COMPUTE_WH', estSavingsUSD: 3.50, estSavingsPercent: 28, queryText: 'SELECT * FROM FACT_SALES WHERE EVENT_DATE >= "2023-01-01"', timestamp: '2023-11-20T10:00:00Z', type: ['SELECT'], user: 'jane_doe', bytesScanned: 450000000, bytesWritten: 0, severity: 'High' },
    { id: 'q-9482104', status: 'Failed', costUSD: 0.20, costTokens: 0.1, costCredits: 0.1, duration: '00:00:05', warehouse: 'ETL_WH', estSavingsUSD: 0, estSavingsPercent: 0, queryText: 'INSERT INTO DIM_USERS (ID, NAME) VALUES (1, "Test")', timestamp: '2023-11-20T10:05:00Z', type: ['INSERT'], user: 'john_smith', bytesScanned: 0, bytesWritten: 1200, severity: 'Low' }
];

export const usageCreditsData = [
    { date: '2023-10-01', credits: 120 },
    { date: '2023-10-02', credits: 150 },
];
export const resourceSnapshotData = {
    accounts: 8,
    applications: 4,
    storage: '36 TB',
    compute: '44.25K',
};

// Updated to show three high-impact suggestions as requested
export const finopsRecommendations = [
    { id: 'rec-1', title: 'Idle Warehouse', tag: 'WH', description: 'Warehouse COMPUTE_WH has been idle for 2 hours.' },
    { id: 'rec-2', title: 'Table Scan', tag: 'Query', description: 'Query q-9482103 is performing a full table scan on FACT_SALES.' },
    { id: 'rec-3', title: 'Stale Data', tag: 'Storage', description: 'Table STG_RAW_LOGS has not been accessed in over 90 days.' },
];

export const spendTrendsData = [
    { date: 'Nov 14', total: 1200, warehouse: 1000, storage: 200 },
    { date: 'Nov 15', total: 1450, warehouse: 1200, storage: 250 },
    { date: 'Nov 16', total: 1100, warehouse: 900, storage: 200 },
    { date: 'Nov 17', total: 1600, warehouse: 1400, storage: 200 },
    { date: 'Nov 18', total: 1300, warehouse: 1100, storage: 200 },
    { date: 'Nov 19', total: 1800, warehouse: 1500, storage: 300 },
    { date: 'Nov 20', total: 1550, warehouse: 1300, storage: 250 },
];

export const accountSpend = {
    cost: { monthly: 12500, forecasted: 15000 },
    tokens: { monthly: 98000, forecasted: 110000 }
};
export const topQueriesData: TopQuery[] = [
    { id: 'q-1', queryText: 'SELECT * FROM FACT_SALES WHERE EVENT_DATE >= "2023-01-01"', tokens: 4.5, cost: 12.50, user: 'jane_doe', duration: '02:30' },
    { id: 'q-2', queryText: 'WITH cte AS (SELECT ...) SELECT * FROM cte JOIN ...', tokens: 3.2, cost: 8.40, user: 'mike_fin', duration: '01:45' }
];
export const accountCostBreakdown = [
    { name: 'Compute', cost: 10000, tokens: 80000, percentage: 80, color: '#6932D5' },
    { name: 'Storage', cost: 2500, tokens: 18000, percentage: 20, color: '#A78BFA' },
];
export const availableWidgetsData: Omit<Widget, 'id' | 'dataSource'>[] = [
    { widgetId: 'total-spend', title: 'Total Spend', type: 'StatCard', description: 'Overall spend across accounts', layout: { w: 1, h: 1 }, tags: ['Cost'] },
    { widgetId: 'spend-breakdown', title: 'Spend Breakdown', type: 'DonutChart', description: 'Cost split by category', layout: { w: 1, h: 1 }, tags: ['Cost'] },
    { widgetId: 'cost-by-warehouse', title: 'Cost by Warehouse', type: 'BarChart', description: 'Top warehouses by cost', layout: { w: 2, h: 1 }, tags: ['Compute'] }
];
export const overviewMetrics = {
    cost: { current: 48500, tokens: 380000 },
    tokens: { current: 380000 }
};
export const costBreakdownData = [
    { name: 'Compute', cost: 40000, tokens: 320000, percentage: 82, color: '#6932D5' },
    { name: 'Storage', cost: 8500, tokens: 60000, percentage: 18, color: '#A78BFA' },
];

export const databasesData: Database[] = [
    { id: 'db-1', name: 'PROD_DB', sizeGB: 12500, cost: 3200, tableCount: 45, userCount: 12, users: [] },
    { id: 'db-2', name: 'ANALYTICS_DB', sizeGB: 8400, cost: 2100, tableCount: 32, userCount: 8, users: [] }
];
export const storageByTypeData: StorageByTypeItem[] = [
    { type: 'Active', storageGB: 45000, cost: 2500, color: '#6932D5' },
    { type: 'Time Travel', storageGB: 4200, cost: 400, color: '#A78BFA' },
    { type: 'Fail-safe', storageGB: 1800, cost: 150, color: '#C4B5FD' }
];
export const storageGrowthData: StorageGrowthPoint[] = [
    { date: 'Nov 14', 'Active Storage (GB)': 44000, 'Time Travel (GB)': 1000 },
    { date: 'Nov 15', 'Active Storage (GB)': 44200, 'Time Travel (GB)': 1050 },
    { date: 'Nov 16', 'Active Storage (GB)': 44500, 'Time Travel (GB)': 1100 },
    { date: 'Nov 17', 'Active Storage (GB)': 44800, 'Time Travel (GB)': 1150 },
    { date: 'Nov 18', 'Active Storage (GB)': 45000, 'Time Travel (GB)': 1200 },
    { date: 'Nov 19', 'Active Storage (GB)': 45200, 'Time Travel (GB)': 1250 },
    { date: 'Nov 20', 'Active Storage (GB)': 45500, 'Time Travel (GB)': 1300 }
];
export const databaseTablesData: DatabaseTable[] = [
    { id: 't-1', name: 'FACT_SALES', sizeGB: 1200, rows: 15000000, monthlyGrowth: 4.5 },
    { id: 't-2', name: 'DIM_CUSTOMERS', sizeGB: 450, rows: 800000, monthlyGrowth: 1.2 }
];

export const similarQueriesData: SimilarQuery[] = [];
export const totalStorageMetrics = { totalSizeGB: 45000, totalCost: 2500 };
export const storageGrowthForecast = { nextMonthSizeGB: 48000, nextMonthCost: 2700 };
export const topStorageConsumersData: TopStorageConsumer[] = [];

export const dataAgeDistributionData: DataAgeDistributionItem[] = [];
export const storageByTierData = {
    current: [{ name: 'Hot', value: 80, color: '#DC2626' }],
    recommended: [{ name: 'Hot', value: 60, color: '#DC2626' }]
};
export const tieringOpportunitiesData: TieringOpportunityItem[] = [];
export const policyComplianceData = { compliancePercentage: 85 };
export const costSpendForecastData = [];
export const costForecastByTierData = [];
export const costAnomalyAlertsData: AnomalyAlertItem[] = [];
export const costSavingsProjectionData = { message: 'AI projects 15% savings', savingsPercentage: 15 };
export const storageSummaryData = { totalStorageGB: 45000, totalSpend: 2500 };

export const recommendationsData: Recommendation[] = (function() {
    const recs: Recommendation[] = [];
    const resourceTypes: ResourceType[] = ['Query', 'Warehouse', 'Storage', 'Database', 'User', 'Application', 'Account'];
    const accounts = ['Finance Prod', 'Account B', 'Account C', 'Account D', 'Account E'];
    const severities: SeverityImpact[] = ['High', 'Medium', 'Low', 'Cost Saving', 'Performance Boost', 'High Cost'];
    const statuses: RecommendationStatus[] = ['New', 'Read', 'In Progress', 'Resolved', 'Archived'];
    
    const insightTypes: Record<ResourceType, string[]> = {
        'Query': ['Table Scan Optimization', 'Join Inefficiency', 'Redundant CTE', 'Inefficient Filter', 'Execution Skew'],
        'Warehouse': ['Warehouse Rightsizing', 'Idle Warehouse Detection', 'Queuing Bottleneck', 'Over-provisioned Clusters'],
        'Storage': ['Stale Data Cleanup', 'Time Travel Retention', 'Clustering Opportunity', 'Mismatched Data Types'],
        'Database': ['Access Pattern Shift', 'Schema Optimization', 'Unused Indices', 'Partition Pruning'],
        'User': ['Suspicious Activity', 'Unused Credentials', 'Privilege Escalation', 'High Concurrency Load'],
        'Application': ['Unexpected Consumption Spike', 'Governance Violation', 'Pipeline Latency', 'Batch Window Overlap'],
        'Account': ['Cloud Service Spikes', 'Budget Threshold Warning', 'Mismatched Region Load', 'Storage Growth Anomaly'],
        'All': ['Global Optimization']
    };

    const messages: Record<string, string> = {
        'Table Scan Optimization': "Potential full table scan detected. The query scans large volumes without efficient pruning.",
        'Warehouse Rightsizing': "Warehouse is consistently under-utilized. Consider reducing size to save credits.",
        'Stale Data Cleanup': "Table has not been accessed in over 90 days. Consider dropping or archiving.",
        'Unexpected Consumption Spike': "Resource consumed 40% more credits than usual in the last 24h.",
        'Join Inefficiency': "Complex nested join causing high CPU utilization. Consider denormalization or refactoring.",
        'Idle Warehouse Detection': "Warehouse remained active with 0 queries for several hours.",
        'Suspicious Activity': "User account exhibiting unusual login patterns and high-volume data egress.",
        'Budget Threshold Warning': "Account is projected to exceed allocated budget by 15%."
    };

    for (let i = 1; i <= 110; i++) {
        const type = resourceTypes[i % resourceTypes.length];
        const account = accounts[i % accounts.length];
        const insightList = insightTypes[type];
        const insight = insightList[i % insightList.length];
        const severity = severities[i % severities.length];
        const status = statuses[i % statuses.length];
        
        recs.push({
            id: `REC-${String(i).padStart(3, '0')}`,
            resourceType: type,
            affectedResource: type === 'Query' ? `q-${Math.floor(Math.random() * 9000000 + 1000000)}` : `${type.toUpperCase()}_${Math.floor(Math.random() * 50) + 1}`,
            severity: severity,
            insightType: insight,
            message: messages[insight] || `Detected ${insight.toLowerCase()} impacting resource efficiency and cost performance.`,
            detailedExplanation: `Analyzed workload from the past 7 days. Implementation of this recommendation could lead to significant performance improvements.`,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
            accountName: account,
            status: status,
            metrics: {
                creditsBefore: Math.random() * 100 + 5,
                estimatedSavings: Math.random() * 50 + 1
            }
        });
    }
    return recs;
})();
