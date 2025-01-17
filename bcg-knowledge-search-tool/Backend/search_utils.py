import pandas as pd
import re

def format_years(years):
    if pd.isna(years):
        return "N/A"
    years = str(years)
    if ';' in years:
        years = years.split(';')
        years = [int(year) for year in years]
        return f"{min(years)}-{max(years)}"
    if 'Since' in years:
        years = years.split('Since')[1].strip()
        return f"{years}-present"
    return years

def advanced_search(df, query, search_columns):
    def process_query(q):
        # First split on AND
        and_parts = [part.strip() for part in q.split(' AND ')]
        
        # For each AND part, split on OR if it exists
        processed_parts = []
        for and_part in and_parts:
            or_parts = [term.strip() for term in and_part.split(' OR ')]
            processed_parts.append(or_parts)
        
        return processed_parts

    def search_term(term, text):
        # Treat the entire term as a phrase, including spaces
        return term.lower() in str(text).lower()

    def combine_columns(row):
        return ' '.join(str(row[col]) for col in search_columns if pd.notna(row[col]))

    # Process the combined text of each row
    combined_text = df.apply(combine_columns, axis=1)

    # Process the query into AND groups and OR terms
    search_groups = process_query(query)

    # Initialize mask
    mask = pd.Series([True] * len(df), index=df.index)

    # Keep track of all matching terms for words_found
    all_matching_terms = []

    # Each AND group must be satisfied
    for or_terms in search_groups:
        group_mask = pd.Series([False] * len(df), index=df.index)
        
        # Any OR term can satisfy the group
        for term in or_terms:
            term_mask = combined_text.apply(lambda x: search_term(term, x))
            group_mask |= term_mask
            # Add matching terms to the list
            if any(term_mask):
                all_matching_terms.append(term)
        
        # AND this group with the main mask
        mask &= group_mask

    results = df[mask]

    if results.empty:
        return []
    
    formatted_results = []
    for _, row in results.iterrows():
        combined_row_text = combine_columns(row)
        # Find which terms matched in this specific result
        words_found = [term for term in all_matching_terms 
                      if search_term(term, combined_row_text)]
        
        formatted_results.append({
            "title": row["Source name"],
            "description": row["Description"],
            "years": format_years(row["Years"]),
            "source": row["Source name"],
            "link": row["Link"],
            "words_found": words_found
        })

    # Sort results by number of matching terms
    formatted_results.sort(key=lambda x: len(x['words_found']), reverse=True)

    return formatted_results