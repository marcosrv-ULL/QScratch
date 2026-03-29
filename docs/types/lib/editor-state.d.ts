import { Store } from 'redux';
import { GUIConfig } from '../gui-config';
export interface EditorStateParams {
    localesOnly?: boolean;
    isFullScreen?: boolean;
    isPlayerOnly?: boolean;
    showTelemetryModal?: boolean;
    isEmbedded?: boolean;
    locale?: string;
}
/**
 * Manages an editor's Redux state.
 *
 * To be used in tandem with an AppStateHOC component to be provided to the editor.
 */
export declare class EditorState {
    /**
     * The redux store that this class wraps.
     */
    readonly store: Store<unknown>;
    constructor(params: EditorStateParams, configFactory: () => GUIConfig);
    dispatch(action: any): void;
}
