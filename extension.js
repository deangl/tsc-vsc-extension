const vscode = require('vscode');

function activate(context) {
    function updateMinimapVisibility() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const config = vscode.workspace.getConfiguration('minimapToggle');
            const minWidthForMinimap = config.get('minWidthForMinimap');
            const editorWidth = getEditorWidth(editor);

            if (editorWidth > minWidthForMinimap) {
                vscode.workspace.getConfiguration().update('editor.minimap.enabled', true, vscode.ConfigurationTarget.Global);
            } else {
                vscode.workspace.getConfiguration().update('editor.minimap.enabled', false, vscode.ConfigurationTarget.Global);
            }
        }
    }

    // 监听窗口变化以更新minimap的显示状态
    vscode.window.onDidChangeTextEditorViewColumn(updateMinimapVisibility);

    // 监听配置变化以更新minimap的显示状态
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('minimapToggle.minWidthForMinimap')) {
            updateMinimapVisibility();
        }
    });

    // 初始调用以设置minimap的显示状态
    updateMinimapVisibility();

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('minimapToggle.minWidthForMinimap')) {
                updateMinimapVisibility();
            }
        })
    );
}

/**
 * 尝试获取编辑器宽度的函数
 * 注意：VS Code API 没有直接提供获取编辑器宽度的方法，以下方法仅供参考
 */
function getEditorWidth(editor) {
    // 这里需要根据实际情况来获取编辑器的宽度，可能需要通过 DOM 操作或其他方式
    // 以下代码仅为示例，实际中需要根据 VS Code 的版本和 API 进行调整
    const editorElement = vscode.window.visibleTextEditors[0]?.view?.overviewRule?.clientWidth;
    return editorElement || vscode.window.visibleTextEditors[0]?.options?.get('minimap.maxColumn');
}

/**
 * 扩展停用时调用
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};