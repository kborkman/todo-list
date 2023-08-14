let tasksCreateContainer = document.getElementById("tasks-create");
let tasksCompleteContainer = document.getElementById("tasks-complete");
let closeIcon = document.querySelector(".prompt-close");
let completedTitle = document.getElementById("completed-title");
let completedCounter = document.getElementById("completed-number");
let completedPlural = document.getElementById("completed-plural");
let prompt = document.getElementById("prompt");
let addTaskIcon = document.getElementById("prompt-click");
let updateBtn = document.getElementById("prompt-submit");
let inputName = document.getElementById("input-name");
let inputDesc = document.getElementById("input-desc");
let tasks = [];
let editTaskObj = null;

//global event listeners (elements that exist when page loads)
tasksCreateContainer.addEventListener("dragover", onDragOver);
closeIcon.addEventListener("click", togglePrompt);
addTaskIcon.addEventListener("click", addTaskBtnClicked);
updateBtn.addEventListener("click", promptSubmit);

// Create Tasks Dom 
function updateTasks() {
  tasksCreateContainer.innerHTML = "";
  tasksCompleteContainer.innerHTML = "";

  tasks.forEach((task) => {
    // no need to do anything if the task already exists
    // 'return' makes `forEach()` skip to next iteration.
    // Early returns help make code more efficient.
    if (document.getElementById(task.id)) return;

    let tasksContainer;
    let taskEl = document.createElement("div");

    if (task.checked) {
      tasksContainer = tasksCompleteContainer;
    } else {
      tasksContainer = tasksCreateContainer;
    }

    taskEl.id = task.id;
    taskEl.classList.add("draggable");
    taskEl.draggable = true;
    taskEl.innerHTML = `
        <div class='tasks-wrap border-glow ${task.checked ? "checked" : ""}'>
            <div class="tasks-left">
                <h4>${task.name}</h4>
                <p>${task.desc}</p>
            </div>
            <div id="check-wrap" class="tasks-right">
                <div class="prompt-delete"><i class="fa fa-trash"></i></div>
                <input type="checkbox" id="${task.id}" class="mark-complete" ${
      task.checked ? "checked" : ""
    }>
            </div>
        </div>`

    //apply listeners to taskEl tag here
    taskEl.addEventListener("dragstart", onDrag);
    taskEl.addEventListener("dragend", onDrag);
    tasksContainer.appendChild(taskEl);

    // all other elements above had to be added to DOM first before we can apply listeners
    taskEl.querySelector(".tasks-left").addEventListener("click", updateTask);
    taskEl.querySelector(".fa-trash").addEventListener("click", deleteTask);
    taskEl
      .querySelector(".mark-complete")
      .addEventListener("change", toggleIsComplete);
  });
  updateCompletedUI();
}

function updateCompletedUI() {
  // filter returns all array elements that match conditional
  let completedTasksCount = tasks.filter((task) => task.checked).length;
  completedCounter.innerText = completedTasksCount;

  //handle title
  if (completedTasksCount) {
    completedTitle.classList.remove("hidden");
  } else {
    completedTitle.classList.add("hidden");
  }

  //handle plural
  if (completedTasksCount > 1) {
    completedPlural.classList.remove("hidden");
  } else {
    completedPlural.classList.add("hidden");
  }
}

// made a single function to handle all drag events
function onDrag(e) {
  switch (e.type) {
    case "dragstart":
      e.target.classList.add("dragging");
      break;
    case "dragend":
      e.target.classList.remove("dragging");
      break;
  }
}

function updateTask(e) {
  let taskId = e.target.closest(".draggable").id;
  // 'find' method returns first array item satisfying conditional
  let task = tasks.find((task) => task.id == taskId);
  editTaskObj = {
    id: task.id,
    name: task.name,
    desc: task.desc
  };
  inputName.value = task.name;
  inputDesc.value = task.desc;
  togglePrompt();
}

function taskCheck(id) {
  tasks.forEach((task) => {
    if (task.id != id) return;
    task.checked = !task.checked;
  });
  updateTasks();
}

function deleteTask(e) {
  let taskId = parseInt(e.target.closest(".draggable").id);
  let taskIdx = tasks.findIndex((task) => task.id == taskId);
  tasks.splice(taskIdx, 1);
  updateTasks();
}

function addTaskBtnClicked() {
  inputName.value = "";
  inputDesc.value = "";
  togglePrompt();
}

function togglePrompt() {
  if (prompt.open) {
    prompt.close();
  } else {
    prompt.show();
  }
}

function editTasks(id) {
  tasks.forEach((task) => {
    // skip to next iteration if ids don't match
    if (task.id != id) return;

    task.name = editTaskObj.name;
    task.desc = editTaskObj.desc;
  });
  editTaskObj = null;
  updateTasks();
}

function toggleIsComplete(e) {
  e.target.closest(".tasks-wrap").classList.toggle("checked");
  e.target.closest(".tasks-wrap").classList.add(e.target.id);
  taskCheck(e.target.id);
}

function promptSubmit(e) {
  e.preventDefault();
  let nameVal = document.getElementById("input-name").value;
  let descVal = document.getElementById("input-desc").value;
  if (editTaskObj) {
    editTaskObj.name = nameVal;
    editTaskObj.desc = descVal;
    editTasks(editTaskObj.id);
  } else {
    tasks.push({
      id: tasks.length + 1,
      name: nameVal,
      desc: descVal,
      checked: false
    });
  }
  updateTasks();
  togglePrompt();
}

function onDragOver(e) {
  e.preventDefault();
  const afterElement = getDragElement(e.clientY);
  const draggable = document.querySelector(".dragging");
  if (!afterElement) {
    tasksCreateContainer.appendChild(draggable);
  } else {
    tasksCreateContainer.insertBefore(draggable, afterElement);
  }
}

function getDragElement(y) {
  const draggableElems = [
    ...document.querySelectorAll(".draggable:not(.dragging)")
  ];

  return draggableElems.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
