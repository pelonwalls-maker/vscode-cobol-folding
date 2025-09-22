import * as vscode from 'vscode';
import pkg from '../package.json';

const VERSION_KEY = 'version';

async function showWhatsNewMessage(version: string) { // {{{
	const actions: vscode.MessageItem[] = [{
		title: 'Homepage',
	}, {
		title: 'Release Notes',
	}];

	const result = await vscode.window.showInformationMessage(
		`COBOL Folding has been updated to v${version} — check out what's new!`,
		...actions,
	);

	if(result !== null) {
		if(result === actions[0]) {
			await vscode.commands.executeCommand(
				'vscode.open',
				vscode.Uri.parse(`${pkg.homepage}`),
			);
		}
		else if(result === actions[1]) {
			await vscode.commands.executeCommand(
				'vscode.open',
				vscode.Uri.parse(`${pkg.homepage}/blob/master/CHANGELOG.md`),
			);
		}
	}
} // }}}

export function activate(context: vscode.ExtensionContext) { // {{{
	console.log(`${pkg.name} is now active! - extension.ts:35`);

	const provider: vscode.FoldingRangeProvider = {
		provideFoldingRanges(document, context, token) {
			const ranges: vscode.FoldingRange[] = [];
			const regex = /^\s*(?:if|perform|evaluate|section|division)/i;

			for(let line = 0; line < document.lineCount; line++) {
				const lineText = document.lineAt(line).text;
				if(regex.test(lineText)) {
					let endLine = line + 1;
					while(endLine < document.lineCount && !/^\s*END-/.test(document.lineAt(endLine).text)) {
						endLine++;
					}

					if(endLine < document.lineCount) {
						ranges.push(new vscode.FoldingRange(line, endLine));
					}
				}
			}

			return ranges;
		},
	};

	context.subscriptions.push(
		vscode.languages.registerFoldingRangeProvider({ language: 'cobol' }, provider),
	);

	// Handle version notifications
	const previousVersion = context.globalState.get<string>(VERSION_KEY);
	const currentVersion = pkg.version;

	const config = vscode.workspace.getConfiguration('explicitFolding');

	if(previousVersion === undefined || currentVersion !== previousVersion) {
		void context.globalState.update(VERSION_KEY, currentVersion);

		const notification = config.get<string>('notification');

		if(previousVersion === undefined) {
			// don't show notification on install
		}
		else if(notification === 'major') {
			if(currentVersion.split('.')[0] > previousVersion.split('.')[0]) {
				void showWhatsNewMessage(currentVersion);
			}
		}
		else if(notification === 'minor') {
			if(currentVersion.split('.')[0] > previousVersion.split('.')[0] || (currentVersion.split('.')[0] === previousVersion.split('.')[0] && currentVersion.split('.')[1] > previousVersion.split('.')[1])) {
				void showWhatsNewMessage(currentVersion);
			}
		}
		else if(notification !== 'none') {
			void showWhatsNewMessage(currentVersion);
		}
	}
} // }}}

export function deactivate() {
	// This method is called when the extension is deactivated
	// No cleanup is needed for this extension
}
