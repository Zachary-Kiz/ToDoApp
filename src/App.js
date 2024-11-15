import logo from './logo.svg';
import plus from './assets/plus.svg';
import trash from './assets/trash-svgrepo-com.svg'
import './App.css';
import { useEffect, useState } from 'react';

export default function ToDoPage() {

  const [isBlurred, setIsBlurred] = useState(false);
  const [projects, setProjects] = useState(() => {
    const storedProj = window.localStorage.getItem('projects');
    const initVal = storedProj ? JSON.parse(storedProj) : [];
    return Array.isArray(initVal) ? initVal : [];
  });
  const [tasks, setTasks] = useState(() => {
    try {
      const storedTasks = window.localStorage.getItem("tasks");
      const initialVal = storedTasks ? JSON.parse(storedTasks) : [];
      return Array.isArray(initialVal) ? initialVal : [];
    } catch (error) {
      console.error("Error parsing stored tasks:", error);
      return [];
    }
  });
  const [currentProj, setCurrentProj] = useState("Home");
  const [currentTasks, setCurrentTasks] = useState([])

  


  useEffect(() => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks.length])

  useEffect(() => {
    window.localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects.length])
  
  function unBlur() {
    if (isBlurred) {
      setIsBlurred(false);
      const create = document.querySelector('.create-task');
      create.style['display'] = 'none';
      const details = document.getElementById('taskDetails');
      details.style['display'] = 'none';
    }
  }

  return (
    <>
  <div id="body" className={isBlurred ? 'blur' : ''} onClick={unBlur}>
  <Sidebar tasks={tasks} setCurrentTasks={setCurrentTasks} setCurrentProj={setCurrentProj} setIsBlurred={setIsBlurred} projects={projects}/>
  <ProjPage currentProj={currentProj} tasks={currentTasks} setTasks={setTasks} setIsBlurred={setIsBlurred}></ProjPage>
  </div>
  <div id="popups">
  <CreateTask tasks={tasks} setTasks={setTasks} projects={projects} setProjects={setProjects} setIsBlurred={setIsBlurred} currentProj={currentProj}/>
  <ShowDetails setIsBlurred={setIsBlurred}/>
  </div>
  </>
);
}

function ProjPage({currentProj, tasks, setTasks, setIsBlurred}) {
  
  return (
    <div className='projPage'>
      <h1 className='header'>{currentProj}</h1>
      {tasks.map((task, index) => (
        <Task key={index} task={task} num={index} setTasks={setTasks} setIsBlurred={setIsBlurred}/>
      ))}
    </div>
  )
}

function Task({ task,num, setTasks, setIsBlurred }) {

  const [completed, setCompleted] = useState(false);

  function addStrike(id) {
    let elem = document.getElementById(id);
    elem.classList.toggle('strike');
    if (elem.classList.contains('strike')) {
      setCompleted(true);
    } else {
      setCompleted(false);
    }
  }

  function deleteTask(){
    let taskId = task.id;
    document.getElementById('task' + taskId).style['display'] = 'none';
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }

  function showDetails() {
    const details = document.getElementById('taskDetails');
    details.style['display'] = 'block';
    document.getElementById('taskNameDet').innerHTML = task.name;
    document.getElementById('taskDescription').innerHTML = task.description || "None";
    document.getElementById('taskProject').innerHTML = task.project || "None";
    document.getElementById('taskPriority').innerHTML = task.priority;
    document.getElementById('taskDueDate').innerHTML = task.dueDate;
    setIsBlurred(true);
  }

  //num = num.toString();
  let id = 'taskText' + num;
  let priorityLabel = '!'; // Default to Low

  // Check priority and assign the correct label
  if (task.priority === 'High') {
    priorityLabel = '!!!';
  } else if (task.priority === 'Medium') {
    priorityLabel = '!!';
  }

  let date = new Date();
  let year = date.getFullYear()
  year = year.toString();
  let month = date.getMonth() + 1;
  month = month.toString();
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  let today = year + "-" + month + "-" + day;

  return (<>
    <div id={"task" + task.id}  className='task'>
      <div style={{ display: 'flex', alignItems: 'center', maxWidth:'calc(100% - 260px)' }}>
        <input className='task-stuff' style={{accentColor:'rgb(9, 38, 187)', marginLeft:'10px'}} type='checkbox' onClick={() => addStrike(id)}/>
        <div id={id} className='task-stuff' style={{
          marginLeft: '10px',
          flexGrow: 1, // This ensures task name takes up remaining space
          overflowX: 'hidden', // Prevents overflow if task name is too long
          textOverflow: 'ellipsis', // Adds ellipsis when the text overflows
          whiteSpace: 'nowrap',
           // Prevents wrapping of task name
        }}><div className='task-stuff prioLevel'>{priorityLabel}</div>{task.name}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button className='task-stuff prio' onClick={() => showDetails()}>Details</button>
        <div className='task-stuff' style={{ marginLeft: '10px', 'marginRight': '30px', color: today > task.dueDate && !completed ? 'red' : 'black'}}>{task.dueDate}</div>
        <img className='task-stuff' onClick={() => deleteTask()} src={trash} alt='trash' style={{'width':'30px', height:'30px', 'marginRight':'20px'}}></img>
      </div>
    </div>
    </>
  );
}

