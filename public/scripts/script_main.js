let btnSaveOption=0;

//Toggle "New task" visible (From NavBar New and dialog Buttons)/*
document.querySelector("nav ul li:nth-of-type(1)").addEventListener("click", ()=>{
    clearNewTaskDialog();
    btnSaveOption=dataArray.length;
    document.getElementById("new_task").classList.toggle("invisible");
});

document.getElementById("new_task_btns__btnCancel").addEventListener("click", ()=>{
    document.getElementById("new_task").classList.toggle("invisible");
});

//Array to store the tasks
let dataArray=[];

//Retrieve InternalStorage information (will be a JSON file, we'll need to parse it into a JS Object)
if(localStorage.getItem('miTaskList')!==null){
    dataArray=JSON.parse(localStorage.getItem('miTaskList'));
    btnSaveOption=dataArray.length;
    refreshTaskView();
}

//Add data to the screen
function refreshTaskView(){
    document.getElementById("task_view").innerHTML="";
    dataArray.forEach(x=>addTasksToDoc(x));
    refreshContextMenuListener();
}

/* -Object Model-
let toDoTaskObject={
    done:"",
    title:"",
    category:"",
    task:""
}*/

//Locate inputs for a new task
const input_titleText=document.getElementById("new_task__input_title");
const input_categoryText=document.getElementById("new_task__input_category");
const input_taskText=document.getElementById("new_task__input_task");
const input_doneText=document.getElementById("new_task__task_done");

//Save button funcionality
document.getElementById("new_task_btns__btnSave").addEventListener("click", ()=>{
    
    if(btnSaveOption===dataArray.length){
        btnSaveAdd(dataArray.length);
    }
    else{
        btnSaveAdd(btnSaveOption);        
    }
    
    refreshContextMenuListener();
});

//Checking not equal titles among stored tasks. Returns true on match
function TaskTitlesNotRepeated(newTaskTitle){
    
    let aMatch=false;
    dataArray.forEach( function(eachObj){
        
        if(eachObj.title===newTaskTitle.trim()){
            aMatch=true;
        }
    });

    return aMatch;    
}

//Add a task to the document
function addTasksToDoc(oneTask){
    let newTaskContainer = document.createElement("article");
    let newTaskCheckBox = document.createElement("input");
        newTaskCheckBox.setAttribute("type", "checkbox");
        newTaskCheckBox.checked=oneTask.done;
        newTaskCheckBox.setAttribute("id", oneTask.title);
    let newTaskTitle = document.createElement("p");
        newTaskTitle.textContent=oneTask.title;
    let newTaskCategory = document.createElement("p");
        newTaskCategory.textContent = oneTask.category;
    let newTaskDesc = document.createElement("p");
        newTaskDesc.textContent = oneTask.task;

    let arrayContents=[newTaskCheckBox, newTaskTitle, newTaskCategory, newTaskDesc];

    arrayContents.forEach((eachArrayComponent)=>{
        newTaskContainer.appendChild(eachArrayComponent);
    });

    document.getElementById("task_view").appendChild(newTaskContainer);
}


function refreshContextMenuListener(){

    document.querySelectorAll("#task_view article").forEach((x, index)=>{
        
        let clickDown=0;
        let clickUp=0;
        let lcTolerance=500;
        let IsLongClick;

        if(window.innerWidth>780){
            x.addEventListener("mousedown", (event)=>{        

                event.preventDefault();
        
                clickDown=Date.now();
            
                x.addEventListener("mouseup",(event)=>{
        
                    event.preventDefault();
        
                    clickUp=Date.now();
        
                    if(clickUp-clickDown>=lcTolerance){
                        IsLongClick = true;
    
                        deleteTask(index);
                    }
                    else{
    
                        document.getElementById("new_task").classList.toggle("invisible");
        
                        input_doneText.checked=dataArray[index].done;
                        input_titleText.value=dataArray[index].title;
                        input_categoryText.value=dataArray[index].category;
                        input_taskText.value=dataArray[index].task;
                
                        btnSaveOption=index;
    
                    }                 
                });      
        
            });

        }
        else{

            x.addEventListener("touchstart", (event)=>{        

                event.preventDefault();
        
                clickDown=Date.now();
            
                x.addEventListener("touchend",(event)=>{
        
                    event.preventDefault();
        
                    clickUp=Date.now();
        
                    if(clickUp-clickDown>=lcTolerance){
                        IsLongClick = true;
    
                        deleteTask(index);
                    }
                    else{
    
                        document.getElementById("new_task").classList.toggle("invisible");
        
                        input_doneText.checked=dataArray[index].done;
                        input_titleText.value=dataArray[index].title;
                        input_categoryText.value=dataArray[index].category;
                        input_taskText.value=dataArray[index].task;
                
                        btnSaveOption=index;
    
                    }                 
                });      
        
            });

        }       

    });
}

function btnSaveAdd(whereToSaveIndataArray){

    if(input_titleText.value.trim().length > 0){
        if(!TaskTitlesNotRepeated(input_titleText.value) || (whereToSaveIndataArray<dataArray.length) ){
            dataArray[whereToSaveIndataArray]={
                done:input_doneText.checked,
                title:input_titleText.value,
                category: input_categoryText.value,
                task: input_taskText.value
            };

            document.getElementById("new_task").classList.toggle("invisible");
            localStorage.setItem('miTaskList', JSON.stringify(dataArray));
            refreshTaskView();
            refreshContextMenuListener();
        }
        else{window.alert(`${input_titleText.value} already exists`);}
    }
    else{window.alert("Your task is meant to have a title at least");}
}

function clearNewTaskDialog(){
    input_doneText.checked=false;
        input_titleText.value="";
        input_categoryText.value="";
        input_taskText.value="";
}

function deleteTask(index){
    if(window.confirm(`This will delete the task "${dataArray[index].title}". Are you sure?`)){
        dataArray.shift(index);
        refreshTaskView();
        //localStorage.setItem('miTaskList', JSON.stringify(dataArray));
    };
}




 