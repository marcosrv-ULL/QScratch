import {buildInitialState} from './reducers/gui';
import {legacyConfig} from './legacy-config';

export {default} from './containers/gui.jsx';
export {default as GUIComponent} from './components/gui/gui.jsx';
export {default as AppStateHOC} from './lib/app-state-hoc.jsx';
export {setAppElement} from 'react-modal';

export {legacyConfig};
export const guiInitialState = buildInitialState(legacyConfig);

export * from './exported-reducers';

// Intercept native Web Worker to fix hardcoded absolute paths in external dependencies
const OriginalWorker = window.Worker;

(window as any).Worker = function(stringUrl, options) {
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

// If using TypeScript and it complains about the override, use this alternative:
// (window as any).Worker = function(stringUrl: string | URL, options?: WorkerOptions) { ... }
