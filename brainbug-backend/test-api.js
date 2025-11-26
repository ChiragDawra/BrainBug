import axios from "axios";

const BASE_URL = "http://localhost:5000";
const API_BASE = `${BASE_URL}/api`;

// Test configuration
const TEST_USER_ID = "507f1f77bcf86cd799439011"; // Sample ObjectId for testing
let createdBugEntryId = null;

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name) {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(`Testing: ${name}`, 'blue');
    log('='.repeat(60), 'cyan');
}

async function testAnalyzeEndpoint() {
    logTest("POST /api/analyze");

    const testCode = `
function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
}

const products = [
    { name: "Apple", price: 1.5 },
    { name: "Banana", price: 0.8 }
];

const result = calculateTotal(products);
console.log(result);
`;

    try {
        const response = await axios.post(`${API_BASE}/analyze`, {
            code: testCode,
            filePath: "test-project/src/utils/calculator.js",
            userId: TEST_USER_ID
        });

        log("✓ Request successful", 'green');
        log(`Status: ${response.status}`, 'green');
        log(`Response:`, 'green');
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data.bugEntry && response.data.bugEntry.id) {
            createdBugEntryId = response.data.bugEntry.id;
            log(`\nCreated BugEntry ID: ${createdBugEntryId}`, 'yellow');
        }

        return true;
    } catch (error) {
        log("✗ Request failed", 'red');
        if (error.response) {
            log(`Status: ${error.response.status}`, 'red');
            log(`Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
        } else {
            log(`Error: ${error.message}`, 'red');
        }
        return false;
    }
}

async function testDashboardEndpoint() {
    logTest("GET /api/dashboard");

    try {
        const response = await axios.get(`${API_BASE}/dashboard`, {
            params: {
                userId: TEST_USER_ID
            }
        });

        log("✓ Request successful", 'green');
        log(`Status: ${response.status}`, 'green');
        log(`Response:`, 'green');
        console.log(JSON.stringify(response.data, null, 2));

        // Validate response structure
        if (response.data.statCards && response.data.aiAnalysis && response.data.bugsVsTime && response.data.recentBugs) {
            log("\n✓ Response structure is valid", 'green');
        } else {
            log("\n✗ Response structure is incomplete", 'red');
        }

        return true;
    } catch (error) {
        log("✗ Request failed", 'red');
        if (error.response) {
            log(`Status: ${error.response.status}`, 'red');
            log(`Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
        } else {
            log(`Error: ${error.message}`, 'red');
        }
        return false;
    }
}

