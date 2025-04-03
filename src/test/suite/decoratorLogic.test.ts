import * as assert from "assert";
import { getDecorationsFromText } from "../../decoratorLogic";

suite("Decorator Logic Test Suite", () => {
    test("Should detect a const arrow function as component", () => {
        const code = `export const App = () => { return <div>App</div>; }`;
        const decorations = getDecorationsFromText(code);
        console.log("Input Code:", code);
        console.log("Output Decorations:", decorations);
        assert.strictEqual(decorations.length, 1, "Expected one decoration");
        assert.strictEqual(
            decorations[0].type,
            "component",
            'Expected type "component" for const declaration'
        );
    });

    test("Should detect a let arrow function as function", () => {
        const code = `let doSomething = () => { console.log("hello"); }`;
        const decorations = getDecorationsFromText(code);
        console.log("Input Code:", code);
        console.log("Output Decorations:", decorations);
        assert.strictEqual(decorations.length, 1, "Expected one decoration");
        assert.strictEqual(
            decorations[0].type,
            "function",
            'Expected type "function" for let declaration'
        );
    });

    test("Should detect a hook when name starts with 'use'", () => {
        const code = `export const useMyHook = () => { return "hook"; }`;
        const decorations = getDecorationsFromText(code);
        console.log("Input Code:", code);
        console.log("Output Decorations:", decorations);
        assert.strictEqual(decorations.length, 1, "Expected one decoration");
        assert.strictEqual(
            decorations[0].type,
            "hook",
            'Expected type "hook" for a const declaration starting with "use"'
        );
    });

    test("Should detect both const, let, and hook declarations in the same file", () => {
        const code = `
      export const App = () => { return <div>App</div>; }
      let doSomething = () => { console.log("hello"); }
      export const useMyHook = () => { return "hook"; }
    `;
        const decorations = getDecorationsFromText(code);
        console.log("Input Code:", code);
        console.log("Output Decorations:", decorations);
        assert.strictEqual(decorations.length, 3, "Expected three decorations");
        const componentDecoration = decorations.find(
            (dec) => dec.type === "component"
        );
        const functionDecoration = decorations.find(
            (dec) => dec.type === "function"
        );
        const hookDecoration = decorations.find((dec) => dec.type === "hook");
        assert.ok(componentDecoration, "Component decoration missing");
        assert.ok(functionDecoration, "Function decoration missing");
        assert.ok(hookDecoration, "Hook decoration missing");
    });

    test("Should ignore non-arrow function initializers", () => {
        const code = `
      const number = 42;
      let text = "hello";
    `;
        const decorations = getDecorationsFromText(code);
        console.log("Input Code:", code);
        console.log("Output Decorations:", decorations);
        assert.strictEqual(
            decorations.length,
            0,
            "Expected no decorations for non-arrow functions"
        );
    });

    test("Should detect multiple arrow function declarations on the same line", () => {
        const code = `const first = () => {}; let second = () => {}; export const useThird = () => {};`;
        const decorations = getDecorationsFromText(code);
        console.log("Input Code:", code);
        console.log("Output Decorations:", decorations);
        assert.strictEqual(decorations.length, 3, "Expected three decorations");
        const componentDecoration = decorations.find(
            (dec) => dec.type === "component"
        );
        const functionDecoration = decorations.find(
            (dec) => dec.type === "function"
        );
        const hookDecoration = decorations.find((dec) => dec.type === "hook");
        assert.ok(
            componentDecoration,
            "Component decoration missing for multiple declarations"
        );
        assert.ok(
            functionDecoration,
            "Function decoration missing for multiple declarations"
        );
        assert.ok(
            hookDecoration,
            "Hook decoration missing for multiple declarations"
        );
    });

    test("Should handle arrow functions with multi-line formatting", () => {
        const code = `
      const MultiLine = () => {
        return (
          <div>
            <span>Test</span>
          </div>
        );
      }
      let MultiLineFunc = () => 
        console.log("Multi-line function");
      export const useMultiLineHook = () => {
        return (
          <div>Hook</div>
        );
      }
    `;
        const decorations = getDecorationsFromText(code);
        console.log("Input Code:", code);
        console.log("Output Decorations:", decorations);
        assert.strictEqual(
            decorations.length,
            3,
            "Expected three decorations in multi-line formatted code"
        );
        const componentDecoration = decorations.find(
            (dec) => dec.type === "component"
        );
        const functionDecoration = decorations.find(
            (dec) => dec.type === "function"
        );
        const hookDecoration = decorations.find((dec) => dec.type === "hook");
        assert.ok(
            componentDecoration,
            "Component decoration missing in multi-line code"
        );
        assert.ok(
            functionDecoration,
            "Function decoration missing in multi-line code"
        );
        assert.ok(hookDecoration, "Hook decoration missing in multi-line code");
    });
});
