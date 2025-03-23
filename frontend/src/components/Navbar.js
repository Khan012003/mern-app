import { Link } from 'react-router-dom';
import '../App.css';
export default function Navbar() {
  return (
    <nav>
      <Link to="/">FreecodeCamp</Link>
      <div>
        <Link to="/signup">Sign Up</Link>
        <Link to="/signin">Sign In</Link>
      </div>
    </nav>
  );
}