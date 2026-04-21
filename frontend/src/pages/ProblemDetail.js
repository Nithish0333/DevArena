import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Container, Button, Badge, Alert, Form, Row, Col } from 'react-bootstrap';
import Editor from '@monaco-editor/react';
import { problemsAPI } from '../services/api';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    console.log('Fetching problem with ID:', id);
    try {
      const response = await problemsAPI.getProblem(id);
      console.log('Problem data received:', response.data);
      setProblem(response.data);
      
      const defaultCode = getDefaultCode(language);
      setCode(defaultCode);
      console.log('Problem loaded successfully');
    } catch (error) {
      setError('Problem not found');
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCode = (lang) => {
    const templates = {
      javascript: `// Solution in JavaScript
function solve(input) {
    // Write your solution here
    return input;
}

// Example usage
const input = ''; // Read input here
console.log(solve(input));`,
      python: `# Solution in Python
def solve():
    # Write your solution here
    pass

if __name__ == "__main__":
    solve()`,
      java: `// Solution in Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,
      cpp: `// Solution in C++
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
      c: `// Solution in C
#include <stdio.h>

int main() {
    // Write your solution here
    return 0;
}`
    };
    return templates[lang] || templates.javascript;
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(getDefaultCode(newLanguage));
    setSubmissionResult(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting');
      return;
    }

    setSubmitting(true);
    setError('');
    setSubmissionResult(null);

    try {
      const response = await problemsAPI.submitSolution(id, code, language);
      setSubmissionResult(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error && !problem) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
        <Link to="/problems" className="btn btn-primary">
          Back to Problems
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <Link to="/problems" className="btn btn-outline-light mb-3">
          &larr; Back to Problems
        </Link>
        <h1 className="display-5 fw-bold text-white mb-3">{problem.title}</h1>
        <div className="mb-3">
          <Badge bg={getDifficultyColor(problem.difficulty)} className="me-2">
            {problem.difficulty}
          </Badge>
          <Badge bg="secondary" className="me-2">
            {problem.category}
          </Badge>
          <Badge bg="info">
            {problem.points} points
          </Badge>
        </div>
      </div>

      <Row>
        <Col md={6}>
          <Card className="bg-dark text-white mb-4">
            <Card.Header>
              <h5 className="mb-0">Problem Description</h5>
            </Card.Header>
            <Card.Body>
              <div className="problem-description">
                <p>{problem.description}</p>
                
                <h6 className="mt-4">Input Format</h6>
                <pre className="bg-secondary p-2 rounded">{problem.inputFormat}</pre>
                
                <h6 className="mt-3">Output Format</h6>
                <pre className="bg-secondary p-2 rounded">{problem.outputFormat}</pre>
                
                <h6 className="mt-3">Constraints</h6>
                <pre className="bg-secondary p-2 rounded">{problem.constraints}</pre>
                
                <h6 className="mt-3">Sample Input</h6>
                <pre className="bg-secondary p-2 rounded">{problem.sampleInput}</pre>
                
                <h6 className="mt-3">Sample Output</h6>
                <pre className="bg-secondary p-2 rounded">{problem.sampleOutput}</pre>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="bg-dark text-white">
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
                height="400px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </Card.Body>
            <Card.Footer>
              {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
              
              {submissionResult && (
                <Alert variant={submissionResult.submission.status === 'Accepted' ? 'success' : 'warning'}>
                  <h6>Submission Result</h6>
                  <p><strong>Status:</strong> {submissionResult.submission.status}</p>
                  <p><strong>Submitted at:</strong> {new Date(submissionResult.submission.submittedAt).toLocaleString()}</p>
                </Alert>
              )}
              
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-100"
              >
                {submitting ? 'Submitting...' : 'Submit Solution'}
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProblemDetail;
