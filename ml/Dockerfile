FROM python:3.10-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libgl1 && rm -rf /var/lib/apt/lists/*
COPY ml/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY ml/models ml/models
COPY ml/api ml/api
EXPOSE 8000
CMD ["uvicorn", "ml.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
