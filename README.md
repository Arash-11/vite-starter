# vite-starter

A CLI tool to create boilerplate for vanilla TS + SCSS projects using Vite.

To get started, just run `npx vite-starter <your-project-name>`!

Ensure that your Node environment meets Vite's requirements. As mentioned [here](https://vitejs.dev/guide/#scaffolding-your-first-vite-project):

>Vite requires Node.js version 14.18+, 16+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.

<br>

The tool currently does the following:

- Uses Vite to generate a vanilla TypeScript project.
- Installs Sass and other required dependencies.
- Removes some extra files to clean up.
- Adds a `styles` directory in `src` which includes the SCSS boilerplate to build upon.
