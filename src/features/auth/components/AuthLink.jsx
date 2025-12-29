import { Link } from 'react-router-dom';

export const AuthLink = ({ to, children, className = '' }) => {
  return (
    <Link 
      to={to} 
      className={`text-sm text-foreground hover:underline hover:text-foreground-light transition-colors ${className}`}
    >
      {children}
    </Link>
  );
};
