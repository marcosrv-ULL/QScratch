import { ScratchStorage } from 'scratch-storage';
import { GUIStorage, TranslatorFunction } from '../gui-config';
export declare class LegacyStorage implements GUIStorage {
    private projectHost?;
    private projectToken?;
    private assetHost?;
    private backpackHost?;
    private translator?;
    readonly scratchStorage: ScratchStorage;
    constructor();
    setProjectHost(host: string): void;
    setProjectToken(token: string): void;
    setProjectMetadata(projectId: string | null | undefined): void;
    setAssetHost(host: string): void;
    setTranslatorFunction(translator: TranslatorFunction): void;
    setBackpackHost(host: string): void;
    saveProject(projectId: number, vmState: string, params: {
        originalId: string;
        isCopy: boolean;
        isRemix: boolean;
        title: string;
    }): Promise<{
        id: string | number;
    }>;
    private cacheDefaultProject;
    private addOfficialScratchWebStores;
    private getProjectGetConfig;
    private getProjectCreateConfig;
    private getProjectUpdateConfig;
    private getAssetGetConfig;
    private getAssetCreateConfig;
    private getBackpackAssetURL;
}
