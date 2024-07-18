import React from 'react';
import { createRoot } from 'react-dom/client';
import Reading from './../../views/PracticeTest/Reading';

const ReadingSectionQuestionType = () => {
  return (
    <div>
      <Reading apiEndpoint="http://127.0.0.1:8000/api/toefl/r_q" />
    </div>
  );
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<ReadingSectionQuestionType />);
