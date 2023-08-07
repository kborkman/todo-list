let taskCount = -1;
let compTitle = document.getElementById('completed-title'); 
let compCount = [];
let compCheck;
let container = document.getElementById('tasks-create');
let tasks =  [];
let completedTasks = [];
let editArr = []
let tarTitle = '';
let tarDesc = '';
let tarId = '';

const tasksCreate = 'tasks-create';
const tasksComplete = 'tasks-complete';

function updateTasks(arr) {
    for (let i = 0; i < arr.length; i++) {
        let taskDiv = document.getElementById(tasksCreate);
        let div = document.createElement('a');
        // let checked = taskState === 'tasks-complete' ? 'checked' : 'unchecked';
        if (!arr[i].checked) {
            taskDiv = document.getElementById(tasksCreate);
            if (!document.getElementById(arr[i].id)) {
                div.id = arr[i].id;
                div.classList.add('draggable');
                div.draggable = true;
                div.innerHTML = `
            <div href="#" class='tasks-wrap border-glow'>
                <div class="tasks-left">
                    <h4>${ arr[i].name }</h4>
                    <p>${ arr[i].desc }</p>
                </div>
                <div id="check-wrap" class="tasks-right">
                    <div class="prompt-delete"><i class="fa fa-trash"></i></div>
                    <input type="checkbox" id="${ arr[i].id }" class="mark-complete">
                </div>
            </div>
            `;
            taskDiv.appendChild(div);
            }
        } else {
            taskDiv = document.getElementById(tasksComplete);
            if (!document.getElementById(arr[i].id)) {
                div.id = arr[i].id;
                div.innerHTML = `
            <div class='tasks-wrap border-glow checked'>
                <div class="tasks-left">
                    <h4>${ arr[i].name }</h4>
                    <p>${ arr[i].desc }</p>
                </div>
                <div id="check-wrap" class="tasks-right">
                    <div class="prompt-delete"><i class="fa fa-trash"></i></div>
                    <input type="checkbox" id="${ arr[i].id }" class="mark-complete" checked>
                </div>
            </div>
            `;
            taskDiv.appendChild(div);
            }
        }
    } 
    if (compCount.length > 0) {
        compTitle.classList.remove('hidden');
    } else if (compCount.length === 0 && !compTitle.classList.contains('hidden')) {
        compTitle.classList.add('hidden');
    } 
};

function taskCheck(id) {
    for (let k = 0; k < tasks.length; k++) {
        if (tasks[k].id == id) {
            tasks[k].checked = !tasks[k].checked;
            if (compCount.length > 0) {
                compCheck = tasks[k].checked ? compCount.push(tasks[k]) : compCount.pop();
            } else if (compCount.length === 0 && tasks[k].checked) {
                compCheck = compCount.push(tasks[k]);
            }
        }
    }
    document.getElementById('completed-number').innerText = `${compCount.length} `;
    let plural = document.getElementById('completed-plural');
    compCount.length > 1 ? plural.classList.remove('hidden') : plural.classList.add('hidden');
    redrawTasks();
}

function deleteTask(id) {
    console.log(id);
    for (let p = 0; p < tasks.length; p++) {
        if (tasks[p].id == id) {
            if (tasks[p].checked) {
                compCount.pop();
                console.log(compCount);
                document.getElementById('completed-number').innerText = `${compCount.length} `;
            }
            tasks.splice(p, 1);
        }
    }
    redrawTasks();
}

function redrawTasks() {
    document.querySelector("#tasks-create").innerHTML = " ";
    document.querySelector("#tasks-complete").innerHTML = " ";
    updateTasks(tasks);
}

function togglePrompt() {
    document.getElementById('prompt').classList.toggle('hidden');
    document.getElementById('prompt').classList.toggle('blur');
}

function editTasks(id) {
    for (let l = 0; l < tasks.length; l++) {
        if (tasks[l].id == id) {
            tasks[l].name = editArr[0].name;
            tasks[l].desc = editArr[0].desc;
        }
    }
    redrawTasks();
    editArr.splice(0, editArr.length);
}

function clearInput(target) {
    if (target.value) {
        target.value = '';
    }
}

document.getElementById('prompt-click').addEventListener('click', ()=> {
    togglePrompt();
});

document.getElementById('prompt-submit').addEventListener('click', (e) => {
    let nameVal = document.getElementById('input-name').value;
    let descVal = document.getElementById('input-desc').value;
    e.preventDefault();
    if (editArr.length > 0) {
        editArr[0].name = nameVal;
        editArr[0].desc = descVal;
        console.log(editArr);
        editTasks(editArr[0].id)
    } else {
        let newObj = {
            id: taskCount += 1,
            name: nameVal,
            desc: descVal,
            checked: false
        };
        tasks.push(newObj);
    }
    updateTasks(tasks);
    togglePrompt();
});

document.addEventListener('click', (e)=> {
    const target = e.target;
    if (target.classList.contains('tasks-wrap')) {
        console.log(target);
        tarTitle = e.target.querySelector('h4').innerText;
        tarDesc = e.target.querySelector('p').innerText;
        tarId = e.target.parentNode.id;
        let tempObj = {
            id: tarId,
            name: tarTitle,
            desc: tarDesc,
        };
        editArr.push(tempObj);
        togglePrompt();
    }
    if (target.classList.contains('fa-trash')) {
        deleteTask(target.parentElement.nextElementSibling.id);
    }
    if (target.classList.contains('mark-complete')) {
       target.closest('.tasks-wrap').classList.toggle('checked');
       target.closest('.tasks-wrap').classList.add(`${e.target.id}`);
       taskCheck(e.target.id);
    }
    if (target.classList.contains('prompt-close')) {
        togglePrompt();
    }
});

document.addEventListener('dragstart', e => {
    if (e.target.classList.contains('draggable')) {
       e.target.classList.add('dragging');
    }
});

document.addEventListener('dragend', e => {
    if (e.target.classList.contains('draggable')) {
       e.target.classList.remove('dragging');
    }
});


container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragElement(e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        container.appendChild(draggable);
    } else {
        console.log(container);
        container.insertBefore(draggable, afterElement);
    }
});

function getDragElement(y) {
    const draggableElems = [...document.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElems.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}