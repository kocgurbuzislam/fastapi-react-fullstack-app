import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {

  const [value, setValue] = useState("");
  const [toDos, setToDos] = useState([]);


  function handleNewToDo() {

    if (value === "") return;
    axios.post("http://localhost:8000/todos", { title: value })
      .then(() => fetchToDos())

  }

  function fetchToDos() {
    axios.get("http://localhost:8000/todos").then((res) => setToDos(res.data))
  }

  useEffect(() => {
    fetchToDos()
  }, []);

  return (
    <div>

      <h1>My To Do App</h1>
      <label>Yeni To Do Oluştur:</label>
      <input  type="text" onChange={(e) => setValue(e.target.value)} />
      <button  onClick={handleNewToDo}>Ekle</button>


      <div>
        <ul>
          {toDos.map((item) => (
            <li key={item.id}>
              {item.title}
            </li>
          ))}
        </ul>

      </div>



    </div>

  );
}

export default App;
