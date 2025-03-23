
import { Link } from 'react-router-dom';

import '../App.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-heading">
          <span className="welcome-text">Welcome to</span>
          <span className="fcc-text">freeCodeCamp</span>
        </h1>
        <h1 className="tagline">Learn to code — for free.</h1>
      </div>
    </div>
  );
}