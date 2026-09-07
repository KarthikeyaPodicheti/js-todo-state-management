(function () {
  var storageKey = "js-todo-state-management-tasks";
  var form = document.getElementById("todo-form");
  var input = document.getElementById("todo-input");
  var list = document.getElementById("todo-list");
  var empty = document.getElementById("todo-empty");
  var count = document.getElementById("todo-count");
  var message = document.getElementById("todo-message");
  var filters = document.querySelector(".filters");
  var activeFilter = "all";
  var tasks = loadTasks();

  function loadTasks() {
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey));
      return Array.isArray(saved) ? saved.filter(function (task) {
        return task && typeof task.id === "string" && typeof task.title === "string" && typeof task.completed === "boolean";
      }) : [];
    } catch (error) { return []; }
  }
  function saveTasks() {
    try { localStorage.setItem(storageKey, JSON.stringify(tasks)); }
    catch (error) { message.textContent = "Your browser could not save this task list."; }
  }
  function render() {
    var visible = tasks.filter(function (task) {
      return activeFilter === "all" || (activeFilter === "completed" ? task.completed : !task.completed);
    });
    list.textContent = "";
    visible.forEach(function (task) {
      var item = document.createElement("li");
      item.className = "task-item" + (task.completed ? " is-completed" : "");
      item.dataset.id = task.id;
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox"; checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", "Mark " + task.title + " as " + (task.completed ? "active" : "complete"));
      var title = document.createElement("span");
      title.className = "task-title"; title.textContent = task.title;
      var actions = document.createElement("div"); actions.className = "task-actions";
      var edit = document.createElement("button");
      edit.type = "button"; edit.className = "task-action edit-task"; edit.textContent = "Edit"; edit.setAttribute("aria-label", "Edit " + task.title);
      var remove = document.createElement("button");
      remove.type = "button"; remove.className = "task-action delete-task"; remove.textContent = "Delete"; remove.setAttribute("aria-label", "Delete " + task.title);
      actions.append(edit, remove); item.append(checkbox, title, actions); list.appendChild(item);
    });
    var remaining = tasks.filter(function (task) { return !task.completed; }).length;
    count.textContent = remaining + " " + (remaining === 1 ? "task" : "tasks") + " remaining";
    empty.hidden = visible.length !== 0;
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var title = input.value.trim();
    if (!title) { message.textContent = "Enter a task before adding it."; input.focus(); return; }
    tasks.unshift({ id: String(Date.now()) + Math.random().toString(16).slice(2), title: title, completed: false });
    saveTasks(); render(); form.reset(); message.textContent = "Task added."; input.focus();
  });
  list.addEventListener("change", function (event) {
    if (event.target.type !== "checkbox") return;
    var task = tasks.find(function (item) { return item.id === event.target.closest(".task-item").dataset.id; });
    if (!task) return;
    task.completed = event.target.checked; saveTasks(); render(); message.textContent = task.completed ? "Task completed." : "Task marked active.";
  });
  list.addEventListener("click", function (event) {
    var button = event.target.closest("button"); if (!button) return;
    var index = tasks.findIndex(function (task) { return task.id === button.closest(".task-item").dataset.id; }); if (index < 0) return;
    if (button.classList.contains("delete-task")) { tasks.splice(index, 1); saveTasks(); render(); message.textContent = "Task deleted."; }
    if (button.classList.contains("edit-task")) {
      var updated = window.prompt("Edit task", tasks[index].title); if (updated === null) return;
      updated = updated.trim(); if (!updated) { message.textContent = "A task cannot be empty."; return; }
      tasks[index].title = updated; saveTasks(); render(); message.textContent = "Task updated.";
    }
  });
  filters.addEventListener("click", function (event) {
    var button = event.target.closest("button[data-filter]"); if (!button) return;
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach(function (filter) {
      var selected = filter === button; filter.classList.toggle("is-active", selected); filter.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    render();
  });
  render();
})();
