# JavaScript To-Do State Management

I built this client-side to-do list for Task 3 of my web development internship. I used it to practise DOM manipulation, event handling, state updates, and browser storage without using a framework.

## What I built

I can add a task, mark it complete, edit its text, and delete it. The app renders each task from the current task array, so the visible list always reflects the application state.

I added All, Active, and Completed filters to make it easier to focus on a specific group of tasks. I also save the task array to `window.localStorage` after every change and load it when the page opens, so the tasks remain after a browser refresh.

For the task list, I use delegated `change` and `click` listeners. This lets newly created task items work without attaching separate listeners to every button or checkbox.

## Run the project

I open `index.html` in a modern browser. The project does not need a framework, installation, or server.

## Files

- `index.html` contains the accessible structure for the task list.
- `style.css` contains the responsive layout and visual styles.
- `script.js` contains the task state, rendering, filtering, storage, and event handling.
