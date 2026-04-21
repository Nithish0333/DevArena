import React, { useState } from 'react';
import { Card, Container, Button, Badge, Form, Row, Col, Alert } from 'react-bootstrap';
import Editor from '@monaco-editor/react';

const Practice = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const getDefaultCode = (lang) => {
    const templates = {
      javascript: `// JavaScript Practice - Full Features!
console.log("Hello World!");

// Variables and Data Types
let name = "John";
let age = 25;
console.log(\`Name: \${name}, Age: \${age}\`);

// If-Else Statements
if (age >= 18) {
    console.log("You are an adult");
} else {
    console.log("You are a minor");
}

// Arrays and Loops
let numbers = [1, 2, 3, 4, 5];
console.log("Array:", numbers);

for (let i = 0; i < numbers.length; i++) {
    console.log(\`Number \${i}: \${numbers[i]}\`);
}

// For-Each Loop
numbers.forEach(num => {
    console.log(\`Double: \${num * 2}\`);
});

// Functions
function greet(person) {
    return \`Hello, \${person}!\`;
}
console.log(greet("Alice"));

// Objects and Classes
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    introduce() {
        return \`Hi, I'm \${this.name} and I'm \${this.age} years old.\`;
    }
}

const person1 = new Person("Bob", 30);
console.log(person1.introduce());

// While Loop
let count = 0;
while (count < 3) {
    console.log(\`Count: \${count}\`);
    count++;
}`,
      python: `# Python Practice - Full Features!
print("Hello World!")

# Variables and Data Types
name = "John"
age = 25
print(f"Name: {name}, Age: {age}")

# If-Else Statements
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# Lists and Loops
numbers = [1, 2, 3, 4, 5]
print("List:", numbers)

for i in range(len(numbers)):
    print(f"Number {i}: {numbers[i]}")

# For-Each Loop
for num in numbers:
    print(f"Double: {num * 2}")

# Functions
def greet(person):
    return f"Hello, {person}!"

print(greet("Alice"))

# Classes and Objects
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"Hi, I'm {self.name} and I'm {self.age} years old."

person1 = Person("Bob", 30)
print(person1.introduce())

# While Loop
count = 0
while count < 3:
    print(f"Count: {count}")
    count += 1`,
      java: `// Java Practice - Full Features!
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
        
        // Variables and Data Types
        String name = "John";
        int age = 25;
        System.out.println("Name: " + name + ", Age: " + age);
        
        // If-Else Statements
        if (age >= 18) {
            System.out.println("You are an adult");
        } else {
            System.out.println("You are a minor");
        }
        
        // Arrays and Loops
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.println("Array: " + java.util.Arrays.toString(numbers));
        
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Number " + i + ": " + numbers[i]);
        }
        
        // For-Each Loop
        for (int num : numbers) {
            System.out.println("Double: " + (num * 2));
        }
        
        // Functions
        System.out.println(greet("Alice"));
        
        // Classes and Objects
        Person person1 = new Person("Bob", 30);
        System.out.println(person1.introduce());
        
        // While Loop
        int count = 0;
        while (count < 3) {
            System.out.println("Count: " + count);
            count++;
        }
    }
    
    public static String greet(String person) {
        return "Hello, " + person + "!";
    }
    
    static class Person {
        String name;
        int age;
        
        public Person(String name, int age) {
            this.name = name;
            this.age = age;
        }
        
        public String introduce() {
            return "Hi, I'm " + name + " and I'm " + age + " years old.";
        }
    }
}`,
      cpp: `// C++ Practice - Full Features!
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// Functions
string greet(const string& person) {
    return "Hello, " + person + "!";
}

// Classes and Objects
class Person {
private:
    string name;
    int age;
public:
    Person(string n, int a) : name(n), age(a) {}
    
    string introduce() {
        return "Hi, I'm " + name + " and I'm " + to_string(age) + " years old.";
    }
};

int main() {
    cout << "Hello World!" << endl;
    
    // Variables and Data Types
    string name = "John";
    int age = 25;
    cout << "Name: " << name << ", Age: " << age << endl;
    
    // If-Else Statements
    if (age >= 18) {
        cout << "You are an adult" << endl;
    } else {
        cout << "You are a minor" << endl;
    }
    
    // Vectors and Loops
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << "Vector: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    for (int i = 0; i < numbers.size(); i++) {
        cout << "Number " << i << ": " << numbers[i] << endl;
    }
    
    // For-Each Loop
    for (int num : numbers) {
        cout << "Double: " << (num * 2) << endl;
    }
    
    // Functions
    cout << greet("Alice") << endl;
    
    // Classes and Objects
    Person person1("Bob", 30);
    cout << person1.introduce() << endl;
    
    // While Loop
    int count = 0;
    while (count < 3) {
        cout << "Count: " << count << endl;
        count++;
    }
    
    return 0;
}`,
      c: `// C Practice - Full Features!
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Functions
void greet(const char* person) {
    printf("Hello, %s!\\n", person);
}

// Structs (C version of classes)
typedef struct {
    char name[50];
    int age;
} Person;

void introduce(Person p) {
    printf("Hi, I'm %s and I'm %d years old.\\n", p.name, p.age);
}

int main() {
    printf("Hello World!\\n");
    
    // Variables and Data Types
    char name[] = "John";
    int age = 25;
    printf("Name: %s, Age: %d\\n", name, age);
    
    // If-Else Statements
    if (age >= 18) {
        printf("You are an adult\\n");
    } else {
        printf("You are a minor\\n");
    }
    
    // Arrays and Loops
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printf("Array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    
    for (int i = 0; i < size; i++) {
        printf("Number %d: %d\\n", i, numbers[i]);
    }
    
    // Functions
    greet("Alice");
    
    // Structs and Objects
    Person person1;
    strcpy(person1.name, "Bob");
    person1.age = 30;
    introduce(person1);
    
    // While Loop
    int count = 0;
    while (count < 3) {
        printf("Count: %d\\n", count);
        count++;
    }
    
    return 0;
}`
    };
    return templates[lang] || templates.javascript;
  };

  React.useEffect(() => {
    setCode(getDefaultCode(language));
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(getDefaultCode(newLanguage));
    setOutput('');
    setError('');
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: language
        })
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.output);
      } else {
        setError(data.output || 'Execution failed');
      }
    } catch (err) {
      setError('Failed to connect to execution server');
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode(getDefaultCode(language));
    setOutput('');
    setError('');
  };

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h1 className="text-center mb-4">Coding Practice</h1>
        <p className="text-center text-muted">
          Master your coding skills with our real-time execution engine. Write, run, and test your code!
        </p>
      </div>

      <Row>
        <Col md={8}>
          <Card className="bg-dark text-white h-100">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Code Editor</h5>
                <Form.Select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                </Form.Select>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Editor
                height="500px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                beforeMount={(monaco) => {
                  // Configure Monaco for better performance
                  monaco.languages.setLanguageConfiguration('python', {
                    comments: {
                      lineComment: '#',
                      blockComment: ['"""', '"""']
                    },
                    brackets: [
                      ['{', '}'],
                      ['[', ']'],
                      ['(', ')']
                    ],
                    autoClosingPairs: [
                      { open: '{', close: '}' },
                      { open: '[', close: ']' },
                      { open: '(', close: ')' },
                      { open: '"', close: '"', notIn: ['string'] },
                      { open: "'", close: "'", notIn: ['string', 'comment'] }
                    ],
                    surroundingPairs: [
                      { open: '{', close: '}' },
                      { open: '[', close: ']' },
                      { open: '(', close: ')' },
                      { open: '"', close: '"' },
                      { open: "'", close: "'" }
                    ]
                  });
                }}
                onMount={(editor, monaco) => {
                  // Performance optimizations
                  editor.updateOptions({
                    smoothScrolling: true,
                    cursorSmoothCaretAnimation: true,
                    mouseWheelZoom: true,
                    multiCursorModifier: 'ctrlCmd',
                    scrollbar: {
                      verticalScrollbarSize: 14,
                      horizontalScrollbarSize: 14
                    }
                  });
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'Consolas, "Courier New", monospace',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  smoothScrolling: true,
                  cursorSmoothCaretAnimation: true,
                  renderLineHighlight: 'line',
                  renderWhitespace: 'selection',
                  autoClosingBrackets: 'always',
                  autoClosingQuotes: 'always',
                  autoIndent: 'full',
                  formatOnType: true,
                  formatOnPaste: true,
                  tabSize: 4,
                  insertSpaces: true,
                  detectIndentation: false,
                  trimAutoWhitespace: true,
                  largeFileOptimizations: true,
                  mouseWheelZoom: true
                }}
              />
            </Card.Body>
            <Card.Footer>
              <div className="d-flex gap-2">
                <Button
                  variant="success"
                  onClick={executeCode}
                  disabled={isRunning}
                  className="flex-fill"
                >
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleClear}
                  className="flex-fill"
                >
                  Clear
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="bg-dark text-white h-100">
            <Card.Header>
              <h5 className="mb-0">Output</h5>
            </Card.Header>
            <Card.Body className="p-3">
              {error && (
                <Alert variant="danger" className="mb-3">
                  <strong>Execution Error:</strong> {error}
                </Alert>
              )}
              <div 
                style={{ 
                  backgroundColor: '#0d1117', 
                  color: '#58a6ff', 
                  padding: '20px', 
                  fontFamily: 'Consolas, "Courier New", monospace',
                  fontSize: '14px',
                  overflow: 'auto',
                  minHeight: '500px',
                  maxHeight: '500px',
                  whiteSpace: 'pre-wrap',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                  lineHeight: '1.5',
                  tabSize: 4
                }}
              >
                {output ? (
                  <div>
                    {output.split('\n').map((line, index) => (
                      <div key={index} style={{ 
                        marginBottom: '2px',
                        padding: '2px 0',
                        color: line.includes('ERROR') ? '#ff6b6b' : 
                               line.includes('WARNING') ? '#ffa657' :
                               line.includes('INFO') ? '#58a6ff' :
                               line.includes('DEBUG') ? '#79c0ff' : '#8b949e'
                      }}>
                        <span style={{ 
                          opacity: 0.7, 
                          fontSize: '11px', 
                          marginRight: '10px',
                          fontFamily: 'monospace'
                        }}>
                          {String(index + 1).padStart(3, ' ')} │
                        </span>
                        {line}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    opacity: 0.5, 
                    fontStyle: 'italic',
                    textAlign: 'center',
                    marginTop: '150px'
                  }}>
                    Your output will appear here...
                    <br />
                    <small style={{ fontSize: '12px', opacity: 0.7 }}>
                      Run your code to see results
                    </small>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="bg-secondary text-white">
            <Card.Header>
              <h6 className="mb-0">Quick Examples</h6>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-6">
                  <h6>JavaScript:</h6>
                  <pre style={{fontSize: '12px'}}>
{`console.log("Hello");
console.log(2 + 2);
const arr = [1,2,3];
console.log(arr.length);`}
                  </pre>
                </div>
                <div className="col-md-6">
                  <h6>Python:</h6>
                  <pre style={{fontSize: '12px'}}>
{`print("Hello")
print(2 + 2)
arr = [1,2,3]
print(len(arr))`}
                  </pre>
                </div>
              </div>
              <p className="text-muted small mt-3">
                Try these examples in the editor! Your code will actually execute and show real output.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Practice;
