export interface Task{
    id:string;
    taskTitle:string;
    priority: 'Low' | 'Medium' | 'High';
    dueDate:string;
    completed:boolean;
}