'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  interface Result {
    table_title?: string;
    table_number?: number;
    summary: string[];
  }

  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setResults([]);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults([]);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setResults(data.results);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">SAE Summary Tool</h1>
              <form onSubmit={handleSubmit} className="mb-4">
                <input
                  type="file"
                  accept=".docx"
                  className="form-control mb-2"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <button type="submit" className="btn btn-primary w-100" disabled={!file || loading}>
                  {loading ? 'Uploading...' : 'Upload and Summarize'}
                </button>
              </form>
              {error && <div className="alert alert-danger">{error}</div>}
              {results.length > 0 && (
                <div className="mt-4">
                  {results.map((result, idx) => (
                    <div key={idx} className="mb-4">
                      {result.table_title && (
                        <h5>{result.table_title} {result.table_number && <span className="text-muted">(Table {result.table_number})</span>}</h5>
                      )}
                      <ul>
                        {result.summary.map((sentence: string, i: number) => (
                          <li key={i}>{sentence}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
