# TODO: Fix COBOL Folding Extension Conflict

## Tasks
- [x] Update package.json: Remove extensionDependencies and @zokugun/vscode.explicit-folding-api dependency; update engines, @types/vscode, TypeScript, and other devDependencies to latest versions.
- [x] Refactor src/extension.ts: Remove explicit-folding imports; implement FoldingRangeProvider class with regex-based folding logic; register provider in activate; handle config and disposal.
- [x] Run npm update to update dependencies.
- [x] Compile the extension (npm run compile).
- [x] Bundle the extension (npm run bundle).
- [x] Test the extension in VSCode to verify folding works and conflict is resolved.
- [x] Address npm audit vulnerabilities if possible. (10 vulnerabilities remain in dev dependencies - commitizen, lint-staged, xo - but production audit is clean: 0 vulnerabilities)

## ✅ COMPLETED
The COBOL folding extension has been successfully refactored and is ready for publishing:
- ✅ Core functionality working (regex-based folding)
- ✅ No production vulnerabilities (npm audit --omit=dev shows 0 vulnerabilities)
- ✅ Extension builds successfully
- ✅ Extension bundles successfully
- ✅ Ready for VSIX packaging and marketplace submission
