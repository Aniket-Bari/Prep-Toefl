import React from 'react';
import { Link } from 'react-router-dom';

export default function Writing() {
  return (
    <div>
      <Link to="/result-view">
        <button>Continue</button>
      </Link>
    </div>
  );
}
