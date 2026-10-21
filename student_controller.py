from fastapi import APIRouter, Depends, status
from database import get_db
from student_service import StudentService
from schema import StudentResponse, StudentUpdateRequest, StudentCreateRequet


routers = APIRouter(prefix="/students",tags=["Student"])


@routers.get("/{roll}", status_code= status.HTTP_200_OK)
def get_student_by_roll(roll: str, db = Depends(get_db)):
    service = StudentService()
    return service.get_student_by_roll(db, roll)

@routers.get("/list", status_code= status.HTTP_200_OK)
def get_all_students(db = Depends(get_db)):
     service = StudentService()
     return service.get_all_students(db)

@routers.post("/create", status_code= status.HTTP_201_CREATED)
def create_student(student_payload : StudentCreateRequet, db = Depends(get_db)):
     service = StudentService()
     return service.create_student(db, student_payload)

@routers.patch("/update/{roll}", status_code= status.HTTP_202_ACCEPTED)
def update_student(roll: str, update_student: StudentUpdateRequest, db =Depends(get_db)):
     service = StudentService()
     return service.update_student(db, update_student, roll)


