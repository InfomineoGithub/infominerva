from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from search_utils import advanced_search
from Llm_utils import process_link


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

def reload_database():
    global df
    df = pd.read_csv("Database.csv")

@app.get("/search")
async def search(query: str, sort_by: str = "relevance"):
    results = advanced_search(df, query, search_columns)
    if sort_by == "relevance":
        results.sort(key=lambda x: len(x['words_found']), reverse=True)
    # You could add other sorting options here
    return {"results": results}
 



@app.get("/llm")
async def llm_search(link: str):
    result = process_link(df, link)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result



@app.post("/add_data")
async def add_data(data: dict):
    global df
    new_row = pd.DataFrame([data])
    df = pd.concat([df, new_row], ignore_index=True)
    df.to_csv("Database.csv", index=False)
    reload_database()  # Reload the database after adding new data
    return {"message": "Data added successfully"}

@app.on_event("startup")
async def startup_event():
    reload_database()  # Ensure the database is loaded when the app starts


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
 