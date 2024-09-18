#!/bin/bash

# Controleer of Node.js is geïnstalleerd
if ! command -v node &> /dev/null
then
    echo "Node.js is niet geïnstalleerd. Installeer Node.js om door te gaan."
    exit
fi

# Dependencies installeren
echo "Dependencies installeren..."
npm install

# Applicatie bouwen
echo "Applicatie bouwen..."
npm run build

# Applicatie starten
echo "Applicatie starten..."
npm start
