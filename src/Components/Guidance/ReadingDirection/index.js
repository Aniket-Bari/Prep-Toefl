import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./style.scss";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Index() {
  const navigate = useNavigate();

  const handleStart = () => {
    // Navigate to the /toefl/reading page or route
    navigate('/toefl/reading'); // Replace '//toefl/reading' with your actual route
  };

  return (
    <div className="main">
      <div className='container'>
          <div className='title'><span className="icon"></span>Reading Test Directions</div>
          <p>In this section, you will demonstrate your ability to understand academic passages in English. You will read and answer questions about <b>two passages</b>.</p>
          <p>Move to the next question by selecting <b>Next</b>. Return to previous screens by selecting <b>Back</b>.</p>
          <p>You may take notes to help you answer the test questions. Your notes will not be scored.</p>
      </div>
      <div className='button-click'>
        <button className="start-btn" onClick={handleStart}>Start</button>
      </div>
    </div>
  );
}
