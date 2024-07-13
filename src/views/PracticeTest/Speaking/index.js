import React from 'react';
import { Link } from 'react-router-dom';

export default function Speaking() {
  return (
    <div className='question-start-wrap'>
      {/* Your existing content */}
      <Link to="/writing-direction">
        <button>Continue</button>
      </Link>
    </div>
  )
}
