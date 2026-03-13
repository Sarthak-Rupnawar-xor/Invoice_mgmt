from fastapi import FastAPI
from database import invoice_collection
from routes.invoice import router as invoice_router
from fastapi.middleware.cors import CORSMiddleware

app= FastAPI()

#allow react frontend to access the api
origins= ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# @app.get("/")
# def home():
#     return {"message": "Hello World"}

@app.get("/test-db")
def test_db():
    count= invoice_collection.count_documents({})
    return {"count": count}

# Include the invoice router
app.include_router(invoice_router)