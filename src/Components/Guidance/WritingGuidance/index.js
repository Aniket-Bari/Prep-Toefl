import React from 'react';
import "./style.scss";

const WritingGuidance = () => {
    return (
        <div className='/toefl/reading-guidance-main'>
            <div className='/toefl/reading-main-heading'>
                <h4>Build a sentence</h4>
            </div>
            <div className='/toefl/reading-description-main'>
                <div>
                    <p>
                        This task has a dialogue with two parts. The first part is complete, but the second part has blanks. Move the words to the blanks to make a grammatical sentence. For some questions, there may be more words than blanks. In those cases, move only the words you need into the blanks.
                    </p>
                    <p>
                        In the actual test, within this part of the writing section, you can move to the next question by selecting <b>Next</b>. You can also skip questions and go back to them later as long as there is time remaining in the part. If you want to return to previous questions, select <b>back</b>
                    </p>
                    <p>
                        In this practice test you can check your answers using the <b>show answer</b> button
                    </p>
                </div>
                <div>
                    <p>To move an answer to a blank: </p>
                    <ul>
                        <li>Use the mouse to drag the words to the blanks where they belong.  </li>
                        <li>Or use <b>Tab </b>  to go to the word and press the space bar to select it. Then use <b>Shift+Tab</b> to go to the correct blank and then press the space bar.  </li>
                    </ul>
                </div>
                <div>
                    <p>To change your answer:  </p>
                    <ul>
                        <li>Use the mouse to drag your new answer choice to the correct blank.   </li>
                        <li>or use<b> Tab </b>or <b>Shift+Tab</b>  to go to the choice you want to remove. Press the space bar to select the choice and then press the space bar again to return it to the answer choices. You may then select a new answer choice.</li>
                    </ul>
                </div>
                <div>
                    <p>To go to the next question:  </p>
                    <ul>
                        <li>•  Use the mouse to select the  <b>Next</b> button </li>
                        <li>or use<b> Tab </b>   key to go to the <b>Next</b> button. You may have to press the tab key more than once. </li>
                    </ul>
                </div>
                <p>Select <b>Continue</b> to go on. </p>
            </div>
        </div>
    )
}

export default WritingGuidance;