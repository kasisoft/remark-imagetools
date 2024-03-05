import { Parent } from 'unist';

export enum Debug {
    None         = 0,
    Default      = 1 << 0,
    RootBefore   = 1 << 1,
    RootAfter    = 1 << 2,
    ScriptBefore = 1 << 3,
    ScriptAfter  = 1 << 4,
    All          = Default | RootBefore | RootAfter
} /* ENDENUM */

export interface ImageConfigPreset {
    name: string,
    width?: number | number[],
    height?: number | number[],
    options?: string | string[],
    format?: 'heic' | 'heif' |'avif' | 'jpeg' | 'jpg' | 'png' | 'tiff' | 'webp' | 'gif'
} /* ENDINTERFACE */

export interface ImageConfig extends ImageConfigPreset {
    preset?: string,
    image: string
} /* ENDINTERFACE */

export interface ImagetoolsOptions {

    /* collection of presets used overall */
    presets?: ImageConfigPreset[],

    /* the attribute of the markdown providing the images */
    attributeName?: string,

    debug: Debug | 'None' | 'Default' | 'RootBefore' | 'RootAfter' | 'All',

    /* generate ts lang attribute for non existent script nodes */
    scriptTS?: boolean

} /* ENDINTERFACE */


export function remarkImagetools(options?: ImagetoolsOptions): (tree: Parent) => void;
