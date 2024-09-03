# packages

Shared libraries between frontends. Until we decide to add some monorepo management tool like Nx or Lerna, we will have to rebuild each package manually when changes are made.

## List of packages

| Package | Description |
|---------|-------------|
| [api](./api) | Shared API to backend <br> Includes resource functions to REST endpoints and model types for backend database schemas |
| [components](./components) | Shared React components |
| [schemas](./schemas) | Shared Yup schemas for validation |
| [ui](./ui) | Shared UI resources such as Tailwind config preset |
