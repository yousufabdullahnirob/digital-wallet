import requests
import json

url = 'http://127.0.0.1:8000/api/expenses/'
data = {
    "amount": "10.50",
    "category": "Test Category",
    "description": "Test Description",
    "date": "2023-10-27",
    "transaction_type": "expense"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
