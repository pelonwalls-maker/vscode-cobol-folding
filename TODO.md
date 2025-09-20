# TODO: Fix COBOL Folding Extension Conflict

## Tasks
- [x] Update package.json: Remove extensionDependencies and @zokugun/vscode.explicit-folding-api dependency; update engines, @types/vscode, TypeScript, and other devDependencies to latest versions.
- [x] Refactor src/extension.ts: Remove explicit-folding imports; implement FoldingRangeProvider class with regex-based folding logic; register provider in activate; handle config and disposal.
- [x] Run npm update to update dependencies.
- [x] Compile the extension (npm run compile).
- [x] Bundle the extension (npm run bundle).
- [x] Test the extension in VSCode to verify folding works and conflict is resolved.
- [x] Address npm audit vulnerabilities if possible. (10 vulnerabilities remain - mostly in dev dependencies of xo, lint-staged, commitizen)
