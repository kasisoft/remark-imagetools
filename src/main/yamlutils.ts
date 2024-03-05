import jsyaml from 'js-yaml';

import { debug, error } from '$main/log';

export function loadYaml(content: string): any | null {
    try {
        return jsyaml.load(content);
    } catch (err) {
        error('Couldn\'t load yaml ! ', err);
        debug('Failing yaml content: ', content);
        return null;
    }
}
