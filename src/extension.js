'use strict';
const __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
	if (k2 === undefined) {
		k2 = k;
	}

	let desc = Object.getOwnPropertyDescriptor(m, k);
	if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		desc = {
			enumerable: true, get() {
				return m[k];
			},
		};
	}

	Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
	if (k2 === undefined) {
		k2 = k;
	}

	o[k2] = m[k];
}));
const __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
	Object.defineProperty(o, 'default', {enumerable: true, value: v});
}) : function (o, v) {
	o.default = v;
});
const __importStar = (this && this.__importStar) || (function () {
	let ownKeys = function (o) {
		ownKeys = Object.getOwnPropertyNames || function (o) {
			const ar = [];
			for (const k in o) {
				if (Object.hasOwn(o, k)) {
					ar[ar.length] = k;
				}
			}

			return ar;
		};

		return ownKeys(o);
	};

	return function (module_) {
		if (module_ && module_.__esModule) {
			return module_;
		}

		const result = {};
		if (module_ != null) {
			for (let k = ownKeys(module_), i = 0; i < k.length; i++) {
				if (k[i] !== 'default') {
					__createBinding(result, module_, k[i]);
				}
			}
		}

		__setModuleDefault(result, module_);
		return result;
	};
})();
const __awaiter = (this && this.__awaiter) || function (thisArgument, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P((resolve) => {
			resolve(value);
		});
	}

	return new (P ||= Promise)((resolve, reject) => {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (error) {
				reject(error);
			}
		}

		function rejected(value) {
			try {
				step(generator.throw(value));
			} catch (error) {
				reject(error);
			}
		}

		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}

		step((generator = generator.apply(thisArgument, _arguments || [])).next());
	});
};

const __importDefault = (this && this.__importDefault) || function (module_) {
	return (module_ && module_.__esModule) ? module_ : {default: module_};
};

Object.defineProperty(exports, '__esModule', {value: true});
exports.activate = activate;
exports.deactivate = deactivate;
const vscode_explicit_folding_api_1 = require('@zokugun/vscode.explicit-folding-api');
const vscode = __importStar(require('vscode'));
const package_json_1 = __importDefault(require('../package.json'));

const VERSION_KEY = 'version';
let $foldingHub;
function showWhatsNewMessage(version) {
	return __awaiter(this, void 0, void 0, function * () {
		const actions = [{
			title: 'Homepage',
		}, {
			title: 'Release Notes',
		}];
		const result = yield vscode.window.showInformationMessage(`COBOL Folding has been updated to v${version} — check out what's new!`, ...actions);
		if (result !== null) {
			if (result === actions[0]) {
				yield vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${package_json_1.default.homepage}`));
			} else if (result === actions[1]) {
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
		} else {
			$foldingHub.unregisterFoldingRules('cobol');
		}
	}
} // }}}

function activate(context) {
	return __awaiter(this, void 0, void 0, function * () {
		const previousVersion = context.globalState.get(VERSION_KEY);
		const currentVersion = package_json_1.default.version;
		const config = vscode.workspace.getConfiguration('explicitFolding');
		if (previousVersion === undefined || currentVersion !== previousVersion) {
			void context.globalState.update(VERSION_KEY, currentVersion);
			const notification = config.get('notification');
			if (previousVersion === undefined) {
				// don't show notification on install
			} else if (notification === 'major') {
				if (currentVersion.split('.')[0] > previousVersion.split('.')[0]) {
					void showWhatsNewMessage(currentVersion);
				}
			} else if (notification === 'minor') {
				if (currentVersion.split('.')[0] > previousVersion.split('.')[0] || (currentVersion.split('.')[0] === previousVersion.split('.')[0] && currentVersion.split('.')[1] > previousVersion.split('.')[1])) {
					void showWhatsNewMessage(currentVersion);
				}
			} else if (notification !== 'none') {
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
