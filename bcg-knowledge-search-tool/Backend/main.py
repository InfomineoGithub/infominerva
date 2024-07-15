from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from search_utils import advanced_search

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow React app to access the API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

search_columns = ["Tags", "Sector/Area", "Sub-Sector", "Description", "Source name"]

# Load the database
df = pd.read_csv("Database.csv")

@app.get("/search")
async def search(query: str):
    results = advanced_search(df, query, search_columns)
    return {"results": results}
 


@app.get("/llm")
async def llm_search(query: str):
    # Placeholder for LLM functionality
    return {"message": "LLM search not implemented yet"}


@app.post("/add_data")
async def add_data(data: dict):
    # Placeholder for adding new data
    return {"message": "Adding new data not implemented yet"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
