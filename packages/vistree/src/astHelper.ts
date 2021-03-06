import ts from "typescript";

export function parseCode(value: string) {
  console.time("parse");
  const ret = ts.createSourceFile(
    "file:///index.ts",
    value,
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TSX
  );
  console.timeEnd("parse");
  return ret;
}

export function updateSource(
  ast: ts.SourceFile,
  newStatements: ts.Statement[]
) {
  return ts.updateSourceFileNode(ast, newStatements);
}

export function replaceNode(ast: ts.SourceFile, prev: ts.Node, next: ts.Node) {
  function rewriter(): ts.TransformerFactory<ts.Node> {
    return (context) => {
      const visit: ts.Visitor = (node) => {
        if (prev === node) return next;
        return ts.visitEachChild(node, (child) => visit(child), context);
      };
      return (node) => ts.visitNode(node, visit);
    };
  }
  ts.updateSourceFileNode;
  const result = ts.transform(ast, [rewriter()]);
  const newAst = result.transformed[0] as ts.SourceFile;
  return newAst;
}
