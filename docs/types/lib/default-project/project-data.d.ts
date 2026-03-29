import { TranslatorFunction } from '../../gui-config';
/**
 * Generate a localized version of the default project
 * @param {function} translateFunction a function to use for translating the default names
 * @returns {object} the project data json for the default project
 */
declare const projectData: (translateFunction?: TranslatorFunction) => object;
export default projectData;
