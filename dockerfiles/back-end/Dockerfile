# syntax=docker/dockerfile:1

FROM python:3.7.4

# RUN apk add --no-cache python3-dev libffi-dev gcc && pip3 install --upgrade pip

WORKDIR /usr/src/app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

RUN python -m spacy download en
