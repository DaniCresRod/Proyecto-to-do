//Toggle "New task" visible (From NavBar New and dialog Buttons)/*
document.querySelector("nav ul li:nth-of-type(1)").addEventListener("click", ()=>{
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
}

console.log(dataArray);

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
    
    if(input_titleText.value.trim().length > 0){
        if(!TaskTitlesNotRepeated(input_titleText.value)){
            dataArray.push({
                done:input_doneText.checked,
                title:input_titleText.value,
                category: input_categoryText.value,
                task: input_doneText.value
            });
            //document.getElementById("new_task").classList.toggle("invisible");
            localStorage.setItem('miTaskList', JSON.stringify(dataArray))
        }
        else{window.alert(`${input_titleText.value} already exists`);}
    }
    else{window.alert("Your task is meant to have a title at least");}
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
 