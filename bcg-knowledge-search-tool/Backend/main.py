from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow React app to access the API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the database
df = pd.read_csv("Backend/database.csv")


@app.get("/search")
async def search(query: str):
    # Search for the query in the 'Tags' column
    results = df[df["Tags"].str.contains(query, case=False, na=False)]

    if results.empty:
        return {"results": []}

    # Format the results
    formatted_results = results.apply(
        lambda row: {
            "title": row["Source name"],
            "description": row["Description"],
            "years": row["Years"],
            "source": row["Source name"],
            "link": row["Link"],
        },
        axis=1,
    ).tolist()

    return {"results": formatted_results}


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
