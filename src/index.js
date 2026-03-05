import './assets/styles/main.css';
import { renderTodos, renderSidebar } from './modules/dom';
import * as Logic from './modules/logic';
import * as UI from './modules/ui';
import * as DOM from './modules/dom';

//Default task bin 
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

const refreshUI = () => {
    const timeFilters = ['Today', 'Upcoming', 'Anytime', 'Someday'];
    
    if (timeFilters.includes(currentProject)) {
        const filteredData = Logic.getFilteredTasks(currentProject);
        renderTodos(currentProject, filteredData);
    } else {
        renderTodos(currentProject);
    }
    renderSidebar();
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
        refreshUI();
        UI.projectInput.close(elements.showBtn, elements.inputGroup, elements.projectNameInput);
    } else {
        alert("Project requires a new name!");
    }
});

elements.sidebar.addEventListener('click', (e) => {
    const target = e.target;
    //Bubble up when clicking bubble.. chortle. 
    const navLink = target.closest('.nav-link');
    if (navLink) {
        currentProject = navLink.querySelector('span').textContent;
        refreshUI();
        return;
    }
    //Bubble bubble 
    const projectItem = target.closest('.project-item');
    if (projectItem) {
        currentProject = projectItem.textContent;
        refreshUI();
    }

    if (target.classList.contains('sub-task-item')) {
        const projectHeader = target.closest('.project-nav-group').querySelector('.project-item');
        currentProject = projectHeader.textContent;
        refreshUI();
    }

    if (target.classList.contains('delete-project-btn')) {
        const projectToDelete = target.dataset.project;
        const userConfirmed = confirm(`Are you sure you want to delete "${projectToDelete}"? This will remove all tasks inside it.`);
        if (userConfirmed) {   
            if (Logic.deleteProject(projectToDelete)) {
                if (currentProject === projectToDelete) currentProject = 'Inbox';
                refreshUI();
            }
        }   
    }
});

elements.todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskTitle = elements.todoInput.value.trim();
    const taskDate = elements.todoDate.value; 
    const timeFilters = ['Today', 'Upcoming', 'Anytime', 'Someday'];
    
    const projectToSaveTo = timeFilters.includes(currentProject) ? 'Inbox' : currentProject;
    
    if (taskTitle) {
        Logic.addTaskToProject(projectToSaveTo, taskTitle, taskDate);
        elements.todoInput.value = '';
        elements.todoDate.value = ''; 
        refreshUI(); //
    }
});

elements.todoListUI.addEventListener('click', (e) => {
    const target = e.target;
    const li = target.closest('.todo-item');
    if (!li) return;

    const taskId = target.dataset.id || li.getAttribute('data-id');
    if (!taskId) return;

    if (target.classList.contains('edit-task-btn')) {
        const task = Logic.getTaskById(taskId);
        if (task) {
            DOM.showEditForm(li, task);
        }
        return;
    }

    if (target.classList.contains('save-edit-btn')) {
        const newTitle = li.querySelector('.edit-title').value.trim();
        const newDate = li.querySelector('.edit-date').value;
        const newProject = li.querySelector('.edit-project').value;

        if (newTitle) {
            Logic.updateTask(taskId, {
                title: newTitle,
                dueDate: newDate,
                project: newProject
            });
            refreshUI();
        } else {
            alert("Task title cannot be empty!");
        }
        return;
    }

    if (target.classList.contains('cancel-edit-btn')) {
        refreshUI(); 
        return;
    }

    if (target.classList.contains('todo-checkbox')) {
        Logic.toggleTaskStatusGlobal(taskId);
        refreshUI(); 
    }

    if (target.classList.contains('delete-task-btn')) {
        Logic.deleteTaskGlobal(taskId);
        refreshUI(); 
    }
});

elements.clearCompletedBtn.addEventListener('click', () => {
    const timeFilters = ['Today', 'Upcoming', 'Anytime', 'Someday'];
    if (timeFilters.includes(currentProject)) {
        alert("Please select a specific project (like Inbox or Work) to clear completed tasks.");
        return;
    }

    Logic.clearCompletedTasks(currentProject);
    refreshUI();
});

init();