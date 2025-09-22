# VS Code Extension Publisher & Azure DevOps Setup

## Current Issues to Fix:
1. **Publisher Mismatch**: package.json shows "zokugun" but publisher.json shows "JefeAguila"
2. **Repository URLs**: Currently point to GitHub instead of Azure DevOps
3. **Author Information**: Needs to be updated to reflect current ownership

## Plan:

### Phase 1: Fix Publisher Configuration ✅ COMPLETED
- [x] Update package.json publisher from "zokugun" to "JefeAguila"
- [x] Update author information in package.json
- [x] Update repository URLs to point to Azure DevOps
- [x] Update homepage and bugs URLs
- [x] Update publisher.json sourceCodeRepository URL

### Phase 2: Azure DevOps Integration
- [ ] Create Azure DevOps project at https://dev.azure.com/senorparedes/
- [ ] Set up Git repository
- [ ] Configure CI/CD pipelines for extension builds
- [ ] Set up artifact storage for .vsix packages

### Phase 3: Publishing Setup
- [ ] Register "JefeAguila" as publisher with Microsoft
- [x] Test extension packaging ✅ SUCCESSFUL
- [ ] Set up automated publishing workflow

## Files Updated:
- ✅ package.json (publisher, author, repository URLs)
- ✅ publisher.json (sourceCodeRepository URL)
- ⏳ README.md (if needed for new repository links)
