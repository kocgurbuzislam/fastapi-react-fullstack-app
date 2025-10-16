from database import Base
from sqlalchemy import Column, Integer, String, Boolean

class ToDo(Base):
    __tablename__ = "todo"

    from sqlalchemy import Column, Integer, String, Boolean

    id = Column(Integer, primary_key=True)
    title = Column(String)
    