
const taskHeads =  ["name", "age", "status"]
// const tasks = []
const addForm = document.querySelector("#addForm")
const dataWrap = document.querySelector("#dataWrap")
const single = document.querySelector("#single")
const editUser = document.querySelector("#editUser")
const statusButton = document.querySelector("#statusButton")

const readFromStorage = (key= "tasks", dataType="array") => {
    let data
    try{
        data = JSON.parse(localStorage.getItem(key)) || []
        if(!Array.isArray(data) && dataType=="array") throw new Error("data is not an array")
    }
    catch(e){
        data = []
    }
    return data
}

const writeToStorage = (data, key="tasks") => {
    localStorage.setItem(key, JSON.stringify(data))
}

const createTaskObject = (addForm) =>{
    let task = { id:Date.now() }
    taskHeads.forEach(head => task[head]= addForm.elements[head].value)
    return task 
}
const createMyOwnEle = (eleTag, parent, txtContent=null, classes=null) =>{
    const myNewElement = document.createElement(eleTag)
    if(classes)  myNewElement.classList = classes
    if(txtContent) myNewElement.innerText= txtContent
    parent.appendChild(myNewElement)
    return myNewElement
}

const userStatues = (tasks, task) => {
    if(task.status == 'active'){
        task.status = 'not active';
    }
    else{
        task.status = 'active';
    }
    console.log(task.status);
    writeToStorage(tasks);
    draw(tasks);
}

const editTask = (task) => {
    writeToStorage(task , "item")
    //"ok"
    window.location.href = "edit.html"  
}

const delTask = (tasks, i)=>{
    tasks.splice(i,1)
    writeToStorage(tasks)
    draw(tasks)
}

const showSingle = (task)=>{
    // localStorage.setItem("itemId", i)
    writeToStorage(task , "item")
    window.location.href = "single.html"
}
const draw = (tasks) => {
    dataWrap.innerHTML=""
    if(tasks.length==0){
        let tr = createMyOwnEle("tr", dataWrap, null, "alert alert-danger")
        let td = createMyOwnEle("td", tr, "no data found", "alert alert-danger")
        td.setAttribute("colspan", "5")
    }
    tasks.forEach((task, i)=>{
        let tr = createMyOwnEle("tr", dataWrap)
        createMyOwnEle("td", tr, task.id)
        createMyOwnEle("td", tr, task.name)
        createMyOwnEle("td", tr, task.age)
        createMyOwnEle("td", tr, task.status)
        let td = createMyOwnEle("td", tr)
        
        let status = createMyOwnEle("button", td, "Status", "btn btn-primary mx-2 slider")
        // let s = true;
        status.addEventListener("click", ()=>userStatues(tasks, tasks[i]) )
        let delBtn = createMyOwnEle("button", td, "delete", "btn btn-danger mx-2")
        delBtn.addEventListener("click", ()=>delTask(tasks, i) )

        let editBtn = createMyOwnEle("button", td, "edit", "btn btn-warning mx-2")
        editBtn.addEventListener("click", ()=>editTask(tasks[i]))

        let showBtn = createMyOwnEle("button", td, "show", "btn btn-success mx-2")
        showBtn.addEventListener("click", ()=> showSingle(tasks[i] ) )

    })
}

if(addForm){
    addForm.addEventListener("submit", function(e){
        e.preventDefault()
        const task = createTaskObject(this)
        if(statusButton.checked){
            task.status = 'active';
        }
        else{
            task.status = 'not active';
        }
        const tasks = readFromStorage()
        tasks.push(task)
        writeToStorage(tasks)
        window.location.href="index.html"
    })
}

if(editUser){
    let task = readFromStorage("item", "object")
    
    let inp1 = document.querySelector("#inp1")
    let inp2 = document.querySelector("#inp2")
    let inp3 = document.querySelector("#inp3")

    inp1.value = task.name;
    inp2.value = task.age;
    inp3.value = task.status;

    editUser.addEventListener("submit", function(e){
        e.preventDefault() 
        const task = readFromStorage("item", "object")    
        console.log(task);    
        const tasks = readFromStorage()
        tasks.forEach((t)=> t.id === tasks.id)
        let i = tasks.findIndex(t => t.id === task.id);
        task.name = inp1.value;
        task.age = inp2.value;
        task.status = inp3.value;
        tasks.splice(i,1,task)
        writeToStorage(tasks)
        window.location.href="index.html"
    })
}

if(dataWrap) {
    const tasks = readFromStorage()
    draw(tasks)
}

if(single){
    // console.log("test")
    const task = readFromStorage("item", "object")
    console.log(task);
    if(Array.isArray(task)) createMyOwnEle("div", single, "no data to show", "alert alert-danger")
    else{
        createMyOwnEle("div", single, task.id, "alert alert-primary")
        createMyOwnEle("div", single, task.name, "alert alert-primary")
        createMyOwnEle("div", single, task.age, "alert alert-primary")
        createMyOwnEle("div", single, task.status, "alert alert-primary")
    } 
}