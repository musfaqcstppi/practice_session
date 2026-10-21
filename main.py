from fastapi import FastAPI
from database import Base, engine
from student_controller import routers as student_router

Base.metadata.create_all(bind = engine)
app = FastAPI(title= "Fast api project for assesment")
app.include_router(student_router)

