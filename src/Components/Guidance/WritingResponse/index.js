import React from 'react';
import "./style.scss";

const WritingResponse = () => {
    return (
        <div className='writing-response-main'>
            <div className='response-main-heading'>
                <h4>Writing Responses</h4>
            </div>
            <div className='response-description-main'>
                <div>
                    <p>
                    You will be asked to write in response to a variety of different situations. In the actual test, you will have a short amount of time to write your responses. The clock will show you how much time is remaining for each question or task.  When your time ends, you will be moved to the next question. 
                    </p>
                </div>
                <div>
                    <p>
                    In this practice test, you will be able to practice writing a response for each question or task and review sample responses. Once you exit the section, your responses will not longer be available. 
                    </p>
                </div>
               
                <div className='general-description-continue'>
                    <p>
                    Select<b> Continue</b> to go on
                    </p>
                </div>
               
            </div>
        </div>
    )

}

export default WritingResponse;