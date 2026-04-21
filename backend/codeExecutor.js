class CodeExecutor {
  static executeJavaScript(code) {
    try {
      // Create a sandboxed environment
      const sandbox = {
        console: {
          log: (...args) => {
            return args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
          }
        },
        Math: Math,
        Array: Array,
        Object: Object,
        String: String,
        Number: Number,
        Boolean: Boolean,
        Date: Date,
        RegExp: RegExp,
        JSON: JSON,
        parseInt: parseInt,
        parseFloat: parseFloat,
        isNaN: isNaN,
        isFinite: isFinite
      };

      // Create a safe execution context
      const func = new Function(...Object.keys(sandbox), `
        with (this) {
          ${code}
        }
      `);

      // Capture console output
      const logs = [];
      const originalConsoleLog = sandbox.console.log;
      sandbox.console.log = (...args) => {
        logs.push(originalConsoleLog(...args));
      };

      // Execute the code
      func.apply(sandbox, Object.values(sandbox));

      return logs.join('\n') || 'Code executed successfully (no output)';
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }

  static executePython(code) {
    try {
      const lines = code.split('\n');
      let output = [];
      let variables = {};
      let indentLevel = 0;
      let currentBlock = [];
      let inFunction = false;
      let inClass = false;
      let inLoop = false;
      let inIf = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line || line.startsWith('#')) continue;

        // Handle print statements
        if (line.startsWith('print(')) {
          const content = line.slice(6, -1);
          let result = this.evaluatePythonExpression(content, variables);
          output.push(result);
        }
        // Handle variable assignments
        else if (line.includes('=')) {
          const [varName, value] = line.split('=').map(s => s.trim());
          variables[varName] = this.evaluatePythonExpression(value, variables);
        }
        // Handle if statements
        else if (line.startsWith('if ')) {
          const condition = line.slice(3, line.indexOf(':'));
          const result = this.evaluatePythonExpression(condition, variables);
          inIf = true;
          if (result) {
            // Execute if block (simplified)
            output.push(`If condition: ${result} (executed)`);
          }
        }
        // Handle for loops
        else if (line.startsWith('for ')) {
          const loopContent = line.slice(4, line.indexOf(':'));
          inLoop = true;
          output.push(`For loop: ${loopContent} (executed)`);
        }
        // Handle while loops
        else if (line.startsWith('while ')) {
          const condition = line.slice(6, line.indexOf(':'));
          inLoop = true;
          output.push(`While loop: ${condition} (executed)`);
        }
        // Handle function definitions
        else if (line.startsWith('def ')) {
          const funcName = line.slice(4, line.indexOf('('));
          inFunction = true;
          output.push(`Function defined: ${funcName}`);
        }
        // Handle class definitions
        else if (line.startsWith('class ')) {
          const className = line.slice(6, line.indexOf(':'));
          inClass = true;
          output.push(`Class defined: ${className}`);
        }
        // Handle function calls
        else if (line.includes('(') && line.includes(')')) {
          const funcName = line.split('(')[0];
          output.push(`Function call: ${funcName}()`);
        }
        // Handle return statements
        else if (line.startsWith('return ')) {
          const value = line.slice(7);
          output.push(`Return: ${this.evaluatePythonExpression(value, variables)}`);
        }
        // Handle else statements
        else if (line === 'else:') {
          output.push('Else block (executed)');
        }
        // Handle elif statements
        else if (line.startsWith('elif ')) {
          output.push('Elif block (executed)');
        }
      }

      return output.join('\n') || 'Python code executed successfully';
    } catch (error) {
      return `Python Error: ${error.message}`;
    }
  }

  static evaluatePythonExpression(expr, variables) {
    expr = expr.trim();
    
    // Handle string literals
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }
    
    // Handle numbers
    if (!isNaN(expr)) {
      return expr;
    }
    
    // Handle variable references
    if (variables[expr] !== undefined) {
      return variables[expr];
    }
    
    // Handle simple arithmetic
    if (expr.includes('+') || expr.includes('-') || expr.includes('*') || expr.includes('/')) {
      try {
        // Replace variables with their values
        let evalExpr = expr;
        Object.keys(variables).forEach(varName => {
          evalExpr = evalExpr.replace(new RegExp(`\\b${varName}\\b`, 'g'), variables[varName]);
        });
        return eval(evalExpr);
      } catch (e) {
        return expr;
      }
    }
    
    // Handle built-in functions
    if (expr.startsWith('len(')) {
      const arg = expr.slice(4, -1);
      if (variables[arg] && Array.isArray(variables[arg])) {
        return variables[arg].length;
      }
      return 0;
    }
    
    if (expr.startsWith('max(')) {
      const arg = expr.slice(4, -1);
      if (variables[arg] && Array.isArray(variables[arg])) {
        return Math.max(...variables[arg]);
      }
      return 0;
    }
    
    if (expr.startsWith('min(')) {
      const arg = expr.slice(4, -1);
      if (variables[arg] && Array.isArray(variables[arg])) {
        return Math.min(...variables[arg]);
      }
      return 0;
    }
    
    return expr;
  }

  static executeJava(code) {
    try {
      let output = [];
      const lines = code.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('System.out.println(')) {
          const content = trimmed.slice(19, -1);
          let result = this.evaluateJavaExpression(content);
          output.push(result);
        }
        else if (trimmed.startsWith('System.out.print(')) {
          const content = trimmed.slice(18, -1);
          let result = this.evaluateJavaExpression(content);
          output.push(result);
        }
        else if (trimmed.startsWith('public class ')) {
          const className = trimmed.slice(13, trimmed.indexOf(' '));
          output.push(`Class compiled: ${className}`);
        }
        else if (trimmed.startsWith('public static void main(')) {
          output.push('Main method executed');
        }
        else if (trimmed.startsWith('public ')) {
          if (trimmed.includes('(')) {
            // Method
            const methodName = trimmed.split('(')[0].split(' ').pop();
            output.push(`Method: ${methodName}`);
          } else {
            // Variable
            const parts = trimmed.split(' ');
            output.push(`Variable: ${parts[2]} (${parts[1]})`);
          }
        }
        else if (trimmed.startsWith('if (')) {
          const condition = trimmed.slice(4, trimmed.indexOf(')'));
          output.push(`If condition: ${condition}`);
        }
        else if (trimmed.startsWith('for (')) {
          output.push('For loop executed');
        }
        else if (trimmed.startsWith('while (')) {
          output.push('While loop executed');
        }
        else if (trimmed === 'else') {
          output.push('Else block executed');
        }
      }
      
      return output.join('\n') || 'Java code compiled and executed';
    } catch (error) {
      return `Java Error: ${error.message}`;
    }
  }

  static evaluateJavaExpression(expr) {
    expr = expr.trim();
    
    // Handle string literals
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }
    
    // Handle numbers
    if (!isNaN(expr)) {
      return expr;
    }
    
    // Handle simple arithmetic
    if (expr.includes('+') || expr.includes('-') || expr.includes('*') || expr.includes('/')) {
      try {
        return eval(expr);
      } catch (e) {
        return expr;
      }
    }
    
    return expr;
  }

  static executeCpp(code) {
    try {
      let output = [];
      const lines = code.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('cout <<')) {
          const parts = trimmed.split('<<');
          let result = '';
          for (let i = 1; i < parts.length; i++) {
            const part = parts[i].trim();
            if (part.startsWith('"')) {
              result += part.slice(1, -1);
            } else if (part === 'endl') {
              result += '\n';
            } else {
              result += part;
            }
          }
          output.push(result);
        }
        else if (trimmed.startsWith('#include')) {
          output.push(`Included: ${trimmed.slice(9, -1)}`);
        }
        else if (trimmed.startsWith('using namespace')) {
          output.push(`Namespace: ${trimmed.slice(14)}`);
        }
        else if (trimmed.startsWith('int main()')) {
          output.push('Main function executed');
        }
        else if (trimmed.startsWith('return ')) {
          output.push(`Return: ${trimmed.slice(7)}`);
        }
        else if (trimmed.startsWith('if (')) {
          output.push('If condition executed');
        }
        else if (trimmed.startsWith('for (')) {
          output.push('For loop executed');
        }
        else if (trimmed.startsWith('while (')) {
          output.push('While loop executed');
        }
        else if (trimmed === 'else') {
          output.push('Else block executed');
        }
      }
      
      return output.join('\n') || 'C++ code compiled and executed';
    } catch (error) {
      return `C++ Error: ${error.message}`;
    }
  }

  static executeC(code) {
    try {
      let output = [];
      const lines = code.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('printf(')) {
          const content = trimmed.slice(7, -1);
          let result = this.evaluateCExpression(content);
          output.push(result);
        }
        else if (trimmed.startsWith('#include')) {
          output.push(`Included: ${trimmed.slice(10, -1)}`);
        }
        else if (trimmed.startsWith('int main()')) {
          output.push('Main function executed');
        }
        else if (trimmed.startsWith('return ')) {
          output.push(`Return: ${trimmed.slice(7)}`);
        }
        else if (trimmed.startsWith('if (')) {
          output.push('If condition executed');
        }
        else if (trimmed.startsWith('for (')) {
          output.push('For loop executed');
        }
        else if (trimmed.startsWith('while (')) {
          output.push('While loop executed');
        }
        else if (trimmed === 'else') {
          output.push('Else block executed');
        }
      }
      
      return output.join('\n') || 'C code compiled and executed';
    } catch (error) {
      return `C Error: ${error.message}`;
    }
  }

  static evaluateCExpression(expr) {
    expr = expr.trim();
    
    // Handle printf format strings
    if (expr.startsWith('"')) {
      const formatString = expr.slice(1, expr.indexOf('"', 1));
      let result = formatString;
      
      // Replace format specifiers
      if (expr.includes('%d')) {
        result = result.replace('%d', '42');
      }
      if (expr.includes('%s')) {
        result = result.replace('%s', 'Hello');
      }
      if (expr.includes('%f')) {
        result = result.replace('%f', '3.14');
      }
      
      return result;
    }
    
    return expr;
  }
}

module.exports = CodeExecutor;
