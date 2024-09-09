# Use an official Python runtime as a parent image
FROM python:3.8

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install Python dependencies
RUN python -m venv venv
RUN . venv/bin/activate && pip install -r Backend/requirements.txt && pip install gunicorn

# Install Node.js dependencies
RUN cd /app && npm install

# Build React app for production
RUN cd /app && npm run build

# Configure ngrok
RUN ngrok config add-authtoken 28zBovSx2jpRgNlIkBDFkk1n2do_4QaRa37q1ntQdtMuxvVp

# Create a script to run services (development mode)
RUN echo '#!/bin/bash\n\
. venv/bin/activate\n\
cd Backend && uvicorn main:app --host 0.0.0.0 --port 8000 &\n\
cd /app && npm start &\n\
ngrok http 3000\n\
wait' > /app/run_dev.sh

# Create a script to run services (production mode)
RUN echo '#!/bin/bash\n\
. venv/bin/activate\n\
cd Backend && gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 &\n\
cd /app && npx serve -s build -l 8000 &\n\
ngrok http 8000\n\
wait' > /app/run_prod.sh

RUN chmod +x /app/run_dev.sh /app/run_prod.sh

# Default to development mode
CMD ["/app/run_dev.sh"]