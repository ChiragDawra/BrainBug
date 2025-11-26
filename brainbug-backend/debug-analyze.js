import axios from "axios";

const BASE_URL = "http://localhost:5000";
const API_BASE = `${BASE_URL}/api`;
const TEST_USER_ID = "507f1f77bcf86cd799439011";

async function testAnalyze() {
    console.log("Testing POST /api/analyze...");
    const testCode = `
function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
}
`;

    try {
        const response = await axios.post(`${API_BASE}/analyze`, {
            code: testCode,
            filePath: "test-project/src/utils/calculator.js",
            userId: TEST_USER_ID
        });
        console.log("Success:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("Error Status:", error.response?.status);
        console.error("Error Data:", JSON.stringify(error.response?.data, null, 2));
    }
}

testAnalyze();
