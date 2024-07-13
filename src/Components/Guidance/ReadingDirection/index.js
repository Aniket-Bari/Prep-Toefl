import React from 'react';
import { Link } from 'react-router-dom';
import "./style.scss";

const ReadingDirection = () => {
  return (
    <div className='reading-direction-main'>
      <div className='reading-main-heading'>
        <h4>Reading Section Directions</h4>
      </div>
      <div className='reading-description-main'>
        <div>
          <p>
            This section measures your ability to understand written English. For some questions, you will move your answer choices to a blank. For other questions, you will select the best answer from several options.
          </p>
        </div>

        <div>
          <p>To move an answer to a blank: </p>
          <ul>
            <li>Use the mouse to drag a choice to the blank.</li>
            <li>or use<b> Tab </b>or <b>Shift+Tab</b> to go to the correct blank and then press the space bar.</li>
          </ul>
        </div>

        <div>
          <p>To change your answer: </p>
          <ul>
            <li>Use the mouse to drag your new answer choice to the correct blank.</li>
            <li>or use<b> Tab </b>or <b>Shift+Tab</b> to go to the choice you want to remove. Press the space bar to select the choice and then press the space bar again to return it to the answer choices. You may then select a new answer choice.</li>
          </ul>
        </div>
        <div>
          <p>To go to the next question: </p>
          <ul>
            <li>• Use the mouse to select the <b>Next</b> button</li>
            <li>or use<b> Tab </b> key to go to the Next button. You may have to press the tab key more than once.</li>
          </ul>
        </div>

        <div>
          <p>
            In the actual test, a clock will show you how much time you have remaining to complete the section. Additionally, within each part of the reading section, you can move to the next question by selecting <b>Next</b>. You can skip questions and go back to them later. If you want to return to previous questions, select <b>Back</b>. A review screen is also available in the actual test. By selecting <b>Review</b>, you will have the opportunity to check whether you have or have not answered any of the questions. The review screen is available at any time during this section.
          </p>
        </div>
        <div>
          You may take notes and use your notes to help you answer the questions. Your notes will not be scored.
        </div>
        <div>
          <p>In this practice test, you can: </p>
          <ul>
            <li>use the <b>Back</b> and <b>Next</b> buttons to go to different questions in the test</li>
            <li>check your answers using the <b>Show Answer</b> button</li>
          </ul>
        </div>
        <p>In this practice test the Review screen is not available.</p>
        <b>Select <Link to="/reading">Continue</Link> to go on.</b>
      </div>
    </div>
  );
};

export default ReadingDirection;
