# BCG Knowledge Search Tool

The app is a React app that allows users to search with keywords and filters online with login credentials. It uses an internal database sent by BCG internal team.

## Structure of the app

The app is divided into the backend and the frontend : 
- The backend is a **fastapi** app that uses the database sent by the BCG internal team. It's easy to add new endpoints such as LLM Agents, Modifying the database, etc.
- The frontend is a **React app** that allows users to search with keywords and filters online with login credentials. The authentication is done with Firebase. It uses the backend to get the data.

## Installation

### Local Installation

To run the app locally (No docker), you need to activate the venv :
```bash
source venv/bin/activate
```
For windows, you need to run the command:
```bash
.\venv\Scripts\activate
```
Then, you can run the app with :
```bash
fastapi run main.py
```
or :
```bash
uvicorn main:app --reload
```

or you can install the requirements.txt file directly.

Once the API is running, you can run the frontend with :
```bash
cd bcg-knowledge-search-tool
npm install
npm start
```
However this will give you an address IP only accessible in local network. you can then run ngrok to get a proper domain name accessible from the internet : 
```bash
ngrok http 3000
```

then you'd need to add it to firebase autohorized domains.
this is lazy and mostly for development purpose, ideally you should use the docker image and have it running in the cloud.

### Docker Installation

There is already a dockerfile in the root of the project. You can build the image with :
```bash
docker build -t bcg-knowledge-search-tool .
```
Then you can run the image with :
```bash
docker run -p 8000:8000 bcg-knowledge-search-tool
```
