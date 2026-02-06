
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
    { id: 'm-1', name: 'llama3-70b', inputTokens: '450K', outputTokens: '400K', tokens: '850K', credits: 1.2, insightCount: 5 },
    { id: 'm-2', name: 'mistral-large', inputTokens: '720K', outputTokens: '480K', tokens: '1.2M', credits: 1.9, insightCount: 2 },
    { id: 'm-3', name: 'snowflake-arctic', inputTokens: '2.4M', outputTokens: '2.1M', tokens: '4.5M', credits: 4.5, insightCount: 8 },
    { id: 'm-4', name: 're-ranker', inputTokens: '180K', outputTokens: '60K', tokens: '240K', credits: 0.2, insightCount: 1 },
    { id: 'm-5', name: 'text-embedding-gecko', inputTokens: '2.8M', outputTokens: '300K', tokens: '3.1M', credits: 0.8, insightCount: 0 },
    { id: 'm-6', name: 'jamba-instruct', inputTokens: '80K', outputTokens: '70K', tokens: '150K', credits: 0.4, insightCount: 1 },
];

export const workloadsData = [
    { id: 'wl-1', account: 'Finance Prod', workloads: 18, credits: 61400, queryCount: 88200, avgRuntime: '4.6s', idleTime: '17%' },
    { id: 'wl-2', account: 'Sales Prod', workloads: 14, credits: 52800, queryCount: 71300, avgRuntime: '3.9s', idleTime: '13%' },
    { id: 'wl-3', account: 'Marketing Dev', workloads: 9, credits: 29600, queryCount: 41200, avgRuntime: '5.8s', idleTime: '24%' },
    { id: 'wl-4', account: 'Data Platform', workloads: 11, credits: 24100, queryCount: 38900, avgRuntime: '3.5s', idleTime: '11%' },
];

export const servicesData = [
    { id: 'svc-1', type: 'SEARCH_OPTIMIZATION', account: 'Finance Prod', credits: 1230, count: 6, queryCount: 18200, trend: '↑ 12%' },
    { id: 'svc-2', type: 'QUERY_ACCELERATION', account: 'Retail Prod', credits: 2840, count: 4, queryCount: 41600, trend: '↑ 21%' },
    { id: 'svc-3', type: 'SERVERLESS_TASK', account: 'Risk Dev', credits: 420, count: 3, queryCount: 6200, trend: '↓ 4%' },
    { id: 'svc-4', type: 'AUTO_CLUSTERING', account: 'Marketing QA', credits: 310, count: 2, queryCount: 2900, trend: '↑ 6%' },
    { id: 'svc-5', type: 'AI_SERVICES', account: 'Supply Prod', credits: 1980, count: 5, queryCount: 14400, trend: '↑ 17%' },
];

