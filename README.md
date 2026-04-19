# Nuxt Template

always use the latest version of Nuxt

## outofbox features

- [x] i18n
- [x] pinia
- [x] element-plus
- [x] unocss
- [x] scss
- [x] eslint
- [ ] stylelint
- [x] vueuse
- [x] lodash
- [x] unplugin-icons
- [x] vue3-context-menu
- [x] husky & commitlint
- [x] prisma
- [x] user authentication with `@clerk/nuxt`

> [quickstart](https://clerk.com/docs/nuxt/getting-started/quickstart)

## TODO

- [ ] global error handler at server side
- [ ] [`@clerk/nuxt` not work under `hashMode`](https://github.com/clerk/javascript/issues/8357)

- [ ] `afterSignOutUrl` & `signInForceRedirectUrl` not work 

## FAQ

1. Could not locate the bindings file: better-sqlite3

> `pnpm rebuild better-sqlite3`
