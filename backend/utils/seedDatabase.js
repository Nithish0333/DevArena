const mongoose = require('mongoose');
const Problem = require('../models/Problem');
require('dotenv').config();

const sampleProblems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["array", "hash-table"],
    inputFormat: "First line contains an integer n (size of array). Second line contains n space-separated integers. Third line contains the target integer.",
    outputFormat: "Print two space-separated indices (0-based) of the numbers that add up to the target.",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
    sampleInput: "4\n2 7 11 15\n9",
    sampleOutput: "0 1",
    testCases: [
      { input: "4\n2 7 11 15\n9", expectedOutput: "0 1", isHidden: false },
      { input: "3\n3 2 4\n6", expectedOutput: "0 1", isHidden: false },
      { input: "3\n3 3\n6", expectedOutput: "0 1", isHidden: true }
    ],
    points: 10
  },
  {
    title: "Palindrome Number",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same backward as forward. For example, 121 is a palindrome while 123 is not.",
    difficulty: "Easy",
    category: "Math",
    tags: ["math"],
    inputFormat: "A single integer x.",
    outputFormat: "Print 'true' if x is a palindrome, otherwise print 'false'.",
    constraints: "-2^31 <= x <= 2^31 - 1",
    sampleInput: "121",
    sampleOutput: "true",
    testCases: [
      { input: "121", expectedOutput: "true", isHidden: false },
      { input: "-121", expectedOutput: "false", isHidden: false },
      { input: "10", expectedOutput: "false", isHidden: true }
    ],
    points: 10
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
    difficulty: "Easy",
    category: "Stacks",
    tags: ["stack", "string"],
    inputFormat: "A string s consisting of parentheses, braces and brackets.",
    outputFormat: "Print 'true' if the string is valid, otherwise print 'false'.",
    constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
    sampleInput: "()",
    sampleOutput: "true",
    testCases: [
      { input: "()", expectedOutput: "true", isHidden: false },
      { input: "()[]{}", expectedOutput: "true", isHidden: false },
      { input: "(]", expectedOutput: "false", isHidden: true }
    ],
    points: 15
  },
  {
    title: "Binary Search",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.",
    difficulty: "Medium",
    category: "Searching",
    tags: ["array", "binary-search"],
    inputFormat: "First line contains an integer n (size of array). Second line contains n space-separated integers in ascending order. Third line contains the target integer.",
    outputFormat: "Print the index of target if found, otherwise print -1.",
    constraints: "1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll the integers in nums are unique.\nnums is sorted in ascending order.",
    sampleInput: "6\n-1 0 3 5 9 12\n9",
    sampleOutput: "4",
    testCases: [
      { input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4", isHidden: false },
      { input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1", isHidden: false },
      { input: "1\n5\n5", expectedOutput: "0", isHidden: true }
    ],
    points: 20
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. A subarray is a contiguous part of an array.",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["array", "dynamic-programming"],
    inputFormat: "First line contains an integer n (size of array). Second line contains n space-separated integers.",
    outputFormat: "Print the maximum possible sum of a contiguous subarray.",
    constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    sampleInput: "9\n-2 1 -3 4 -1 2 1 -5 4",
    sampleOutput: "6",
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: false },
      { input: "5\n5 4 -1 7 8", expectedOutput: "23", isHidden: true }
    ],
    points: 25
  },
  {
    title: "Merge Sort",
    description: "Given an array of integers, sort the array in ascending order using merge sort algorithm. You need to implement the merge sort algorithm and return the sorted array.",
    difficulty: "Medium",
    category: "Sorting",
    tags: ["array", "sorting", "divide-and-conquer"],
    inputFormat: "First line contains an integer n (size of array). Second line contains n space-separated integers.",
    outputFormat: "Print the sorted array in ascending order separated by spaces.",
    constraints: "1 <= n <= 10^5\n-10^6 <= nums[i] <= 10^6",
    sampleInput: "6\n12 11 13 5 6 7",
    sampleOutput: "5 6 7 11 12 13",
    testCases: [
      { input: "6\n12 11 13 5 6 7", expectedOutput: "5 6 7 11 12 13", isHidden: false },
      { input: "4\n4 3 2 1", expectedOutput: "1 2 3 4", isHidden: false },
      { input: "1\n42", expectedOutput: "42", isHidden: true }
    ],
    points: 20
  },
  {
    title: "Fibonacci Number",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
    difficulty: "Easy",
    category: "Recursion",
    tags: ["recursion", "dynamic-programming", "math"],
    inputFormat: "A single integer n.",
    outputFormat: "Print the nth Fibonacci number.",
    constraints: "0 <= n <= 30",
    sampleInput: "3",
    sampleOutput: "2",
    testCases: [
      { input: "3", expectedOutput: "2", isHidden: false },
      { input: "0", expectedOutput: "0", isHidden: false },
      { input: "7", expectedOutput: "13", isHidden: true }
    ],
    points: 10
  },
  {
    title: "Linked List Cycle",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.",
    difficulty: "Medium",
    category: "Linked Lists",
    tags: ["linked-list", "two-pointers"],
    inputFormat: "First line contains an integer n (number of nodes). Second line contains n space-separated integers representing node values. Third line contains a position p where tail connects to (0-indexed), or -1 if no cycle.",
    outputFormat: "Print 'true' if there is a cycle, otherwise print 'false'.",
    constraints: "0 <= n <= 10^4\n0 <= Node.val <= 10^5\npos is -1 or a valid index in the linked-list.",
    sampleInput: "3\n3 2 0 -4\n1",
    sampleOutput: "true",
    testCases: [
      { input: "3\n3 2 0 -4\n1", expectedOutput: "true", isHidden: false },
      { input: "2\n1 2\n-1", expectedOutput: "false", isHidden: false },
      { input: "4\n1 2 3 4\n2", expectedOutput: "true", isHidden: true }
    ],
    points: 25
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    await Problem.insertMany(sampleProblems);
    console.log(`Inserted ${sampleProblems.length} sample problems`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
