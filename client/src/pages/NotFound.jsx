import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-display font-bold text-saffron-600 mb-4">404</p>
        <h1 className="font-display font-bold text-2xl text-navy-800 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/schemes" className="btn-secondary">Browse Schemes</Link>
        </div>
      </div>
    </div>
  );
}
