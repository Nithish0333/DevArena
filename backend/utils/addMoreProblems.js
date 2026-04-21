const { initDatabase, Problem } = require('../config/initDatabase');

const newProblems = [
  {
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
    difficulty: "Easy",
    category: "Strings",
    tags: ["string", "two-pointers"],
    inputFormat: "A single string s.",
    outputFormat: "Print the reversed string.",
    constraints: "1 <= s.length <= 10^5\ns consists of printable ASCII characters.",
    sampleInput: "hello",
    sampleOutput: "olleh",
    testCases: [
      { input: "hello", expectedOutput: "olleh", isHidden: false },
      { input: "Hannah", expectedOutput: "hannaH", isHidden: false },
      { input: "a", expectedOutput: "a", isHidden: true }
    ],
    points: 10
  },
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "Easy",
    category: "Dynamic Programming",
    tags: ["dynamic-programming", "math"],
    inputFormat: "A single integer n.",
    outputFormat: "Print the number of distinct ways to reach the top.",
    constraints: "1 <= n <= 45",
    sampleInput: "2",
    sampleOutput: "2",
    testCases: [
      { input: "2", expectedOutput: "2", isHidden: false },
      { input: "3", expectedOutput: "3", isHidden: false },
      { input: "5", expectedOutput: "8", isHidden: true }
    ],
    points: 15
  },
  {
    title: "Power of Two",
    description: "Given an integer n, return true if it is a power of two. Otherwise, return false. An integer n is a power of two if there exists an integer x such that n == 2^x.",
    difficulty: "Easy",
    category: "Math",
    tags: ["math", "bit-manipulation"],
    inputFormat: "A single integer n.",
    outputFormat: "Print 'true' if n is a power of two, otherwise 'false'.",
    constraints: "-2^31 <= n <= 2^31 - 1",
    sampleInput: "1",
    sampleOutput: "true",
    testCases: [
      { input: "1", expectedOutput: "true", isHidden: false },
      { input: "16", expectedOutput: "true", isHidden: false },
      { input: "3", expectedOutput: "false", isHidden: true }
    ],
    points: 10
  },
  {
    title: "Missing Number",
    description: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["array", "math", "bit-manipulation"],
    inputFormat: "First line contains n (the size of array). Second line contains n space-separated integers.",
    outputFormat: "Print the missing number.",
    constraints: "n == nums.length, 1 <= n <= 10^4, 0 <= nums[i] <= n. All numbers are unique.",
    sampleInput: "3\n3 0 1",
    sampleOutput: "2",
    testCases: [
      { input: "3\n3 0 1", expectedOutput: "2", isHidden: false },
      { input: "9\n9 6 4 2 3 5 7 0 1", expectedOutput: "8", isHidden: false },
      { input: "2\n0 1", expectedOutput: "2", isHidden: true }
    ],
    points: 15
  },
  {
    title: "Rotate Array",
    description: "Given an array, rotate the array to the right by k steps, where k is non-negative.",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["array", "math", "two-pointers"],
    inputFormat: "First line contains n (size) and k (steps). Second line contains n space-separated integers.",
    outputFormat: "Print the rotated array separated by spaces.",
    constraints: "1 <= nums.length <= 10^5, -2^31 <= nums[i] <= 2^31 - 1, 0 <= k <= 10^5",
    sampleInput: "7 3\n1 2 3 4 5 6 7",
    sampleOutput: "5 6 7 1 2 3 4",
    testCases: [
      { input: "7 3\n1 2 3 4 5 6 7", expectedOutput: "5 6 7 1 2 3 4", isHidden: false },
      { input: "4 2\n-1 -100 3 99", expectedOutput: "3 99 -1 -100", isHidden: false },
      { input: "2 3\n1 2", expectedOutput: "2 1", isHidden: true }
    ],
    points: 20
  },
  {
    title: "Intersection of Two Arrays",
    description: "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["array", "hash-table", "two-pointers", "binary-search"],
    inputFormat: "First line contains n1 (size of first array). Second line contains n1 integers. Third line contains n2 (size of second array). Fourth line contains n2 integers.",
    outputFormat: "Print the intersection elements separated by spaces (sorted for consistency).",
    constraints: "1 <= nums1.length, nums2.length <= 1000, 0 <= nums1[i], nums2[i] <= 1000",
    sampleInput: "4\n1 2 2 1\n2\n2 2",
    sampleOutput: "2",
    testCases: [
      { input: "4\n1 2 2 1\n2\n2 2", expectedOutput: "2", isHidden: false },
      { input: "3\n4 9 5\n5\n9 4 9 8 4", expectedOutput: "4 9", isHidden: false },
      { input: "2\n1 1\n1\n1", expectedOutput: "1", isHidden: true }
    ],
    points: 15
  },
  {
    title: "Container With Most Water",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    difficulty: "Medium",
    category: "Two Pointers",
    tags: ["array", "two-pointers", "greedy"],
    inputFormat: "First line contains n. Second line contains n space-separated integers.",
    outputFormat: "Print the maximum area of water.",
    constraints: "n == height.length, 2 <= n <= 10^5, 0 <= height[i] <= 10^4",
    sampleInput: "9\n1 8 6 2 5 4 8 3 7",
    sampleOutput: "49",
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49", isHidden: false },
      { input: "2\n1 1", expectedOutput: "1", isHidden: false },
      { input: "4\n4 3 2 1", expectedOutput: "4", isHidden: true }
    ],
    points: 25
  },
  {
    title: "Reverse Integer",
    description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.",
    difficulty: "Medium",
    category: "Math",
    tags: ["math"],
    inputFormat: "A single integer x.",
    outputFormat: "Print the reversed integer.",
    constraints: "-2^31 <= x <= 2^31 - 1",
    sampleInput: "123",
    sampleOutput: "321",
    testCases: [
      { input: "123", expectedOutput: "321", isHidden: false },
      { input: "-123", expectedOutput: "-321", isHidden: false },
      { input: "120", expectedOutput: "21", isHidden: true }
    ],
    points: 20
  },
  {
    title: "String to Integer (atoi)",
    description: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer. The algorithm should handle leading whitespace, sign characters, and non-digit characters correctly.",
    difficulty: "Medium",
    category: "Strings",
    tags: ["string"],
    inputFormat: "A single string s.",
    outputFormat: "Print the resulting 32-bit integer.",
    constraints: "0 <= s.length <= 200, s consists of English letters, digits, ' ', '+', '-', and '.'.",
    sampleInput: "42",
    sampleOutput: "42",
    testCases: [
      { input: "42", expectedOutput: "42", isHidden: false },
      { input: "   -42", expectedOutput: "-42", isHidden: false },
      { input: "4193 with words", expectedOutput: "4193", isHidden: true }
    ],
    points: 25
  },
  {
    title: "Single Number",
    description: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
    difficulty: "Easy",
    category: "Bit Manipulation",
    tags: ["array", "bit-manipulation"],
    inputFormat: "First line contains n. Second line contains n space-separated integers.",
    outputFormat: "Print the number that appears only once.",
    constraints: "1 <= nums.length <= 3 * 10^4, -3 * 10^4 <= nums[i] <= 3 * 10^4",
    sampleInput: "3\n2 2 1",
    sampleOutput: "1",
    testCases: [
      { input: "3\n2 2 1", expectedOutput: "1", isHidden: false },
      { input: "5\n4 1 2 1 2", expectedOutput: "4", isHidden: false },
      { input: "1\n1", expectedOutput: "1", isHidden: true }
    ],
    points: 15
  }
];

const addMoreProblems = async () => {
  try {
    const { Problem } = await initDatabase();
    
    // Using bulkCreate without destroying to append problems
    await Problem.bulkCreate(newProblems);
    console.log(`Successfully added ${newProblems.length} new problems!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding more problems:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  addMoreProblems();
}

module.exports = addMoreProblems;
