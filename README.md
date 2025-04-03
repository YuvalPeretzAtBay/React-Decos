# React Decos

**React Decos** is a Visual Studio Code extension that enhances the readability of your React code by adding inline decorations to your component, function, and hook declarations. It automatically detects arrow functions declared with `const`, `let`, and those following the hook naming convention (starting with "use") and appends customizable placeholder text in the editor.

## Features

-   **Component Decoration:**  
    Detects React components declared as arrow functions with `const` and adds a customizable label (default: `(component)`).

-   **Function Decoration:**  
    Detects functions declared as arrow functions with `let` and adds a customizable label (default: `(function)`).

-   **Hook Decoration:**  
    Automatically detects hooks (arrow functions declared with `const` whose names start with "use") and adds a customizable label (default: `(hook)`).

-   **Configuration Options:**  
    Easily enable/disable each decoration type and customize the label text via VSCode settings:
    -   `reactDecos.enableComponentDecoration`
    -   `reactDecos.componentDecorationText`
    -   `reactDecos.enableFunctionDecoration`
    -   `reactDecos.functionDecorationText`
    -   `reactDecos.enableHookDecoration`
    -   `reactDecos.hookDecorationText`

## Installation

1. **Build and Package:**

    - Open a terminal in the extension’s root directory.
    - Run:
        ```bash
        yarn install
        yarn run compile
        vsce package
        ```
    - This will generate a `.vsix` file (e.g., `react-decos-0.0.1.vsix`).

2. **Install the Extension in VSCode:**
    - Open VSCode.
    - Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
    - Click the ellipsis (...) in the top-right corner and select **"Install from VSIX..."**.
    - Select the generated `.vsix` file.
    - Reload VSCode if prompted.

## Usage

Once installed and enabled, **React Decos** will automatically add inline labels in your code for:

-   **Components:**  
    When a `const` arrow function is detected as a component.

-   **Functions:**  
    When a `let` arrow function is detected.

-   **Hooks:**  
    When a `const` arrow function starts with `"use"`.

Open any JavaScript, TypeScript, or TSX file containing React code to see the decorations in action.

## Configuration

You can modify the behavior and appearance of the decorations through the VSCode settings. For example, open the settings (File > Preferences > Settings), search for `reactDecos`, and update:

-   **Enable/Disable Decorations:**  
    Toggle whether each decoration type is active.
-   **Decoration Text:**  
    Change the text displayed after the code (e.g., change `(component)` to `(cmp)`).

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-repo/react-decos/issues) if you have any questions or suggestions.

## License

[MIT](LICENSE)
