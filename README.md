// To-do application

// Define a ToDo class with the following fields:
// owner (string), task (string), dueDate (date), category (string), status (string), id (number)
class ToDo {
  constructor(owner, task, dueDate, category, status, id) {
    this.owner = owner;
    this.task = task;
    this.dueDate = dueDate;
    this.category = category;
    this.status = status;
    this.id = id;	th
	
  }
}

// Create an array to store multiple ToDo objects
let todos = [];

// Create a few sample ToDo objects
let todo1 = new ToDo("John Doe", "Submit report", "2022-12-08", "Work", "In progress", 1);
let todo2 = new ToDo("Jane Doe", "Buy groceries", "2022-12-09", "Personal", "Not started", 2);
let todo3 = new ToDo("John Doe", "Attend meeting", "2022-12-10", "Work", "Not started", 3);

// Add the sample ToDo objects to the array
todos.push(todo1);
todos.push(todo2);
todos.push(todo3);

// Log the array of ToDo objects
console.log(todos);
