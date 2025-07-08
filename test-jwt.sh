#!/bin/bash

echo "🧪 Probando Sistema JWT - Weather API"
echo "====================================="

# URL base
BASE_URL="http://localhost:3000"

echo ""
echo "1️⃣ Probando endpoint público..."
curl -s "$BASE_URL/weather/public-info" | jq '.'

echo ""
echo "2️⃣ Probando login con credenciales válidas..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }')

echo $LOGIN_RESPONSE | jq '.'

# Extraer token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo ""
    echo "3️⃣ Probando endpoint protegido con token válido..."
    curl -s -X GET "$BASE_URL/weather/forecast?latitude=40.7128&longitude=-74.0060" \
      -H "Authorization: Bearer $TOKEN" | jq '.'
    
    echo ""
    echo "4️⃣ Probando verificación de token..."
    curl -s -X POST "$BASE_URL/auth/verify" \
      -H "Content-Type: application/json" \
      -d "{\"token\": \"$TOKEN\"}" | jq '.'
    
    echo ""
    echo "5️⃣ Probando endpoint protegido SIN token (debe fallar)..."
    curl -s -X GET "$BASE_URL/weather/forecast?latitude=40.7128&longitude=-74.0060" | jq '.'
    
    echo ""
    echo "6️⃣ Probando login con credenciales inválidas..."
    curl -s -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "username": "admin",
        "password": "wrongpassword"
      }' | jq '.'
    
else
    echo "❌ Error: No se pudo obtener el token JWT"
fi

echo ""
echo "✅ Pruebas completadas!" 