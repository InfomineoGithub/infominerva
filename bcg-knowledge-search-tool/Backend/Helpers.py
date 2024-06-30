import pandas as pd

df = pd.read_csv("Database.csv")


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
