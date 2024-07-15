import pandas as pd
import re

def advanced_search(df, query, search_columns):
    def process_query(q):
        terms = re.findall(r'\([^()]+\)|\S+', q)
        terms = [term.strip('()') for term in terms]
        return terms

    def search_term(term, text):
        # For terms without spaces, search for whole word
        if ' ' not in term:
            return re.search(r'\b' + re.escape(term.lower()) + r'\b', str(text).lower()) is not None
        # For terms with spaces (from parentheses), search as is
        else:
            return term.lower() in str(text).lower()

    def combine_columns(row):
        return ' '.join(str(row[col]) for col in search_columns if pd.notna(row[col]))

    combined_text = df.apply(combine_columns, axis=1)

    tokens = process_query(query)

    # Initialize mask with False values
    mask = pd.Series([False] * len(df), index=df.index)

    for token in tokens:
        term_mask = combined_text.apply(lambda x: search_term(token, x))
        # Use OR operation (|) instead of AND (&)
        mask |= term_mask

    results = df[mask]

    if results.empty:
        return []
    
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

    return formatted_results