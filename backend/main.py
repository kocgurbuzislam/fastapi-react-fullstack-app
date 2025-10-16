from fastapi import FastAPI, Depends, HTTPException
from database import SessionLocal, engine 
from models import ToDo, Base
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Hello, World!"}

@app.get("/todos")
def read_todos(db=Depends(get_db)):
    todos = db.query(ToDo).all()
    return todos


class ToDoCreate(BaseModel):
    title: str

@app.post("/todos")
def create_todo(new_todo: ToDoCreate ,db = Depends(get_db)):
    db_todo = ToDo(title=new_todo.title)
    db.add(db_todo)
    db.commit()
    return {"message": "ToDo created successfully"}


class ToDoUpdate(BaseModel):
    title: str

@app.put("/todos/{todo_id}")
def update_todo(
    todo_id: int,
    request_data: ToDoUpdate,
    db=Depends(get_db)
):
    todo_item = db.query(ToDo).filter(ToDo.id == todo_id).first()

    if not todo_item:
        raise HTTPException(status_code=404, detail="ToDo not found")
    
    todo_item.title = request_data.title
    db.add(todo_item)
    db.commit()
    return {"message": "ToDo updated successfully"}

@app.delete("/todos/{todo_id}")
def delete_todo(
    todo_id: int,
    db=Depends(get_db)
):
    todo_item = db.query(ToDo).filter(ToDo.id == todo_id).first()

    if not todo_item:
        raise HTTPException(status_code=404, detail="ToDo not found")
    
    db.delete(todo_item)
    db.commit()
    return {"message": "ToDo deleted successfully"}
