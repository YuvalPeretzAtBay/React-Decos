import * as vscode from "vscode";
import * as ts from "typescript";

export function activate(context: vscode.ExtensionContext) {
    // Function to update decorations using the TypeScript AST.
    const updateDecorations = (editor: vscode.TextEditor) => {
        const text = editor.document.getText();
        const sourceFile = ts.createSourceFile(
            "temp.tsx",
            text,
            ts.ScriptTarget.Latest,
            true,
            ts.ScriptKind.TSX
        );

        // Read user settings.
        const config = vscode.workspace.getConfiguration("reactDecos");
        const enableComponent = config.get<boolean>(
            "enableComponentDecoration",
            true
        );
        const componentText = config.get<string>(
            "componentDecorationText",
            " (component)"
        );
        const enableFunction = config.get<boolean>(
            "enableFunctionDecoration",
            true
        );
        const functionText = config.get<string>(
            "functionDecorationText",
            " (function)"
        );
        const enableHook = config.get<boolean>("enableHookDecoration", true);
        const hookText = config.get<string>("hookDecorationText", " (hook)");

        // Create decoration types based on settings.
        const componentDecoration = enableComponent
            ? vscode.window.createTextEditorDecorationType({
                  after: {
                      contentText: componentText,
                      color: "gray",
                      margin: "0 0 0 1em",
                  },
              })
            : null;
        const functionDecoration = enableFunction
            ? vscode.window.createTextEditorDecorationType({
                  after: {
                      contentText: functionText,
                      color: "gray",
                      margin: "0 0 0 1em",
                  },
              })
            : null;
        const hookDecoration = enableHook
            ? vscode.window.createTextEditorDecorationType({
                  after: {
                      contentText: hookText,
                      color: "gray",
                      margin: "0 0 0 1em",
                  },
              })
            : null;

        const componentDecorations: vscode.DecorationOptions[] = [];
        const functionDecorations: vscode.DecorationOptions[] = [];
        const hookDecorations: vscode.DecorationOptions[] = [];

        // Traverse the AST.
        const visit = (node: ts.Node) => {
            if (ts.isVariableStatement(node)) {
                // Determine if declared with 'const' (if not, assume let).
                const isConst =
                    (node.declarationList.flags & ts.NodeFlags.Const) !== 0;
                node.declarationList.declarations.forEach((declaration) => {
                    if (
                        declaration.initializer &&
                        ts.isArrowFunction(declaration.initializer)
                    ) {
                        const startPos = editor.document.positionAt(
                            declaration.getStart(sourceFile)
                        );
                        const endPos = editor.document.positionAt(
                            declaration.getEnd()
                        );
                        const deco = {
                            range: new vscode.Range(startPos, endPos),
                        };

                        // Get the variable name text.
                        const varName = declaration.name.getText(sourceFile);
                        if (
                            isConst &&
                            enableHook &&
                            varName.startsWith("use")
                        ) {
                            hookDecorations.push(deco);
                        } else if (isConst && enableComponent) {
                            componentDecorations.push(deco);
                        } else if (!isConst && enableFunction) {
                            functionDecorations.push(deco);
                        }
                    }
                });
            }
            ts.forEachChild(node, visit);
        };
        visit(sourceFile);

        // Apply the decorations if enabled.
        if (componentDecoration) {
            editor.setDecorations(componentDecoration, componentDecorations);
        }
        if (functionDecoration) {
            editor.setDecorations(functionDecoration, functionDecorations);
        }
        if (hookDecoration) {
            editor.setDecorations(hookDecoration, hookDecorations);
        }
    };

    // Initial decoration for the active editor.
    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }

    // Refresh decorations when the active editor changes.
    vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            if (editor) {
                updateDecorations(editor);
            }
        },
        null,
        context.subscriptions
    );

    // Refresh decorations on document changes.
    vscode.workspace.onDidChangeTextDocument(
        (event) => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                updateDecorations(editor);
            }
        },
        null,
        context.subscriptions
    );
}

export function deactivate() {}
