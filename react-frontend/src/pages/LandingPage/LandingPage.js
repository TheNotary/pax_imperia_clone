import { useContext } from 'react';
import LandingPageOptions from './LandingPageOptions';

const LandingPage = () => {

  return (
    <div className="page-wrap">
      <div id="generic-app-parent" className="title-screen">
        <div className="wrap-block"></div>
        <div className="landing-menu">
          <div className="branding">
            <h1>Pax Imperia</h1>
            <h3>Eminent Domain</h3>
          </div>

          <LandingPageOptions />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
