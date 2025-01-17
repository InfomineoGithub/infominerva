from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from search_utils import advanced_search
from Llm_utils import process_link
import os


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

Validation_columns = ['PA classification', 'Sector/Area', 'Sub-Sector', 'Source name',
       'Description', 'Type (General DB, specialized, ...)', 'Free/Paid?',
       'Geography', 'Regional data', 'Country data',
       'Frequency cover harmonized for all geos ? ', 'Frequency ', 'Years',
       'Latest year available', 'Forecasts?', 'Latest forecast year avalable',
       'Tags', 'Format ', 'Expert opinion', 'Submitter_email',
       'Submitter_role', 'Status', 'Reliability score (1-10) ', 'Link']

# Load the database
df = pd.read_csv("Database.csv", encoding='cp1252')

users_df = pd.read_csv("users.csv", encoding='cp1252')

def reload_database():
    global df
    df = pd.read_csv("Database.csv", encoding='cp1252')

# reload for users
def reload_users():
    global users_df
    users_df = pd.read_csv("users.csv", encoding='cp1252')

####################### USER AUTHENTICATION ############################

@app.get("/get_user_role")
async def get_user_role(email: str):
    global users_df
    
    # Check if user exists
    user = users_df[users_df['email'] == email]
    
    if not user.empty:
        # Convert to dict and replace NaN with None for JSON serialization
        user_data = user.iloc[0].replace({pd.NA: None, float('nan'): None}).to_dict()
        return {
            "role": user_data.get('role', 'contributor'),
            "expert_domain": user_data.get('expert_domain')
        }
    
    # If user doesn't exist, create new with default role
    new_user = pd.DataFrame([{
        'email': email,
        'role': 'contributor',
        'expert_domain': None
    }])
    
    users_df = pd.concat([users_df, new_user], ignore_index=True)
    users_df.to_csv("users.csv", index=False)
    # Reload the database after adding new user
    reload_users()
    return {"role": "contributor", "expert_domain": None}

@app.post("/update_user_role")
async def update_user_role(data: dict):
    global users_df
    target_email = data.get('target_email')
    new_role = data.get('new_role')

    # Update user role
    users_df.loc[users_df['email'] == target_email, 'role'] = new_role
    users_df.to_csv("users.csv", index=False)
    reload_users()  # Reload for all sessions
    return {"message": f"Role updated for {target_email}"}

@app.get("/get_all_users")
async def get_all_users():
    global users_df
    users_list = users_df.replace({pd.NA: None, float('nan'): None}).to_dict('records')
    return {"users": users_list}


####################### END OF USER AUTHENTICATION ############################



############################# LEADERBOARD ####################################
@app.get("/get_leaderboard")
async def get_leaderboard():
    global df
    
    # Create leaderboard data
    leaderboard = df.groupby('Submitter_email').agg({
        'Submitter_email': 'count',  # Total contributions
        'Expert opinion': lambda x: x.notna().sum()  # Count of non-empty expert opinions
    }).rename(columns={
        'Submitter_email': 'total_contributions',
        'Expert opinion': 'expert_opinions'
    })
    
    # Process email to name
    leaderboard = leaderboard.reset_index()
    leaderboard['full_name'] = leaderboard['Submitter_email'].apply(lambda x: 
        ' '.join(x.split('@')[0].split('.'))
        .title()  # Capitalize first letter of each word
    )
    
    # Sort by total contributions descending
    leaderboard = leaderboard.sort_values('total_contributions', ascending=False)
    
    # Convert to dict format for JSON response
    leaderboard_dict = leaderboard.to_dict('records')
    
    return {"leaderboard": leaderboard_dict}
############################# END OF LEADERBOARD ####################################


####################### DATA VALIDATION ############################

@app.get("/get_pending_entries")
async def get_pending_entries():
    global df
    # Get only pending entries
    pending_mask = df['Status'] == 'pending'
    # Store the original index before filtering
    df['temp_id'] = df.index
    pending_entries = df[pending_mask].replace({pd.NA: None, float('nan'): None})
    # Convert to dict and ensure id is included
    entries = pending_entries.to_dict('records')
    # Map the temp_id to id in each record
    for entry in entries:
        entry['id'] = entry['temp_id']
    # Remove temp_id column from df
    df = df.drop('temp_id', axis=1)
    return {"entries": entries}


@app.post("/update_entry")
async def update_entry(data: dict):
    global df
    entry_id = data.get('id')  # We'll use index as ID
    updated_data = data.get('data')
    
    try:
        # Update the entry
        for column, value in updated_data.items():
            df.loc[entry_id, column] = value
            
        df.to_csv("Database.csv", index=False, encoding='cp1252')
        reload_database()  # Reload for all sessions
        return {"message": "Entry updated successfully"}
    except Exception as e:
        return {"error": str(e)}, 400


@app.post("/validate_entry")
async def validate_entry(data: dict):
    global df
    entry_id = data.get('id')
    
    try:
        # Update status to approved
        df.loc[int(entry_id), 'Status'] = 'approved'
        df.to_csv("Database.csv", index=False, encoding='cp1252')
        reload_database()
        return {"message": "Entry validated successfully"}
    except Exception as e:
        print(f"Error in validate_entry: {str(e)}")  # Debug print
        return {"error": str(e)}, 400

@app.delete("/delete_entry/{entry_id}")
async def delete_entry(entry_id: int):
    global df
    try:
        # Drop the row
        df = df.drop(index=int(entry_id))
        df.to_csv("Database.csv", index=False, encoding='cp1252')
        reload_database()
        return {"message": "Entry deleted successfully"}
    except Exception as e:
        print(f"Error in delete_entry: {str(e)}")  # Debug print
        return {"error": str(e)}, 400

@app.post("/update_entry")
async def update_entry(data: dict):
    global df
    entry_id = data.get('id')
    updated_data = data.get('data')
    
    try:
        # Remove id from updated_data if it exists
        if 'id' in updated_data:
            del updated_data['id']
            
        # Update the entry
        for column, value in updated_data.items():
            df.loc[int(entry_id), column] = value
            
        df.to_csv("Database.csv", index=False, encoding='cp1252')
        reload_database()
        return {"message": "Entry updated successfully"}
    except Exception as e:
        print(f"Error in update_entry: {str(e)}")  # Debug print
        return {"error": str(e)}, 400    

####################### END OF DATA VALIDATION ############################

@app.get("/search")
async def search(query: str, sort_by: str = "relevance"):
    reload_database()  # Reload the database before searching
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
 