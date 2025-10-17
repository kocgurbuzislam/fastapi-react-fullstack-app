import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {

  const [value, setValue] = useState("");
  const [toDos, setToDos] = useState([]);
  const [editValues, setEditValues] = useState({});


  function handleNewToDo() {

    if (value === "") return;
    axios.post("http://localhost:8000/todos", { title: value })
      .then(() => {
        fetchToDos();
        setValue("");
      });

  }

  function fetchToDos() {
    axios.get("http://localhost:8000/todos").then((res) => {
      setToDos(res.data);
      // Her todo için başlangıç değerlerini ayarla
      const initialValues = {};
      res.data.forEach(item => {
        initialValues[item.id] = item.title;
      });
      setEditValues(initialValues);
    });
  }

  function deleteToDo(id) {

    if (!window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      return;
    }

    axios.delete(`http://localhost:8000/todos/${id}`).then(() => fetchToDos())

  }

  function updateToDo(id, e) {
    e.preventDefault();

    if (!window.confirm("Bu kaydı güncellemek istediğinize emin misiniz?")) {
      return;
    }

    axios.put(`http://localhost:8000/todos/${id}`, { title: editValues[id] }).then(() => fetchToDos())

  }

  function handleEditChange(id, newValue) {
    setEditValues(prev => ({
      ...prev,
      [id]: newValue
    }));
  }

  useEffect(() => {
    fetchToDos()
  }, []);

  return (
    <div>

      <h1>My To Do App</h1>
      <label>Yeni To Do Oluştur:</label>
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleNewToDo}>Ekle</button>


      <div>
        <ul>
          {toDos.map((item) => (
            <li className='todo-item' key={item.id}>

              <form onSubmit={(e) => updateToDo(item.id, e)}>

                <input 
                  value={editValues[item.id] || ''} 
                  onChange={(e) => handleEditChange(item.id, e.target.value)}
                />
                <div>

                  <button type="submit" className='update-button'>Kaydet</button>

                  <button type="button" className='delete-button' onClick={() => deleteToDo(item.id)}>Sil</button>


                </div>

              </form>

            </li>
          ))}
        </ul>

      </div>



    </div>

  );
}

export default App;