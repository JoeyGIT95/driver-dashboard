import React from 'react';

const mockData = [
  {
    driver: 'Velu (PD1781L)',
    currentTask: 'Material Delivery - PSS',
    taskPeriod: '09:00 → 10:45',
    nextTask: 'Pickup Workers - CNB',
    nextPeriod: '11:30 → 12:00',
  },
  {
    driver: 'Raja (YQ766M)',
    currentTask: 'Available',
    taskPeriod: '—',
    nextTask: 'Equipment Transfer - Tuas',
    nextPeriod: '10:30 → 11:00',
  },
];

function App() {
  return (
    <div style={{ backgroundColor: '#0c0c0c', minHeight: '100vh', padding: '20px', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Driver Task Dashboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#222' }}>
          <tr>
            <th style={thStyle}>Driver</th>
            <th style={thStyle}>Current Task</th>
            <th style={thStyle}>Task Period</th>
            <th style={thStyle}>Next Task</th>
            <th style={thStyle}>Next Period</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#1a1a1a' : '#111' }}>
              <td style={tdStyle}>{row.driver}</td>
              <td style={tdStyle}>{row.currentTask}</td>
              <td style={tdStyle}>{row.taskPeriod}</td>
              <td style={tdStyle}>{row.nextTask}</td>
              <td style={tdStyle}>{row.nextPeriod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: '12px', borderBottom: '1px solid #444', textAlign: 'left' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #333' };

export default App;
