# Mirae - Growth Companion

A self-discovery application built with React, broken down into modular files for better organization and maintainability.

## File Structure

```
.
├── index.html          # Main HTML entry point with script includes
├── styles.css          # All CSS animations and custom styles
├── constants.js        # Translations (i18n) and style constants
├── utils.js            # AI simulation functions (simulateResponse, simulateTwin)
├── components.js       # Reusable components (Icon)
├── app.js              # Main React App component with all views
└── README.md           # This file
```

## File Descriptions

### `index.html`
- Main HTML structure
- Includes external dependencies (Tailwind CSS, React, ReactDOM, Babel)
- Links to all JavaScript modules and CSS
- Contains the root div where React renders

### `styles.css`
- All custom CSS animations (fade-in, slide-in, zoom-in, etc.)
- Animation utility classes
- Icon styles
- Chat container styles
- Selection colors

### `constants.js`
- `i18n` object: Translations for Korean (ko) and English (en)
- `STYLES` object: Reusable Tailwind CSS class combinations

### `utils.js`
- `simulateResponse()`: Simulates AI chat responses based on user context
- `simulateTwin()`: Generates AI Twin persona data based on user signals and state

### `components.js`
- `Icon` component: Simple icon component using Unicode/Emoji fallbacks

### `app.js`
- Main `App` component with all application logic
- Contains all view components:
  - `Onboarding`: Initial setup screen
  - `NotebookView`: Signal collection interface
  - `ChatView`: Chat interface with AI companion
  - `TwinView`: AI Twin profile and growth compass display
- State management for the entire application
- All React hooks and effects

## How It Works

1. **index.html** loads all dependencies and scripts in order
2. **constants.js** and **utils.js** are loaded first (no dependencies)
3. **components.js** is loaded next (uses React)
4. **app.js** is loaded last with Babel transformation (contains JSX)
5. The app renders into the `#root` div

## Usage

Simply open `index.html` in a web browser. All files must be in the same directory for the relative imports to work.

## Dependencies

- Tailwind CSS (via CDN)
- React 18 (via CDN)
- ReactDOM 18 (via CDN)
- Babel Standalone (via CDN) - for JSX transformation

## Notes

- All files use relative paths, so they must be kept in the same directory
- The app uses Babel Standalone for JSX transformation in the browser
- No build step required - works directly in the browser

