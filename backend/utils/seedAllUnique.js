const { initDatabase, Problem } = require('../config/initDatabase');

const allProblems = [
  // --- Set 1 (Original 8) ---
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy", category: "Arrays", tags: ["array", "hash-table"],
    inputFormat: "n, nums, target", outputFormat: "indices", constraints: "2 <= nums.length <= 10^4",
    sampleInput: "4\n2 7 11 15\n9", sampleOutput: "0 1",
    testCases: [{ input: "4\n2 7 11 15\n9", expectedOutput: "0 1", isHidden: false }], points: 10
  },
  {
    title: "Palindrome Number",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    difficulty: "Easy", category: "Math", tags: ["math"],
    inputFormat: "x", outputFormat: "true/false", constraints: "-2^31 <= x <= 2^31 - 1",
    sampleInput: "121", sampleOutput: "true",
    testCases: [{ input: "121", expectedOutput: "true", isHidden: false }], points: 10
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "Easy", category: "Stacks", tags: ["stack", "string"],
    inputFormat: "s", outputFormat: "true/false", constraints: "1 <= s.length <= 10^4",
    sampleInput: "()", sampleOutput: "true",
    testCases: [{ input: "()", expectedOutput: "true", isHidden: false }], points: 15
  },
  {
    title: "Binary Search",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
    difficulty: "Medium", category: "Searching", tags: ["array", "binary-search"],
    inputFormat: "n, nums, target", outputFormat: "index", constraints: "1 <= nums.length <= 10^4",
    sampleInput: "6\n-1 0 3 5 9 12\n9", sampleOutput: "4",
    testCases: [{ input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4", isHidden: false }], points: 20
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the contiguous subarray which has the largest sum.",
    difficulty: "Medium", category: "Dynamic Programming", tags: ["array", "dynamic-programming"],
    inputFormat: "n, nums", outputFormat: "sum", constraints: "1 <= nums.length <= 10^5",
    sampleInput: "9\n-2 1 -3 4 -1 2 1 -5 4", sampleOutput: "6",
    testCases: [{ input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", isHidden: false }], points: 25
  },
  {
    title: "Merge Sort",
    description: "Implement merge sort algorithm to sort an array in ascending order.",
    difficulty: "Medium", category: "Sorting", tags: ["array", "sorting"],
    inputFormat: "n, nums", outputFormat: "sorted array", constraints: "1 <= n <= 10^5",
    sampleInput: "6\n12 11 13 5 6 7", sampleOutput: "5 6 7 11 12 13",
    testCases: [{ input: "6\n12 11 13 5 6 7", expectedOutput: "5 6 7 11 12 13", isHidden: false }], points: 20
  },
  {
    title: "Fibonacci Number",
    description: "Calculate the nth Fibonacci number.",
    difficulty: "Easy", category: "Recursion", tags: ["recursion", "math"],
    inputFormat: "n", outputFormat: "nth fibonacci", constraints: "0 <= n <= 30",
    sampleInput: "3", sampleOutput: "2",
    testCases: [{ input: "3", expectedOutput: "2", isHidden: false }], points: 10
  },
  {
    title: "Linked List Cycle",
    description: "Determine if a linked list has a cycle.",
    difficulty: "Medium", category: "Linked Lists", tags: ["linked-list", "two-pointers"],
    inputFormat: "n, nodes, pos", outputFormat: "true/false", constraints: "0 <= n <= 10^4",
    sampleInput: "3\n3 2 0 -4\n1", sampleOutput: "true",
    testCases: [{ input: "3\n3 2 0 -4\n1", expectedOutput: "true", isHidden: false }], points: 25
  },

  // --- Set 2 (Next 10) ---
  {
    title: "Reverse String",
    description: "Write a function that reverses a string in-place.",
    difficulty: "Easy", category: "Strings", tags: ["string", "two-pointers"],
    inputFormat: "s", outputFormat: "reversed string", constraints: "1 <= s.length <= 10^5",
    sampleInput: "hello", sampleOutput: "olleh",
    testCases: [{ input: "hello", expectedOutput: "olleh", isHidden: false }], points: 10
  },
  {
    title: "Climbing Stairs",
    description: "Calculate how many distinct ways you can climb to the top of a staircase with n steps.",
    difficulty: "Easy", category: "Dynamic Programming", tags: ["dynamic-programming", "math"],
    inputFormat: "n", outputFormat: "ways", constraints: "1 <= n <= 45",
    sampleInput: "2", sampleOutput: "2",
    testCases: [{ input: "2", expectedOutput: "2", isHidden: false }], points: 15
  },
  {
    title: "Power of Two",
    description: "Return true if an integer n is a power of two.",
    difficulty: "Easy", category: "Math", tags: ["math", "bit-manipulation"],
    inputFormat: "n", outputFormat: "true/false", constraints: "-2^31 <= n <= 2^31 - 1",
    sampleInput: "1", sampleOutput: "true",
    testCases: [{ input: "1", expectedOutput: "true", isHidden: false }], points: 10
  },
  {
    title: "Missing Number",
    description: "Return the only number in the range [0, n] that is missing from the array.",
    difficulty: "Easy", category: "Arrays", tags: ["array", "math"],
    inputFormat: "n, nums", outputFormat: "missing number", constraints: "n == nums.length",
    sampleInput: "3\n3 0 1", sampleOutput: "2",
    testCases: [{ input: "3\n3 0 1", expectedOutput: "2", isHidden: false }], points: 15
  },
  {
    title: "Rotate Array",
    description: "Rotate the array to the right by k steps.",
    difficulty: "Medium", category: "Arrays", tags: ["array", "math"],
    inputFormat: "n, k, nums", outputFormat: "rotated array", constraints: "1 <= nums.length <= 10^5",
    sampleInput: "7 3\n1 2 3 4 5 6 7", sampleOutput: "5 6 7 1 2 3 4",
    testCases: [{ input: "7 3\n1 2 3 4 5 6 7", expectedOutput: "5 6 7 1 2 3 4", isHidden: false }], points: 20
  },
  {
    title: "Intersection of Two Arrays",
    description: "Return an array of the intersection of two integer arrays.",
    difficulty: "Easy", category: "Arrays", tags: ["array", "hash-table"],
    inputFormat: "n1, nums1, n2, nums2", outputFormat: "intersection", constraints: "1 <= n1, n2 <= 1000",
    sampleInput: "4\n1 2 2 1\n2\n2 2", sampleOutput: "2",
    testCases: [{ input: "4\n1 2 2 1\n2\n2 2", expectedOutput: "2", isHidden: false }], points: 15
  },
  {
    title: "Container With Most Water",
    description: "Find two lines that form a container with the most water.",
    difficulty: "Medium", category: "Two Pointers", tags: ["array", "two-pointers"],
    inputFormat: "n, height", outputFormat: "max area", constraints: "2 <= n <= 10^5",
    sampleInput: "9\n1 8 6 2 5 4 8 3 7", sampleOutput: "49",
    testCases: [{ input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49", isHidden: false }], points: 25
  },
  {
    title: "Reverse Integer",
    description: "Return x with its digits reversed, handling 32-bit overflow.",
    difficulty: "Medium", category: "Math", tags: ["math"],
    inputFormat: "x", outputFormat: "reversed x", constraints: "-2^31 <= x <= 2^31 - 1",
    sampleInput: "123", sampleOutput: "321",
    testCases: [{ input: "123", expectedOutput: "321", isHidden: false }], points: 20
  },
  {
    title: "String to Integer (atoi)",
    description: "Convert a string to a 32-bit signed integer.",
    difficulty: "Medium", category: "Strings", tags: ["string"],
    inputFormat: "s", outputFormat: "integer", constraints: "0 <= s.length <= 200",
    sampleInput: "42", sampleOutput: "42",
    testCases: [{ input: "42", expectedOutput: "42", isHidden: false }], points: 25
  },
  {
    title: "Single Number",
    description: "Find the element that appears only once in an array where every other element appears twice.",
    difficulty: "Easy", category: "Bit Manipulation", tags: ["array", "bit-manipulation"],
    inputFormat: "n, nums", outputFormat: "single number", constraints: "1 <= nums.length <= 3 * 10^4",
    sampleInput: "3\n2 2 1", sampleOutput: "1",
    testCases: [{ input: "3\n2 2 1", expectedOutput: "1", isHidden: false }], points: 15
  },

  // --- Set 3 (Final 10) ---
  {
    title: "Reverse Linked List",
    description: "Reverse a singly linked list.",
    difficulty: "Medium", category: "Linked Lists", tags: ["linked-list", "recursion"],
    inputFormat: "n, nodes", outputFormat: "reversed list", constraints: "0 <= n <= 5000",
    sampleInput: "5\n1 2 3 4 5", sampleOutput: "5 4 3 2 1",
    testCases: [{ input: "5\n1 2 3 4 5", expectedOutput: "5 4 3 2 1", isHidden: false }], points: 20
  },
  {
    title: "Same Tree",
    description: "Check if two binary trees are structurally identical and have same values.",
    difficulty: "Easy", category: "Trees", tags: ["tree", "binary-tree"],
    inputFormat: "n1, p, n2, q", outputFormat: "true/false", constraints: "0 <= nodes <= 100",
    sampleInput: "3\n1 2 3\n3\n1 2 3", sampleOutput: "true",
    testCases: [{ input: "3\n1 2 3\n3\n1 2 3", expectedOutput: "true", isHidden: false }], points: 10
  },
  {
    title: "Maximum Depth of Binary Tree",
    description: "Return the maximum depth of a binary tree.",
    difficulty: "Easy", category: "Trees", tags: ["tree", "binary-tree"],
    inputFormat: "n, values", outputFormat: "depth", constraints: "0 <= nodes <= 10^4",
    sampleInput: "5\n3 9 20 null null 15 7", sampleOutput: "3",
    testCases: [{ input: "5\n3 9 20 null null 15 7", expectedOutput: "3", isHidden: false }], points: 10
  },
  {
    title: "Best Time to Buy and Sell Stock",
    description: "Maximize profit by choosing a single day to buy and a different day to sell.",
    difficulty: "Easy", category: "Arrays", tags: ["array", "dynamic-programming"],
    inputFormat: "n, prices", outputFormat: "max profit", constraints: "1 <= n <= 10^5",
    sampleInput: "6\n7 1 5 3 6 4", sampleOutput: "5",
    testCases: [{ input: "6\n7 1 5 3 6 4", expectedOutput: "5", isHidden: false }], points: 15
  },
  {
    title: "Valid Anagram",
    description: "Check if string t is an anagram of string s.",
    difficulty: "Easy", category: "Strings", tags: ["string", "hash-table"],
    inputFormat: "s, t", outputFormat: "true/false", constraints: "1 <= n <= 5 * 10^4",
    sampleInput: "anagram\nnagaram", sampleOutput: "true",
    testCases: [{ input: "anagram\nnagaram", expectedOutput: "true", isHidden: false }], points: 10
  },
  {
    title: "Longest Common Prefix",
    description: "Find the longest common prefix string amongst an array of strings.",
    difficulty: "Easy", category: "Strings", tags: ["string"],
    inputFormat: "n, strs", outputFormat: "prefix", constraints: "1 <= n <= 200",
    sampleInput: "3\nflower\nflow\nflight", sampleOutput: "fl",
    testCases: [{ input: "3\nflower\nflow\nflight", expectedOutput: "fl", isHidden: false }], points: 10
  },
  {
    title: "Plus One",
    description: "Increment a large integer represented as a digit array by one.",
    difficulty: "Easy", category: "Math", tags: ["array", "math"],
    inputFormat: "n, digits", outputFormat: "resulting digits", constraints: "1 <= n <= 100",
    sampleInput: "3\n1 2 3", sampleOutput: "1 2 4",
    testCases: [{ input: "3\n1 2 3", expectedOutput: "1 2 4", isHidden: false }], points: 10
  },
  {
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists into one sorted list.",
    difficulty: "Easy", category: "Linked Lists", tags: ["linked-list"],
    inputFormat: "n1, list1, n2, list2", outputFormat: "merged list", constraints: "0 <= nodes <= 50",
    sampleInput: "3\n1 2 4\n3\n1 3 4", sampleOutput: "1 1 2 3 4 4",
    testCases: [{ input: "3\n1 2 4\n3\n1 3 4", expectedOutput: "1 1 2 3 4 4", isHidden: false }], points: 15
  },
  {
    title: "Number of Islands",
    description: "Count the number of islands in an m x n 2D binary grid.",
    difficulty: "Medium", category: "Graphs", tags: ["matrix", "dfs"],
    inputFormat: "m, n, grid", outputFormat: "count", constraints: "1 <= m, n <= 300",
    sampleInput: "4 5\n11110\n11010\n11000\n00000", sampleOutput: "1",
    testCases: [{ input: "4 5\n11110\n11010\n11000\n00000", expectedOutput: "1", isHidden: false }], points: 25
  },
  {
    title: "Group Anagrams",
    description: "Group an array of strings into anagram groups.",
    difficulty: "Medium", category: "Strings", tags: ["string", "hash-table"],
    inputFormat: "n, strs", outputFormat: "groups", constraints: "1 <= n <= 10^4",
    sampleInput: "6\neat\ntea\ntan\nate\nnat\nbat", sampleOutput: "ate eat tea\nnat tan\nbat",
    testCases: [{ input: "6\neat\ntea\ntan\nate\nnat\nbat", expectedOutput: "ate eat tea\nnat tan\nbat", isHidden: false }], points: 20
  }
];

const seedAllUnique = async () => {
  try {
    const { Problem } = await initDatabase();
    
    await Problem.destroy({ where: {} });
    console.log('Cleared all existing problems');
    
    await Problem.bulkCreate(allProblems);
    console.log(`Inserted ${allProblems.length} unique problems`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding unique database:', error);
    process.exit(1);
  }
};

seedAllUnique();
