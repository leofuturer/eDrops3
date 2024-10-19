# components

This package contains shared UI components as well as corresponding Storybook stories for each component.

The principle philosophy is that all of these components should be visual only and have no functionality directly associated with them (other than exposing handlers for actions such as for a button component). This package should not import any other dependencies other than React, TailwindCSS, and other miscellaneous dev tools such as Storybook, ESLint, etc.

They are divided into categories by folder and any component prefixed with `_` is intended as an internal component (for use only to help build other components, not to be used directly).

