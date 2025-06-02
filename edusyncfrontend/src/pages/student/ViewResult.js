import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Alert,
  Accordion,
  Badge,
  Row,
  Col,
  Spinner,
  Card
} from "react-bootstrap";
import API from "../../services/api";
import { jwtDecode } from "jwt-decode";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return (
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      decoded.sub ||
      null
    );
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

const ViewResult = () => {
  const { assessmentId, userId } = useParams();
  const navigate = useNavigate();
  const currentUserId = getUserIdFromToken();
  const resultUserId = userId || currentUserId;

  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [unattemptedCount, setUnattemptedCount] = useState(0);

  useEffect(() => {
    if (!resultUserId || !assessmentId) {
      setError("Missing student or assessment information.");
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await API.get(`/Results/by-user/${resultUserId}/assessment/${assessmentId}`);
        if (!res.data || !res.data.questions) {
          setError("No result data found.");
          setLoading(false);
          return;
        }

        setScore(res.data.score);

        const transformedQuestions = res.data.questions.map((q) => ({
          questionId: q.questionId || q.QuestionId,
          questionText: q.questionText || q.Question || "",
          options: q.options || q.Options || [],
          selectedOption: q.selectedOption || q.SelectedOption || null,
          correctOption: q.correctAnswer || q.correctOption || q.CorrectOption || null,
        }));

        setQuestions(transformedQuestions);

        let correct = 0, incorrect = 0, unattempted = 0;
        transformedQuestions.forEach((q) => {
          if (!q.selectedOption || q.selectedOption === "Unattempted") {
            unattempted++;
          } else if (q.selectedOption === q.correctOption) {
            correct++;
          } else {
            incorrect++;
          }
        });

        setCorrectCount(correct);
        setIncorrectCount(incorrect);
        setUnattemptedCount(unattempted);
      } catch (err) {
        console.error("Failed to load result", err);
        setError("Could not fetch result data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultUserId, assessmentId]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <div className="mt-2">Loading your result...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger" className="text-center shadow">
          <strong>⚠️ {error}</strong>
        </Alert>
        <div className="text-center">
          <Button variant="dark" onClick={() => navigate(-1)}>
            ⬅ Go Back
          </Button>
        </div>
      </div>
    );
  }

  const total = questions.length;
  const percentage = total > 0 ? ((score / total) * 100).toFixed(0) : 0;
  const accuracy = total > 0 ? ((correctCount / total) * 100).toFixed(1) : 0;

  return (
    <div className="container mt-4 mb-5">
      <div className="text-center mb-4">
       
      
      </div>
<div 
  className="mb-4 p-4 rounded-4 shadow-lg border-0" 
  style={{ 
    backgroundColor: 'rgba(108, 112, 138, 0.3)', // semi-transparent dark background
    color: '#ffff',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  }}
>
  <h3 className="text-center mb-4" style={{ fontWeight: 700, color:"black" }}>
    Final Score: <span style={{ color: 'black' }}>{score} / {total}</span>
  </h3>
  <Row className="text-center justify-content-center gy-3">
    <Col xs={6} md={2}>
      <Badge bg="primary" className="fs-6 py-2 px-3 rounded-pill shadow-sm">Total: {total}</Badge>
    </Col>
    <Col xs={6} md={2}>
      <Badge bg="success" className="fs-6 py-2 px-3 rounded-pill shadow-sm">Correct: {correctCount}</Badge>
    </Col>
    <Col xs={6} md={2}>
      <Badge bg="danger" className="fs-6 py-2 px-3 rounded-pill shadow-sm">Incorrect: {incorrectCount}</Badge>
    </Col>
    <Col xs={6} md={2}>
      <Badge bg="secondary" className="fs-6 py-2 px-3 rounded-pill shadow-sm">Unattempted: {unattemptedCount}</Badge>
    </Col>
    <Col xs={6} md={2}>
      <Badge bg="info" className="fs-6 py-2 px-3 rounded-pill shadow-sm">Accuracy: {accuracy}%</Badge>
    </Col>
  </Row>
</div>


      <Accordion defaultActiveKey="0">
        {questions.map((q, idx) => {
          const borderStyle = !q.selectedOption || q.selectedOption === "Unattempted"
            ? "secondary"
            : q.selectedOption === q.correctOption
              ? "success"
              : "danger";

          return (
            <Accordion.Item key={q.questionId} eventKey={String(idx)}>
              <Accordion.Header>
                <span className={`me-2 badge bg-${borderStyle}`}>Q{idx + 1}</span> {q.questionText}
              </Accordion.Header>
              <Accordion.Body>
                <ul className="list-unstyled ps-3 ">
                  {q.options.map((opt, i) => {
                    const label = String.fromCharCode(65 + i);
                    const isSelected = q.selectedOption === label || q.selectedOption === opt;
                    const isCorrect = q.correctOption === label || q.correctOption === opt;

                    return (
                      <li
                        key={label}
                        className="mb-1"
                        style={{
                          fontWeight: isCorrect ? "600" : "400",
                          color: isSelected
                            ? isCorrect
                              ? "#00ffa2"
                              : "#ff4d4f"
                            : isCorrect
                              ? "#00ffa2"
                              : "#ffffff",
                        }}
                      >
                        {label}. {opt}
                        {isCorrect && " ✅"}
                        {isSelected && !isCorrect && " ❌"}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-2 small text-muted">
                  <strong>Selected:</strong> {q.selectedOption || "Unattempted"} | <strong>Correct:</strong> {q.correctOption}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      <div className="text-center mt-5">
        <Button variant="light" size="lg" onClick={() => navigate(-1)} className="rounded-3 shadow">
          ⬅ Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ViewResult;
