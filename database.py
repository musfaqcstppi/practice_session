from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# DATABASE_URL ="mysql+pymysql://root:root@localhost:3306/training_db"
DATABASE_URL = "postgresql+psycopg2://training_wm4s_user:nuAAzaCc9I3RYrAAaU5kRB5ejtlcbxG5@dpg-dbc5b5t9fdbs73bu4i60-a.oregon-postgres.render.com/training_wm4s"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()