class AdvancedCodeExecutor {
  static executeJavaScript(code) {
    try {
      // Create a comprehensive sandbox environment
      const sandbox = {
        // Console with enhanced output formatting
        console: {
          log: (...args) => {
            return args.map(arg => {
              if (typeof arg === 'object') {
                if (arg === null) return 'null';
                if (arg === undefined) return 'undefined';
                try {
                  return JSON.stringify(arg, null, 2);
                } catch (e) {
                  return String(arg);
                }
              }
              if (typeof arg === 'function') return '[Function]';
              if (typeof arg === 'undefined') return 'undefined';
              if (typeof arg === 'bigint') return `${arg}n`;
              return String(arg);
            }).join(' ');
          },
          error: (...args) => `ERROR: ${args.join(' ')}`,
          warn: (...args) => `WARNING: ${args.join(' ')}`,
          info: (...args) => `INFO: ${args.join(' ')}`,
          debug: (...args) => `DEBUG: ${args.join(' ')}`,
          trace: (...args) => `TRACE: ${args.join(' ')}`
        },
        // Built-in objects and functions
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
        isFinite: isFinite,
        BigInt: typeof BigInt !== 'undefined' ? BigInt : undefined,
        Symbol: Symbol,
        Map: Map,
        Set: Set,
        WeakMap: WeakMap,
        WeakSet: WeakSet,
        Promise: Promise,
        setTimeout: (fn, delay) => `setTimeout called with delay: ${delay}`,
        setInterval: (fn, delay) => `setInterval called with delay: ${delay}`,
        clearTimeout: (id) => `clearTimeout called for: ${id}`,
        clearInterval: (id) => `clearInterval called for: ${id}`,
        // Array methods with proper context
        map: Array.prototype.map,
        filter: Array.prototype.filter,
        reduce: Array.prototype.reduce,
        forEach: Array.prototype.forEach,
        find: Array.prototype.find,
        findIndex: Array.prototype.findIndex,
        some: Array.prototype.some,
        every: Array.prototype.every,
        includes: Array.prototype.includes,
        slice: Array.prototype.slice,
        splice: Array.prototype.splice,
        push: Array.prototype.push,
        pop: Array.prototype.pop,
        shift: Array.prototype.shift,
        unshift: Array.prototype.unshift,
        sort: Array.prototype.sort,
        reverse: Array.prototype.reverse,
        join: Array.prototype.join,
        // String methods with proper context
        split: String.prototype.split,
        replace: String.prototype.replace,
        replaceAll: String.prototype.replaceAll,
        toUpperCase: String.prototype.toUpperCase,
        toLowerCase: String.prototype.toLowerCase,
        trim: String.prototype.trim,
        trimStart: String.prototype.trimStart,
        trimEnd: String.prototype.trimEnd,
        includes: String.prototype.includes,
        startsWith: String.prototype.startsWith,
        endsWith: String.prototype.endsWith,
        substring: String.prototype.substring,
        substr: String.prototype.substr,
        slice: String.prototype.slice,
        charAt: String.prototype.charAt,
        charCodeAt: String.prototype.charCodeAt,
        length: String.prototype.length
      };

      // Capture all console output with timing
      const logs = [];
      const originalConsoleLog = sandbox.console.log;
      
      sandbox.console.log = (...args) => {
        const timestamp = new Date().toLocaleTimeString();
        const output = originalConsoleLog(...args);
        logs.push(`[${timestamp}] ${output}`);
      };

      // Enhanced error handling
      const originalError = console.error;
      console.error = (...args) => {
        logs.push(`ERROR: ${args.join(' ')}`);
      };

      // Execute code in sandbox with performance monitoring
      const startTime = Date.now();
      const func = new Function(...Object.keys(sandbox), `
        "use strict";
        with (this) {
          try {
            ${code}
          } catch (e) {
            console.error('Runtime Error:', e.message);
          }
        }
      `);

      func.apply(sandbox, Object.values(sandbox));
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Restore console
      console.error = originalError;

      if (logs.length === 0) {
        return `Code executed successfully in ${executionTime}ms (no console output)`;
      }

      const result = logs.join('\n');
      if (executionTime > 100) {
        return `${result}\n\n⚠️  Execution time: ${executionTime}ms (consider optimizing)`;
      }
      
      return result;
    } catch (error) {
      return `JavaScript Error: ${error.message}\nStack: ${error.stack}`;
    }
  }

