import React from 'react';
import "./style.scss";

const EndOfBuild = () => {
    return (
        <div className='end-build-main'>
            <div className='build-main-heading'>
                <h4>End of the Build a Sentence Section</h4>
            </div>
            <div className='build-description-main'>
                <div>
                    <p>
                    You have seen all of the questions in this section. In the actual test, once you leave this section, you WILL NOT be able to return to it.  
                    </p>
                </div>
                <div>
                    <p>
                    In this practice test, you can go back to previous sections of the test. 
                    </p>
                </div>
                <div className='general-description-continue'>
                    <p>
                    Select<b> Back </b> to go back to the last question in this part. 
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

export default EndOfBuild;