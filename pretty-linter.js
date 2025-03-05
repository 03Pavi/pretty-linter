#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

console.log("🚀 Setting up Prettier and Import Sorting...");

// Get the current working directory
const projectRoot = process.cwd();
const packageJsonPath = path.join(projectRoot, "package.json");

// Ensure `package.json` exists
if (!fs.existsSync(packageJsonPath)) {
  console.error("❌ Error: package.json not found! Run `npm init -y` first.");
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// Prettier configuration settings
const prettierConfig = {
  semi: false,
  singleQuote: true,
  trailingComma: "es5",
  printWidth: 80,
  tabWidth: 2,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^react(.*)",
    "^next(.*)",
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
    "@/(.css)",
    "@/(.scss)",
    "@/(.*)",
    "^[./]",
  ],
};

// Write .prettierrc.json
fs.writeFileSync(
  path.join(projectRoot, ".prettierrc.json"),
  JSON.stringify(prettierConfig, null, 2)
);

// Prettier ignore settings
const prettierIgnoreContent = `
node_modules
dist
build
.next
coverage
*.log
`;

fs.writeFileSync(
  path.join(projectRoot, ".prettierignore"),
  prettierIgnoreContent
);

// Add script to package.json
if (!packageJson.scripts) packageJson.scripts = {};
if (!packageJson.scripts["format"]) {
  packageJson.scripts["format"] =
    'npx prettier --config .prettierrc.json --write "${npm_config_path:-src}/**/*.{js,ts,tsx,jsx}"';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("✅ Added format script to package.json.");
}

// Ensure dependencies are installed
console.log("📦 Installing necessary dependencies...");
try {
  execSync(
    "npm install --save-dev prettier @trivago/prettier-plugin-sort-imports",
    { stdio: "inherit" }
  );
} catch (error) {
  console.error("❌ Error installing dependencies:", error.message);
  process.exit(1);
}

console.log("✅ Prettier and Import Sorting setup completed successfully!");

const userPath = process.argv[2] || "src";

const prettierConfigPath = path.join(projectRoot, ".prettierrc.json");
const targetPath = path.join(projectRoot, userPath);

// Check if Git is initialized
let isGitRepo = false;
try {
  execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
  isGitRepo = true;
} catch (error) {
  console.log("⚠️ Git is not initialized. Skipping Git-related options.");
}

// Function to ask user questions if Git is initialized
if (isGitRepo) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    "🛠️  Choose an option:\n1️⃣  Format only modified & newly added files\n2️⃣  Format all files under `src/`\nEnter your choice (1 or 2): ",
    (answer) => {
      if (answer === "1") {
        console.log("🔍 Checking for modified and newly added files...");
        try {
          const modifiedFiles = execSync(
            "git diff --cached --name-only --diff-filter=ACM",
            { encoding: "utf8" }
          )
            .split("\n")
            .filter((file) => file.match(/\.(js|ts|tsx|jsx)$/));

          if (modifiedFiles.length > 0) {
            console.log("🖌 Formatting modified files and sorting imports...");
            execSync(`npx prettier --write ${modifiedFiles.join(" ")}`, {
              stdio: "inherit",
            });

            console.log("✅ Staging formatted files...");
            execSync(`git add ${modifiedFiles.join(" ")}`, {
              stdio: "inherit",
            });

            console.log("🚀 Prettier formatting and import sorting complete!");
          } else {
            console.log(
              "✅ No modified JavaScript/TypeScript files to format."
            );
          }
        } catch (error) {
          console.error("❌ Error formatting files:", error.message);
        }
      } else if (answer === "2") {
        console.log(
          "🖌 Formatting all files under `src/` and sorting imports..."
        );
        try {
          execSync(
            `npx prettier --config ${prettierConfigPath} --write "${targetPath}/**/*.{js,ts,tsx,jsx}"`,
            { stdio: "inherit" }
          );
          console.log("✅ Formatting and import sorting complete!");
        } catch (error) {
          console.error("❌ Error formatting files:", error.message);
        }
      } else {
        console.log("❌ Invalid choice! Please enter 1 or 2.");
      }

      rl.close();
    }
  );
}
