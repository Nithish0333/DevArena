const CodeExecutor = require('../utils/codeExecutor');
const { initDatabase } = require('../config/initDatabase');

const codeExecutor = new CodeExecutor();

const processSubmission = async (submissionId) => {
  let models;
  try {
    models = await initDatabase();
    const { Problem, Submission, User } = models;

    const submission = await Submission.findByPk(submissionId, {
      include: [{ model: Problem }]
    });

    if (!submission) {
      console.error('Submission not found:', submissionId);
      return;
    }

    const problem = submission.Problem;
    let totalTestCasesPassed = 0;
    let finalStatus = 'Accepted';
    let finalOutput = '';
    let maxRuntime = 0;
    let totalMemory = 0;

    // testCases is already a JSON object in Sequelize
    const testCases = typeof problem.testCases === 'string' 
      ? JSON.parse(problem.testCases) 
      : problem.testCases;

    for (const testCase of testCases) {
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
    submission.totalTestCases = testCases.length;

    if (finalStatus === 'Accepted') {
      submission.points = problem.points;
      
      const user = await User.findByPk(submission.userId);
      if (user) {
        let solvedProblems = [];
        try {
          solvedProblems = typeof user.solvedProblems === 'string' 
            ? JSON.parse(user.solvedProblems) 
            : user.solvedProblems;
        } catch (e) {
          solvedProblems = [];
        }

        if (!solvedProblems.includes(problem.id)) {
          solvedProblems.push(problem.id);
          user.solvedProblems = solvedProblems;
          user.points += problem.points;
          
          let badges = [];
          try {
            badges = typeof user.badges === 'string' 
              ? JSON.parse(user.badges) 
              : user.badges;
          } catch (e) {
            badges = [];
          }

          if (!badges.includes('First Solve') && solvedProblems.length === 1) {
            badges.push('First Solve');
          }
          if (!badges.includes('10 Problems') && solvedProblems.length === 10) {
            badges.push('10 Problems');
          }
          if (!badges.includes('50 Problems') && solvedProblems.length === 50) {
            badges.push('50 Problems');
          }
          user.badges = badges;
          
          await user.save();
        }
      }

      problem.solvedBy += 1;
      await problem.save();
    }

    await submission.save();
    console.log(`Submission ${submissionId} processed with status: ${finalStatus}`);
  } catch (error) {
    console.error('Error processing submission:', error);
    
    try {
      if (models) {
        const { Submission } = models;
        await Submission.update({
          status: 'Runtime Error',
          error: error.message
        }, { where: { id: submissionId } });
      }
    } catch (updateError) {
      console.error('Error updating submission status:', updateError);
    }
  }
};

module.exports = { processSubmission };
