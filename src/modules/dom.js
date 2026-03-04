
import { projects } from './logic';

const todoListUI = document.getElementById('todo-list');
const viewTitle = document.getElementById('current-view-title');
const projectListUI = document.getElementById('project-list');

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
                <span>${task.title}</span>
            </div>
            <button class="delete-task-btn" data-index="${index}">×</button>
        `;
        //Prevent XSS while using innerHTML:
        li.querySelector('.task-text').textContent = task.title;
        todoListUI.appendChild(li);
    });
}

// --- RENDER SIDEBAR ---
export function renderSidebar() {
    projectListUI.innerHTML = ''; 

    Object.keys(projects).forEach(projectName => {
        if (projectName === 'Inbox') return;

        const projectContainer = document.createElement('li');
        projectContainer.className = 'project-nav-group';

        const tasks = projects[projectName] || [];
        const taskCount = tasks.length; // Get the count

        // 1. Updated Header with the Count Bubble
        const projectHeader = `
            <div class="project-header">
                <div class="project-info">
                    <span class="project-item bold-text">${projectName}</span>
                    <span class="task-count">${taskCount}</span>
                </div>
                <button class="delete-project-btn" data-project="${projectName}">×</button>
            </div>
        `;

        // 2. Sub-Tree (Only show if there are tasks)
        let taskSubTree = '<ul class="sub-task-list">';
        tasks.forEach(task => {
            taskSubTree += `<li class="sub-task-item">${task.title}</li>`;
        });
        taskSubTree += '</ul>';

        projectContainer.innerHTML = projectHeader + taskSubTree;
        projectListUI.appendChild(projectContainer);
    });
}