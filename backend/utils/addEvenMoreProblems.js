const { initDatabase, Problem } = require('../config/initDatabase');

const evenMoreProblems = [
  {
    title: "Reverse Linked List",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    difficulty: "Medium",
    category: "Linked Lists",
    tags: ["linked-list", "recursion"],
    inputFormat: "First line contains n (number of nodes). Second line contains n space-separated integers representing node values.",
    outputFormat: "Print the reversed list node values separated by spaces.",
    constraints: "The number of nodes in the list is the range [0, 5000]. -5000 <= Node.val <= 5000",
    sampleInput: "5\n1 2 3 4 5",
    sampleOutput: "5 4 3 2 1",
    testCases: [
      { input: "5\n1 2 3 4 5", expectedOutput: "5 4 3 2 1", isHidden: false },
      { input: "2\n1 2", expectedOutput: "2 1", isHidden: false },
      { input: "0", expectedOutput: "", isHidden: true }
    ],
    points: 20
  },
  {
    title: "Same Tree",
    description: "Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.",
    difficulty: "Easy",
    category: "Trees",
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    inputFormat: "First line contains n1 (nodes in tree p). Second line contains n1 values (null for empty). Third line contains n2 (nodes in tree q). Fourth line contains n2 values.",
    outputFormat: "Print 'true' if they are the same, otherwise 'false'.",
    constraints: "The number of nodes in both trees is in the range [0, 100]. -10^4 <= Node.val <= 10^4",
    sampleInput: "3\n1 2 3\n3\n1 2 3",
    sampleOutput: "true",
    testCases: [
      { input: "3\n1 2 3\n3\n1 2 3", expectedOutput: "true", isHidden: false },
      { input: "3\n1 2 null\n3\n1 null 2", expectedOutput: "false", isHidden: false },
      { input: "1\n1\n1\n1", expectedOutput: "true", isHidden: true }
    ],
    points: 10
  },
  {
    title: "Maximum Depth of Binary Tree",
    description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    difficulty: "Easy",
    category: "Trees",
    tags: ["tree", "depth-first-search", "breadth-first-search", "binary-tree"],
    inputFormat: "First line contains n (nodes). Second line contains n values (null for empty).",
    outputFormat: "Print the maximum depth.",
    constraints: "The number of nodes in the tree is in the range [0, 10^4]. -100 <= Node.val <= 100",
    sampleInput: "5\n3 9 20 null null 15 7",
    sampleOutput: "3",
    testCases: [
      { input: "5\n3 9 20 null null 15 7", expectedOutput: "3", isHidden: false },
      { input: "2\n1 null 2", expectedOutput: "2", isHidden: false },
      { input: "0", expectedOutput: "0", isHidden: true }
    ],
    points: 10
  },
  {
    title: "Best Time to Buy and Sell Stock",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["array", "dynamic-programming"],
    inputFormat: "First line contains n. Second line contains n space-separated integers.",
    outputFormat: "Print the maximum profit.",
    constraints: "1 <= prices.length <= 10^5, 0 <= prices[i] <= 10^4",
    sampleInput: "6\n7 1 5 3 6 4",
    sampleOutput: "5",
    testCases: [
      { input: "6\n7 1 5 3 6 4", expectedOutput: "5", isHidden: false },
      { input: "5\n7 6 4 3 1", expectedOutput: "0", isHidden: false },
      { input: "1\n10", expectedOutput: "0", isHidden: true }
    ],
    points: 15
  },
  {
    title: "Valid Anagram",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    difficulty: "Easy",
    category: "Strings",
    tags: ["hash-table", "string", "sorting"],
    inputFormat: "Two strings s and t on separate lines.",
    outputFormat: "Print 'true' if t is an anagram of s, otherwise 'false'.",
    constraints: "1 <= s.length, t.length <= 5 * 10^4, s and t consist of lowercase English letters.",
    sampleInput: "anagram\nnagaram",
    sampleOutput: "true",
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true", isHidden: false },
      { input: "rat\ncar", expectedOutput: "false", isHidden: false },
      { input: "a\na", expectedOutput: "true", isHidden: true }
    ],
    points: 10
  },
  {
    title: "Longest Common Prefix",
    description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \"\".",
    difficulty: "Easy",
    category: "Strings",
    tags: ["string", "trie"],
    inputFormat: "First line contains n. Next n lines contain one string each.",
    outputFormat: "Print the longest common prefix.",
    constraints: "1 <= n <= 200, 0 <= strs[i].length <= 200, strs[i] consists of only lowercase English letters.",
    sampleInput: "3\nflower\nflow\nflight",
    sampleOutput: "fl",
    testCases: [
      { input: "3\nflower\nflow\nflight", expectedOutput: "fl", isHidden: false },
      { input: "3\ndog\nracecar\ncar", expectedOutput: "", isHidden: false },
      { input: "1\nabc", expectedOutput: "abc", isHidden: true }
    ],
    points: 10
  },
  {
    title: "Plus One",
    description: "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading zeros. Increment the large integer by one and return the resulting array of digits.",
    difficulty: "Easy",
    category: "Math",
    tags: ["array", "math"],
    inputFormat: "First line contains n. Second line contains n space-separated integers.",
    outputFormat: "Print the resulting digits separated by spaces.",
    constraints: "1 <= digits.length <= 100, 0 <= digits[i] <= 9, digits does not contain any leading zeros.",
    sampleInput: "3\n1 2 3",
    sampleOutput: "1 2 4",
    testCases: [
      { input: "3\n1 2 3", expectedOutput: "1 2 4", isHidden: false },
      { input: "4\n4 3 2 1", expectedOutput: "4 3 2 2", isHidden: false },
      { input: "1\n9", expectedOutput: "1 0", isHidden: true }
    ],
    points: 10
  },
  {
    title: "Merge Two Sorted Lists",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    difficulty: "Easy",
    category: "Linked Lists",
    tags: ["linked-list", "recursion"],
    inputFormat: "First line contains n1. Second line contains n1 sorted integers. Third line contains n2. Fourth line contains n2 sorted integers.",
    outputFormat: "Print the merged sorted list values separated by spaces.",
    constraints: "The number of nodes in both lists is in the range [0, 50]. -100 <= Node.val <= 100",
    sampleInput: "3\n1 2 4\n3\n1 3 4",
    sampleOutput: "1 1 2 3 4 4",
    testCases: [
      { input: "3\n1 2 4\n3\n1 3 4", expectedOutput: "1 1 2 3 4 4", isHidden: false },
      { input: "0\n\n0", expectedOutput: "", isHidden: false },
      { input: "1\n5\n0", expectedOutput: "5", isHidden: true }
    ],
    points: 15
  },
  {
    title: "Number of Islands",
    description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    difficulty: "Medium",
    category: "Graphs",
    tags: ["array", "depth-first-search", "breadth-first-search", "union-find", "matrix"],
    inputFormat: "First line contains m and n. Next m lines contain n characters ('0' or '1').",
    outputFormat: "Print the number of islands.",
    constraints: "m == grid.length, n == grid[i].length, 1 <= m, n <= 300, grid[i][j] is '0' or '1'.",
    sampleInput: "4 5\n11110\n11010\n11000\n00000",
    sampleOutput: "1",
    testCases: [
      { input: "4 5\n11110\n11010\n11000\n00000", expectedOutput: "1", isHidden: false },
      { input: "4 5\n11000\n11000\n00100\n00011", expectedOutput: "3", isHidden: false },
      { input: "1 1\n0", expectedOutput: "0", isHidden: true }
    ],
    points: 25
  },
  {
    title: "Group Anagrams",
    description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    difficulty: "Medium",
    category: "Strings",
    tags: ["array", "hash-table", "string", "sorting"],
    inputFormat: "First line contains n. Next n lines contain one string each.",
    outputFormat: "Print groups of anagrams, each group on a new line (sorted for consistency).",
    constraints: "1 <= strs.length <= 10^4, 0 <= strs[i].length <= 100, strs[i] consists of lowercase English letters.",
    sampleInput: "6\neat\ntea\ntan\nate\nnat\nbat",
    sampleOutput: "ate eat tea\nnat tan\nbat",
    testCases: [
      { input: "6\neat\ntea\ntan\nate\nnat\nbat", expectedOutput: "ate eat tea\nnat tan\nbat", isHidden: false },
      { input: "1\na", expectedOutput: "a", isHidden: false },
      { input: "2\n\n", expectedOutput: "\n", isHidden: true }
    ],
    points: 20
  }
];

const addEvenMoreProblems = async () => {
  try {
    const { Problem } = await initDatabase();
    
    await Problem.bulkCreate(evenMoreProblems);
    console.log(`Successfully added ${evenMoreProblems.length} more new problems!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding even more problems:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  addEvenMoreProblems();
}

module.exports = addEvenMoreProblems;
