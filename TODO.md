# TODO: Fix COBOL Folding Extension Conflict

## Tasks
- [ ] Update package.json: Remove extensionDependencies and @zokugun/vscode.explicit-folding-api dependency; update engines, @types/vscode, TypeScript, and other devDependencies to latest versions.
- [ ] Refactor src/extension.ts: Remove explicit-folding imports; implement FoldingRangeProvider class with regex-based folding logic; register provider in activate; handle config and disposal.
- [ ] Run npm update to update dependencies.
- [ ] Compile the extension (npm run compile).
- [ ] Bundle the extension (npm run bundle).
- [ ] Test the extension in VSCode to verify folding works and conflict is resolved.
- [ ] Address npm audit vulnerabilities if possible.
