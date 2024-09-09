import openai
import requests
from bs4 import BeautifulSoup
import re

# Initialize OpenAI API 
openai.api_key = "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"

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
    system_prompt = {
        "role": "system",
        "content": """
        You are an expert data analyst specialized in content analysis and keyword extraction for business research. Your task is to analyze the given content and extract relevant information to categorize the source. The content given is parsed from websites, It may have irrelevant stuff that you need to ignore. Your audience is business researchers who will use this information for market analysis and reports.

        Provide your answers in the following format:

        1. Sector/Area: (Main industry or area of focus)
        2. Sub-Sector: (More specific category within the Sector/Area)
        3. Source name: (Name of the organization or database providing the information)
        4. Description: (2-3 sentences summarizing what kind of data or information the source provides)        
        5. Years: (The range of years the data covers, in the format "YYYY; YYYY; YYYY" for specific years or "YYYY-YYYY" for ranges) If not specified, use "Not specified." ONLY.
        6. Tags: (At least 30 relevant keywords and phrases, separated by semicolons. Include a mix of general and specific terms, synonyms, related terms, and both short-tail and long-tail keywords. Consider different user intents such as informational, navigational, and transactional.)

        Guidelines:
        - For Sector/Area and Sub-Sector, be specific but not overly narrow.
        - The Description should be informative but concise, focusing on the type of data available.
        - Tags should be comprehensive and relevant for search and categorization purposes.
        - For Years, if specific years are mentioned, list them individually. If a range is given, use the range format.
        - Avoid including irrelevant information or speculation.
        """
    }

    conversation = [
        system_prompt,
        {"role": "user", "content": f"Analyze the following content from {url} and provide the requested information:\n\n{content}"}
    ]

    response = openai.chat.completions.create(
        model="gpt-4-1106-preview",
        temperature=0.1,
        messages=conversation
    )

    return response.choices[0].message.content

def parse_llm_response(response):
    lines = response.split('\n')
    result = {}
    for line in lines:
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.split('.', 1)[-1].strip()  # Remove numbering and strip
            result[key] = value.strip()
    
    # Process Years field
    if 'Years' in result:
        years = result['Years']
        # If it's a range, keep it as is
        if '-' in years:
            result['Years'] = years
        else:
            # If it's a list of years, ensure they are separated by semicolons
            years = re.findall(r'\d{4}', years)
            result['Years'] = '; '.join(years)
    
    return result

def check_link_exists(df, link):
    return link in df['Link'].values

def process_link(df, link):
    if check_link_exists(df, link):
        return {"error": "Link already exists in the database"}

    content = fetch_website_content(link)
    if not content:
        return {"error": "Failed to fetch website content"}

    llm_response = analyze_content(content, link)
    parsed_response = parse_llm_response(llm_response)
    parsed_response['link'] = link

    return parsed_response