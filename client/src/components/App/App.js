import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LandingPage from '../LandingPage';
import CaseStudiesPage from '../CaseStudiesPage';
import CompanyPage from '../CompanyPage';
import ContactPage from '../ContactPage';
import CareersPage from '../CareersPage';

export default function App() {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/">home</Link></li>
          <li><Link to="/case-studies">case Studies</Link></li>
          <li><Link to="/company">company</Link></li>
          <li><Link to="/contact">contact</Link></li>
          <li><Link to="/careers">careers</Link></li>
        </ul>
        <Route exact path="/" component={LandingPage} />
        <Route path="/case-studies" component={CaseStudiesPage} />
        <Route path="/company" component={CompanyPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/careers" component={CareersPage} />
      </div>
    </Router>
  );
}
