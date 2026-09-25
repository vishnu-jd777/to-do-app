export interface Task{
    id:string;
    taskTitle:string;
    priority: 'low' | 'medium' | 'high';
    dueDate:string;
    completed:boolean;
}