import { expect, test } from 'vitest'

import { buildScriptBlock } from '$main/imagetools';
import { ImageConfig, newImagetoolsOptions } from '$main/datatypes';
import { getYamlResource } from '$test/testutils';


const CFG_GLOBAL               = newImagetoolsOptions(getYamlResource('imagetools/options.yaml'));
const TESTS_BUILD_SCRIPT_BLOCK = getYamlResource('imagetools/testcases.yaml');

for (const tc of TESTS_BUILD_SCRIPT_BLOCK) {
    test(`buildScriptBlock(${tc.key})`, () => {
        const scriptBlock = buildScriptBlock(CFG_GLOBAL, tc.images as ImageConfig[]);
        const text        = scriptBlock?.replace(/imageref_\d+/g, 'image_randomnum');
        expect(text).toBe(tc.expected);
    });
}
