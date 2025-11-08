from fastapi import APIRouter, HTTPException
from typing import List, Optional
import pandas as pd
from pydantic import BaseModel

router = APIRouter()

# Load the doctors data
try:
    doctors_df = pd.read_csv('app/data/us_doctors_psychologists.csv')
except:
    doctors_df = pd.DataFrame(columns=['name', 'specialty', 'location', 'contact', 'rating'])

class Doctor(BaseModel):
    name: str
    specialty: str
    location: str
    contact: str
    rating: Optional[float] = None

@router.get("/api/doctors/search", response_model=List[Doctor])
async def search_doctors(
    location: Optional[str] = None,
    specialty: Optional[str] = None,
    name: Optional[str] = None
):
    global doctors_df
    
    filtered_df = doctors_df.copy()
    
    if location:
        filtered_df = filtered_df[filtered_df['location'].str.contains(location, case=False, na=False)]
    if specialty:
        filtered_df = filtered_df[filtered_df['specialty'].str.contains(specialty, case=False, na=False)]
    if name:
        filtered_df = filtered_df[filtered_df['name'].str.contains(name, case=False, na=False)]
    
    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="No doctors found matching the criteria")
        
    return [
        Doctor(
            name=row['name'],
            specialty=row['specialty'],
            location=row['location'],
            contact=row['contact'],
            rating=row['rating']
        )
        for _, row in filtered_df.iterrows()
    ]