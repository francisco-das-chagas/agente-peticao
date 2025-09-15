# Usar uma imagem base oficial do Python
FROM python:3.11-slim
# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app
# Instalar o Tesseract-OCR (dependência do sistema)
RUN apt-get update && apt-get install -y tesseract-ocr && rm -rf /var/lib/apt/lists/*
# Copiar o arquivo de dependências do Python para o contêiner
COPY requirements.txt .
# Instalar as dependências do Python
RUN pip install -r requirements.txt
# Copiar todos os outros arquivos para o contêiner
COPY . .
# Comando para iniciar a aplicação no Hugging Face
CMD gunicorn --bind 0.0.0.0:7860 --timeout 300 app:app