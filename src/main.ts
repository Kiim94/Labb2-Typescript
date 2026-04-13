import './style.scss'
//begränsa så prioriteter bara kan vara 1, 2, 3
type Prio = 1 | 2 | 3;

interface Todo{
  task: string;
  completed: boolean;
  priority: Prio;
}

/*klass är ritningen/instruktioner om vad en viss del i appen kan göra.
Bestämmer vilka egenskaper/data som finns (t.ex. task, completed, priority).
Bestämmer vilka metoder/handlingar som går att göra med datan. 
I detta fall lägga till, markera klart, hämta, spara och ladda*/
class TodoList {
  //ska använda en array i constructor som heter todos. En array med objekt som är modellerade efter Todo-interface
  todos: Todo[] = [];

  //constructor - körs automatiskt när objekt skapas. Den "bygger" det första som behövs/ska användas
  constructor(){
    //skapar tom array som används direkt
    this.todos = [];
    //ladda sparades todos automatiskt
    this.loadFromLocalStorage();
  }

  //lägg till todo. Med validering så att korrekt info läggs in
  addTodo(task: string, priority: number): boolean{
    if(task.trim() === ""){
      alert("Kom ihåg att fylla i en uppgift!");
      return false;
    }
    if(![1, 2, 3].includes(priority)){
      alert("Ogiltig prioritering! Välj antingen 1, 2 eller 3!");
      return false;
    }
    //om allt är korrekt ifyllt, fortsätt med todo-uppgift
    const newTodo: Todo = {
      task,
      completed: false,
      priority: priority as Prio
    };
    //pga att addTodo ska returnera en boolean så måste man returnera true här, även fastän man "vet" att det är en else från en if/else
    this.todos.push(newTodo);
    return true;
  }

  //markera todo som klar
  markTodoCompleted(todoIndex: number): void{
    //om todoIndexet är mer än eller lika med 0 och om det är mindre än längden på arrayen todos, markera den som "klar", alltså boolean = true
    if(todoIndex >= 0 && todoIndex < this.todos.length){
      this.todos[todoIndex].completed = true;
    }else{
      alert("Det gick inte att klarmarkera! Försök igen eller radera");
      return;
    }
  }
  //radera todo
  deleteTodo(todoIndex: number): void{
    //nästan samma som markTodo - använder splice för att "skära bort" det som blivit klickat på
    if(todoIndex >= 0 && todoIndex < this.todos.length){
      this.todos.splice(todoIndex, 1);
    }else{
      alert("Det gick inte att ta bort! Försök igen")
    }
  }

  //hämta alla todos från array
  getTodos(): Todo[]{
    const copyTodos = this.todos.slice();
    return copyTodos;
  }

  //localStorage metoder. Blir void pga att vi inte vill "visa" eller hämta ngt, vi laddar om eller spara färdiga värden
  //spara i localstorage
  saveToLocalStorage(): void{
    //gör array till sträng för att kunna sparas i localStorage
    const todoString = JSON.stringify(this.todos);
    //sparas med todos som nyckel - unikt namn för just todo-listan
    localStorage.setItem("todos", todoString);
  }
  loadFromLocalStorage(): void{
    const todoString = localStorage.getItem("todos");
    if(todoString){
      this.todos = JSON.parse(todoString);
    }
  }
}

//DOM delen
//hämta de html element som behövs
const taskInput = document.getElementById("task") as HTMLInputElement;
const prioSelect = document.getElementById("prio") as HTMLSelectElement;
const ulTodoList = document.getElementById("todoList") as HTMLUListElement;
const todoForm = document.getElementById("todoForm") as HTMLFormElement;

//skapa variabel som "börjar om" en class TodoList()
const newTodoList = new TodoList();

function renderTodos(): void{
  //töm listan
  ulTodoList.innerHTML = "";
  newTodoList.getTodos().forEach((todo, index) => {
    const li = document.createElement("li");
    li.innerHTML = "<b>" + todo.task + "</b>" + " - Prioritet:" + todo.priority;
    
    //en klar knapp
    const doneBtn = document.createElement("button");
    doneBtn.textContent="✔";
    doneBtn.classList.add("done");
    doneBtn.addEventListener("click", () => {
      newTodoList.markTodoCompleted(index);
      newTodoList.saveToLocalStorage();
      renderTodos();
    })

    //en radera knapp
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.classList.add("delete");
    delBtn.addEventListener("click", () => {

      /*Hade detta innan deleteTodo i class TodoList:
      todoList.todos.splice(index, 1);*/
      newTodoList.deleteTodo(index);
      newTodoList.saveToLocalStorage();
      renderTodos();
    })
    if(todo.completed){
      li.style.textDecoration = "line-through";
      li.style.color = "grey";
    }

    li.appendChild(doneBtn);
    li.appendChild(delBtn);
    ulTodoList.appendChild(li);
  })
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = taskInput.value;
  //pga select så är värdet alltid en sträng. Fungerar inte med Prio (som är nummer)
  const prioValue = prioSelect.value;
  if(prioValue === ""){
    alert("Välj en prioritet!");
    return;
  }
  //gör om select värdet till nummer
  const priority = Number(prioValue);
  const add = newTodoList.addTodo(task, priority);

  if(add){
    newTodoList.saveToLocalStorage();
    renderTodos();

    taskInput.value="";
    prioSelect.value = "";
  }
})
renderTodos()