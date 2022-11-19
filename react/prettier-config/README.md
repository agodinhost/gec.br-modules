# `@godinho/prettier-config`

A configuration for prettier, to create consistancy across multiple projects.

## Usage

Install package as a dev dependency:

```
npm install @godinho/prettier-config -D
// or
yarn add @godinho/prettier-config -D
```

Create a `.prettierrc.js` file in the root of your project.

```js
const prettierConfig = require("@godinho/prettier-config");

module.exports = prettierConfig;
```

To apply overrides of any of the options:

```js
const prettierConfig = require("@godinho/prettier-config");

module.exports = {
  ...prettierConfig,
  semi: false,
};
```
