#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API base URL
API_URL="http://localhost:3000"

echo -e "${YELLOW}🧪 Testing Sign-Up Flow API${NC}"
echo "=================================="

# Test 1: Health Check
echo -e "\n${YELLOW}1. Testing Health Check${NC}"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "${API_URL}/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $RESPONSE_BODY"
fi

# Test 2: Sign Up
echo -e "\n${YELLOW}2. Testing User Sign Up${NC}"
SIGNUP_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "${API_URL}/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }')

HTTP_CODE=$(echo "$SIGNUP_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$SIGNUP_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" -eq 201 ]; then
    echo -e "${GREEN}✅ Sign up successful${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ Sign up failed${NC}"
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $RESPONSE_BODY"
fi

# Test 3: Login
echo -e "\n${YELLOW}3. Testing User Login${NC}"
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }')

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Login successful${NC}"
    echo "Response: $RESPONSE_BODY"
    
    # Extract JWT token for future use
    JWT_TOKEN=$(echo "$RESPONSE_BODY" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    echo "JWT Token: ${JWT_TOKEN:0:50}..."
else
    echo -e "${RED}❌ Login failed${NC}"
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $RESPONSE_BODY"
fi

# Test 4: Duplicate Sign Up (should fail)
echo -e "\n${YELLOW}4. Testing Duplicate Sign Up (should fail)${NC}"
DUPLICATE_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "${API_URL}/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123!"
  }')

HTTP_CODE=$(echo "$DUPLICATE_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$DUPLICATE_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" -eq 409 ]; then
    echo -e "${GREEN}✅ Duplicate sign up correctly rejected${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ Duplicate sign up should have failed${NC}"
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $RESPONSE_BODY"
fi

# Test 5: Invalid Login (should fail)
echo -e "\n${YELLOW}5. Testing Invalid Login (should fail)${NC}"
INVALID_LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword123!"
  }')

HTTP_CODE=$(echo "$INVALID_LOGIN_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$INVALID_LOGIN_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" -eq 401 ]; then
    echo -e "${GREEN}✅ Invalid login correctly rejected${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ Invalid login should have failed${NC}"
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $RESPONSE_BODY"
fi

# Test 6: Validation Error (should fail)
echo -e "\n${YELLOW}6. Testing Validation Error (should fail)${NC}"
VALIDATION_RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "${API_URL}/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "T",
    "email": "invalid-email",
    "password": "weak"
  }')

HTTP_CODE=$(echo "$VALIDATION_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$VALIDATION_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}✅ Validation error correctly handled${NC}"
    echo "Response: $RESPONSE_BODY"
else
    echo -e "${RED}❌ Validation should have failed${NC}"
    echo "HTTP Code: $HTTP_CODE"
    echo "Response: $RESPONSE_BODY"
fi

echo -e "\n${YELLOW}🎉 API Testing Complete!${NC}"
echo -e "${GREEN}📚 Swagger documentation available at: ${API_URL}/api${NC}" 