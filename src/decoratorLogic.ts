import * as ts from "typescript";

export type DecorationType = "component" | "function" | "hook";

export interface Decoration {
    start: number;
    end: number;
    type: DecorationType;
}

/**
 * Parses the given text and returns a list of decoration objects.
 * Variables declared with 'const' are treated as components unless their name starts with "use" (in which case they’re hooks),
 * while those declared with 'let' are treated as functions.
 */
export function getDecorationsFromText(text: string): Decoration[] {
    const sourceFile = ts.createSourceFile(
        "temp.tsx",
        text,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
    );
    const decorations: Decoration[] = [];

    const visit = (node: ts.Node) => {
        if (ts.isVariableStatement(node)) {
            const isConst =
                (node.declarationList.flags & ts.NodeFlags.Const) !== 0;
            node.declarationList.declarations.forEach((declaration) => {
                if (
                    declaration.initializer &&
                    ts.isArrowFunction(declaration.initializer)
                ) {
                    const start = declaration.getStart(sourceFile);
                    const end = declaration.getEnd();
                    const varName = declaration.name.getText(sourceFile);
                    let type: DecorationType;
                    if (isConst && varName.startsWith("use")) {
                        type = "hook";
                    } else if (isConst) {
                        type = "component";
                    } else {
                        type = "function";
                    }
                    decorations.push({ start, end, type });
                }
            });
        }
        ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return decorations;
}
