
---

# 🚀 pretty-linter

A simple CLI tool to quickly set up **Prettier** and **ESLint** in your project with sensible defaults.

## 📌 Features

- Automatically configures **Prettier** with recommended settings.
- Sets up a **.prettierrc.json** file.
- Creates a **.prettierignore** file.
- Adds a script to your **package.json** for easy formatting.
- Supports formatting only modified files in Git or all files in `src/`.

## 🛠 Installation

You can install the package globally or use `npx` directly.

### **Option 1: Run with `npx`** (Recommended)

```sh
npx pretty-linter
```

### **Option 2: Install Globally**

```sh
npm install -g pretty-linter
```

Then run:

```sh
pretty-linter
```

## 🚀 Usage

Simply run the command in your project root:

```sh
npx pretty-linter
```

You'll be prompted to choose how you want to format files:

1️⃣ **Format only modified & newly added files** (Git tracked files)  
2️⃣ **Format all files under `src/`**

## ⚙️ Configuration

By default, the following **Prettier** settings are applied:

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2,
  "plugins": [
    "@trivago/prettier-plugin-sort-imports"
  ],
  "importOrder": [
    "^react(.*)",
    "^formik(.*)",
    "^redux(.*)",
    "^yup(.*)",
    "^dayjs(.*)",
    "@mui/(.*)",
    "@reduxjs/(.*)",
    "@/components/(.*)",
    "@/types/(.*)",
    "@/services/(.*)",
    "@/pages/(.*)",
    "@/app/(.*)",
    "@/features/(.*)",
    "@/utils/(.*)",
    "@/assets/(.*)",
    "@/(.*)",
    "@/(.scss)",
    "@/(.css)",
    "^[./]"
  ]
}
```

### **Ignore Files (`.prettierignore`)**

By default, these folders/files are ignored:

```
node_modules
dist
build
.next
coverage
*.log
```

## ✅ Adding a Formatting Script

This package automatically adds the following script to your `package.json`:

```json
"scripts": {
  "format": "npx prettier --config .prettierrc.json --write \"${npm_config_path:-src}/**/*.{js,ts,tsx,jsx}\""
}
```

##  🎯 How Users Can Run It
Format the src/ folder (default):
```jsx
npm run format
```
Format a specific folder (e.g., components/):

```jsx
npm run format --path=components`
```

## 🐛 Troubleshooting

If you encounter issues, try the following:

1. **Ensure Node.js is installed** (`node -v`).
2. **Check if Prettier is installed** (`npx prettier --version`).
3. **Run `npm pkg fix`** to correct any package.json issues.
4. **Reinstall the package**:
   ```sh
   npm uninstall -g pretty-linter && npm install -g pretty-linter
   ```

---

Let me know if you want any modifications! 🚀
