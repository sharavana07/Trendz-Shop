from pydantic import BaseModel

class AdminCreate(BaseModel):
    username: str
    password: str
