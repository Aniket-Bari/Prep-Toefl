import React from 'react'
import './style.scss'
import Header from './../Header';
const ExpirePage = () => {
  return (
    <>
     {/* <Header /> */}
      <div className='expire-page-wrap'>
        <p>
          Time has expired for this question.<br></br>
          Please select Next to continue.
        </p>   
      </div>
    </>
  )
}

export default ExpirePage