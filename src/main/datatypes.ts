import { ArkErrors, type } from 'arktype';

import { error } from '$main/log';

export enum Debug {
    None         = 0,
    Default      = 1 << 0,
    RootBefore   = 1 << 1,
    RootAfter    = 1 << 2,
    ScriptBefore = 1 << 3,
    ScriptAfter  = 1 << 4,
    All          = Default | RootBefore | RootAfter
} /* ENDENUM */

export function parseDebug(val: any): number {
    if (typeof val === 'string') {
        switch (val) {
            case 'None': return Debug.None;
            case 'Default': return Debug.Default;
            case 'RootBefore': return Debug.RootBefore;
            case 'RootAfter': return Debug.RootAfter;
            case 'ScriptBefore': return Debug.ScriptBefore;
            case 'ScriptAfter': return Debug.ScriptAfter;
            case 'All': return Debug.All;
        }
    } else if (Array.isArray(val)) {
        const asArray: string[] = val;
        return asArray.map(v => parseDebug(v)).reduce((a, b) => a | b, 0);
    }
    // we know from arktype that it's a number
    return val as number;
}


/** @todo [07-01-2024:KASI]   Figure out a way to combine ImageConfigPresetDef and ImageConfigDef ! */

const ImageConfigPresetDef = type({
    "name"     : "0<string<64",
    "width?"   : "number | number[]",
    "height?"  : "number | number[]",
    "options?" : "string | string[]",
    // @see https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md#format
    "format?"  : "'heic'|'heif'|'avif'|'jpeg'|'jpg'|'png'|'tiff'|'webp'|'gif'"
});


export const ImageConfigDef = type({
    "name"     : "0<string<64",
    "width?"   : "number | number[]",
    "height?"  : "number | number[]",
    "options?" : "string | string[]",
    // @see https://github.com/JonasKruckenberg/imagetools/blob/main/docs/directives.md#format
    "format?"  : "'heic'|'heif'|'avif'|'jpeg'|'jpg'|'png'|'tiff'|'webp'|'gif'",

    "preset?"  : "0<string<64",
    "image"    : "string",
});


export const ImagetoolsOptionsDef = type({

    /* collection of presets used overall */
    "presets?"      : ImageConfigPresetDef.array(),

    /* the attribute of the markdown providing the images */
    "attributeName?": "string",
    "debug"         : ["(number|'None'|'Default'|'RootBefore'|'RootAfter'|'ScriptBefore'|'ScriptAfter'|'All'|string[])", "=>", parseDebug],

    /* generate ts lang attribute for non existent script nodes */
    "scriptTS?"     : "boolean"

});


export type ImageConfigPreset = typeof ImageConfigPresetDef.infer;

export type ImageConfig       = typeof ImageConfigDef.infer;

export type ImagetoolsOptions = typeof ImagetoolsOptionsDef.infer;


function newObject<T>(obj: any, constructor: (value: any) => T | ArkErrors): T {
    const result = constructor(obj);
    if (result instanceof type.errors) {
        const asText = JSON.stringify(result as ArkErrors);
        error("Failed to validate obj: " + asText);
        throw Error(asText);
    }
    return result as T;
}

export function newImageConfigs(obj: any): ImageConfig[] {
    return newObject(obj, ImageConfigDef.array());
}

export function newImagetoolsOptions(obj: any): ImagetoolsOptions {
    return newObject(obj, ImagetoolsOptionsDef);
}
