import logo from './logo.svg';
import plus from './assets/plus.svg';
import trash from './assets/trash-svgrepo-com.svg'
import './App.css';
import { useEffect, useState } from 'react';

export default function ToDoPage() {

  const [isBlurred, setIsBlurred] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentProj, setCurrentProj] = useState("Home");
  const [currentTasks, setCurrentTasks] = useState([])
  
  function unBlur() {
    if (isBlurred) {
      setIsBlurred(false);
      const create = document.querySelector('.create-task');
      create.style['display'] = 'none';
    }
  }

  return (
    <>
  <div id="body" className={isBlurred ? 'blur' : ''} onClick={unBlur}>
  <Sidebar tasks={tasks} setCurrentTasks={setCurrentTasks} setCurrentProj={setCurrentProj} setIsBlurred={setIsBlurred} projects={projects}/>
  <ProjPage currentProj={currentProj} tasks={currentTasks} setTasks={setTasks}></ProjPage>
  </div>
  <CreateTask tasks={tasks} setTasks={setTasks} projects={projects} setProjects={setProjects} setIsBlurred={setIsBlurred} currentProj={currentProj}/>
  
  </>
);
}

function ProjPage({currentProj, tasks, setTasks}) {
  
  return (
    <div className='projPage'>
      <h1 className='header'>{currentProj}</h1>
      {tasks.map((task, index) => (
        <Task key={index} task={task} num={index} setTasks={setTasks}/>
      ))}
    </div>
  )
}

function Task({ task,num, setTasks }) {

  function addStrike(id) {
    let elem = document.getElementById(id);
    elem.classList.toggle('strike');
  }

  function deleteTask(){
    let taskId = task.id;
    document.getElementById('task' + taskId).style['display'] = 'none';
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  }

  //num = num.toString();
  let id = 'taskText' + num;

  return (
    <div id={"task" + task.id}  className='task'>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input className='task-stuff' type='checkbox' onClick={() => addStrike(id)}/>
        <div id={id} className='task-stuff' style={{
          marginLeft: '10px',
          flexGrow: 1, // This ensures task name takes up remaining space
          overflow: 'hidden', // Prevents overflow if task name is too long
          textOverflow: 'ellipsis', // Adds ellipsis when the text overflows
          whiteSpace: 'nowrap', // Prevents wrapping of task name
        }}>{task.name}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button className='task-stuff prio'>Details</button>
        <div className='task-stuff' style={{ marginLeft: '10px', 'marginRight': '30px' }}>{task.dueDate}</div>
        <img className='task-stuff' onClick={() => deleteTask()} src={trash} alt='trash' style={{'width':'3%', 'marginRight':'1%'}}></img>
      </div>
    </div>
  );
}

function Sidebar({tasks, setCurrentTasks,setCurrentProj, setIsBlurred, projects}) {
  
  const [isClicked, setIsClicked] = useState(null);

  function onAddProj() {
    setIsBlurred(true);
    const create = document.querySelector('.create-task');
    create.style['display'] = 'block';

    // setProjects([...projects, 'project']);
  }


  function getProj(projName, num, check) {
    
    setCurrentProj(projName);
    setIsClicked(num);
    console.log('cehc');
    setCurrentTasks([]);
    console.log(tasks);
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
        console.log(tasks[i].dueDate == today)
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
    <div className='sidebar'>
      <SideElem value="Home" getProj={getProj} index={0} isClicked={isClicked} tasks={tasks}/>
      <SideElem value="Today" getProj={getProj} index={1} isClicked={isClicked} tasks={tasks}/>
      <SideElem value="Week" getProj={getProj} index={2} isClicked={isClicked} tasks={tasks}/>
      <div className='line'></div><br />
      <div style={{"marginBottom":"10px"}}>Projects</div>
      {projects.map((project, index) => (
        <SideElem key={index} value={project.name} index={index + 3} getProj={getProj} isClicked={isClicked} tasks={tasks}/>
      ))}
      <AddList onClick={onAddProj} /> {/* Pass onClick prop */}
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
    <div id='addProj' onClick={onClick} style={{ cursor: 'pointer' }}>
      <img src={plus} alt="plus" style={{ width: '10%', paddingRight: '20px', paddingLeft: '10px' }} />
      <div>Add Project</div>
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
    if (formData.projName !== "") {
      const projEntry = {
        name: formData.projName,
        description: formData.projDescription,
      }
      setProjects((prevProjects) => [...prevProjects, projEntry]);
      setIsBlurred(false);
      setFormData({ projName: '', projDescription: '' });
      
      create.style['display'] = 'none';
      e.target.reset();
    }
  }

  function addTask(e) {
    e.preventDefault();
    if (formTask.taskName !== "") {
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

      create.style['display'] = 'none';
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
        <label>Enter Project Name:</label><br></br>
        <input id="projName" value={formData.projName} onChange={handleChange} name="projName" required></input><br></br>
        <label>Project Description</label><br></br>
        <input  name="projDescription"
            value={formData.projDescription}
            onChange={handleChange}></input><br></br>
        <input className='create' type="submit" value="Create"></input>
        </form>
      </div>
      <div id="task" style={{"display": "none"}}>
      <form  className='createForm' onSubmit={addTask}>
        <label>Enter Task Name:</label><br></br>
        <input id="taskName" name="taskName" required onChange={handleChangeTask}></input><br></br>
        <label>Enter Description:</label><br></br>
        <textarea name='taskDesc' onChange={handleChangeTask}></textarea> <br></br>
        <label for="chooseProj">Choose Project:</label><br></br>
        <select name="taskProj" id="chooseProj" onChange={handleChangeTask}>
          <option value={"None"} >None</option>
          {projects.map((project, index) => (
        <option key={index} value={project.name}>{project.name}</option>
          ))}
        </select><br></br>
        <label>Select Priority:</label> <br></br>
        <button id='low' style={{backgroundColor: selButton == 'low' ? 'black':'', color:  selButton == 'low' ? 'white':''}} className='prio' name="taskPrio" onClick={handleChangeTask} value={"Low"}>Low</button>
        <button id='med' style={{backgroundColor: selButton == 'med' ? 'black':'', color:  selButton == 'med' ? 'white':''}} className='prio' name="taskPrio" onClick={handleChangeTask} value={"Medium"}>Medium</button>
        <button id='high' style={{backgroundColor: selButton == 'high' ? 'black':'', color:  selButton == 'high' ? 'white':''}} className='prio' name="taskPrio" onClick={handleChangeTask} value={"High"}>High</button><br></br>
        <label>Enter Due Date:</label><br></br>
        <input required name="taskDue" type="date" onChange={handleChangeTask}></input><br></br>
        <input className='create' type="submit" value="Create"></input>

      </form>
      </div>
      </div>
      
    </div>
  )
}