<p align="center"><img src="https://i0.wp.com/www.primefaces.org/wp-content/uploads/2017/09/feature-react.png?ssl=1" width="224px"/>

<p align="center">
<a href="https://github.com/TimCrooker/Grit/releases" target="_blank">
<img src="https://img.shields.io/github/package-json/v/TimCrooker/Grit?style=for-the-badge" alt="cli version" />
</a>
&nbsp;
<a href="https://www.npmjs.com/package/grit-cli" target="_blank">
<img src="https://img.shields.io/npm/dw/grit-cli?style=for-the-badge" alt="npm downloads" />
</a>
&nbsp;
<a href="https://www.npmjs.com/package/grit-cli" target="_blank">
<img src="https://img.shields.io/github/stars/TimCrooker/grit?style=for-the-badge" alt="github stars" />
</a>
&nbsp;
<img src="https://img.shields.io/circleci/build/github/TimCrooker/Grit/master?color=green&style=for-the-badge" alt="circle ci tests" />
&nbsp;
<img src="https://img.shields.io/npm/l/grit-cli?style=for-the-badge" alt="license" />
</h1>

## Overview

This tool is awesome. Write some more stuff here

## Installation

The Grit CLI needs to be installed globally on your machine

```bash
npm install -g grit-cli
```

## Running a generator

Use any grit-generator to scaffold out new projects or inject code into existing projects.

```bash
grit [generator] [outDir]
```

Example:

```bash
grit react my-new-react-project
```

This example uses [grit-react](https://github.com/TimCrooker/grit-generator) to build a new React project into the `my-grit-generator` directory

| Argument    | Description                                                         | Default     | Required? |
| ----------- | ------------------------------------------------------------------- | ----------- | --------- |
| [generator] | The generator to run. Can be NPM package, github repo, or local dir | none        | no        |
| [outDir]    | Can be the name of the output directory or a path to it             | working dir | no        |

## Documentation

The best way to explore all the features of **Grit** is to read the project [Documentation](https://timcrooker.github.io/Grit/)

## Commands & Options

### `grit`

Use a generator to create a new project with the interactive console UI.

```bash
grit create [OPTION]
```

| Option | Description                                              | Type   | Default | Required? |
| ------ | -------------------------------------------------------- | ------ | ------- | --------- |
| `-t`   | Enables to define custom backend and frontend templates. | `bool` | `false` | No        |

## Project assistance

If you want to help out and/or support development of `Grit`:

- Add a [GitHub Star](https://github.com/TimCrooker/Grit) to the project.
- Publish [your own generators](https://github.com/TimCrooker/awesome-grit) for the community to use
- Submit a pull request on [GitHub](https://github.com/TimCrooker/Grit/pulls)
- Write interesting articles about project on [Dev.to](https://dev.to/), [Medium](https://medium.com/) or personal blog.

[awesome-grit](https://github.com/TimCrooker/awesome-grit)

## License

`Grit` is free and open-source MIT licensed software.