export const vampireSpendData = [
    { name: 'Finance Prod', compute: 12000, cloud: 1450, isAlert: true },
    { name: 'Account B', compute: 8500, cloud: 420, isAlert: false },
    { name: 'Account C', compute: 7200, cloud: 680, isAlert: false },
    { name: 'Account D', compute: 3100, cloud: 350, isAlert: true },
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

export const assignedQueriesData: AssignedQuery[] = [
    {
        id: 'aq-1',
        queryId: 'Production ETL Spike',
        queryText: 'SELECT * FROM FACT_SALES WHERE EVENT_DATE >= "2023-01-01" AND STATUS = "COMPLETED"',
        assignedBy: 'FinOps Admin',
        assignedTo: 'Data Engineer',
        priority: 'High',
        status: 'In progress',
        message: 'This query is showing a massive spike in warehouse credits. Please optimize the partition filters.',
        assignedOn: '2024-02-05T10:00:00Z',
        cost: 44.19,
        tokens: 15.2,
        credits: 44.19,
        warehouse: 'COMPUTE_WH',
        history: [
            { id: 'h-1', type: 'system', author: 'FinOps Admin', timestamp: '2024-02-05T10:00:00Z', content: 'Task assigned to Data Engineer' }
        ]
    },
    {
        id: 'aq-2',
        queryId: 'Tableau BI Latency',
        queryText: 'SELECT CUSTOMER_NAME, SUM(TOTAL_AMOUNT) FROM ORDERS GROUP BY 1 ORDER BY 2 DESC',
        assignedBy: 'FinOps Admin',
        assignedTo: 'Data Analyst',
        priority: 'Medium',
        status: 'Assigned',
        message: 'The executive dashboard is loading slowly due to this aggregation. Can we pre-aggregate this data?',
        assignedOn: '2024-02-06T14:30:00Z',
        cost: 12.50,
        tokens: 4.8,
        credits: 12.50,
        warehouse: 'ANALYTICS_WH',
        history: [
            { id: 'h-2', type: 'system', author: 'FinOps Admin', timestamp: '2024-02-06T14:30:00Z', content: 'Task assigned to Data Analyst' }
        ]
    },
    {
        id: 'aq-3',
        queryId: 'Monthly Report Cleanup',
        queryText: 'DELETE FROM STG_EVENTS WHERE PROCESSED_AT < CURRENT_DATE() - 30',
        assignedBy: 'FinOps Admin',
        assignedTo: 'Junior Dev',
        priority: 'Low',
        status: 'Optimized',
        message: 'Cleanup job is taking 30 minutes. Let\'s optimize the deletion pattern.',
        assignedOn: '2024-02-01T09:15:00Z',
        cost: 8.20,
        tokens: 3.1,
        credits: 8.20,
        warehouse: 'ETL_WH',
        engineerResponse: 'Optimized by processing in smaller batches to avoid transaction log pressure.',
        history: [
            { id: 'h-3', type: 'system', author: 'FinOps Admin', timestamp: '2024-02-01T09:15:00Z', content: 'Task assigned' },
            { id: 'h-4', type: 'comment', author: 'Junior Dev', timestamp: '2024-02-02T11:00:00Z', content: 'Working on refactoring the delete script.' }
        ]
    },
    {
        id: 'aq-4',
        queryId: 'Log Ingestion Optimization',
        queryText: 'INSERT INTO LOGS_ARCHIVE SELECT * FROM LOGS_STAGING',
        assignedBy: 'FinOps Admin',
        assignedTo: 'Data Engineer',
        priority: 'High',
        status: 'Needs clarification',
        message: 'Ingestion is failing during peak hours. Verify if we can use Snowpipe.',
        assignedOn: '2024-02-04T16:45:00Z',
        cost: 156.40,
        tokens: 52.5,
        credits: 156.40,
        warehouse: 'LOAD_WH',
        history: [
            { id: 'h-5', type: 'system', author: 'FinOps Admin', timestamp: '2024-02-04T16:45:00Z', content: 'Task assigned' }
        ]
    },
    {
        id: 'aq-5',
        queryId: 'Inventory Sync Issue',
        queryText: 'UPDATE INVENTORY SET STOCK = STOCK - 1 WHERE SKU_ID = ?',
        assignedBy: 'FinOps Admin',
        assignedTo: 'Backend Lead',
        priority: 'Medium',
        status: 'Assigned',
        message: 'Row-by-row updates are expensive. Can we switch to a merge operation?',
        assignedOn: '2024-02-06T11:20:00Z',
        cost: 22.10,
        tokens: 8.4,
        credits: 22.10,
        warehouse: 'TRANSFORM_WH',
        history: [
            { id: 'h-6', type: 'system', author: 'FinOps Admin', timestamp: '2024-02-06T11:20:00Z', content: 'Task assigned' }
        ]
    }
];

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

export const spendTrendsData = [
    { date: 'Nov 14', total: 1200, warehouse: 1000, storage: 150, cloud: 50 },
    { date: 'Nov 15', total: 1450, warehouse: 1200, storage: 180, cloud: 70 },
    { date: 'Nov 16', total: 1100, warehouse: 900, storage: 150, cloud: 50 },
    { date: 'Nov 17', total: 1600, warehouse: 1400, storage: 140, cloud: 60 },
    { date: 'Nov 18', total: 1300, warehouse: 1100, storage: 150, cloud: 50 },
    { date: 'Nov 19', total: 1800, warehouse: 1500, storage: 200, cloud: 100 },
    { date: 'Nov 20', total: 1550, warehouse: 1300, storage: 180, cloud: 70 },
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
    const accounts = ['Finance Prod', 'Account B', 'Account C', 'Account D', 'Account E', 'Account F', 'Account G', 'Account H'];
    const appNames = ['Production ETL', 'Tableau BI Dashboards', 'Log Ingestion Service', 'SageMaker ML Model', 'Inventory Sync Job'];
    const severities: SeverityImpact[] = ['High', 'Medium', 'Low', 'Cost Saving', 'Performance Boost', 'High Cost'];
    const statuses: RecommendationStatus[] = ['New', 'Read', 'In Progress', 'Resolved', 'Archived'];
    const users = ['jane_doe', 'mike_fin', 'admin_user', 'data_eng_1', 'analyst_pro'];
    const warehouses = ['COMPUTE_WH', 'ETL_WH', 'ANALYTICS_WH', 'TRANSFORM_WH'];
    
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
        'Table Scan Optimization': "A JOIN in this query has no join condition (at node [1]), which produces many more rows than the total number of rows that went in.",
        'Warehouse Rightsizing': "Your warehouse is currently operating at only 12% utilization while being provisioned at LARGE. Scaling down will immediately reduce cost without impacting performance.",
        'Stale Data Cleanup': "We detected tables that have not been accessed in over 90 days. These are incurring storage costs without providing business value.",
        'Unexpected Consumption Spike': "Resource usage spiked by 42% in the last 24 hours. This typically indicates an unoptimized batch job or a new data-heavy dashboard refresh.",
        'Join Inefficiency': "This query utilizes a nested loop join across two large tables. Adding a proper equality condition or pre-filtering partitions could significantly speed up execution.",
        'Idle Warehouse Detection': "Warehouse COMPUTE_WH remained active with zero running queries for a continuous 3-hour window. Auto-suspend settings are likely too high.",
        'Suspicious Activity': "Unusual account behavior detected. High-volume data export patterns from a standard analyst role might indicate a security risk.",
        'Budget Threshold Warning': "At current consumption rates, this account is projected to exceed its allocated monthly budget by 18% within the next 4 days."
    };

    const suggestions: Record<string, string> = {
        'Table Scan Optimization': "Adding at least one condition to define the relationship between columns in the joined data sets could speed up this query by reducing the number of rows that it produces.",
        'Warehouse Rightsizing': "We recommend resizing the ETL_WH from LARGE to SMALL. This adjustment aligns with your average workload profile and is estimated to save 1,450 credits per month.",
        'Stale Data Cleanup': "Identify and drop unused tables or migrate them to a cheaper archival tier. Start by reviewing the 'STG_OLD_EVENTS' table which hasn't been queried since Q2.",
        'Unexpected Consumption Spike': "Investigate the 'Daily Revenue Sync' job. Review recent commits to the SQL logic as a change in filtering might be causing full table scans.",
        'Join Inefficiency': "Apply a join condition using indexed columns. Our optimizer suggests using the 'org_id' and 'event_date' columns to leverage Snowflake's partition pruning.",
        'Idle Warehouse Detection': "Decrease the auto-suspend timer to 60 seconds. This ensures you only pay for active compute while maintaining sub-second resume capabilities.",
        'Suspicious Activity': "Enforce multi-factor authentication (MFA) and temporarily restrict data export privileges for this user until the activity is verified.",
        'Budget Threshold Warning': "Review active queries for the past 24h. Consider scaling down non-critical development warehouses until the next billing cycle begins."
    };

    const sqlQueries = [
        `WITH 
  monthly_customer_revenue AS (
    SELECT 
      DATE_TRUNC('month', order_date) as sales_month,
      customer_id,
      SUM(total_amount) as revenue
    FROM snowflake_db.public.sales_orders
    WHERE order_date >= DATEADD(year, -1, CURRENT_DATE())
      AND status = 'COMPLETED'
    GROUP BY 1, 2
  ),
  customer_growth AS (
    SELECT 
      sales_month,
      customer_id,
      revenue,
      LAG(revenue) OVER (PARTITION BY customer_id ORDER BY sales_month) as prev_month_revenue
    FROM monthly_customer_revenue
  ),
  top_tier_customers AS (
    SELECT 
      cg.sales_month,
      c.first_name,
      c.last_name,
      c.email,
      cg.revenue,
      cg.prev_month_revenue,
      ((cg.revenue - cg.prev_month_revenue) / NULLIF(cg.prev_month_revenue, 0)) * 100 as growth_percentage
    FROM customer_growth cg
    INNER JOIN snowflake_db.public.customers c ON cg.customer_id = c.id
    WHERE cg.revenue > 10000
  )
SELECT 
  sales_month,
  first_name || ' ' || last_name as full_name,
  revenue,
  growth_percentage
FROM top_tier_customers
WHERE growth_percentage > 10
ORDER BY sales_month DESC, revenue DESC
LIMIT 500;`,
        `SELECT 
    p.category,
    p.product_name,
    SUM(oi.quantity) as total_units_sold,
    SUM(oi.quantity * p.price) as gross_revenue,
    AVG(p.price) as average_price,
    COUNT(DISTINCT o.id) as number_of_orders
FROM production_db.inventory.products p
JOIN production_db.sales.order_items oi ON p.id = oi.product_id
JOIN production_db.sales.orders o ON oi.order_id = o.id
WHERE o.order_date BETWEEN '2023-01-01' AND '2023-12-31'
  AND p.status = 'ACTIVE'
  AND o.region IN ('NORTH_AMERICA', 'EUROPE', 'ASIA_PACIFIC')
GROUP BY 1, 2
HAVING gross_revenue > 50000
ORDER BY gross_revenue DESC;`,
        `INSERT INTO warehouse_metrics.usage.daily_summary (
    summary_date,
    warehouse_id,
    total_queries,
    avg_execution_time_ms,
    total_credits_used,
    p95_queue_time_ms
)
SELECT 
    CURRENT_DATE() - 1 as summary_date,
    wh.id as warehouse_id,
    COUNT(qh.query_id) as total_queries,
    AVG(qh.execution_time) as avg_execution_time_ms,
    SUM(qh.credits_used) as total_credits_used,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY qh.queued_time) as p95_queue_time_ms
FROM snowflake.account_usage.query_history qh
JOIN snowflake.account_usage.warehouses wh ON qh.warehouse_name = wh.name
WHERE qh.start_time >= DATEADD(day, -1, CURRENT_DATE())
  AND qh.start_time < CURRENT_DATE()
GROUP BY 1, 2;`,
        `DELETE FROM staging_db.raw_data.ingestion_logs
WHERE ingested_at < DATEADD(month, -3, CURRENT_TIMESTAMP())
  AND status = 'PROCESSED'
  AND id NOT IN (
    SELECT log_id 
    FROM archive_db.logs.critical_incidents 
    WHERE created_at >= DATEADD(month, -6, CURRENT_TIMESTAMP())
  );`,
        `WITH 
  user_activity AS (
    SELECT 
      user_id,
      session_id,
      MIN(event_timestamp) as session_start,
      MAX(event_timestamp) as session_end,
      COUNT(event_id) as total_events
    FROM web_events.tracking.clicks
    GROUP BY 1, 2
  ),
  session_durations AS (
    SELECT 
      user_id,
      DATEDIFF('minute', session_start, session_end) as duration_minutes,
      total_events
    FROM user_activity
    WHERE session_end > session_start
  )
SELECT 
  u.user_segment,
  AVG(sd.duration_minutes) as avg_session_length,
  AVG(sd.total_events) as avg_events_per_session,
  COUNT(DISTINCT u.id) as active_users
FROM session_durations sd
JOIN web_events.core.users u ON sd.user_id = u.id
GROUP BY 1
ORDER BY active_users DESC;`
    ];

    for (let i = 1; i <= 150; i++) {
        let type = resourceTypes[i % resourceTypes.length];
        const account = accounts[i % accounts.length];
        const insightList = insightTypes[type];
        const insight = insightList[i % insightList.length];
        const severity = severities[i % severities.length];
        const status = statuses[i % statuses.length];
        
        let affectedResource = '';
        if (type === 'Application') {
            affectedResource = appNames[i % appNames.length];
        } else if (type === 'Query') {
            affectedResource = `q-${Math.floor(Math.random() * 9000000 + 1000000)}`;
            const appAssoc = appNames[i % appNames.length];
            if (i % 2 === 0) affectedResource = `${appAssoc} - ${affectedResource}`;
        } else if (type === 'Warehouse') {
            affectedResource = warehouses[i % warehouses.length];
        } else {
            affectedResource = `${type.toUpperCase()}_${Math.floor(Math.random() * 50) + 1}`;
        }
        
        recs.push({
            id: `REC-${String(i).padStart(3, '0')}`,
            resourceType: type,
            affectedResource: affectedResource,
            severity: severity,
            insightType: insight,
            message: messages[insight] || `Detected ${insight.toLowerCase()} impacting resource efficiency and cost performance.`,
            suggestion: suggestions[insight] || `Implement recommended configuration changes and review execution plans to optimize resource utilization.`,
            detailedExplanation: `Analyzed workload from the past 7 days. Implementation of this recommendation could lead to significant performance improvements and cost reduction. System telemetry indicates higher than normal resource locking during peak hours.`,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
            accountName: account,
            userName: users[i % users.length],
            warehouseName: warehouses[i % warehouses.length],
            status: status,
            metrics: {
                creditsBefore: Math.random() * 100 + 5,
                estimatedSavings: Math.random() * 50 + 1,
                queryText: sqlQueries[i % sqlQueries.length]
            }
        });
    }
    return recs;
})();
