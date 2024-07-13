import React from 'react';
import "./style.scss";

const InterViewGuidance = () => {
    return (
        <div className='interview-guidance-main'>
            <div className='interview_main-heading'>
                <h4>Interview</h4>
            </div>
            <div className='interview-description-main'>
                <div>
                    <p>
                        In this part, an interviewer will ask you questions. Please answer the questions to the best of your ability. In the actual test, the clock will show you how much time you have to speak.
                    </p>
                </div>
                <div>
                    <p>
                        In this practice test, you will listen to sample responses and read comments about them.
                    </p>
                </div>
                <div className='interview-description-continue'>
                    <p>
                        select<b> continue </b>to go on.
                    </p>
                </div>

            </div>
        </div>
    )

}

export default InterViewGuidance;