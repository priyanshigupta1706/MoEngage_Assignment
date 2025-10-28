import React, { useState, useEffect } from 'react';
import { executeQuery, getQueryHistory } from '../services/api';
import '../styles/QueryEditor.css';

const QueryEditor = () => {
  const [query, setQuery] = useState('SELECT * FROM Customers;');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await getQueryHistory();
      if (response.success) {
        setHistory(response.history);
      }
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const handleExecute = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await executeQuery(query);
      if (response.success) {
        setResults(response);
        loadHistory();
      } else {
        setError(response.error || 'Query execution failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (historyQuery) => {
    setQuery(historyQuery);
    setShowHistory(false);
  };

  const handleKeyPress = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleExecute();
    }
  };

  return (
    <div className="query-editor">
      <div className="editor-header">
        <h2>SQL Query Editor</h2>
        <button 
          className="btn-secondary"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {showHistory && (
        <div className="query-history">
          <h3>Recent Queries</h3>
          {history.length === 0 ? (
            <p className="no-history">No query history</p>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => handleHistoryClick(item.query)}
                >
                  <div className="history-query">{item.query}</div>
                  <div className="history-time">{item.executed_at}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="editor-content">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter your SQL query here..."
          className="query-input"
        />

        <div className="editor-actions">
          <button
            onClick={handleExecute}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Executing...' : 'Run Query (Ctrl + Enter)'}
          </button>
          <button
            onClick={() => setQuery('')}
            className="btn-secondary"
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && results.data && (
        <div className="results-container">
          <h3>Query Results ({results.data.length} rows)</h3>

          {results.data.length === 0 ? (
            <p className="no-results">No results found</p>
          ) : (
            <div className="table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    {results.columns.map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {results.columns.map((col, colIndex) => (
                        <td key={colIndex}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QueryEditor;
