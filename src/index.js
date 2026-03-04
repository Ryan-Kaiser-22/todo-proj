import './assets/styles/main.css';
import { renderTodos, renderSidebar } from './modules/dom';
import * as Logic from './modules/logic';
import * as UI from './modules/ui';

// --- STATE TRACKING ---
let currentProject = 'Inbox';

const elements = {
    showBtn: document.getElementById('show-add-project'),
    inputGroup: document.getElementById('project-input-group'),
    projectNameInput: document.getElementById('new-project-name'),
    confirmProjectBtn: document.getElementById('confirm-add-project'),
    cancelProjectBtn: document.getElementById('cancel-add-project'),
    themeToggle: document.getElementById('theme-toggle'),
    todoForm: document.getElementById('todo-form'),
    todoInput: document.getElementById('todo-input'),
    sidebar: document.querySelector('.sidebar'),
    todoListUI: document.getElementById('todo-list'),
    clearCompletedBtn: document.getElementById('clear-completed-btn'),
};

// --- INITIALIZATION ---
const init = () => {
    // Set theme
    const theme = Logic.getStoredTheme();
    document.documentElement.setAttribute('data-theme', theme);
    UI.theme.updateButton(elements.themeToggle, theme);
    renderSidebar();
    renderTodos(currentProject);
};

// --- THEME LOGIC ---
elements.themeToggle.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    Logic.saveTheme(newTheme);
    UI.theme.updateButton(elements.themeToggle, newTheme);
});

// --- PROJECT EVENT LISTENERS ---

elements.showBtn.addEventListener('click', () => {
    UI.projectInput.open(elements.showBtn, elements.inputGroup, elements.projectNameInput);
});

elements.cancelProjectBtn.addEventListener('click', () => {
    UI.projectInput.close(elements.showBtn, elements.inputGroup, elements.projectNameInput);
});

elements.confirmProjectBtn.addEventListener('click', () => {
    const name = elements.projectNameInput.value.trim();
    if (Logic.addProject(name)) {
        renderSidebar();
        UI.projectInput.close(elements.showBtn, elements.inputGroup, elements.projectNameInput);
    } else {
        alert("Project name must be unique and not empty!");
    }
});

// --- SIDEBAR ACTIONS (Switching & Deleting) ---
elements.sidebar.addEventListener('click', (e) => {

    if (e.target.matches('.nav-link, .project-item')) {
        currentProject = e.target.textContent;
        renderTodos(currentProject);
    }

    if (e.target.classList.contains('sub-task-item')) {
        // This finds the parent container and grabs the project name from the header
        const projectHeader = e.target.closest('.project-nav-group').querySelector('.project-item');
        currentProject = projectHeader.textContent;
        renderTodos(currentProject);
    }

    if (e.target.classList.contains('delete-project-btn')) {
        const projectToDelete = e.target.dataset.project;
        if (Logic.deleteProject(projectToDelete)) {
            if (currentProject === projectToDelete) currentProject = 'Inbox';
            renderSidebar();
            renderTodos(currentProject);
        }
    }
});

// --- TASK ACTIONS (Adding, Toggling, Deleting) ---

elements.todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskTitle = elements.todoInput.value.trim();
    if (taskTitle) {
        Logic.addTaskToProject(currentProject, taskTitle);
        elements.todoInput.value = '';
        renderTodos(currentProject);
        renderSidebar(); // updating count bubble
    }
});

elements.todoListUI.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (!index) return;

    if (e.target.classList.contains('todo-checkbox')) {
        Logic.toggleTaskStatus(currentProject, index);
        renderTodos(currentProject);
    }

    if (e.target.classList.contains('delete-task-btn')) {
        Logic.deleteTask(currentProject, index);
        renderTodos(currentProject);
        renderSidebar(); // update count bubble
    }
});

elements.clearCompletedBtn.addEventListener('click', () => {
    Logic.clearCompletedTasks(currentProject);
    renderTodos(currentProject);
    renderSidebar(); // Update the count bubbles in the sidebar!
});

init();