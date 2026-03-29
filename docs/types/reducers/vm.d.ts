import { GUIConfig } from '../gui-config';
declare const createVM: (config: GUIConfig) => any;
declare const reducer: (state: any, action: any) => any;
declare const setVM: (vm: any) => {
    type: string;
    vm: any;
};
export { reducer as default, createVM as vmInitialState, setVM };
