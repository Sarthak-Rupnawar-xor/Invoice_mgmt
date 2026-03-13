# Database connection and configuration
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

Mongo_URL= os.getenv("COSMOS_CONN")
client = MongoClient(Mongo_URL)

db= client["Invoice_db"]
invoice_collection = db["invoice"]