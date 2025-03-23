import { useEffect, useState } from 'react';
import '../App.css';
import api from '../services/api';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
      } catch (error) {
        setError('Failed to load courses. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Available Courses</h1>
      <div className="courses-list">
        {courses.map(course => (
          <div className="course-card" key={course._id}>
            <h3 className="course-title">{course.title}</h3>
            <p className="course-duration">Duration: {course.duration}</p>
          </div>
        ))}
      </div>
      {courses.length === 0 && !loading && (
        <p className="no-courses">No courses available at the moment.</p>
      )}
    </div>
  );
}