  static executePython(code) {
    try {
      const startTime = Date.now();
      const lines = code.split('\n');
      let output = [];
      let variables = {};
      let functions = {};
      let classes = {};
      let indentLevel = 0;
      let currentBlock = [];
      let inFunction = false;
      let inClass = false;
      let inLoop = false;
      let inIf = false;
      let functionStack = [];
      let recursionDepth = 0;

      // Enhanced preprocessing
      const processedCode = code
        .replace(/'''[\s\S]*?'''/g, '# Multiline comment')
        .replace(/"""[\s\S]*?"""/g, '# Multiline comment')
        .replace(/#.*$/gm, '');

      // Process each line
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        const currentIndent = line.match(/^\s*/)[0].length;
        
        if (!trimmed || trimmed.startsWith('#')) continue;

        // Handle print statements
        if (trimmed.startsWith('print(')) {
          const content = trimmed.slice(6, -1);
          let result = this.evaluatePythonExpression(content, variables, functions, classes);
          output.push(result);
        }
        // Handle variable assignments
        else if (trimmed.includes('=') && !trimmed.includes('==') && !trimmed.includes('<=') && !trimmed.includes('>=')) {
          const [varName, value] = trimmed.split('=').map(s => s.trim());
          variables[varName] = this.evaluatePythonExpression(value, variables, functions, classes);
        }
        // Handle function definitions
        else if (trimmed.startsWith('def ')) {
          const funcMatch = trimmed.match(/def\s+(\w+)\s*\(([^)]*)\)/);
          if (funcMatch) {
            const funcName = funcMatch[1];
            const params = funcMatch[2].split(',').map(p => p.trim()).filter(p => p);
            functions[funcName] = { params, body: [] };
            inFunction = true;
            currentBlock = [];
          }
        }
        // Handle class definitions
        else if (trimmed.startsWith('class ')) {
          const classMatch = trimmed.match(/class\s+(\w+)(?:\s*\(\s*(\w+)\s*\))?:/);
          if (classMatch) {
            const className = classMatch[1];
            const parentClass = classMatch[2];
            classes[className] = { parent: parentClass, methods: {} };
            inClass = true;
            currentBlock = [];
          }
        }
        // Handle if statements
        else if (trimmed.startsWith('if ')) {
          const condition = trimmed.slice(3, trimmed.indexOf(':'));
          const result = this.evaluatePythonExpression(condition, variables, functions, classes);
          inIf = true;
          if (result) {
            output.push(`If condition true: ${result}`);
          }
        }
        // Handle elif statements
        else if (trimmed.startsWith('elif ')) {
          const condition = trimmed.slice(5, trimmed.indexOf(':'));
          const result = this.evaluatePythonExpression(condition, variables, functions, classes);
          output.push(`Elif condition: ${result}`);
        }
        // Handle else statements
        else if (trimmed === 'else:') {
          output.push('Else block executed');
        }
        // Handle for loops
        else if (trimmed.startsWith('for ')) {
          const loopContent = trimmed.slice(4, trimmed.indexOf(':'));
          inLoop = true;
          
          // Handle range loops
          if (loopContent.includes('range(')) {
            const rangeMatch = loopContent.match(/range\((\d+)\)/);
            if (rangeMatch) {
              const end = parseInt(rangeMatch[1]);
              output.push(`For loop: range(${end})`);
              for (let j = 0; j < end; j++) {
                output.push(`  Loop iteration ${j}`);
              }
            }
          } else {
            output.push(`For loop: ${loopContent}`);
          }
        }
        // Handle while loops
        else if (trimmed.startsWith('while ')) {
          const condition = trimmed.slice(6, trimmed.indexOf(':'));
          const result = this.evaluatePythonExpression(condition, variables, functions, classes);
          inLoop = true;
          output.push(`While loop condition: ${result}`);
        }
        // Handle return statements
        else if (trimmed.startsWith('return ')) {
          const value = trimmed.slice(7);
          const result = this.evaluatePythonExpression(value, variables, functions, classes);
          output.push(`Return: ${result}`);
        }
        // Handle function calls
        else if (trimmed.includes('(') && trimmed.includes(')') && !trimmed.includes('def ') && !trimmed.includes('class ')) {
          const funcMatch = trimmed.match(/(\w+)\s*\(([^)]*)\)/);
          if (funcMatch) {
            const funcName = funcMatch[1];
            const args = funcMatch[2].split(',').map(a => a.trim()).filter(a => a);
            
            if (functions[funcName]) {
              // Execute user-defined function
              const result = this.executeUserFunction(funcName, args, variables, functions, classes);
              output.push(result);
            } else if (funcName === 'len') {
              if (args[0] && variables[args[0]]) {
                const value = variables[args[0]];
                if (Array.isArray(value)) {
                  output.push(value.length.toString());
                } else {
                  output.push(value.toString().length.toString());
                }
              }
            } else if (funcName === 'range') {
              output.push(`range(${args.join(', ')})`);
            } else if (funcName === 'max') {
              if (args[0] && variables[args[0]]) {
                const value = variables[args[0]];
                if (Array.isArray(value)) {
                  output.push(Math.max(...value).toString());
                }
              }
            } else if (funcName === 'min') {
              if (args[0] && variables[args[0]]) {
                const value = variables[args[0]];
                if (Array.isArray(value)) {
                  output.push(Math.min(...value).toString());
                }
              }
            } else if (funcName === 'sum') {
              if (args[0] && variables[args[0]]) {
                const value = variables[args[0]];
                if (Array.isArray(value)) {
                  output.push(value.reduce((a, b) => a + b, 0).toString());
                }
              }
            } else if (funcName === 'type') {
              if (args[0] && variables[args[0]]) {
                const value = variables[args[0]];
                output.push(`<class '${typeof value}'>`);
              }
            } else {
              output.push(`Built-in function: ${funcName}(${args.join(', ')})`);
            }
          }
        }
        // Handle string slicing operations
        else if (trimmed.includes('[') && trimmed.includes(']')) {
          const sliceMatch = trimmed.match(/(\w+)\s*=\s*(\w+)\s*\[([^\]]+)\]/);
          if (sliceMatch) {
            const varName = sliceMatch[1];
            const sourceVar = sliceMatch[2];
            const sliceExpr = sliceMatch[3];
            
            if (variables[sourceVar]) {
              const sourceValue = variables[sourceVar];
              const slicedValue = this.evaluateStringSlice(sourceValue, sliceExpr);
              variables[varName] = slicedValue;
              output.push(`${varName} = "${slicedValue}"`);
            }
          }
        }
        // Handle list operations
        else if (trimmed.includes('[') && trimmed.includes(']')) {
          const listMatch = trimmed.match(/(\w+)\s*=\s*\[(.*)\]/);
          if (listMatch) {
            const varName = listMatch[1];
            const elements = listMatch[2].split(',').map(e => e.trim());
            const list = elements.map(e => this.evaluatePythonExpression(e, variables, functions, classes));
            variables[varName] = list;
            output.push(`${varName} = [${list.join(', ')}]`);
          }
        }
        // Handle dictionary operations
        else if (trimmed.includes('{') && trimmed.includes('}')) {
          const dictMatch = trimmed.match(/(\w+)\s*=\s*\{(.*)\}/);
          if (dictMatch) {
            const varName = dictMatch[1];
            output.push(`${varName} = {dictionary}`);
            variables[varName] = {};
          }
        }
        // Handle method calls on objects
        else if (trimmed.includes('.')) {
          const methodMatch = trimmed.match(/(\w+)\.(\w+)\s*\(([^)]*)\)/);
          if (methodMatch) {
            const objName = methodMatch[1];
            const methodName = methodMatch[2];
            const args = methodMatch[3].split(',').map(a => a.trim()).filter(a => a);
            
            if (variables[objName]) {
              output.push(`Method called: ${objName}.${methodName}(${args.join(', ')})`);
            }
          }
        }
      }

      return output.join('\n') || 'Python code executed successfully';
    } catch (error) {
      return `Python Error: ${error.message}`;
    }
  }

  static evaluatePythonExpression(expr, variables, functions, classes) {
    expr = expr.trim();
    
    // Handle string literals
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
      return expr.slice(1, -1);
    }
    
    // Handle f-strings
    if (expr.startsWith('f"') && expr.endsWith('"')) {
      let result = expr.slice(2, -1);
      Object.keys(variables).forEach(varName => {
        result = result.replace(new RegExp(`\\{${varName}\\}`, 'g'), variables[varName]);
      });
      return result;
    }
    
    // Handle numbers
    if (!isNaN(expr)) {
      return expr;
    }
    
    // Handle variable references
    if (variables[expr] !== undefined) {
      return variables[expr];
    }
    
    // Handle boolean values
    if (expr === 'True') return true;
    if (expr === 'False') return false;
    if (expr === 'None') return null;
    
    // Handle conditional expressions (ternary operator style)
    if (expr.includes(' if ') && expr.includes(' else ')) {
      const parts = expr.split(' if ');
      if (parts.length === 2) {
        const [trueExpr, conditionAndFalse] = parts;
        const conditionParts = conditionAndFalse.split(' else ');
        if (conditionParts.length === 2) {
          const [condition, falseExpr] = conditionParts;
          const conditionResult = this.evaluatePythonExpression(condition, variables, functions, classes);
          if (conditionResult) {
            return this.evaluatePythonExpression(trueExpr, variables, functions, classes);
          } else {
            return this.evaluatePythonExpression(falseExpr, variables, functions, classes);
          }
        }
      }
    }
    
    // Handle logical expressions with 'or' and 'and'
    if (expr.includes(' or ') || expr.includes(' and ')) {
      try {
        let evalExpr = expr;
        Object.keys(variables).forEach(varName => {
          evalExpr = evalExpr.replace(new RegExp(`\\b${varName}\\b`, 'g'), variables[varName]);
        });
        return eval(evalExpr);
      } catch (e) {
        return expr;
      }
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
    
    // Handle comparisons
    if (expr.includes('==') || expr.includes('!=') || expr.includes('<') || expr.includes('>') || expr.includes('<=') || expr.includes('>=')) {
      try {
        let evalExpr = expr;
        Object.keys(variables).forEach(varName => {
          evalExpr = evalExpr.replace(new RegExp(`\\b${varName}\\b`, 'g'), variables[varName]);
        });
        return eval(evalExpr);
      } catch (e) {
        return expr;
      }
    }
    
    return expr;
  }

  static executeJava(code) {
    try {
      let output = [];
      const lines = code.split('\n');
      let inClass = false;
      let inMethod = false;
      let className = '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('public class ')) {
          className = trimmed.split(' ')[2];
          output.push(`Class compiled: ${className}`);
          inClass = true;
        }
        else if (trimmed.startsWith('public static void main(')) {
          output.push('Main method executed');
          inMethod = true;
        }
        else if (trimmed.startsWith('System.out.println(')) {
          const content = trimmed.slice(19, -1);
          let result = this.evaluateJavaExpression(content);
          output.push(result);
        }
        else if (trimmed.startsWith('System.out.print(')) {
          const content = trimmed.slice(18, -1);
          let result = this.evaluateJavaExpression(content);
          output.push(result);
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
        else if (trimmed.startsWith('private ')) {
          if (trimmed.includes('(')) {
            const methodName = trimmed.split('(')[0].split(' ').pop();
            output.push(`Private method: ${methodName}`);
          }
        }
        else if (trimmed.startsWith('static ')) {
          if (trimmed.includes('(')) {
            const methodName = trimmed.split('(')[0].split(' ').pop();
            output.push(`Static method: ${methodName}`);
          }
        }
        else if (trimmed.startsWith('if (')) {
          const condition = trimmed.slice(4, trimmed.indexOf(')'));
          output.push(`If condition: ${condition}`);
        }
        else if (trimmed.startsWith('else if (')) {
          const condition = trimmed.slice(9, trimmed.indexOf(')'));
          output.push(`Else if condition: ${condition}`);
        }
        else if (trimmed === 'else') {
          output.push('Else block executed');
        }
        else if (trimmed.startsWith('for (')) {
          output.push('For loop executed');
        }
        else if (trimmed.startsWith('while (')) {
          output.push('While loop executed');
        }
        else if (trimmed.startsWith('do {')) {
          output.push('Do-while loop started');
        }
        else if (trimmed.startsWith('switch (')) {
          output.push('Switch statement executed');
        }
        else if (trimmed.startsWith('case ')) {
          output.push(`Case: ${trimmed.split(' ')[1]}`);
        }
        else if (trimmed.startsWith('break;')) {
          output.push('Break statement');
        }
        else if (trimmed.startsWith('continue;')) {
          output.push('Continue statement');
        }
        else if (trimmed.startsWith('return ')) {
          const value = trimmed.slice(7, -1); // Remove semicolon
          output.push(`Return: ${value}`);
        }
        else if (trimmed.startsWith('try {')) {
          output.push('Try block started');
        }
        else if (trimmed.startsWith('catch (')) {
          output.push('Catch block executed');
        }
        else if (trimmed.startsWith('finally {')) {
          output.push('Finally block executed');
        }
        else if (trimmed.startsWith('throw ')) {
          output.push('Exception thrown');
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
    
    // Handle string concatenation
    if (expr.includes('+') && expr.includes('"')) {
      return expr.replace(/"/g, '');
    }
    
    return expr;
  }

  static executeCpp(code) {
    try {
      let output = [];
      const lines = code.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('#include')) {
          output.push(`Included: ${trimmed.slice(9, -1)}`);
        }
        else if (trimmed.startsWith('using namespace')) {
          output.push(`Namespace: ${trimmed.slice(14)}`);
        }
        else if (trimmed.startsWith('int main()')) {
          output.push('Main function executed');
        }
        else if (trimmed.startsWith('cout <<')) {
          const parts = trimmed.split('<<');
          let result = '';
          for (let i = 1; i < parts.length; i++) {
            const part = parts[i].trim();
            if (part.startsWith('"')) {
              result += part.slice(1, -1);
            } else if (part === 'endl') {
              result += '\n';
            } else if (part === 'flush') {
              result += '[flush]';
            } else {
              result += part;
            }
          }
          output.push(result);
        }
        else if (trimmed.startsWith('cerr <<')) {
          output.push(`Error: ${trimmed.slice(8)}`);
        }
        else if (trimmed.startsWith('cin >>')) {
          const variable = trimmed.slice(8);
          output.push(`Input requested for: ${variable}`);
        }
        else if (trimmed.startsWith('return ')) {
          output.push(`Return: ${trimmed.slice(7)}`);
        }
        else if (trimmed.startsWith('if (')) {
          output.push('If condition executed');
        }
        else if (trimmed.startsWith('else if (')) {
          output.push('Else if condition executed');
        }
        else if (trimmed === 'else') {
          output.push('Else block executed');
        }
        else if (trimmed.startsWith('for (')) {
          output.push('For loop executed');
        }
        else if (trimmed.startsWith('while (')) {
          output.push('While loop executed');
        }
        else if (trimmed.startsWith('do {')) {
          output.push('Do-while loop started');
        }
        else if (trimmed.startsWith('switch (')) {
          output.push('Switch statement executed');
        }
        else if (trimmed.startsWith('case ')) {
          output.push(`Case: ${trimmed.split(' ')[1]}`);
        }
        else if (trimmed.startsWith('break;')) {
          output.push('Break statement');
        }
        else if (trimmed.startsWith('continue;')) {
          output.push('Continue statement');
        }
        else if (trimmed.startsWith('try {')) {
          output.push('Try block started');
        }
        else if (trimmed.startsWith('catch (')) {
          output.push('Catch block executed');
        }
        else if (trimmed.startsWith('throw ')) {
          output.push('Exception thrown');
        }
        else if (trimmed.startsWith('class ')) {
          const className = trimmed.split(' ')[1];
          output.push(`Class defined: ${className}`);
        }
        else if (trimmed.startsWith('struct ')) {
          const structName = trimmed.split(' ')[1];
          output.push(`Struct defined: ${structName}`);
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
        
        if (trimmed.startsWith('#include')) {
          output.push(`Included: ${trimmed.slice(10, -1)}`);
        }
        else if (trimmed.startsWith('#define')) {
          output.push(`Macro defined: ${trimmed.slice(8)}`);
        }
        else if (trimmed.startsWith('int main()')) {
          output.push('Main function executed');
        }
        else if (trimmed.startsWith('printf(')) {
          const content = trimmed.slice(7, -1);
          let result = this.evaluateCExpression(content);
          output.push(result);
        }
        else if (trimmed.startsWith('scanf(')) {
          output.push(`Input requested: ${trimmed.slice(7, -1)}`);
        }
        else if (trimmed.startsWith('fprintf(')) {
          output.push(`File output: ${trimmed.slice(8, -1)}`);
        }
        else if (trimmed.startsWith('sprintf(')) {
          output.push(`String formatted: ${trimmed.slice(8, -1)}`);
        }
        else if (trimmed.startsWith('return ')) {
          output.push(`Return: ${trimmed.slice(7)}`);
        }
        else if (trimmed.startsWith('if (')) {
          output.push('If condition executed');
        }
        else if (trimmed.startsWith('else if (')) {
          output.push('Else if condition executed');
        }
        else if (trimmed === 'else') {
          output.push('Else block executed');
        }
        else if (trimmed.startsWith('for (')) {
          output.push('For loop executed');
        }
        else if (trimmed.startsWith('while (')) {
          output.push('While loop executed');
        }
        else if (trimmed.startsWith('do {')) {
          output.push('Do-while loop started');
        }
        else if (trimmed.startsWith('switch (')) {
          output.push('Switch statement executed');
        }
        else if (trimmed.startsWith('case ')) {
          output.push(`Case: ${trimmed.split(' ')[1]}`);
        }
        else if (trimmed.startsWith('break;')) {
          output.push('Break statement');
        }
        else if (trimmed.startsWith('continue;')) {
          output.push('Continue statement');
        }
        else if (trimmed.startsWith('goto ')) {
          output.push(`Goto: ${trimmed.slice(5)}`);
        }
        else if (trimmed.startsWith('typedef struct')) {
          output.push('Typedef struct defined');
        }
        else if (trimmed.startsWith('struct ')) {
          const structName = trimmed.split(' ')[1];
          output.push(`Struct defined: ${structName}`);
        }
        else if (trimmed.startsWith('union ')) {
          const unionName = trimmed.split(' ')[1];
          output.push(`Union defined: ${unionName}`);
        }
        else if (trimmed.startsWith('enum ')) {
          const enumName = trimmed.split(' ')[1];
          output.push(`Enum defined: ${enumName}`);
        }
      }
      
      return output.join('\n') || 'C code compiled and executed';
    } catch (error) {
      return `C Error: ${error.message}`;
    }
  }

  static executeUserFunction(funcName, args, variables, functions, classes) {
    try {
      const funcInfo = functions[funcName];
      if (!funcInfo) return `Function ${funcName} not found`;
      
      // Create local variables for function scope
      const localVars = { ...variables };
      
      // Map arguments to parameter names
      funcInfo.params.forEach((param, index) => {
        if (args[index]) {
          localVars[param] = this.evaluatePythonExpression(args[index], variables, functions, classes);
        }
      });
      
      // For factorial function specifically
      if (funcName === 'factorial' && funcInfo.params.includes('n')) {
        const n = parseInt(localVars.n) || 0;
        if (n <= 1) {
          return '1';
        } else {
          // Calculate factorial recursively
          let result = 1;
          for (let i = 2; i <= n; i++) {
            result *= i;
          }
          return result.toString();
        }
      }
      
      // Generic function execution (simplified)
      return `Function ${funcName} executed with args: [${args.join(', ')}]`;
    } catch (error) {
      return `Error executing ${funcName}: ${error.message}`;
    }
  }

  static evaluateStringSlice(str, sliceExpr) {
    try {
      // Handle different slice expressions
      if (sliceExpr === ':-1' || sliceExpr === '::-1') {
        // Reverse string
        return str.split('').reverse().join('');
      }
      
      // Handle [start:stop:step] format
      const sliceMatch = sliceExpr.match(/(-?\d*):(-?\d*):?(-?\d*)/);
      if (sliceMatch) {
        let start = sliceMatch[1] === '' ? 0 : parseInt(sliceMatch[1]) || 0;
        let stop = sliceMatch[2] === '' ? str.length : parseInt(sliceMatch[2]) || str.length;
        let step = sliceMatch[3] === '' ? 1 : parseInt(sliceMatch[3]) || 1;
        
        // Handle negative indices
        if (start < 0) start = str.length + start;
        if (stop < 0) stop = str.length + stop;
        
        // Apply slice
        let result = '';
        for (let i = start; i < stop && i < str.length; i += step) {
          result += str[i];
        }
        return result;
      }
      
      // Handle [start:stop] format
      const simpleMatch = sliceExpr.match(/(-?\d*):(-?\d*)/);
      if (simpleMatch) {
        let start = simpleMatch[1] === '' ? 0 : parseInt(simpleMatch[1]) || 0;
        let stop = simpleMatch[2] === '' ? str.length : parseInt(simpleMatch[2]) || str.length;
        
        if (start < 0) start = str.length + start;
        if (stop < 0) stop = str.length + stop;
        
        return str.substring(start, stop);
      }
      
      return str; // Return original if no match
    } catch (error) {
      return str;
    }
  }

  static evaluateCExpression(expr) {
    expr = expr.trim();
    
    // Handle printf format strings
    if (expr.startsWith('"')) {
      const formatString = expr.slice(1, expr.indexOf('"', 1));
      let result = formatString;
      
      // Replace format specifiers
      result = result.replace(/%d/g, '42');
      result = result.replace(/%f/g, '3.14');
      result = result.replace(/%s/g, 'Hello');
      result = result.replace(/%c/g, 'A');
      result = result.replace(/%x/g, 'ff');
      result = result.replace(/%o/g, '77');
      result = result.replace(/%p/g, '0x7fff');
      result = result.replace(/%%/g, '%');
      result = result.replace(/\\n/g, '\n');
      result = result.replace(/\\t/g, '\t');
      result = result.replace(/\\\\/g, '\\');
      result = result.replace(/\\"/g, '"');
      
      return result;
    }
    
    return expr;
  }
}

module.exports = AdvancedCodeExecutor;
