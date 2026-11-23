# Архитектура проекта

Проект использует упрощённый вариант Feature-Sliced Design с тремя слоями: `app`, `widgets` и `ui-kit`. Не добавлять остальные слои FSD без отдельной необходимости.

## Слои и зависимости

- `src/app` — композиционный корень приложения: подключает виджеты, глобальные эффекты и оболочку страницы. Конкретные тексты резюме и содержимое карточек здесь не размещать.
- `src/widgets` — крупные смысловые блоки страницы и их содержимое: опыт, ключевой проект, проекты, стек, контакты. Виджеты компонуют UI-kit и владеют текстами своего блока.
- `src/ui-kit` — переиспользуемые компоненты без текстов и знаний о предметной области резюме.
- Разрешённые зависимости: `app → widgets → ui-kit` и `app → ui-kit`. Запрещены импорты в обратную сторону, импорты между виджетами и циклические зависимости.
- Внутри `src` использовать алиас `@` для импортов между слоями. Локальные импорты внутри одного компонента или слайса могут быть относительными.
- Каждый компонент UI-kit живёт в своей папке (kebab-case) с barrel `index.ts` (default export); виджеты импортируют компоненты напрямую, например `import Card from '@/ui-kit/card'`. Виджеты подключаются через `src/widgets/index.ts`.

## Карточки

- `Card` отвечает только за оболочку и раскладку, а виджет — за конкретный контент.
- Слот `header` — основная часть заголовка, например название компании или проекта.
- Слот `header-additional` — дополнительная часть заголовка, например дата или компания.
- Default-слот — тело карточки; в него можно передавать любое количество абзацев, секций, списков и других блоков.
- Слот `footer` — теги, ссылки и другие завершающие элементы.
- Семантические элементы `article`, `header`, `body`-обёртка и `footer` остаются в UI-kit; виджеты не дублируют их раскладку.

## Соглашения

- Vue 3, Composition API и `<script setup lang="ts">`; не добавлять новые зависимости без необходимости.
- Vue-компоненты называть в PascalCase, composable-функции — с префикса `use`.
- Сохранять существующее визуальное поведение при архитектурных переносах; не смешивать рефакторинг структуры с изменением контента.
- Все перемещения и переименования файлов выполнять через сабагента. Основному агенту не выполнять эти операции напрямую.
- После изменений запускать стандартные проверки Vite+ и исправлять только относящиеся к задаче проблемы.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
