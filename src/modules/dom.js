
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

function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`;
}

//Tasks
export function renderTodos(title, tasksOverride) {
    const todoListUI = document.getElementById('todo-list');
    const viewTitle = document.getElementById('current-view-title');
    
    if (!todoListUI || !viewTitle) return; 

    todoListUI.innerHTML = ''; 
    viewTitle.textContent = title;
    const tasks = tasksOverride || projects[title] || [];

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        // Use the helper function here
        const displayDate = formatDate(task.dueDate);

       li.innerHTML = `
            <div class="todo-main-content ${task.completed ? 'completed' : ''}">
                <input type="checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    data-id="${task.id}" 
                    class="todo-checkbox">
                <span class="task-text"></span>
            </div>
            <div class="todo-meta">
                <span class="task-date">Due: ${displayDate}</span>
                <button class="delete-task-btn" data-id="${task.id}">×</button>
            </div>
        `;
        
        // XSS Protection for the title
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