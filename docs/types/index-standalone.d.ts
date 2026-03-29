import { EditorState } from './lib/editor-state';
import { ReactComponentLike } from 'prop-types';
export { EditorState, type EditorStateParams } from './lib/editor-state';
export { type AccountMenuOptions } from './lib/account-menu-options';
export { setAppElement } from 'react-modal';
export * from './gui-config';
export * from './exported-reducers';
export * from 'scratch-storage';
export { default as buildDefaultProject } from './lib/default-project';
export type GUIProps = any;
export type HigherOrderComponent = (component: ReactComponentLike) => ReactComponentLike;
/**
 * Creates a "root" for the editor to be hosted in.
 * @param {EditorState} state The editor state. Create by new-ing EditorState.
 * @param {HTMLElement} container The container the editor should be hosted under.
 * @param root0
 * @param root0.wrappers
 * @returns {{ render: function(props: GUIProps): void, unmount: function(): void }} The mounted root.
 */
export declare const createStandaloneRoot: (state: EditorState, container: HTMLElement, { wrappers }?: {
    wrappers?: HigherOrderComponent[];
}) => {
    render(props: GUIProps): void;
    unmount(): void;
};