function ShowDetails({setIsBlurred}) {

  const details = document.getElementById("taskDetails");
  
  function returnHome() {
    details.style['display'] = 'none';
    setIsBlurred(false);
  }

  return (
    <div className='details' id="taskDetails">
    <div className='banner'>
        <h2>Details</h2>
        <div className="close" onClick={() => returnHome()}>&#x2716;</div>
      </div>
      <div style={{display: 'inline-block'}}>
        <div ><b>Task Name: </b><div id="taskNameDet" style={{display: 'inline-block', marginRight: '10px'}}></div></div>
        <div ><b>Description: </b><div id="taskDescription" style={{display: 'inline-block', marginRight: '10px'}}></div></div>
        <div ><b>Project: </b><div id="taskProject" style={{display: 'inline-block', marginRight: '10px'}}></div></div>
        <div ><b>Priority: </b><div id="taskPriority" style={{display: 'inline-block', marginRight: '10px'}}></div></div>
        
        <div ><b>Due Date: </b><div id="taskDueDate" style={{display: 'inline-block', marginRight: '10px'}}></div></div>
      </div>
      </div>
  )
}

function Sidebar({tasks, setCurrentTasks,setCurrentProj, setIsBlurred, projects}) {
  
  const [isClicked, setIsClicked] = useState(0);

  function onAddProj() {
    setIsBlurred(true);
    const create = document.querySelector('.create-task');
    create.style['display'] = 'block';

    // setProjects([...projects, 'project']);
  }


  function getProj(projName, num, check) {
    
    setCurrentProj(projName);
    setIsClicked(num);
    setCurrentTasks([]);
    let curTasks = [];
    if (projName == "Home") {
      curTasks = tasks;
    }
    else if (projName == "Today") {
      let date = new Date();
      let year = date.getFullYear()
      year = year.toString();
      let month = date.getMonth() + 1;
      month = month.toString();
      let day = date.getDate();
      if (day < 10) {
        day = "0" + day;
      }

      let today = year + "-" + month + "-" + day;
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].dueDate == today) {
          curTasks.push(tasks[i]);
        }
      }

    } else if (projName == "Week") {
      let date = new Date();
      let year = date.getFullYear()
      year = year.toString();
      let month = date.getMonth() + 1;
      month = month.toString();
      let day = date.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      let today = year + "-" + month + "-" + day;
      let date1 = new Date(today);
      let date2 = new Date()
      date2.setDate(date1.getDate() + 7);
      
      for (let i = 0; i < tasks.length; i++) {
        let curDate = new Date(tasks[i].dueDate);
        console.log(date2);
        if (date1 <= curDate && date2 >= curDate) {
          curTasks.push(tasks[i]);
        }
      }
    }
    else {   
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].project == projName) {
        curTasks.push(tasks[i]);
        }
      }
    }
    setCurrentTasks(curTasks);
  }
  

  return (
    <div className="sidebar" style={{ minHeight:'500px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Static items like "Home", "Today", "Week" */}
      <SideElem value="Home" getProj={getProj} index={0} isClicked={isClicked} tasks={tasks} />
      <SideElem value="Today" getProj={getProj} index={1} isClicked={isClicked} tasks={tasks} />
      <SideElem value="Week" getProj={getProj} index={2} isClicked={isClicked} tasks={tasks} />
      
      {/* Horizontal line divider */}
      <div className="line" style={{ margin: '10px 0', borderBottom: '1px solid #ddd' }}></div>
      
      {/* Scrollable container for Projects */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, 
        maxHeight: 'calc(82vh - 150px)',  // Adjust to leave space for the "Projects" label and the divider
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '10px'
      }}>
        
        {/* "Projects" Title */}
        <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '18px', color: '#333' }}>
          Projects
        </div>
        
        {/* Project List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {projects.map((project, index) => (
            <SideElem 
              key={index} 
              value={project.name} 
              index={index + 3} 
              getProj={getProj} 
              isClicked={isClicked} 
              tasks={tasks}
            />
          ))}
        </div>
  
        <AddList onClick={onAddProj} style={{ marginTop: '30px' }} />
        
      </div>
      
    </div>
  );
}

function SideElem({ value , getProj, index, isClicked, tasks}) {
  useEffect(() => {if (isClicked == index ) {getProj(value,index, false )}}, [tasks.length])
  
  return (
    <div style={{backgroundColor: isClicked === index ? '#D8D8D8':''}} className='side-elem' onClick={() => getProj(value, index, true)}>
      <div style={{ marginLeft: '10px' }}>{value}</div>
    </div>
  );
}

function AddList({ onClick }) { // Receive the onClick prop
  return (
    <div  >
      
      <button  style={{ cursor: 'pointer', alignItems:'center', justifyContent:'center', display:'block' }} id='addProj' onClick={onClick}>
        <img src={plus} alt="plus" style={{ width: '10%', filter: 'invert(100%)'}} />
        </button>
    </div>
  );
}

function CreateTask({tasks, setTasks, projects, setProjects, setIsBlurred, currentProj}) {

  const [formData, setFormData] = useState({ projName: '', projDescription: '' , projTasks: []});
  const [formTask, setFormTask] = useState({taskName: '', taskDesc: '', taskPrio: '', taskDue:'', taskProj:''})
  const create = document.querySelector('.create-task');
  const proj = document.getElementById('proj');
  const task = document.getElementById('task');
  const [selButton, setSelButton] = useState(null);
  const [isClicked, setIsClicked] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeTask = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormTask((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (e.target.className === 'prio') {
      setSelButton(e.target.id);
    }
  };

  function addProj(e) {
    e.preventDefault();
    if (formData.projName !== "" && !projects.some(proj => proj.name === formData.projName)) {
      const projEntry = {
        name: formData.projName,
        description: formData.projDescription,
      }
      setProjects((prevProjects) => [...prevProjects, projEntry]);
      setIsBlurred(false);
      setFormData({ projName: '', projDescription: '' });
      
      create.style['display'] = 'none';
      document.getElementById("titleError").style['display'] = 'none';
      document.getElementById('titleExists').style['display'] = 'none';
      e.target.reset();
    } else if ( projects.some(proj => proj.name === formData.projName)) {
      document.getElementById('titleExists').style['display'] = 'block';
      document.getElementById("titleError").style['display'] = 'none';
    } else {
      document.getElementById("titleError").style['display'] = 'block';
      document.getElementById('titleExists').style['display'] = 'none';
    }
  }

  function addTask(e) {
    e.preventDefault();
    if (formTask.taskName === "") {
      document.getElementById("taskTitleError").style['display'] = 'block';
    }
    if (formTask.taskPrio === "") {
      document.getElementById("taskPrioError").style['display'] = 'block';
    }
    if (formTask.taskDue === "") {
      document.getElementById("taskDateError").style['display'] = 'block';
    }
    if (formTask.taskName !== "" && formTask.taskPrio !== "" && formTask.taskDue !== "") {
      const taskEntry = {
        id: tasks.length,
        name: formTask.taskName,
        description: formTask.taskDesc,
        project: formTask.taskProj,
        priority: formTask.taskPrio,
        dueDate: formTask.taskDue
      }
      setTasks((prevTasks) => [...prevTasks, taskEntry])
      setIsBlurred(false);
      setFormTask({taskId:'', taskName: '', taskDesc: '', taskProj:'', taskPrio: '', taskDue:''});
      setSelButton(null);

      create.style['display'] = 'none';
      document.getElementById("taskTitleError").style['display'] = 'none';
      document.getElementById("taskPrioError").style['display'] = 'none';
      document.getElementById("taskDateError").style['display'] = 'none';
      console.log(formTask)
      e.target.reset();
    } 
  }

  function showProj() {
    proj.style['display'] = '';
    task.style['display'] = 'none';
    setIsClicked(1);
  }

  function showTask() {
    proj.style['display'] = 'none';
    task.style['display'] = '';
    setIsClicked(2);
  }

  function returnHome() {
    create.style['display'] = 'none';
    setIsBlurred(false);
  }

  return (
    <div className='create-task'>
      <div className='banner'>
        <h2>Create...</h2>
        <div className="close" onClick={returnHome}>&#x2716;</div>
      </div>
      <div style={{"display":"flex", "height":"100%"}}>
      <div className='side'>
          <div className='side-elem' style={{paddingLeft:'5px', backgroundColor: isClicked === 1 ? '#D8D8D8':''}} onClick={showProj}>Create Project</div>
          <div className='side-elem' style={{paddingLeft:'5px', backgroundColor: isClicked === 2 ? '#D8D8D8':''}}  onClick={showTask}>Create Task</div>
        </div>

      <div id="proj" >
        <form className='createForm' onSubmit={addProj}>
        <label>Project Name*</label><br></br>
        <input type='text' id="projName" value={formData.projName} onChange={handleChange} name="projName" placeholder='Enter Project Name'></input><br></br>
        <div id="titleError" className='error'>*please enter a project name</div>
        <div id="titleExists" className='error'>*project already exists</div>
        <label style={{marginTop:'10px'}}>Project Description</label><br></br>
        <input type='text'  name="projDescription"
            value={formData.projDescription}
            onChange={handleChange}></input><br></br>
        <button className='create' type="submit" value="Create"><span className='createText'>Create</span></button>
        </form>
      </div>
      <div id="task" style={{"display": "none"}}>
      <form  className='createForm' onSubmit={addTask}>
        <label>Task Name*</label><br></br>
        <input type='text' id="taskName" name="taskName"  onChange={handleChangeTask} placeholder='Enter Task Name'></input><br></br>
        <div id="taskTitleError" className='error'>*please enter a task name</div>
        <label>Description:</label><br></br>
        <textarea name='taskDesc' onChange={handleChangeTask} placeholder='Enter Description'></textarea> <br></br>
        <label for="chooseProj">Choose Project:</label><br></br>
        <select name="taskProj" id="chooseProj" onChange={handleChangeTask}>
          <option value={"None"} >None</option>
          {projects.map((project, index) => (
        <option key={index} value={project.name}>{project.name}</option>
          ))}
        </select><br></br>
        <label>Select Priority*</label> <br></br>
        <button id='low' style={{backgroundColor: selButton == 'low' ? 'black':'', color:  selButton == 'low' ? 'white':''}} className='prio' name="taskPrio" onClick={handleChangeTask} value={"Low"}>Low</button>
        <button id='med' style={{backgroundColor: selButton == 'med' ? 'black':'', color:  selButton == 'med' ? 'white':''}} className='prio' name="taskPrio" onClick={handleChangeTask} value={"Medium"}>Medium</button>
        <button id='high' style={{backgroundColor: selButton == 'high' ? 'black':'', color:  selButton == 'high' ? 'white':''}} className='prio' name="taskPrio" onClick={handleChangeTask} value={"High"}>High</button><br></br>
        <div id="taskPrioError" className='error'>*please choose a priority</div>
        <label>Enter Due Date*</label><br></br>
        <input  name="taskDue" type="date" onChange={handleChangeTask}></input><br></br>
        <div id="taskDateError" className='error'>*please choose a date</div>
        <button className='create' type="submit" value="Create"><span className='createText'>Create</span></button>

      </form>
      </div>
      </div>
      
    </div>
  )
}
