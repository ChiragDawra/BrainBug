import express from 'express';
const router = express.Router();

// This is the mock data from your frontend's BugHistory page
const allBugs = [
  // {
  //   id: 1,
  //   type: 'Null Pointer Exception',
  //   file: 'src/components/UserProfile.tsx',
  //   line: 42,
  //   date: '2024-12-11T10:00:00Z',
  //   snippet: 'const user = users.find(u => u.id === userId);\nreturn user.name; // user might be undefined',
  //   language: 'TypeScript',
  // },
  {
    id: 2,
    type: 'Off-by-One Error',
    file: 'src/utils/arrayHelpers.ts',
    line: 128,
    date: '2024-12-11T08:30:00Z',
    snippet: 'for (let i = 0; i <= arr.length; i++) {\n  // Should be i < arr.length\n  process(arr[i]);\n}',
    language: 'TypeScript',
  },
  {
    id: 3,
    type: 'Type Mismatch',
    file: 'src/api/endpoints.ts',
    line: 67,
    date: '2024-12-10T14:20:00Z',
    snippet: 'const count: number = "123"; // Type string not assignable to number',
    language: 'TypeScript',
  }
];

// This creates a GET route at /api/bugs
router.get('/bugs', (req, res) => {
  console.log("Request received for /api/bugs");
  res.json(allBugs);
});

export default router;