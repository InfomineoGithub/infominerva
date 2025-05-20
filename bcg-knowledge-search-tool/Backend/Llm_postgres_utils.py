import openai
import requests
from bs4 import BeautifulSoup
import re
from sqlalchemy.orm import Session
from models import DatabaseModel

# Initialize OpenAI API
openai.api_key = "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"


VALID_PA_CLASSIFICATIONS = [
    "Aerospace & Defense", "Agriculture", "Climate & Sustainability",
    "Consumer Goods & Retail", "Corporate Finance Strategy", "Energy & Utilities",
    "Banking & Financial Services", "Healthcare", "Automotive", "Chemicals",
    "Construction & Engineering", "Manufacturing", "Metals & Mining", "Textiles",
    "Transportation & Logistics", "Insurance", "Human Resources & Workforce Mgmt",
    "Legal & Compliance", "Macroeconomics", "Public Sector & Government",
    "Real Estate", "Social Impact", "Information Technology",
    "Media & Entertainment", "Telecommunications"
]

def fetch_website_content(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        # Remove script, style, header, footer, and navigation elements
        for element in soup(["script", "style", "header", "footer", "nav"]):
            element.decompose()

        # Find the main content
        main_content = soup.find('main') or soup.find('article') or soup.find('div', class_='content')

        if main_content:
            text = main_content.get_text(separator='\n', strip=True)
        else:
            text = soup.get_text(separator='\n', strip=True)

        # Further clean up the text
        lines = (line.strip() for line in text.splitlines())
        text = '\n'.join(line for line in lines if line)

        return text[:8000]  # Increased to 8000 characters for more context
    except Exception as e:
        print(f"Error fetching website content: {e}")
        return None

def analyze_content(content, url):
    valid_pa_str = "\n".join([f"- {pa}" for pa in VALID_PA_CLASSIFICATIONS])

    system_prompt = {
        "role": "system",
        "content": f"""
        You are an expert data analyst specialized in content analysis and keyword extraction for business research. Your task is to analyze the given content and extract relevant information to categorize the source. The content given is parsed from websites, It may have irrelevant stuff that you need to ignore.

        Provide your answers in the following format:

        1. PA classification: (Choose EXACTLY ONE from the following list. Use the exact spelling and formatting:
{valid_pa_str}
        )
        2. Source name: (Name of the organization or database providing the information)
        3. Description: (2-3 sentences summarizing what kind of data or information the source provides)        
        4. Years: (The range of years the data covers, in the format "YYYY; YYYY; YYYY" for specific years or "YYYY-YYYY" for ranges. If not specified, write "Not specified" ONLY.)
        5. Tags: (At least 70 relevant keywords and phrases, separated by semicolons. Include a mix of general and specific terms, synonyms, related terms, and both short-tail and long-tail keywords. Reflect different user intents, such as informational, navigational, and transactional intents.)

        Guidelines:
        - For PA classification, you MUST choose one from the provided list exactly as written
        - The Description should be informative but concise, focusing on the type of data available
        - Tags should be comprehensive and relevant for search and categorization purposes
        - For Years, if specific years are mentioned, list them individually. If a range is given, use the range format
        - Avoid including irrelevant information or speculation
        """
    }

    conversation = [
        system_prompt,
        {"role": "user", "content": f"Analyze the following content from {url} and provide the requested information:\n\n{content}"}
    ]

    response = openai.chat.completions.create(
        model="gpt-4o",
        temperature=0.1,
        messages=conversation
    )

    return response.choices[0].message.content

def parse_llm_response(response):
    lines = response.split('\n')
    result = {}
    current_key = None

    for line in lines:
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.split('.', 1)[-1].strip()  # Remove numbering and strip
            result[key] = value.strip()

    # Validate PA classification
    if 'PA classification' in result:
        pa = result['PA classification']
        if pa not in VALID_PA_CLASSIFICATIONS:
            result['PA classification'] = 'Information Technology'  # Default fallback

    # Process Years field
    if 'Years' in result:
        years = result['Years']
        if years.lower() == 'not specified':
            result['Years'] = 'Not specified'
        elif '-' in years:
            result['Years'] = years
        else:
            years = re.findall(r'\d{4}', years)
            result['Years'] = '; '.join(years)
        #Added logic for last available year
        year_numbers = re.findall(r'\d{4}', result['Years'])
        if year_numbers:
            latest_year = max(map(int, year_numbers))
            result['Latest year available'] = str(latest_year)
    return result


# --- MODIFIED FUNCTION ---
def check_link_exists(db: Session, link: str) -> bool:
    """
    Checks if a link already exists in the DatabaseModel table using SQLAlchemy.
    """
    return db.query(DatabaseModel).filter(DatabaseModel.Link == link).first() is not None

# --- MODIFIED FUNCTION ---
def process_link(db: Session, link: str) -> dict:
    """
    Orchestrates the link processing using SQL for existence check.
    1. Checks if the link already exists in the database.
    2. Fetches website content.
    3. Analyzes content with LLM.
    4. Parses the LLM response.
    Returns a dictionary with the parsed data or an error message.
    This function DOES NOT save data to the database.
    """
    # Basic validation for the link
    if not link or not (link.startswith("http://") or link.startswith("https://")):
        return {"error": "Invalid or missing link URL"}

    if check_link_exists(db, link):
        return {"error": "Link already exists in the database"}

    content = fetch_website_content(link)
    if content is None: # Check for None explicitly
        return {"error": "Failed to fetch website content"}
    if not content.strip(): # Check if content is just whitespace
        return {"error": "Fetched content is empty or contains only whitespace"}


    try:
        llm_response_text = analyze_content(content, link)
        if llm_response_text is None: # If analyze_content itself returned None (e.g. API error)
            return {"error": "Failed to analyze content with LLM (API error or no response)"}
    except Exception as e: # Catch any other unexpected errors from analyze_content
        print(f"Error during LLM analysis for {link}: {e}")
        return {"error": "An unexpected error occurred during LLM analysis"}


    parsed_response = parse_llm_response(llm_response_text)
    # parse_llm_response currently doesn't have explicit error returns,
    # but if it did, we'd check for `if "error" in parsed_response:` here.

    parsed_response['Link'] = link # Add the original link to the response

    return parsed_response