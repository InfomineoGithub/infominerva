import pandas as pd
import re

""" Later on, we use "..."years": row["Years"], " let's write a function we'll apply to this.
as this is what it looks like a lot of times : 2018;2019;2020  or Since 1990. Let's write a function that automatically detects the format and returns e.g 2018-2020 or 1990-present
"""
def format_years(years):
    if ';' in years: # we split the years by ; and take the highest year and the lowest year
        years = years.split(';')
        years = [int(year) for year in years]
        return str(min(years)) + '-' + str(max(years))
    if 'Since' in years: # there should only be one year, we take it and return year-present
        years = years.split('Since')[1]
        return years + '-present'
    else:
        return years

def advanced_search(df, query, search_columns):
    def process_query(q):
        # Split by 'AND', preserving parentheses
        and_terms = re.findall(r'\([^()]+\)|[^()]+', q)
        and_terms = [term.strip() for term in and_terms if term.strip()]
        
        # Process each AND term
        processed_terms = []
        for term in and_terms:
            if term.startswith('(') and term.endswith(')'):
                processed_terms.append(term[1:-1])  # Remove parentheses
            else:
                # Split non-parentheses terms into individual words
                processed_terms.extend(re.findall(r'\S+', term))
        
        return processed_terms, len(and_terms)

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

    tokens, and_count = process_query(query)

    # Initialize mask with True values
    mask = pd.Series([True] * len(df), index=df.index)

    # Group tokens by AND terms
    for i in range(0, len(tokens), and_count):
        group = tokens[i:i+and_count]
        group_mask = pd.Series([False] * len(df), index=df.index)
        
        for token in group:
            term_mask = combined_text.apply(lambda x: search_term(token, x))
            group_mask |= term_mask
        
        mask &= group_mask

    results = df[mask]

    if results.empty:
        return []
    
    formatted_results = results.apply(
        lambda row: {
            "title": row["Source name"],
            "description": row["Description"],
            "years": format_years(row["Years"]),
            "source": row["Source name"],
            "link": row["Link"],
        },
        axis=1,
    ).tolist()

    return formatted_results