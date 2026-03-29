import PropTypes from 'prop-types';
import { ScratchStorage } from 'scratch-storage';
export type GUIConfigFactory = () => GUIConfig;
export type ProjectId = string | number;
export interface GUIConfig {
    storage: GUIStorage;
}
export interface GUIStorage {
    scratchStorage: ScratchStorage;
    setProjectHost?(host: string): void;
    setProjectToken?(token: string): void;
    setProjectMetadata?(projectId: string | null | undefined): void;
    setAssetHost?(host: string): void;
    setTranslatorFunction?(formatMessageFn: TranslatorFunction): void;
    setBackpackHost?(host: string): void;
    saveProject(projectId: ProjectId | null | undefined, vmState: string, params: {
        originalId?: ProjectId;
        isCopy?: boolean | 1;
        isRemix?: boolean | 1;
        title?: string;
    }): Promise<{
        id: ProjectId;
    }>;
    saveProjectThumbnail?(projectId: ProjectId, thumbnail: Blob): void;
}
export type TranslatorFunction = (msgObj: MessageObject, options?: {
    index: number;
}) => string;
export interface MessageObject {
    id: string;
    description: string;
    defaultMessage: string;
}
export declare const GUIStoragePropType: PropTypes.Requireable<PropTypes.InferProps<{
    scratchStorage: PropTypes.Validator<object>;
    setProjectHost: PropTypes.Requireable<(...args: any[]) => any>;
    setProjectToken: PropTypes.Requireable<(...args: any[]) => any>;
    setProjectMetadata: PropTypes.Requireable<(...args: any[]) => any>;
    setAssetHost: PropTypes.Requireable<(...args: any[]) => any>;
    setTranslatorFunction: PropTypes.Requireable<(...args: any[]) => any>;
    setBackpackHost: PropTypes.Requireable<(...args: any[]) => any>;
    saveProject: PropTypes.Validator<(...args: any[]) => any>;
    saveProjectThumbnail: PropTypes.Requireable<(...args: any[]) => any>;
}>>;
