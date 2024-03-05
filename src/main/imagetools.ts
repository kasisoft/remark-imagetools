import { debug, warn } from '$main/log';
import { ImageConfig, ImageConfigPreset, ImagetoolsOptions } from '$main/datatypes';

function randomNumberString(): string {
    const value = Math.ceil(Math.random() * 100000);
    return value.toString();
}

function isSourceset(cfg: ImageConfig): boolean {
    return Array.isArray(cfg.width) || Array.isArray(cfg.height);
}

function getPreset(config: ImagetoolsOptions, preset?: string): ImageConfigPreset | null {
    if (preset && config.presets) {
        const list = config.presets.filter(p => p.name == preset);
        if (list.length > 0) {
            return list[0];
        }
    }
    if (preset) {
        warn(`Referred preset '${preset}' has not been provided !`);
    }
    return null;
}

function numbersToString(value: number | number[]): string {
    if (Array.isArray(value)) {
        const v: number[] = value;
        if (v.length == 1) {
            return v[0].toString();
        }
        return v.map(i => i.toString()).reduce((a, b) => `${a};${b}`);
    } else {
        return value.toString();
    }
}

function buildOptionParams(options: string | string[]): string {
    if (Array.isArray(options)) {
        return options.reduce((a, b) => `${a}&${b}`, '');
    }
    if (options.length > 0) {
        return '&' + options;
    }
    return '';
}

function buildUrl(cfg: ImageConfig): string {
    let result: string = '';
    if (cfg.height) {
        result = `&h=${numbersToString(cfg.height)}`;
    }
    if (cfg.width) {
        result = `${result}&w=${numbersToString(cfg.width)}`;
    }
    if (cfg.format) {
        result = `${result}&format=${cfg.format}`;
    }
    if (cfg.options) {
        result = `${result}${buildOptionParams(cfg.options)}`;
    }
    if (isSourceset(cfg)) {
        result = `${result}&as=srcset`;
    }
    if (result.length > 0) {
        result = result.substring(1);
        result = `${cfg.image}?${result}&as=metadata`;
    } else {
        result = `${cfg.image}?as=metadata`;
    }
    debug(`${JSON.stringify(cfg)} => '${result}'`);
    return result;
}

// the user used arrays to indicate a sourceset and thus expects an 
// array per image. however if imagetools only generates one image it
// returns one object for this image and not an array. 
// therefore we're testing this usecase to artificially create
// an array wrapping if necessary.
function needsArrayWrapping(config: ImageConfig): boolean {
    if (!isSourceset(config)) {
        return false;
    }
    if (Array.isArray(config.width) && (config.width.length > 1)) {
        return false;
    }
    if (Array.isArray(config.height) && (config.height.length > 1)) {
        return false;
    }
    // it's a sourceset but only one image will come out as one object, so we want 
    // to put it into an array
    return true;
}

function buildScript(config: ImagetoolsOptions, decl: ImageConfig): string {
    const preset               = getPreset(config, decl.preset);
    const joined: ImageConfig  = { ...(preset ?? {}), ...decl };
    const url                  = buildUrl(joined);
    const wrap                 = needsArrayWrapping(joined);
    if (wrap) {
        const suffix = randomNumberString();
        return `
import ${joined.name}_${suffix} from '${url}';
const ${joined.name} = [ ${joined.name}_${suffix} ];
`;
    } else {
        return `import ${joined.name} from '${url}';\n`;
    }    
}

export function buildScriptBlock(config: ImagetoolsOptions, decls: ImageConfig[]): string | null {
    const importlines = decls.map(decl => buildScript(config, decl));
    if (importlines.length == 1) {
        return importlines[0].trim();
    } else if (importlines.length > 1) {
        return importlines.map(a => a.trim()).reduce((a, b) => `${a}${b}`).trim();
    }
    return null;
}
