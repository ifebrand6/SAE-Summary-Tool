'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  interface Result {
    table_title?: string;
    table_number?: number;
    summary: string[];
  }

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [showAllResults, setShowAllResults] = useState(false);

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
      setExpanded({});
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

  const handleDownload = async () => {
    if (!window.confirm("Do you want to download the summary JSON file?")) {
      return;
    }
    setDownloading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/download', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'sae_summary.json');
      document.body.appendChild(a);
      a.click();
      a.parentNode?.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during download');
      }
    } finally {
      setDownloading(false);
    }
  };

  const toggleExpand = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white text-center">
              <h2 className="mb-0">SAE Summary Tool</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                  <label htmlFor="file-upload" className="form-label fw-bold">
                    Upload .docx Clinical Trial File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".docx"
                    className="form-control"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={!file || loading}>
                  {loading ? 'Uploading...' : 'Upload and Summarize'}
                </button>
              </form>
              {error && <div className="alert alert-danger">{error}</div>}
              {results.length > 0 && (
                <div className="mt-4">
                  {results.length > 0 && (
                    <button
                      className="btn btn-success mb-3"
                      onClick={handleDownload}
                      disabled={downloading}
                    >
                      {downloading ? "Downloading..." : "Download JSON"}
                    </button>
                  )}
                  <div className="row g-3">
                    {(showAllResults ? results : results.slice(0, 20)).map((result, idx) => {
                      const showAll = expanded[idx];
                      const summary = result.summary || [];
                      const visible = showAll ? summary : summary.slice(0, 3);
                      const hasMore = summary.length > 3;
                      return (
                        <div className="col-12" key={idx}>
                          <div className="card h-100 shadow-sm">
                            <div className="card-body">
                              {result.table_title && (
                                <h5 className="card-title">
                                  {result.table_title} {result.table_number && (
                                    <span className="text-muted">(Table {result.table_number})</span>
                                  )}
                                </h5>
                              )}
                              <ul className="list-group list-group-flush mb-2">
                                {visible.map((sentence, i) => (
                                  <li className="list-group-item" key={i}>
                                    {sentence}
                                  </li>
                                ))}
                              </ul>
                              {hasMore && (
                                <button
                                  className="btn btn-link p-0"
                                  onClick={() => toggleExpand(idx)}
                                  style={{ fontSize: '0.95rem' }}
                                >
                                  {showAll ? 'Show less' : `Show ${summary.length - 3} more`}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {results.length > 20 && (
                    <div className="text-center mt-3">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setShowAllResults((prev) => !prev)}
                      >
                        {showAllResults ? "Show less results" : `Show ${results.length - 20} more results`}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
