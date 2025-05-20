from sqlalchemy import or_, and_, func  # <--- Import func
from sqlalchemy.orm import Session
from models import DatabaseModel  # Assuming this defines your table model correctly
import re


def format_years(years):
    if not years:
        return "N/A"
    years = str(years)
    if ';' in years:
        # Added check for isdigit to prevent errors if non-numeric parts exist
        years_list = [int(year) for year in years.split(';') if year.strip().isdigit()]
        if not years_list: return "N/A" # Handle case where no valid numbers found
        return f"{min(years_list)}-{max(years_list)}"
    if 'Since' in years:
        years_val = years.split('Since')[1].strip()
        # Check if the extracted part is actually a number before formatting
        if years_val.isdigit():
            return f"{years_val}-present"
        else:
            return years # Or return original string or "N/A" if preferred
    return years

def process_query(q):
    # Remove extra whitespace around operators before splitting
    q = re.sub(r'\s+(AND|OR)\s+', lambda m: f' {m.group(1)} ', q.strip())
    and_parts = [part.strip() for part in q.split(' AND ')]
    processed_parts = []
    for and_part in and_parts:
        # Filter out empty strings that might result from splitting adjacent ORs or leading/trailing ORs
        or_parts = [term.strip() for term in and_part.split(' OR ') if term.strip()]
        if or_parts: # Only add if there are valid OR terms
            processed_parts.append(or_parts)
    # Filter out empty AND groups
    processed_parts = [group for group in processed_parts if group]
    return processed_parts

def extract_exact_phrases(q):
    return re.findall(r'"([^"]+)"', q)

# --- SQL Search Implementation ---

# Define the database columns to search within (using ORM attributes)
# Ensure these match the columns used in the Pandas version's search_columns list
search_columns_sql = [
    DatabaseModel.Tags,
    DatabaseModel.Sector_Area,
    DatabaseModel.Sub_Sector,
    DatabaseModel.Description,
    DatabaseModel.Source_name,
    DatabaseModel.Expert_opinion
    # Add any other columns that were in the original df search_columns list
]

# Build the filter logic based on the parsed query AND the combined text expression
def build_filters_combined(search_groups, exact_phrases, combined_text_sql):
    """
    Builds SQLAlchemy filters targeting a single combined text expression,
    mimicking the Pandas combined-column search logic.
    """
    all_filters = []

    # 1. Add filters for exact phrases (all must match - AND logic)
    for phrase in exact_phrases:
        # Case-insensitive search for the exact phrase within the combined text
        all_filters.append(combined_text_sql.ilike(f'%{phrase}%'))

    # 2. Add filters for AND/OR keyword groups
    for or_terms in search_groups:
        or_block_filters = []
        # Any term in this list can match (OR logic)
        for term in or_terms:
            # Filter out empty terms that might arise from parsing quirks
            if term:
                # Case-insensitive search for the term within the combined text
                or_block_filters.append(combined_text_sql.ilike(f'%{term}%'))
        # Only add the OR block if it contains valid filters
        if or_block_filters:
            all_filters.append(or_(*or_block_filters))

    # Combine all phrase filters and group filters using AND
    if not all_filters:
        return True # No query terms, match everything
    else:
        return and_(*all_filters)

def advanced_search_sql(db: Session, query: str):
    """
    Performs search on SQL database mimicking the Pandas combined-column approach.
    """
    # --- Step 1: Create the combined text expression in SQL ---
    # Use coalesce to handle potential NULLs and concat_ws for clean concatenation
    # NOTE: Requires PostgreSQL or a DB supporting concat_ws.
    #       For others, use nested func.concat.
    combined_text_sql = func.concat_ws(
        ' ',
        *[func.coalesce(col, '') for col in search_columns_sql]
    )

    # --- Step 2: Parse the user query ---
    exact_phrases = extract_exact_phrases(query)
    # Clean the query AFTER extracting phrases
    cleaned_query = re.sub(r'"[^"]+"', '', query).strip()
    # Process the remaining keywords and AND/OR operators
    search_groups = process_query(cleaned_query)

    # --- Step 3: Build the combined filter ---
    # Pass the SQL combined text expression to the filter builder
    combined_filter = build_filters_combined(search_groups, exact_phrases, combined_text_sql)

    # --- Step 4: Query the database ---
    # Apply the filter to the query
    results_query = db.query(DatabaseModel)
    if combined_filter is not True: # Avoid filtering if the filter is just True (empty query)
        results_query = results_query.filter(combined_filter)

    results = results_query.all()

    # --- Step 5: Process results (format and calculate words_found) ---
    # This part remains largely the same, as it reconstructs text *after* fetching
    # to determine which specific terms matched for ranking.
    final_results = []
    all_search_terms = [term for group in search_groups for term in group if term] # Flattened list of keyword terms
    all_match_candidates = all_search_terms + [f'"{p}"' for p in exact_phrases] # All terms + phrases to check

    for row in results:
        # Reconstruct the combined text *in Python* for finding matched words accurately
        # Ensure these fields EXACTLY match those in search_columns_sql
        py_combined_text = " ".join([
            str(getattr(row, col.key) or "") for col in search_columns_sql
            # getattr(row, "Tags") or "",
            # getattr(row, "Sector_Area") or "",
            # getattr(row, "Sub_Sector") or "",
            # getattr(row, "Description") or "",
            # getattr(row, "Source_name") or "",
            # getattr(row, "Expert_opinion") or ""
        ]).lower()

        words_found = []
        # Check keywords
        for term in all_search_terms:
            # Use 'in' for substring matching, mimicking Pandas
            if term.lower() in py_combined_text:
                words_found.append(term)
        # Check exact phrases
        for phrase in exact_phrases:
            # Use 'in' for substring matching, mimicking Pandas
            if phrase.lower() in py_combined_text:
                words_found.append(f'"{phrase}"') # Keep quotes for display

        # Remove duplicate terms if a term was part of multiple OR groups etc.
        words_found = list(dict.fromkeys(words_found))

        final_results.append({
            "title": row.Source_name,
            "description": row.Description,
            "years": format_years(row.Years),
            "source": row.Source_name,
            "link": row.Link,
            "words_found": words_found # Use the recalculated list
        })

    # --- Step 6: Sort results ---
    # Sort by relevance (number of unique words found)
    final_results.sort(key=lambda x: len(x['words_found']), reverse=True)

    return final_results

