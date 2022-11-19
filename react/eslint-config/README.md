# `@godinho/react18-eslint-config`

Eslint config for TS and React projects.

Based on LBHackney-IT work, @hackney/eslint-config:1.4.1

## Installation

```bash
npm install @godinho/react-eslint-config -D
yarn add @godinho/react-eslint-config -D
```

Add the library dependencies

```bash
yarn add @typescript-eslint/eslint-plugin eslint eslinit-config-airbnb eslint-config-airbnb-typescript eslint-config-prettier eslint-config-react eslint-plugin-import eslint-plugin-jest eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-testing-library prettier -D
```

## Usage

For React based projects configure a `.eslintrc` file:

```json
{
  "extends": "@godinho/react-eslint-config"
}
```

For non React based TS projects:

```json
{
  "extends": "@godinho/react-eslint-config/base"
}
```
