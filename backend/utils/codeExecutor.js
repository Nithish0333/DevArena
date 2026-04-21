const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CodeExecutor {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    this.ensureTempDir();
  }

  ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async executeCode(code, language, input, timeLimit = 5000, memoryLimit = 256) {
    const executionId = uuidv4();
    const filePath = this.createCodeFile(code, language, executionId);
    const inputFilePath = this.createInputFile(input, executionId);

    try {
      const result = await this.runCode(filePath, language, inputFilePath, timeLimit, memoryLimit);
      return result;
    } finally {
      this.cleanupFiles([filePath, inputFilePath]);
    }
  }

  createCodeFile(code, language, executionId) {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c'
    };

    const extension = extensions[language] || 'txt';
    const filePath = path.join(this.tempDir, `${executionId}.${extension}`);
    fs.writeFileSync(filePath, code);
    return filePath;
  }

  createInputFile(input, executionId) {
    const inputFilePath = path.join(this.tempDir, `${executionId}_input.txt`);
    fs.writeFileSync(inputFilePath, input);
    return inputFilePath;
  }

  async runCode(filePath, language, inputFilePath, timeLimit, memoryLimit) {
    return new Promise((resolve) => {
      const commands = {
        javascript: `node ${filePath}`,
        python: `python ${filePath}`,
        java: this.getJavaCommand(filePath),
        cpp: this.getCppCommand(filePath),
        c: this.getCCommand(filePath)
      };

      const command = commands[language];
      if (!command) {
        resolve({
          status: 'Compilation Error',
          output: '',
          error: 'Unsupported language',
          runtime: 0,
          memory: 0
        });
        return;
      }

      const startTime = Date.now();
      const process = exec(command, { timeout: timeLimit }, (error, stdout, stderr) => {
        const runtime = Date.now() - startTime;

        if (error) {
          if (error.signal === 'SIGTERM') {
            resolve({
              status: 'Time Limit Exceeded',
              output: '',
              error: 'Program took too long to execute',
              runtime,
              memory: 0
            });
          } else {
            resolve({
              status: stderr.includes('Error') ? 'Compilation Error' : 'Runtime Error',
              output: stdout,
              error: stderr,
              runtime,
              memory: 0
            });
          }
        } else {
          resolve({
            status: 'Accepted',
            output: stdout.trim(),
            error: '',
            runtime,
            memory: 0
          });
        }
      });

      process.stdin.write(fs.readFileSync(inputFilePath));
      process.stdin.end();
    });
  }

  getJavaCommand(filePath) {
    const className = 'Main';
    const dir = path.dirname(filePath);
    const javaFile = path.join(dir, `${className}.java`);
    
    fs.copyFileSync(filePath, javaFile);
    
    return `cd ${dir} && javac ${className}.java && java ${className}`;
  }

  getCppCommand(filePath) {
    const executablePath = filePath.replace('.cpp', '');
    return `g++ -o ${executablePath} ${filePath} && ${executablePath}`;
  }

  getCCommand(filePath) {
    const executablePath = filePath.replace('.c', '');
    return `gcc -o ${executablePath} ${filePath} && ${executablePath}`;
  }

  cleanupFiles(files) {
    files.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
        } catch (error) {
          console.error('Error cleaning up file:', error);
        }
      }
    });

    const executablePath = files[0].replace(/\.[^.]+$/, '');
    if (fs.existsSync(executablePath)) {
      try {
        fs.unlinkSync(executablePath);
      } catch (error) {
        console.error('Error cleaning up executable:', error);
      }
    }
  }
}

module.exports = CodeExecutor;
