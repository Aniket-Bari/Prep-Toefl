import React from 'react';
import Routing from './Routing';

const App = () => {

  let getURLQueryString = new URLSearchParams(window?.location?.search);
  let queryString = '';
  console.log(window?.location?.search)

  for (const entry of getURLQueryString.entries()) {
    queryString = entry[0];
    console.log(queryString)
  }

  let searchParams = new URLSearchParams(queryString);
  let id = searchParams.get('front_url');
  console.log(id,'himanshi');

  return (
    <Routing />
  );
}

export default App;