async function testAnalyticsEndpoint() {
    logTest("GET /api/analytics");

    try {
        const response = await axios.get(`${API_BASE}/analytics`, {
            params: {
                userId: TEST_USER_ID
            }
        });

        log("✓ Request successful", 'green');
        log(`Status: ${response.status}`, 'green');
        log(`Response:`, 'green');
        console.log(JSON.stringify(response.data, null, 2));

        // Validate response structure
        if (response.data.bugTypeDistribution && response.data.bugsByProject && response.data.bugsByLanguage) {
            log("\n✓ Response structure is valid", 'green');
        } else {
            log("\n✗ Response structure is incomplete", 'red');
        }

        return true;
    } catch (error) {
        log("✗ Request failed", 'red');
        if (error.response) {
            log(`Status: ${error.response.status}`, 'red');
            log(`Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
        } else {
            log(`Error: ${error.message}`, 'red');
        }
        return false;
    }
}

async function testBugHistoryEndpoint() {
    logTest("GET /api/bug-history");

    try {
        // Test 1: Basic request with pagination
        log("\n--- Test 1: Basic request with pagination ---", 'yellow');
        const response1 = await axios.get(`${API_BASE}/bug-history`, {
            params: {
                userId: TEST_USER_ID,
                page: 1,
                limit: 5
            }
        });

        log("✓ Request successful", 'green');
        log(`Status: ${response1.status}`, 'green');
        log(`Total items: ${response1.data.pagination?.total || 0}`, 'green');
        log(`Page: ${response1.data.pagination?.page || 'N/A'}`, 'green');
        log(`Total pages: ${response1.data.pagination?.totalPages || 'N/A'}`, 'green');

        // Test 2: Filter by bugType
        log("\n--- Test 2: Filter by bugType ---", 'yellow');
        const response2 = await axios.get(`${API_BASE}/bug-history`, {
            params: {
                userId: TEST_USER_ID,
                bugType: "Logic Error"
            }
        });

        log("✓ Request successful", 'green');
        log(`Status: ${response2.status}`, 'green');
        log(`Filtered items: ${response2.data.pagination?.total || 0}`, 'green');

        // Test 3: Filter by dateRange
        log("\n--- Test 3: Filter by dateRange (week) ---", 'yellow');
        const response3 = await axios.get(`${API_BASE}/bug-history`, {
            params: {
                userId: TEST_USER_ID,
                dateRange: "week"
            }
        });

        log("✓ Request successful", 'green');
        log(`Status: ${response3.status}`, 'green');
        log(`Items in last week: ${response3.data.pagination?.total || 0}`, 'green');

        // Test 4: Combined filters
        log("\n--- Test 4: Combined filters (bugType + dateRange) ---", 'yellow');
        const response4 = await axios.get(`${API_BASE}/bug-history`, {
            params: {
                userId: TEST_USER_ID,
                bugType: "Logic Error",
                dateRange: "month",
                page: 1,
                limit: 10
            }
        });

        log("✓ Request successful", 'green');
        log(`Status: ${response4.status}`, 'green');
        log(`Filtered items: ${response4.data.pagination?.total || 0}`, 'green');

        return true;
    } catch (error) {
        log("✗ Request failed", 'red');
        if (error.response) {
            log(`Status: ${error.response.status}`, 'red');
            log(`Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
        } else {
            log(`Error: ${error.message}`, 'red');
        }
        return false;
    }
}

async function testErrorHandling() {
    logTest("Error Handling Tests");

    const tests = [
        {
            name: "POST /api/analyze - Missing code",
            method: "post",
            url: `${API_BASE}/analyze`,
            data: { filePath: "test.js", userId: TEST_USER_ID },
            expectedStatus: 400
        },
        {
            name: "POST /api/analyze - Missing userId",
            method: "post",
            url: `${API_BASE}/analyze`,
            data: { code: "console.log('test');", filePath: "test.js" },
            expectedStatus: 400
        },
        {
            name: "GET /api/dashboard - Missing userId",
            method: "get",
            url: `${API_BASE}/dashboard`,
            expectedStatus: 400
        },
        {
            name: "GET /api/analytics - Missing userId",
            method: "get",
            url: `${API_BASE}/analytics`,
            expectedStatus: 400
        },
        {
            name: "GET /api/bug-history - Missing userId",
            method: "get",
            url: `${API_BASE}/bug-history`,
            expectedStatus: 400
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            let response;
            if (test.method === "post") {
                response = await axios.post(test.url, test.data);
            } else {
                response = await axios.get(test.url);
            }

            if (response.status === test.expectedStatus) {
                log(`✓ ${test.name} - Correct error status`, 'green');
                passed++;
            } else {
                log(`✗ ${test.name} - Expected ${test.expectedStatus}, got ${response.status}`, 'red');
                failed++;
            }
        } catch (error) {
            if (error.response && error.response.status === test.expectedStatus) {
                log(`✓ ${test.name} - Correct error status`, 'green');
                passed++;
            } else {
                log(`✗ ${test.name} - Expected ${test.expectedStatus}, got ${error.response?.status || 'N/A'}`, 'red');
                failed++;
            }
        }
    }

    log(`\nError handling tests: ${passed} passed, ${failed} failed`, passed === tests.length ? 'green' : 'yellow');
    return failed === 0;
}

async function runAllTests() {
    log("\n" + "=".repeat(60), 'cyan');
    log("🧪 BrainBug Backend API Test Suite", 'cyan');
    log("=".repeat(60), 'cyan');
    log(`\nTesting against: ${BASE_URL}`, 'yellow');
    log(`Test User ID: ${TEST_USER_ID}\n`, 'yellow');

    // Check if server is running
    log("\nChecking server connection...", 'yellow');
    try {
        const healthCheck = await axios.get(`${BASE_URL}/api/dashboard?userId=${TEST_USER_ID}`, {
            timeout: 2000,
            validateStatus: () => true // Don't throw on any status
        });
        log("✓ Server is reachable", 'green');
    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ECONNRESET') {
            log("\n✗ ERROR: Cannot connect to server!", 'red');
            log("Please make sure the server is running on http://localhost:5000", 'red');
            log("\nTo start the server:", 'yellow');
            log("  1. Make sure you have a .env file with MONGO_URI and GEMINI_API_KEY", 'yellow');
            log("  2. Run: npm start (or npm run dev for development)", 'yellow');
            log("  3. Wait for '🚀 BrainBug Backend running on http://localhost:5000' message", 'yellow');
            log("\nThen run this test again: npm test\n", 'yellow');
            process.exit(1);
        } else if (error.code === 'ETIMEDOUT') {
            log("⚠ Server might be slow to respond, continuing with tests...", 'yellow');
        }
    }

    const results = {
        analyze: false,
        dashboard: false,
        analytics: false,
        bugHistory: false,
        errorHandling: false
    };

    // Run tests
    results.analyze = await testAnalyzeEndpoint();
    
    // Wait a bit for async UserAnalysis update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    results.dashboard = await testDashboardEndpoint();
    results.analytics = await testAnalyticsEndpoint();
    results.bugHistory = await testBugHistoryEndpoint();
    results.errorHandling = await testErrorHandling();

    // Summary
    log("\n" + "=".repeat(60), 'cyan');
    log("📊 Test Summary", 'cyan');
    log("=".repeat(60), 'cyan');
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r).length;
    
    log(`\nTotal Tests: ${totalTests}`, 'blue');
    log(`Passed: ${passedTests}`, passedTests === totalTests ? 'green' : 'yellow');
    log(`Failed: ${totalTests - passedTests}`, passedTests === totalTests ? 'green' : 'red');
    
    log("\nDetailed Results:", 'blue');
    Object.entries(results).forEach(([test, passed]) => {
        log(`  ${passed ? '✓' : '✗'} ${test}`, passed ? 'green' : 'red');
    });

    log("\n" + "=".repeat(60), 'cyan');
    
    if (passedTests === totalTests) {
        log("🎉 All tests passed!", 'green');
        process.exit(0);
    } else {
        log("⚠️  Some tests failed. Please review the errors above.", 'yellow');
        process.exit(1);
    }
}

// Run tests
runAllTests().catch(error => {
    log(`\n✗ Fatal error: ${error.message}`, 'red');
    process.exit(1);
});

