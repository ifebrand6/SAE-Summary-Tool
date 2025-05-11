'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Test backend connection
    fetch('http://localhost:5000/api/test')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Error connecting to backend'));
  }, []);

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">SAE Summary Tool</h1>
              <p className="card-text text-center">
                {message || 'Connecting to backend...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
