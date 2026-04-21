import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Container, Button, Badge, Alert, Form, Row, Col } from 'react-bootstrap';
import { problemsAPI } from '../services/api';

const ProblemDetailTest = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      const response = await problemsAPI.getProblem(id);
      setProblem(response.data);
    } catch (error) {
      setError('Problem not found');
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
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
                <h5 className="mb-0">Code Editor (Test Version)</h5>
                <Form.Select style={{ width: '150px' }}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                </Form.Select>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ height: '400px', backgroundColor: '#1e1e1e', padding: '20px', fontFamily: 'monospace', color: 'white', overflow: 'auto' }}>
                <div>// Code Editor Test Area</div>
                <div>// Monaco Editor would load here</div>
                <div>// If you see this, the page is loading but Monaco Editor has issues</div>
                <div>function solve(input) {'{'}</div>
                <div style={{ paddingLeft: '20px' }}>// Write your solution here</div>
                <div style={{ paddingLeft: '20px' }}>return input;</div>
                <div>{'}'}</div>
                <div></div>
                <div>const input = 'test';</div>
                <div>console.log(solve(input));</div>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary" className="w-100">
                Submit Solution (Test)
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProblemDetailTest;
