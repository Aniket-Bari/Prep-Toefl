import React from 'react';
import { createRoot } from 'react-dom/client';
import PracticeTest from './PracticeTest';

const App = () => {
  return (
    <div>
      <PracticeTest apiEndpoint="http://127.0.0.1:8000/api/toefl/r_q" />
    </div>
  );
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);
