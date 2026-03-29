// Polyfills

// Intercept native Web Worker to fix hardcoded absolute paths in external dependencies
const OriginalWorker = window.Worker;

window.Worker = function(stringUrl, options) {
    if (typeof stringUrl === 'string') {
        // Redirect storage fetch worker
        if (stringUrl.startsWith('/chunks/fetch-worker')) {
            stringUrl = '/QScratch' + stringUrl;
        } 
        // Redirect VM extension worker
        else if (stringUrl === '/extension-worker.js') {
            stringUrl = '/QScratch/extension-worker.js';
        }
    }
    
    return new OriginalWorker(stringUrl, options);
};

import 'es6-object-assign/auto';
import 'core-js/fn/array/includes';
import 'core-js/fn/promise/finally';
import 'intl'; // For Safari 9

import React from 'react';
import ReactDomClient from 'react-dom/client';

import AppStateHOC from '../lib/app-state-hoc.jsx';
import BrowserModalComponent from '../components/browser-modal/browser-modal.jsx';
import supportedBrowser from '../lib/supported-browser';
import '../lib/quantum_messages.js'; // <--- Agrega esto

import styles from './index.css';

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);

if (supportedBrowser()) {
    // require needed here to avoid importing unsupported browser-crashing code
    // at the top level
    require('./render-gui.jsx').default(appTarget);

} else {
    BrowserModalComponent.setAppElement(appTarget);
    const WrappedBrowserModalComponent = AppStateHOC(BrowserModalComponent, true /* localesOnly */);
    const handleBack = () => {};
    const root = ReactDomClient.createRoot(appTarget);
    // eslint-disable-next-line react/jsx-no-bind
    root.render(<WrappedBrowserModalComponent onBack={handleBack} />);
}
