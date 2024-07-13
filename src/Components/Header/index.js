import React, { useState, useEffect } from 'react';
import { Button, Container, Navbar, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/Images/prep27-logo.png';
import { useVolume } from './../../context/VolumeContext';
import readingblankbox from './../../assets/Images/reading-help-3.png';
import listeningHelp from './../../assets/Images/listening-help-type.png';
import readingblckbox from './../../assets/Images/reading-help-1.png';
import readingsqbox from './../../assets/Images/reading-help-2.png';
import writinghelp from './../../assets/Images/writing-help-1.png';
import './style.scss';

const Header = ({ showPageNumber, setUpdateVolume, setPage, page }) => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(true);
  const { volume, setVolume } = useVolume();
  const location = useLocation();
  const [helpedPageInfo, setHelpedPageInfo] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [heading, setHeading] = useState('Reading');
  const [seconds, setSeconds] = useState(35 * 60);
  const [show, setShow] = useState(true);
  const [showValue, setShowValue] = useState(true);
  const [showRangeBar, setShowRangeBar] = useState(false);
  const [showBackbtn, setShowBackbtn] = useState(true);
  const hiddenTimerPages = [1, 2, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 22, 24, 26, 27, 28, 29, 31, 32, 35];
  const [previousLocation, setPreviousLocation] = useState(null); // Assuming previousLocation is managed by useState

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume); 
  };

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // Clean up timer on unmount or when seconds reach 0
    return () => clearInterval(timer);
  }, [seconds]);

  // Update heading based on page number
  useEffect(() => {
    if (pageNumber >= 0 && pageNumber <= 9) {
      setHeading('Reading section');
    } else if (pageNumber >= 10 && pageNumber <= 14) {
      setHeading('Listening section');
    } else if (pageNumber >= 15 && pageNumber <= 19) {
      setHeading('Speaking section');
    } else if (pageNumber >= 20 && pageNumber <= 27) {
      setHeading('Writing section');
    } else {
      setHeading('');
    }
  }, [pageNumber]);

  // Effect to set initial page number from location state
  useEffect(() => {
    if (location?.state?.pageNumber) {
      setPageNumber(location.state.pageNumber);
    }
  }, []);

  // Increment page number
  const increment = () => {
    // Handle special cases based on page number
    switch (pageNumber) {
      case 2:
        setSeconds(35 * 60); // Reading section
        break;
      case 12:
        setSeconds(36 * 60); // Listening section
        break;
      case 16:
        setSeconds(16 * 60); // Speaking section
        break;
      case 20:
        setSeconds(29 * 60); // Writing section
        break;
      default:
        break;
    }

    // Navigate based on current page number
    if (window.location.pathname === '/LmcqAfterAudioOpt') {
      navigate('/', { state: { page: 13, pageNumber: 14 } });
    } else if (window.location.pathname === '/PageExpire') {
      navigate('/', { state: { page: 18, pageNumber: 19 } });
    } else if (window.location.pathname === '/WritingQuestionPara') {
      navigate('/', { state: { page: 22, pageNumber: 23 } });
    } else {
      setPage(page + 1);
      setPageNumber(pageNumber + 1);
      setHeading('Reading');
    }
  };

  // Decrement page number
  const decrement = () => {
    setPage(page - 1);
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      setHeading(heading);
    }
  };

  // Navigate back to previous page or initial page
  const navigateBack = () => {
    if (helpedPageInfo) {
      navigate('/', { state: helpedPageInfo });
    } else if (previousLocation) {
      navigate(previousLocation.pathname, { state: previousLocation.state });
    } else {
      navigate('/');
    }
  };

  // Effect to set previous location based on helpedPageInfo
  useEffect(() => {
    if (helpedPageInfo) {
      setPreviousLocation('/');
    } else {
      setPreviousLocation(location);
    }
  }, [helpedPageInfo, location]);

  // Show or hide buttons based on page number
  useEffect(() => {
    if (page === 0) {
      setShowButton(false);
      setShowBackbtn(false);
    } else if (page === 1) {
      setShowButton(false);
    } else if (page === 8) {
      setShowButton(false);
    } else if (page === 9) {
      setShowButton(false);
    } else if (page === 10) {
      setShowButton(false);
      setShowBackbtn(false);
    } else if (page === 11) {
      setShowButton(false);
    } else if (page === 13) {
      setShowButton(false);
    } else if (page === 14) {
      setShowButton(false);
    } else if (page === 16) {
      setShowButton(false);
    } else if (page === 18) {
      setShowButton(false);
    } else if (page === 19) {
      setShowButton(false);
    } else if (page === 20) {
      setShowButton(false);
    } else if (page === 23) {
      setShowButton(false);
    } else if (location.pathname === "/WritingQuestionPara") {
      setShowButton(false);
    } else {
      setShowButton(true);
      setShowBackbtn(true);
    }
  }, [page]);

  // Handle help button click
  const onhandleHelp = () => {
    const helpInfo = {
      page: page,
      pageNumber: pageNumber,
      heading: heading,
    };

    setHelpedPageInfo(helpInfo);

    // Navigate to different help pages based on page number
    switch (page) {
      case 2:
        navigate('/ListeningHelp', {
          state: { showReturn: true, questionType: 'Help:   Directions', pageTitle: 'How to Answer:', img: readingblankbox },
        });
        break;
      case 3:
      case 4:
      case 5:
        navigate('/ListeningHelp', {
          state: { showReturn: true, questionType: 'Help:    Multiple-Choice Questions', pageTitle: 'no', img: listeningHelp },
        });
        break;
      case 6:
        navigate('/ListeningHelp', {
          state: { showReturn: true, questionType: 'Help:    Insert Sentence', pageTitle: 'no', img: readingblckbox },
        });
        break;
      case 7:
        navigate('/ListeningHelp', {
          state: { showReturn: true, questionType: 'Help:    Multiple-Choice Questions', pageTitle: 'no', img: readingsqbox },
        });
        break;
      case 22:
      case 23:
      case 24:
        navigate('/ListeningHelp', {
          state: { showReturn: true, questionType: 'Help:    Writing', pageTitle: 'no', img: writinghelp },
        });
        break;
      default:
        break;
    }

    setPreviousLocation(location);
  };

  // Handle form submission
  const handleSubmit = () => {
    navigate('/submissionConfirmation');
  };

  // Handle review button click
  const handleReview = () => {
    navigate('/reviewQuestions');
  };

  // Format time into mm:ss format
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Toggle timer visibility
  const changeState = () => {
    setShowValue(!showValue);
  };

  return (
    <div className="header-wrap">
      <Navbar bg="light" expand="sm" className="navbar-headspace">
        <Container >
          <Row className="w-100 align-items-center">
            <Col sm={2} md={2} lg={4} xl={4}>
              <a className="nav-logo" href="#home">
                <img src={Logo} alt="logo" className="img-fluid" />
              </a>
            </Col>
            {/* <Col sm={3} md={3} lg={3} xl={3}>
              <div className={`timer-section ${!showPageNumber ? 'hide' : ''}`}>
                <p className={`question-headline ${!showPageNumber ? 'hide' : ''}`}>
                  {heading} Page {pageNumber} of 35</p>
              </div>
            </Col>
            <Col sm={12} md={12} lg={5} xl={5}>
              {pageNumber !== 35 && (
                <div className="exam-controller-btns">
                  {showRangeBar && (<input
                    type="range"
                    min="0"
                    max="100"
                    onChange={handleVolumeChange}
                  />
                  )}
                  <Button className="nav-btn common-control-btn" onClick={() => setShowRangeBar(!showRangeBar)} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-volume-up" viewBox="0 0 16 16">
                      <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                      <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                      <path d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z" />
                    </svg>
                  </Button>
                  {showButton ? (
                    <>
                      <Button className="nav-btn common-control-btn">
                        OK
                      </Button>
                      {location?.state?.showReturn ? (<Button className="nav-btn common-control-btn" onClick={navigateBack}>
                        Return to Question
                      </Button>) : (
                        <>
                          <Button className="nav-btn common-control-btn" onClick={onhandleHelp}>
                            Help
                          </Button>
                          {showBackbtn && (
                            <Button
                              id="backbtn"
                              onClick={decrement}
                              className="nav-btn common-control-btn"
                            >
                              Back
                            </Button>)
                          }
                          <Button onClick={increment} className="nav-btn common-control-btn">
                            Next
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <Button onClick={increment} className="nav-btn common-control-btn">
                      Continue
                    </Button>
                  )}
                </div>
              )}
            </Col> */}
          </Row>
        </Container>
      </Navbar>
      <div className="brand-bar"></div>
      {/* <div className="bottom-box-shadow">
        {!location?.state?.showReturn && (
          <div className="left-button-wrap">
            <Button className="nav-btn common-control-btn" onClick={handleSubmit}>
              Save & Exit
            </Button>
            <Button className="nav-btn common-control-btn" onClick={handleReview}>
              Review Question
            </Button>
          </div>
        )}
        <div className="timer-btns">
          {!hiddenTimerPages.includes(pageNumber) && (
            <>
              {showValue ? <p>{formatTime(seconds)}</p> : null}
              {show ? (
                <Button onClick={changeState} className="show-ans-btn1">
                  Hide
                </Button>
              ) : (
                <Button onClick={changeState} className="show-ans-btn1">
                  Show
                </Button>
              )}
            </>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default Header;
