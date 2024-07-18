import React from 'react'
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import rootReducer from './redux/reducer/rootReducer';
import { VolumeProvider } from './context/VolumeContext';
import Header from './Components/Header';
import GeneralTestInfo from './Components/Guidance/GeneralTestInfo';
import ReadingDirection from './Components/Guidance/ReadingDirection';
import Reading from './views/PracticeTest/Reading';
import EndOfSection from './Components/Guidance/EndOfSection';
// import VolumeDirections from './Components/Guidance/VolumeDirections';
// import Listening from './views/PracticeTest/Listening';
// import PutOnHeadset from './Components/Guidance/PutOnHeadset';
// import SpeakingDirection from './Components/Guidance/SpeakingDirection';
// import Speaking from './views/PracticeTest/Speaking';
// import WritingDirection from './Components/Guidance/WritingDirection';
// import Writing from './views/PracticeTest/Writing';
// import ResultView from './views/ResultView';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default function Routing() {
    return (
        <Provider store={store}>
          <VolumeProvider>
            <Router>
              <Header />
              <Routes>
                <Route path="/" element={<GeneralTestInfo />} />
                <Route path="/reading-direction" element={<ReadingDirection />} />
                <Route path="/reading" element={<Reading />} />
                <Route path="/end-of-section" element={<EndOfSection />} />
                {/*<Route path="/volume-directions" element={<VolumeDirections />} />
                <Route path="/listening" element={<Listening />} />
                <Route path="/put-on-headset" element={<PutOnHeadset />} />
                <Route path="/speaking-direction" element={<SpeakingDirection />} />
                <Route path="/speaking" element={<Speaking />} />
                <Route path="/writing-direction" element={<WritingDirection />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/result-view" element={<ResultView />} /> */}
              </Routes>
            </Router>
          </VolumeProvider>
        </Provider>
      );
}
