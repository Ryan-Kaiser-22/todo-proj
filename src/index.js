import './assets/styles/main.css';
import { renderTodos, renderSidebar } from './modules/dom';
import * as Logic from './modules/logic';
import * as UI from './modules/ui';

//Default state 
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
    todoDate: document.getElementById('todo-date'),
};

//Dark mode
const init = () => {
    const theme = UI.theme.getStored();
    document.documentElement.setAttribute('data-theme', theme);
    UI.theme.updateButton(elements.themeToggle, theme);
    renderSidebar();
    renderTodos(currentProject);
};

elements.themeToggle.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    UI.theme.save(newTheme);
    UI.theme.updateButton(elements.themeToggle, newTheme);
});

//Listeners
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

elements.sidebar.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('nav-link')) {
        const viewName = target.textContent;
        const timeFilters = ['Today', 'Upcoming', 'Anytime', 'Someday'];
        if (timeFilters.includes(viewName)) {
            currentProject = viewName;
            const filteredList = Logic.getFilteredTasks(viewName); 
            renderTodos(viewName, filteredList);
            return; 
        }
        currentProject = viewName;
        renderTodos(currentProject);
        return;
    }

    if (target.classList.contains('project-item')) {
        currentProject = target.textContent;
        renderTodos(currentProject);
    }

    if (target.classList.contains('sub-task-item')) {
        const projectHeader = target.closest('.project-nav-group').querySelector('.project-item');
        currentProject = projectHeader.textContent;
        renderTodos(currentProject);
    }

    if (target.classList.contains('delete-project-btn')) {
        const projectToDelete = target.dataset.project;
        if (Logic.deleteProject(projectToDelete)) {
            if (currentProject === projectToDelete) currentProject = 'Inbox';
            renderSidebar();
            renderTodos(currentProject);
        }
    }
});

elements.todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskTitle = elements.todoInput.value.trim();
    const taskDate = elements.todoDate.value; 
    const timeFilters = ['Today', 'Upcoming', 'Anytime', 'Someday'];
    
    //if in one of the filter views use current, otherwise use Inbox
    const projectToSaveTo = timeFilters.includes(currentProject) ? 'Inbox' : currentProject;
    if (taskTitle) {
        Logic.addTaskToProject(projectToSaveTo, taskTitle, taskDate);
        
        elements.todoInput.value = '';
        elements.todoDate.value = ''; 
        
        if (timeFilters.includes(currentProject)) {
            const filteredData = Logic.getFilteredTasks(currentProject);
            renderTodos(currentProject, filteredData);
        } else {
            renderTodos(currentProject);
        }
        renderSidebar(); 
    }
});

elements.todoListUI.addEventListener('click', (e) => {
    const taskId = e.target.dataset.id;
    if (!taskId) return;

    if (e.target.classList.contains('todo-checkbox')) {
        Logic.toggleTaskStatus(currentProject, taskId);
        refreshUI();
    }

    if (e.target.classList.contains('delete-task-btn')) {
        Logic.deleteTask(currentProject, taskId);
        refreshUI();
    }
});


function refreshUI() {
    renderTodos(currentProject);
    renderSidebar();
}

elements.clearCompletedBtn.addEventListener('click', () => {
    const timeFilters = ['Today', 'Upcoming', 'Anytime', 'Someday'];
    if (timeFilters.includes(currentProject)) {
        alert("Please select a specific project (like Inbox or Work) to clear completed tasks.");
        return;
    }

    Logic.clearCompletedTasks(currentProject);
    renderTodos(currentProject);
    renderSidebar();
});

init();