"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode_explicit_folding_api_1 = require("@zokugun/vscode.explicit-folding-api");
const vscode = __importStar(require("vscode"));
const package_json_1 = __importDefault(require("../package.json"));
const VERSION_KEY = 'version';
let $foldingHub;
function showWhatsNewMessage(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const actions = [{
                title: 'Homepage',
            }, {
                title: 'Release Notes',
            }];
        const result = yield vscode.window.showInformationMessage(`COBOL Folding has been updated to v${version} — check out what's new!`, ...actions);
        if (result !== null) {
            if (result === actions[0]) {
                yield vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${package_json_1.default.homepage}`));
            }
            else if (result === actions[1]) {
                yield vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${package_json_1.default.homepage}/blob/master/CHANGELOG.md`));
            }
        }
    });
} // }}}
function setup() {
    const explicitFoldingExtension = vscode.extensions.getExtension(vscode_explicit_folding_api_1.explicitFoldingExtensionId);
    $foldingHub = explicitFoldingExtension === null || explicitFoldingExtension === void 0 ? void 0 : explicitFoldingExtension.exports;
    if ($foldingHub) {
        const config = vscode.workspace.getConfiguration('cobolFolding');
        const enabled = config.get('enabled');
        if (enabled) {
            $foldingHub.registerFoldingRules('cobol', [
                // Comments block
                {
                    name: 'comment',
                    whileRegex: '^.{6}\\*',
                    kind: 'comment',
                },
                // Division
                {
                    name: 'division',
                    separatorRegex: '^.{6} {1,4}[A-Za-z0-9\\-_:]+ +(?i:DIVISION)',
                    strict: 'never',
                    nested: [
                        // Section
                        {
                            name: 'section',
                            separatorRegex: '^.{6} {1,4}[A-Za-z0-9\\-_:]+ +(?i:SECTION)',
                            nested: [
                                // Paragraph
                                {
                                    name: 'paragraph',
                                    separatorRegex: '^.{6} {1,4}[A-Za-z0-9\\-_:]+(?! +(?i:SECTION|DIVISION))',
                                    nested: [
                                        // Page eject
                                        {
                                            name: 'eject',
                                            separatorRegex: '^.{6}\\/',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ]);
        }
        else {
            $foldingHub.unregisterFoldingRules('cobol');
        }
    }
} // }}}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const previousVersion = context.globalState.get(VERSION_KEY);
        const currentVersion = package_json_1.default.version;
        const config = vscode.workspace.getConfiguration('explicitFolding');
        if (previousVersion === undefined || currentVersion !== previousVersion) {
            void context.globalState.update(VERSION_KEY, currentVersion);
            const notification = config.get('notification');
            if (previousVersion === undefined) {
                // don't show notification on install
            }
            else if (notification === 'major') {
                if (currentVersion.split('.')[0] > previousVersion.split('.')[0]) {
                    void showWhatsNewMessage(currentVersion);
                }
            }
            else if (notification === 'minor') {
                if (currentVersion.split('.')[0] > previousVersion.split('.')[0] || (currentVersion.split('.')[0] === previousVersion.split('.')[0] && currentVersion.split('.')[1] > previousVersion.split('.')[1])) {
                    void showWhatsNewMessage(currentVersion);
                }
            }
            else if (notification !== 'none') {
                void showWhatsNewMessage(currentVersion);
            }
        }
        setup();
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration('cobolFolding')) {
                setup();
            }
        });
    });
} // }}}
function deactivate() {
    if ($foldingHub) {
        $foldingHub.unregisterFoldingRules('cobol');
    }
} // }}}
