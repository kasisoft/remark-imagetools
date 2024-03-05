import { Parent } from 'unist';

import { debug, debugConfiguration, error } from '$main/log';
import { buildScriptBlock } from '$main/imagetools';
import { appendScriptText, getOrCreateScriptNode, locateFrontmatterNode, locateScriptNode } from '$main/astutils';
import { Debug, ImagetoolsOptions, newImageConfigs, newImagetoolsOptions } from '$main/datatypes';
import { loadYaml } from '$main/yamlutils';

export { Debug, ImageConfigPreset, ImageConfig, ImagetoolsOptions } from '$main/datatypes';

const DEFAULT_OPTIONS: ImagetoolsOptions = {
    debug           : Debug.None,
    scriptTS        : true,
    attributeName   : 'images'
};

// https://unifiedjs.com/learn/guide/create-a-plugin/
export function remarkImagetools(options: ImagetoolsOptions = DEFAULT_OPTIONS) {

    const config = newImagetoolsOptions({...DEFAULT_OPTIONS, ...options});
    if ((config.debug & Debug.Default) != 0) {
        debugConfiguration(DEFAULT_OPTIONS, options, config);
    }

    function impl(config: ImagetoolsOptions, tree: Parent) {

        const frontmatterNode = locateFrontmatterNode(tree);
        if (frontmatterNode == null) {
            // nothing to do here
            return;
        }

        if (!(typeof frontmatterNode.value === 'string')) {
            error("Failed to properly process frontmatter value:", frontmatterNode.value);
            return;
        }

        const frontmatter = loadYaml(frontmatterNode.value as string);
        if (frontmatter == null) {
            // an error happened (already reported as part of the loading function)
            return;
        }

        const scriptNode = getOrCreateScriptNode(tree, config.scriptTS ?? false);
        if (frontmatter.hasOwnProperty(config.attributeName)) {
            const imageConfigs = newImageConfigs(frontmatter[config.attributeName ?? 'images']);
            const scriptBlock  = buildScriptBlock(config, imageConfigs);
            if (scriptBlock != null) {
                appendScriptText(scriptNode, scriptBlock);
            }
        }

    }

    function logBefore(config: ImagetoolsOptions, tree: Parent) {
        if ((config.debug & Debug.RootBefore) != 0) {
            debug('Markdown Tree (before)', tree);
        }
        if ((config.debug & Debug.ScriptBefore) != 0) {
            debug('Script (before)', locateScriptNode(tree));
        }
    }

    function logAfter(config: ImagetoolsOptions, tree: Parent) {
        if ((config.debug & Debug.ScriptAfter) != 0) {
            debug('Script (after)', locateScriptNode(tree));
        }

        if ((config.debug & Debug.RootAfter) != 0) {
            debug('Markdown Tree (after)', tree);
        }
    }

    return function (tree: Parent) {
        logBefore(config, tree);
        impl(config, tree);
        logAfter(config, tree);
    }

}
