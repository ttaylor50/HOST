from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime
import os

router = APIRouter()

# Ensure the data directory exists
os.makedirs('app/data', exist_ok=True)

GOALS_FILE = 'app/data/user_progress.json'

class Goal(BaseModel):
    id: Optional[int]
    user_id: int
    title: str
    description: str
    target_date: datetime
    status: str  # "in_progress", "completed", "cancelled"
    progress: int  # 0-100
    created_at: Optional[datetime]

def load_goals():
    try:
        with open(GOALS_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"goals": []}

def save_goals(goals_data):
    with open(GOALS_FILE, 'w') as f:
        json.dump(goals_data, f)

@router.get("/api/goals/{user_id}", response_model=List[Goal])
async def get_user_goals(user_id: int):
    goals_data = load_goals()
    user_goals = [goal for goal in goals_data["goals"] if goal["user_id"] == user_id]
    return user_goals

@router.post("/api/goals", response_model=Goal)
async def create_goal(goal: Goal):
    goals_data = load_goals()
    
    # Generate new ID
    new_id = 1
    if goals_data["goals"]:
        new_id = max(g["id"] for g in goals_data["goals"]) + 1
    
    goal_dict = goal.dict()
    goal_dict["id"] = new_id
    goal_dict["created_at"] = datetime.now().isoformat()
    
    goals_data["goals"].append(goal_dict)
    save_goals(goals_data)
    return goal_dict

@router.put("/api/goals/{goal_id}", response_model=Goal)
async def update_goal(goal_id: int, goal: Goal):
    goals_data = load_goals()
    
    for i, existing_goal in enumerate(goals_data["goals"]):
        if existing_goal["id"] == goal_id:
            goal_dict = goal.dict()
            goal_dict["id"] = goal_id
            goals_data["goals"][i] = goal_dict
            save_goals(goals_data)
            return goal_dict
            
    raise HTTPException(status_code=404, detail="Goal not found")

@router.delete("/api/goals/{goal_id}")
async def delete_goal(goal_id: int):
    goals_data = load_goals()
    
    goals_data["goals"] = [g for g in goals_data["goals"] if g["id"] != goal_id]
    save_goals(goals_data)
    return {"message": "Goal deleted"}