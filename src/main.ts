import './style.css'
import type { Task } from './type.ts'


let tasks: Task[] = [];

const form = document.querySelector('#task-form') as HTMLFormElement;
form.addEventListener('submit', (event) => {

  event.preventDefault();
  let taskTitle = (document.querySelector('#add-task') as HTMLInputElement).value;
  let priority = (document.querySelector('#priority') as HTMLSelectElement).value;
  let dueDate = (document.querySelector('#dueDate') as HTMLInputElement).value;
  const newTask: Task = {
    id: Date.now().toString(),
    taskTitle: taskTitle,
    priority: priority as 'Low' | 'Medium' | 'High',
    dueDate: dueDate,
    completed: false
  }

  tasks.push(newTask);
  renderTasks(tasks)
  form.reset();

})

let taskListItems = document.querySelector('#task-list-items') as HTMLUListElement;
function renderTasks(taskstodisplay: Task[]) {

  taskListItems.innerHTML = '';
  taskstodisplay.forEach((task) => {
    const taskHtml = `
<li>
  <div class="task-item-wrapper">

    <div class="task-item-info-left">

      <input 
        type="checkbox" 
        class="task-item-checkbox" 
        data-id="${task.id}"
        ${task.completed ? 'checked' : ''}
      >

      <div class="task-item-text-left-wrapper">

        <h3 class="task-item-text ${task.completed ? 'complete' : ''}">
          ${task.taskTitle}
        </h3>

        <div class="details">
          <span class="task-priority">${task.priority}</span>

          <div>
            <img src="/calendar-heart.svg" alt="yyjh">
            <span class="task-date">${task.dueDate}</span>
          </div>

        </div>

      </div>

    </div>

    <div class="task-item-actions-right">
    <button class="edit-btn" data-id="${task.id}">
      <img src="/pencil-fill.svg" alt="">
      </button>
    <button class="delete-btn" data-id="${task.id}">

      <img src="/trash3-fill.svg"  alt="">
      </button>

    </div>

  </div>
</li>`;

    if (task.completed) {
      taskListItems.insertAdjacentHTML('beforeend', taskHtml);
    } else {
      taskListItems.insertAdjacentHTML('afterbegin', taskHtml);


    }



  })

  let taskTotal = document.querySelector('#task-total') as HTMLSpanElement;
  let taskcomplete = document.querySelector('#task-completed') as HTMLSpanElement;

  taskTotal.innerHTML = `${tasks.length.toString()} tasks`
  let a: number = 0;
  for (const cmpltstask of tasks) {
    if (cmpltstask.completed) {
      a++;
    }
  }
  taskcomplete.innerHTML = `${a} completed`


}

taskListItems.addEventListener('change', (event) => {

  const checkbox = event.target as HTMLInputElement;

  if (checkbox.classList.contains('task-item-checkbox')) {



    const taskId = checkbox.dataset.id;

    const task = tasks.find((task) => task.id === taskId);

    if (task) {

      task.completed = checkbox.checked;



      renderTasks(tasks);
    }
  }
});

const filterbuttons = document.querySelectorAll<HTMLButtonElement>('.filter-btns button')

filterbuttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterbuttons.forEach((btns) => {
      btns.classList.remove('active')
    })
    btn.classList.add('active')
    const filter = btn.dataset.filter
    if (filter == 'all-task') {
      renderTasks(tasks)
    }
    else if (filter == 'active-task') {
      let active = tasks.filter((task) => task.completed == false)
      renderTasks(active)
    } else if (filter == 'completed-task') {
      let completed = tasks.filter((task) => task.completed)
      renderTasks(completed)
    }


  })
})

const deleteModal = document.querySelector('#delete-modal') as HTMLDivElement;
const deleteCancel = document.querySelector('#delete-cancel') as HTMLButtonElement;
const deleteConfirm = document.querySelector('#delete-confirm') as HTMLButtonElement;
let taskToDeleteId: string | null = null;

taskListItems.addEventListener('click', (event) => {

  const target = event.target as HTMLElement;

  const deleteButton =
    target.closest('.delete-btn') as HTMLButtonElement | null;

  const editButton =
    target.closest('.edit-btn') as HTMLButtonElement | null;

  if (deleteButton) {

    const id = deleteButton.dataset.id;

    if (!id) return;

    taskToDeleteId = id;

    deleteModal.style.display = 'flex';
  }




  if (editButton) {

    const id = editButton.dataset.id;

    if (!id) return;

    const task = tasks.find((task) => task.id === id);

    if (!task) return;

    editingTaskId = id;

    editTitle.value = task.taskTitle;
    editPriority.value = task.priority;
    editDate.value = task.dueDate;

    editModal.style.display = 'flex';
  }
});

deleteCancel.addEventListener('click', () => {

  deleteModal.style.display = 'none';

  taskToDeleteId = null;

});

deleteConfirm.addEventListener('click', () => {



  tasks = tasks.filter((task) => task.id !== taskToDeleteId);

  renderTasks(tasks);

  deleteModal.style.display = 'none';

  taskToDeleteId = null;

});

let editingTaskId: string | null = null;

const editModal =
  document.querySelector('#edit-modal') as HTMLDivElement;

const editTitle =
  document.querySelector('#edit-title') as HTMLInputElement;

const editPriority =
  document.querySelector('#edit-priority') as HTMLSelectElement;

const editDate =
  document.querySelector('#edit-date') as HTMLInputElement;

const editCancel =
  document.querySelector('#edit-cancel') as HTMLButtonElement;

editCancel.addEventListener('click', () => {

  editModal.style.display = 'none';

  editingTaskId = null;

});

const editSave =
  document.querySelector('#edit-save') as HTMLButtonElement;

editSave.addEventListener('click', () => {

  if (!editingTaskId) return;

  const task = tasks.find((task) => task.id === editingTaskId);

  if (!task) return;

  task.taskTitle = editTitle.value.trim();
  task.priority = editPriority.value as 'Low' | 'Medium' | 'High';
  task.dueDate = editDate.value;

  renderTasks(tasks);

  editModal.style.display = 'none';

  editingTaskId = null;
});

const sortSelect = document.querySelector('#sort') as HTMLSelectElement
sortSelect?.addEventListener('change', (event) => {
  const sortvalue = sortSelect.value

  if (sortvalue == 'newest') {
    const newestTask = [...tasks].sort((a, b) => {
      return Number(a.id) - Number(b.id)
    })
    renderTasks(newestTask)
  } else if (sortvalue == 'oldest') {
    const oldTask = [...tasks].sort((a, b) => {
      return Number(b.id) - Number(a.id)
    })
    renderTasks(oldTask)

  }else if(sortvalue=='high-priority'){
    const highTask=[...tasks].sort((a,b)=>{
      const priorityA = a.priority=== 'High' ? 3 : a.priority=== 'Medium' ? 2 : 1;
      const priorityB = b.priority=== 'High' ? 3 : b.priority=== 'Medium' ? 2 : 1;
      return priorityA - priorityB

    })
    renderTasks(highTask)
  } else if(sortvalue=='low-priority'){
    const highTask=[...tasks].sort((a,b)=>{
      const priorityA = a.priority=== 'High' ? 3 : a.priority=== 'Medium' ? 2 : 1;
      const priorityB = b.priority=== 'High' ? 3 : b.priority=== 'Medium' ? 2 : 1;
      return priorityB - priorityA

    })
    renderTasks(highTask)

  }

})

