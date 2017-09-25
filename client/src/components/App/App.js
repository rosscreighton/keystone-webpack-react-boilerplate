import React from 'react';
import { Router } from 'preact-router';
import LandingPage from '../LandingPage';
import CaseStudiesPage from '../CaseStudiesPage';
import CompanyPage from '../CompanyPage';
import ContactPage from '../ContactPage';
import CareersPage from '../CareersPage';

export default function App() {
  return (
    <div>
      <ul>
        <li><a href="/">home</a></li>
        <li><a href="/case-studies">case studies</a></li>
        <li><a href="/company">company</a></li>
        <li><a href="/contact">contact</a></li>
        <li><a href="/careers">careers</a></li>
      </ul>
      <Router>
        <LandingPage path="/" />
        <CaseStudiesPage path="/case-studies" />
        <CompanyPage path="/company" />
        <ContactPage path="/contact" />
        <CareersPage path="/careers" />
      </Router>
    </div>
  );
}
