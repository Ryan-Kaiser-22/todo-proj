
import { projects } from './logic';

const todoListUI = document.getElementById('todo-list');
const viewTitle = document.getElementById('current-view-title');
const projectListUI = document.getElementById('project-list');

//Sanitize innerHTML from XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

//Tasks
export function renderTodos(currentProject) {
    todoListUI.innerHTML = ''; 
    viewTitle.textContent = currentProject;
    const tasks = projects[currentProject] || [];

    if (tasks.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'empty-msg';
        msg.textContent = 'No tasks yet! Add one above.';
        todoListUI.appendChild(msg);
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <div class="todo-content ${task.completed ? 'completed' : ''}">
                <input type="checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       data-index="${index}" 
                       class="todo-checkbox">
                <span class="task-text"></span>
            </div>
            <button class="delete-task-btn" data-index="${index}">×</button>
        `;
        //Prevent XSS while using innerHTML:
        li.querySelector('.task-text').textContent = task.title;
        todoListUI.appendChild(li);
    });
}

//Sidebar
export function renderSidebar() {
    projectListUI.innerHTML = ''; 

    Object.keys(projects).forEach(projectName => {
        if (projectName === 'Inbox') return;

        const projectContainer = document.createElement('li');
        projectContainer.className = 'project-nav-group';

        const tasks = projects[projectName] || [];
        const taskCount = tasks.length;
        const safeProjectName = escapeHTML(projectName);
        const projectHeader = `
            <div class="project-header">
                <div class="project-info">
                    <span class="project-item bold-text">${safeProjectName}</span>
                    <span class="task-count">${taskCount}</span>
                </div>
                <button class="delete-project-btn" data-project="${safeProjectName}">×</button>
            </div>
        `;

        let taskSubTree = '<ul class="sub-task-list">';
        tasks.forEach(task => {
            const safeTaskTitle = escapeHTML(task.title);
            taskSubTree += `<li class="sub-task-item">${safeTaskTitle}</li>`;
        });
        taskSubTree += '</ul>';

        projectContainer.innerHTML = projectHeader + taskSubTree;
        projectListUI.appendChild(projectContainer);
    });
}