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
        and_parts = re.split(r'\s+AND\s+', q)
        terms = []
        for part in and_parts:
            terms.append(re.findall(r'\([^()]+\)|\S+', part))
        return terms

    def search_term(term, text):
        if ' ' not in term:
            return re.search(r'\b' + re.escape(term.lower()) + r'\b', str(text).lower()) is not None
        else:
            return term.lower() in str(text).lower()

    def combine_columns(row):
        return ' '.join(str(row[col]) for col in search_columns if pd.notna(row[col]))

    def format_word(word):
        if word.startswith('(') and word.endswith(')'):
            return word  # Keep parentheses for phrases
        else:
            return word.replace('(', '').replace(')', '')  # Remove parentheses from single words

    combined_text = df.apply(combine_columns, axis=1)

    and_terms = process_query(query)

    mask = pd.Series([True] * len(df), index=df.index)
    all_terms = [term for group in and_terms for term in group]

    for and_group in and_terms:
        group_mask = pd.Series([False] * len(df), index=df.index)
        for token in and_group:
            token = token.strip('()')
            term_mask = combined_text.apply(lambda x: search_term(token, x))
            group_mask |= term_mask
        mask &= group_mask

    results = df[mask]

    if results.empty:
        return []
    
    formatted_results = []
    for _, row in results.iterrows():
        combined_row_text = combine_columns(row)
        words_found = [format_word(term) for term in all_terms if search_term(term.strip('()'), combined_row_text)]
        formatted_results.append({
            "title": row["Source name"],
            "description": row["Description"],
            "years": format_years(row["Years"]),
            "source": row["Source name"],
            "link": row["Link"],
            "words_found": words_found
        })

    return formatted_results