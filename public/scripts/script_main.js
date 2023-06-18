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

//
document.querySelector("nav ul li:nth-of-type(2)").addEventListener("click", (event)=>{
    document.getElementById("filter_task").classList.toggle("invisible");
    
    document.getElementById("filter_task").style.top=event.clientY+scrollY+7+"px";
    document.getElementById("filter_task").style.left=event.clientX+scrollX+7+"px";

    
    document.getElementById("li_todo").addEventListener("click", ()=>{
        dataArray.sort((a,b)=>a.done-b.done);
        refreshTaskView();
    });

    document.getElementById("li_done").addEventListener("click", ()=>{
        dataArray.sort((a,b)=>b.done-a.done);
        refreshTaskView();
    });

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

//Refresh the whole page. Resets the listeners.
function refreshContextMenuListener(){

    if (!document.getElementById("filter_task").classList.contains("invisible")){
        document.getElementById("filter_task").classList.toggle("invisible");
    }
    try{
        document.getElementById("bubbleTag").remove;        
    }
    catch{}

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
                        showDeleteTag(event.clientX+scrollX, event.clientY+scrollY, index);                       
                    }
                    else{
    
                        //document.getElementById("new_task").classList.toggle("invisible");
        
                        showTaskDetail(event.screenY);

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
            
                x.addEventListener("touchend",(event2)=>{
        
                    event2.preventDefault();
        
                    clickUp=Date.now();
        
                    if(clickUp-clickDown>=lcTolerance){
                        IsLongClick = true;
    
                        showDeleteTag(event.touches[0].clientX+scrollX, event.touches[0].clientY+scrollY, index);
                    }
                    else{
    
                        //document.getElementById("new_task").classList.toggle("invisible");

                        showTaskDetail(event.touches[0].screenY);
        
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
    checkboxEmancipation();
}

//Saves the added task on button hit
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

//Deletes the information setted in the form
function clearNewTaskDialog(){
    input_doneText.checked=false;
    input_titleText.value="";
    input_categoryText.value="";
    input_taskText.value="";
}

//Deletes task and gets it away from localStorage
function deleteTask(index, bubbleTag){
    if(window.confirm(`This will delete the task "${dataArray[index].title}". Are you sure?`)){
        
        dataArray.splice(index,1);
       
        //localStorage.setItem('miTaskList', JSON.stringify(dataArray));
    };
    document.getElementById("task_view").removeChild(bubbleTag);
    refreshTaskView();
}

//Shows a kind of Menu to delete a task
function showDeleteTag(xPos, yPos, index){

    let bubbleTag = document.createElement("p");

    bubbleTag.setAttribute("id", "bubbleTag");
    bubbleTag.textContent="Delete";
    
    bubbleTag.style.top=yPos-15+"px";
    bubbleTag.style.left=xPos+"px";    

    bubbleTag.classList.add("floating_bubble");   

    document.getElementById("task_view").appendChild(bubbleTag);
/*
    setTimeout(()=>{
        if(typeof(document.getElementById("task_view").removeChild(bubbleTag))!=='undefined'){
           // document.getElementById("task_view").removeChild(bubbleTag);
            refreshTaskView();
        }
        
        }, 2000);*/

    bubbleTag.addEventListener("click", (event)=>{

        if(event.target===bubbleTag){
            deleteTask(index,bubbleTag);
        }
        else{
            document.getElementById("task_view").removeChild(bubbleTag);
        }        
    });
}

//Avoids article (parent) eventListeners to be able to complete a task from the main layout (Desktop & mobile 780px break point)
function checkboxEmancipation(){

    document.querySelectorAll("#task_view input[type='checkbox']").forEach((x, index)=>{
    
        if(window.innerWidth>780){
            
            x.addEventListener("mousedown", function(event){               
           
                event.stopPropagation();  
                
                if(x.checked){
                    dataArray[index].done=false;
                    x.checked=false;
                }
                else{
                    dataArray[index].done=true;
                    x.checked=true;
                } 
        
                localStorage.setItem('miTaskList', JSON.stringify(dataArray));
                refreshTaskView();
            });
        }
        else{
            x.addEventListener("touchstart", function(event){               
           
                event.stopPropagation();  
                
                if(x.checked){
                    dataArray[index].done=false;
                    x.checked=false;
                }
                else{
                    dataArray[index].done=true;
                    x.checked=true;
                } 
        
                localStorage.setItem('miTaskList', JSON.stringify(dataArray));
                refreshTaskView();
            });
            x.addEventListener("touchend", function(event){               
           
                event.stopPropagation(); 
                event.preventDefault(); 
            });
        }        
    });
}

function showTaskDetail(){

    document.getElementById("new_task").classList.toggle("invisible");
    document.getElementById("new_task").style.top=window.scrollY+10+"px";
}








 