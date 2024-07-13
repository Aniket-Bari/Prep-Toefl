import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './style.scss';

const EndOfSection = (props) => {
    const { heading } = props;

    return (
        <div className='end-guidance-main'>
            <div className='sec-head-line'><p>{heading}</p></div>
            <div className='section-guide'>
                <div className='guide'>
                    <p>
                        {heading} &nbsp;
                        You have seen all of the reading questions in this set. &nbsp;You may go back and review and check your work
                    </p>
                    <p>
                        Click on <b>RETURN</b> to go back to the last question.
                    </p>
                    <p>
                        Click on <b>REVIEW</b> to review the list of questions in this set.
                    </p>
                    <p>
                        Click on <b>CONTINUE</b> to go on to the next section of the test.
                    </p>
                    <p>
                        Once you leave the Reading section you will NOT be able to return.
                    </p>
                    <p>
                        Select <Link to="/volume-directions">CONTINUE</Link> to go on.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EndOfSection;
