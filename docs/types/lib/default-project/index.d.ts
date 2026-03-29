import { TranslatorFunction } from '../../gui-config';
declare const defaultProject: (translator?: TranslatorFunction) => ({
    id: number;
    assetType: string;
    dataFormat: string;
    data: string;
} | {
    id: string;
    assetType: string;
    dataFormat: string;
    data: Uint8Array<ArrayBuffer>;
})[];
export default defaultProject;
