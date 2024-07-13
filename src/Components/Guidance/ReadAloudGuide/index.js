import React from 'react';
import "./style.scss";

const ReadAloudGuide = () => {
    return (
        <div className='read-aloud-guidens-main'>
            <div className='general-main-heading'>
                <h4>Read Aloud</h4>
            </div>
            <div className='general-description-main'>
                <div>
                    <p>
                        For this task, you will hear someone speak to you. After the person has completed speaking, words will appear on the screen and you will hear a beep. Read the words aloud after the beep.
                    </p>
                </div>
                <div>
                    <p>
                        In the actual test, the clock will show you how much time you have to read the words out loud. Read the words aloud
                        <b> one time only</b></p>
                </div>
                <div className='general-description-continue'>
                    <p>
                        In this practice test, you will only listen to sample responses and read comments about them.
                    </p>
                </div>

                <div className='general-description-continue'>
                    <p>
                        The Read Aloud practice includes examples of the passage being read by test takers from a variety of language backgrounds with a variety of accents. The examples of successful performances share these characteristics:
                    </p>
                </div>
                <div className='general-description-continue'>
                    <p>
                        •  The passage is read with ease or with very little difficulty.
                    </p>
                    <p>
                        •  Speech is fluid and intelligible with little or no hesitation.
                    </p>
                    <p>
                        •  Units of meaning are marked by appropriate intonation and pauses.
                    </p>
                    <p>
                        •  Minor mispronunciation or other language influence may be present but do not affect intelligibility.
                    </p>
                </div>
                <div>
                    <p>Test takers are not evaluated on how well they act the part. Intonation and stress is important only to the extent that it is used to express the meaning of the written text. </p>
                </div>

            </div>
        </div>
    )

}

export default ReadAloudGuide;