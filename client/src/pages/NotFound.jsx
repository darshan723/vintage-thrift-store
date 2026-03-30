import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found fade-in">
      <h1>404</h1>
      <h2>Looks like this piece is gone for good</h2>
      <p>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable. Like all good vintage, someone might have snagged it first!
      </p>
      <Link to="/" className="btn btn-primary btn-lg" style={{ marginTop: 'var(--space-md)' }}>
        Return to Collection
      </Link>
    </div>
  );
}
