import './style.css'
import type { Task } from './type.ts'


let tasks: Task[] = [];
let newTaskId: string | null = null;
let taskListItems = document.querySelector('#task-list-items') as HTMLUListElement;

const savedTasks = localStorage.getItem('tasks');

if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

renderTasks(tasks);

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

  newTaskId = newTask.id;
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks)
  form.reset();

})

function renderTasks(taskstodisplay: Task[]) {

  taskListItems.innerHTML = '';
  taskstodisplay.forEach((task) => {
    const taskHtml = `
<li class="${task.id === newTaskId ? 'task-enter' : ''}">
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
          <span class="task-priority priority-${task.priority}">${task.priority}</span>

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
    newTaskId = null; 

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


      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks(tasks);
       if (task.completed) {        // <-- new
        triggerArise(task.id);     // <-- new
      }  

      
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
  const idToDelete = taskToDeleteId;
  if (!idToDelete) return;

  deleteModal.style.display = 'none';
  taskToDeleteId = null;

  const checkbox = document.querySelector(
    `.task-item-checkbox[data-id="${idToDelete}"]`
  );
  const li = checkbox?.closest('li');

  const finishDelete = () => {
    tasks = tasks.filter((task) => task.id !== idToDelete);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
  };

  if (li) {
    li.classList.add('task-dissolve');
    setTimeout(finishDelete, 700);
  } else {
    finishDelete();
  }
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
localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks);

  editModal.style.display = 'none';

  editingTaskId = null;
});

const sortSelect = document.querySelector('#sort') as HTMLSelectElement
sortSelect?.addEventListener('change', () => {
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

function triggerArise(taskId: string) {
  const newCheckbox = document.querySelector(
    `.task-item-checkbox[data-id="${taskId}"]`
  ) as HTMLInputElement | null;

  const li = newCheckbox?.closest('li');
  if (!li) return;

  li.classList.add('arise');
  setTimeout(() => li.classList.remove('arise'), 1800);

  showAriseBanner();
}

function showAriseBanner() {
  const banner = document.createElement('div');
  banner.className = 'arise-banner';
  banner.innerHTML = `
    <span class="arise-sub">[ QUEST COMPLETE ]</span>
    <span class="arise-main">ARISE</span>
  `;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 1700);
}


// ===== Day / Night toggle =====
const themeToggle = document.querySelector('#theme-toggle') as HTMLButtonElement;

if (localStorage.getItem('theme') === 'day') {
  document.body.classList.remove('night');
}

themeToggle.addEventListener('click', () => {
  const isNight = document.body.classList.toggle('night');
  localStorage.setItem('theme', isNight ? 'night' : 'day');
});


// ===== Transparent purple smoke trail =====
interface SmokePuff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  growth: number;
  hue: number;
}

if (window.matchMedia('(pointer: fine)').matches) {
  const canvas = document.createElement('canvas');
  canvas.id = 'aura-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const puffs: SmokePuff[] = [];
  let lastX = 0;
  let lastY = 0;
  let hasMoved = false;

  window.addEventListener('mousemove', (e) => {
    if (!hasMoved) {
      lastX = e.clientX;
      lastY = e.clientY;
      hasMoved = true;
      return;
    }

    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    lastX = e.clientX;
    lastY = e.clientY;

    // smoke only appears while the cursor is moving
    if (dist > 1 && puffs.length < 120) {
      const count = Math.min(2, 1 + Math.floor(dist / 25));
      for (let i = 0; i < count; i++) {
        puffs.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(0.1 + Math.random() * 0.3),
          life: 0,
          maxLife: 55 + Math.random() * 35,
          size: 8 + Math.random() * 6,
          growth: 1.012 + Math.random() * 0.008,
          hue: 268 + Math.random() * 14,
        });
      }
    }
  });

  function animateSmoke() {
    const night = document.body.classList.contains('night');
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = 'source-over';

    for (let i = puffs.length - 1; i >= 0; i--) {
      const p = puffs[i];
      p.life++;
      if (p.life >= p.maxLife) {
        puffs.splice(i, 1);
        continue;
      }

      p.x += p.vx + Math.sin(p.life * 0.07 + p.hue) * 0.2;
      p.y += p.vy;
      p.size *= p.growth;

      // fade in quickly, then fade out slowly
      const fadeIn = Math.min(1, p.life / 8);
      const fadeOut = 1 - p.life / p.maxLife;
      const alpha = (night ? 0.16 : 0.14) * fadeIn * fadeOut;

      const lightness = night ? 78 : 66;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, `hsla(${p.hue}, 65%, ${lightness}%, ${alpha})`);
      g.addColorStop(1, `hsla(${p.hue}, 65%, ${lightness}%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animateSmoke);
  }
  animateSmoke();
}

