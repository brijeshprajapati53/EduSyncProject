import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import useAuth from '../hooks/useAuth';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    setIsDashboard(
      location.pathname === '/instructor-dashboard' ||
      location.pathname === '/student-dashboard'
    );
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

 

  return (
    <Navbar  bg="dark" variant="dark"  expand="lg" className="mb-2 navbar navbar-dark bg-dark " style={{ background: 'linear-gradient(to right, #2575fc, #6a11cb)'}} fixed='top'>
      <Container className='all'>
        <Navbar.Brand as={Link} to="#">
          EduSync
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && !isDashboard && (
              <>
                <Nav.Link
                  as={Link}
                  to={
                    user.role === 'Student'
                      ? '/student-dashboard'
                      : '/instructor-dashboard'
                  }
                >
                  {user.role === 'Student'
                    ? 'Student Dashboard'
                    : 'Instructor Dashboard'}
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to={
                    user.role === 'Student'
                      ? '/student/enrolled-courses'
                      : '/instructor/courses'
                  }
                >
                  {user.role === 'Student'
                    ? 'Enrolled Courses'
                    : 'Upload Course'}
                </Nav.Link>


                {user.role === 'Student' && (
                  <Nav.Link as={Link} to="student/all-assessments">
                   Assessments
                  </Nav.Link>
                )}

                <Nav.Link
                  as={Link}
                  to={
                    user.role === 'Student'
                      ? '/student/ViewAssessmentResults'
                      : '/instructor/quiz-performance'
                  }
                >
                  {user.role === 'Student'
                    ? 'Quiz Results'
                    : 'Student Performance'}
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to={
                    user.role === 'Student'
                      ? '/student/explore-courses'
                      : '/instructor/my-courses'
                  }
                >
                  {user.role === 'Student'
                    ? 'Explore Courses'
                    : 'My Courses'}
                </Nav.Link>
              </>
            )}

            {user && isDashboard && (
              <Nav.Link
                as={Link}
                to={
                  user.role === 'Student'
                    ? '/student-dashboard'
                    : '/instructor-dashboard'
                }
              >
                {user.role === 'Student'
                  ? 'Student Dashboard'
                  : 'Instructor Dashboard'}
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {user ? (
              <div className="d-flex align-items-center">
                <li className="nav-item">
                  <span className="nav-link active" aria-current="page">
                    Good to see you!, {user.name}
                  </span>
                </li>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  as={Link}
                  to="/login"
                  className="me-2"
                >
                  Login
                </Button>
                <Button variant="outline-light" as={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
