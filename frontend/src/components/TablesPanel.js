import React, { useState, useEffect } from 'react';
import { getTables, getTableInfo } from '../services/api';
import '../styles/TablesPanel.css';

const TablesPanel = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const response = await getTables();
      if (response.success) {
        setTables(response.tables);
      }
    } catch (err) {
      console.error('Error loading tables:', err);
    }
  };

  const handleTableClick = async (tableName) => {
    setSelectedTable(tableName);
    setLoading(true);

    try {
      const response = await getTableInfo(tableName);
      if (response.success) {
        setTableInfo(response);
      }
    } catch (err) {
      console.error('Error loading table info:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tables-panel">
      <h2>Available Tables</h2>

      <div className="tables-list">
        {tables.map((table) => (
          <div
            key={table}
            className={`table-item ${selectedTable === table ? 'active' : ''}`}
            onClick={() => handleTableClick(table)}
          >
            📊 {table}
          </div>
        ))}
      </div>

      {loading && <div className="loading">Loading table info...</div>}

      {tableInfo && !loading && (
        <div className="table-details">
          <h3>{selectedTable}</h3>

          <div className="schema-section">
            <h4>Schema</h4>
            <table className="schema-table">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {tableInfo.columns.map((col, index) => (
                  <tr key={index}>
                    <td>{col.name}</td>
                    <td>{col.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sample-data-section">
            <h4>Sample Data (First 5 rows)</h4>
            {tableInfo.sample_data.length === 0 ? (
              <p>No data available</p>
            ) : (
              <div className="table-wrapper">
                <table className="sample-table">
                  <thead>
                    <tr>
                      {tableInfo.columns.map((col, index) => (
                        <th key={index}>{col.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableInfo.sample_data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {tableInfo.columns.map((col, colIndex) => (
                          <td key={colIndex}>{row[col.name]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TablesPanel;
