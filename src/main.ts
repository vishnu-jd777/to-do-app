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
        priority: priority as 'low' | 'medium' | 'high',
        dueDate: dueDate,
        completed: false
    }

    console.log('Form submitted', taskTitle, priority, dueDate);
    tasks.push(newTask);
    console.log('Tasks:', tasks);
    renderTasks();
    form.reset();

})

let taskListItems = document.querySelector('#task-list-items') as HTMLUListElement;
function renderTasks() {

    taskListItems.innerHTML = '';
    tasks.forEach((task) => {
        const taskHtml = `
        <li>
          <div class="task-item-wrapper">

            <div class="task-item-info-left">
              <input type="checkbox" class="task-item-checkbox">
              <div class="task-item-text-left-wrapper">
                <h3 class="task-item-text">${task.taskTitle}</h3>
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
              <img src="/pencil-fill.svg" alt="">
              <img src="/trash3-fill.svg" alt="">

            </div>
          </div>
        </li>`

        taskListItems.insertAdjacentHTML('beforeend', taskHtml);



    })

    let taskTotal = document.querySelector('#task-total') as HTMLSpanElement;
    let taskcomplete = document.querySelector('#task-completed') as HTMLSpanElement;

    taskTotal.innerHTML=`${tasks.length.toString()} tasks`



}