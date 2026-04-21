const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const User = require('../models/User');
const CodeExecutor = require('../utils/codeExecutor');

const codeExecutor = new CodeExecutor();

const processSubmission = async (submissionId) => {
  try {
    const submission = await Submission.findById(submissionId)
      .populate('problemId');

    if (!submission) {
      console.error('Submission not found:', submissionId);
      return;
    }

    const problem = submission.problemId;
    let totalTestCasesPassed = 0;
    let finalStatus = 'Accepted';
    let finalOutput = '';
    let maxRuntime = 0;
    let totalMemory = 0;

    for (const testCase of problem.testCases) {
      const result = await codeExecutor.executeCode(
        submission.code,
        submission.language,
        testCase.input,
        problem.timeLimit,
        problem.memoryLimit
      );

      if (result.status !== 'Accepted') {
        finalStatus = result.status;
        finalOutput = result.error || result.output;
        break;
      }

      const userOutput = result.output.trim();
      const expectedOutput = testCase.expectedOutput.trim();

      if (userOutput !== expectedOutput) {
        finalStatus = 'Wrong Answer';
        finalOutput = `Expected: ${expectedOutput}\nGot: ${userOutput}`;
        break;
      }

      totalTestCasesPassed++;
      maxRuntime = Math.max(maxRuntime, result.runtime);
      totalMemory += result.memory;
    }

    submission.status = finalStatus;
    submission.output = finalOutput;
    submission.runtime = maxRuntime;
    submission.memory = totalMemory;
    submission.testCasesPassed = totalTestCasesPassed;
    submission.totalTestCases = problem.testCases.length;

    if (finalStatus === 'Accepted') {
      submission.points = problem.points;
      
      const user = await User.findById(submission.userId);
      if (!user.solvedProblems.includes(problem._id)) {
        user.solvedProblems.push(problem._id);
        user.points += problem.points;
        
        if (!user.badges.includes('First Solve') && user.solvedProblems.length === 1) {
          user.badges.push('First Solve');
        }
        
        if (!user.badges.includes('10 Problems') && user.solvedProblems.length === 10) {
          user.badges.push('10 Problems');
        }
        
        if (!user.badges.includes('50 Problems') && user.solvedProblems.length === 50) {
          user.badges.push('50 Problems');
        }
        
        await user.save();
      }

      problem.solvedBy += 1;
      await problem.save();
    }

    await submission.save();
    console.log(`Submission ${submissionId} processed with status: ${finalStatus}`);
  } catch (error) {
    console.error('Error processing submission:', error);
    
    try {
      await Submission.findByIdAndUpdate(submissionId, {
        status: 'Runtime Error',
        error: error.message
      });
    } catch (updateError) {
      console.error('Error updating submission status:', updateError);
    }
  }
};

module.exports = { processSubmission };
