import * as Logic from './logic';
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
        li.setAttribute('data-id', task.id);
        
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
                <button class="edit-task-btn" data-id="${task.id}">✎</button>
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
    const fixedViews = ['Inbox', 'Today', 'Upcoming', 'Anytime'];
    
    fixedViews.forEach(view => {
        const badge = document.getElementById(`count-${view}`);
        if (badge) {
            // Get the count from Logic
            const count = (view === 'Inbox') 
                ? projects['Inbox'].filter(t => !t.completed).length 
                : Logic.getFilteredTasks(view).filter(t => !t.completed).length;
            
            badge.textContent = count;
            // Hide bubble if count is 0
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    });
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
                    <span class="project-item bold-text" title="${safeProjectName}">${safeProjectName}</span>
                    <span class="task-count">${taskCount}</span>
                </div>
                <button class="delete-project-btn" data-project="${safeProjectName}">×</button>
            </div>
        `;

        let taskSubTree = '<ul class="sub-task-list">';
        tasks.forEach(task => {
            const safeTaskTitle = escapeHTML(task.title);
            const completedClass = task.completed ? 'sidebar-task-completed' : '';
            taskSubTree += `<li class="sub-task-item ${completedClass}">${safeTaskTitle}</li>`;
        });
        taskSubTree += '</ul>';

        projectContainer.innerHTML = projectHeader + taskSubTree;
        projectListUI.appendChild(projectContainer);
    });
}

//Edit task function
export function showEditForm(liElement, task) {
    const projectOptions = Object.keys(projects).map(projectName => `
        <option value="${projectName}" ${projectName === task.project ? 'selected' : ''}>
            ${projectName}
        </option>
    `).join('');

    liElement.innerHTML = `
        <div class="edit-form-inline">
            <input type="text" class="edit-title" value="${task.title}">
            <input type="date" class="edit-date" value="${task.dueDate}">
            <select class="edit-project">
                ${projectOptions}
            </select>
            <div class="edit-buttons">
                <button class="save-edit-btn" data-id="${task.id}">Save</button>
                <button class="cancel-edit-btn">Cancel</button>
            </div>
        </div>
    `;
}