# remark-imagetools

[![Build][build-badge]][build]
[![StandWithUkraine][ukraine-svg]][ukraine-readme]

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Usage](#usage)
* [Configuration](#configuration)
* [Examples](#examples)
* [Contributing](#contributing)
* [Thanks](#thanks)
* [License](#license)


## What is this?

This plugin is part of the [remark] plugin infrastructure and meant to be used in conjunction with [imagetools] from [Jonas Kruckenberg](https://github.com/JonasKruckenberg).
A typical use case would be writing [Markdown] content using the [mdsvex] plugin for [svelte]. Let's say you want to use an image _desert.webp_ with a certain width. Doing this with [imagetools] is quite easy:

```markdown
---
title: example
---
<script>
    import desertpic from './desert.jpg?w=400&format=webp';
</script>

![Nice desert picture]({desertpic.src})
```

Looks simple enough but I thought this could be better. Creating the URL might become cumbersome and doesn't look very nice. In addition to that you have to put this _script_ block in there.

This is where the _remark-imagetools_ plugin comes into play. If you add it to the list of [remark] plugins you can change the above code to this:

```markdown
---
title: example
images:
    - name: desertpic
      width: 400
      format: webp
---

![Nice desert picture]({desertpic.src})
```

This is much more readable and we got rid of the _script_ block. However we can go much further as you typically have similar requirements for all of your images.
That's where you can provide presets with the initialization of the plugin.
The code than can be simplified even further (assuming the existence of a profile _mobile_):

```markdown
---
title: example
images:
    - name: desertpic
      preset: mobile
---

![Nice desert picture]({desertpic.src})
```

In addition to that you can just make your changes to the preset in case you are making design changes. So there is no need to go through all the URLs.


## When should I use this?

Mostly if you want to use images in multiple variations without the need to setup a corresponding toolchain. [imagetools] makes this process pretty straight forward.
Furthermore it's meant to be used in conjunction with [Markdown] and the [svelte] extension [mdsvex] is a perfect fit for this.


## Install

This package is [ESM only][esmonly]. In Node.js (version 18+), install with [pnpm]:

```js
pnpm i -D @kasisoft/remark-imagetools
```


## Usage

* Setup your _Svelte_ project and install _mdsvex_ (see [mdsvexdocs])
* Your project will now contain a file named __mdsvex.config.js__.
    * Import the plugin:
        ```js
        import { Debug, remarkImagetools } from '@kasisoft/remark-imagetools';
        ```
    * Update the array of _remark_ plugins without a configuration:
        ```js
        const config = defineConfig({
            ...
            remarkPlugins: [remarkImagetools],
            ...
        });
        ```
    * with a configuration (note: each entry is a list here):
        ```js
        const myconfig = {
            debug: Debug.All,
            presets: [
                {
                    name: "mobile",
                    width: 400,
                    format: webp

                },
                {
                    name: "sourceset",
                    width: [100, 200, 400],
                    format: webp
                }
            ]
        };
        const config = defineConfig({
            ...
            remarkPlugins: [
                [remarkImagetools, myconfig]
            ],
            ...
        });
        ```

### Configuration

The configuration is fully typed using [Typescript].
__ImagetoolsOptions__ is defined as followed:

```typescript
export interface ImageConfigPreset {

    /* The name for this preset. Must be unique. */
    name     : string;

    /* The width(s) to use for the images. */
    width?   : number | number[];

    /* The height(s) to use for the images. */
    height?  : number | number[];

    /* Options allowing to do some image manipulations. */
    options? : string | string[],

    /* The file format to use */
    format?  : 'heic' | 'heif' |'avif' | 'jpeg' | 'jpg' | 'png' | 'tiff' | 'webp' | 'gif';

} /* ENDINTERFACE */


export interface ImagetoolsOptions {

    /* Debug.{None, Default, RootBefore, RootAfter, ScriptBefore, ScriptAfter, All}
     * It's okay to use a list of string values for the debugging levels.
     * For instance: ['RootBefore', 'RootAfter']
     */
    debug              : Debug | string[];

    /* Generate ts lang attribute for non existent script nodes */
    scriptTS?           : boolean;

    /* The name for the images property in the frontmatter. Default to 'images' */
    attributeName?      : string;

    presets?            : ImageConfigPreset[];

} /* ENDINTERFACE */
```

* __debug__ : Debug - Combine flags of __Debug__ in order to generate debug statements:
  * Debug.None: no output (just a convenience value)
  * Debug.Default: some basic output
  * Debug.RootBefore: prints the ast before the transformation
  * Debug.RootAfter: prints the ast after the transformation
  * Debug.ScriptBefore: prints the script node before the transformation
  * Debug.ScriptAfter: prints the script node after the transformation
  * Debug.All: enables all outputs (convenience value)
  * Using an array of strings representing these debug settings is also possible. For instance:
    * ['ScriptBefore', 'RootAfter']
* __scriptTS__ : boolean - By default a ```lang="ts"``` will be added to each create __script__ tag. If set to __false__ this won't happen.
* __attributeName__: The name of the attribute within the frontmatter which defaults to _images_.
* __presets__: A list of presets essentially providing named configurations.


## Examples

You can find an example project with various use cases here:

* https://github.com/kasisoft/remark-imagetools-example



## Contributing

If you want to contribute I'm happy for any kind of feedback or bug reports.
Please create issues and pull requests as you like but be aware that it may take some time
for me to react.


## Thanks

* [Svelte] - For providing a great, fast and easy comprehensible framework.
* [MSDVEX][mdsvex] - For the nice intergration of _Markdown_ in _Svelte_
+ [imagetools] - For a great tool simplifying the use of image variations.
* [remark] - For a great platform to modify/transform the content.


## License

[MIT][license] © [Kasisoft.com](https://kasisoft.com) - <daniel.kasmeroglu@kasisoft.com>


<!-- Definitions -->

[build]: https://github.com/kasisoft/remark-imagetools/actions
[build-badge]: https://github.com/kasisoft/remark-imagetools/actions/workflows/remark-imagetools.yml/badge.svg

[esmonly]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[license]: https://github.com/kasisoft/remark-svelte-auto-import/blob/main/license
[markdown]: https://markdown.de/
[imagetools]: https://github.com/JonasKruckenberg/imagetools/tree/main
[mdsvex]: https://mdsvex.com
[mdsvexdocs]: https://mdsvex.com/docs
[pnpm]: https://pnpm.io/
[remark]: https://github.com/remarkjs
[svelte]: https://svelte.dev/
[typescript]: https://www.typescriptlang.org/

[ukraine-readme]: https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md
[ukraine-svg]: https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg
