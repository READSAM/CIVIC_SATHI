# import os
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import google.generativeai as genai
# from dotenv import load_dotenv

# # --- Initialization ---
# load_dotenv()
# app = Flask(__name__)
# CORS(app) # Enables communication between frontend and backend

# # --- Core Logic Functions ---
# def generate_tags_from_description(description: str) -> str:
#     """Generates tags using the Gemini API. This is the core AI function."""
#     try:
#         api_key = os.getenv("GOOGLE_API_KEY")
#         if not api_key:
#             return "Error: GOOGLE_API_KEY not found."
#         genai.configure(api_key=api_key)
#         model = genai.GenerativeModel('gemini-1.5-flash-latest')
#         prompt = f"""
#         You are a civic issue analysis bot. Your task is to extract highly specific keywords from a description.
#         Analyze the following description and generate a list of 1-3 specific tags.
#         Each tag should ideally describe the problem and the object (e.g., 'broken road', 'stray dogs', 'industrial smoke').
#         Do not generalize. Provide the output as a single line of comma-separated values.

#         Description:
#         ---
#         {description}
#         ---

#         Tags:
#         """
#         response = model.generate_content(prompt)
#         return response.text.strip()
#     except Exception as e:
#         return f"An error occurred during tag generation: {e}"

# def assign_department_from_tags(tags_string: str) -> str:
#     """Assigns a department based on a string of tags. This is the core classification function."""
#     department_keywords = {
#         'Pollution Control Board': ['pollution', 'smoke', 'emission', 'factory', 'industrial waste', 'noise', 'contamination', 'air quality', 'water pollution'],
#         'Transport Department (RTO)': ['bus', 'auto', 'traffic signal', 'transport', 'vehicle', 'overcrowding', 'driving', 'license'],
#         'Animal Control & Veterinary Services': ['animal', 'dog', 'stray', 'cattle', 'monkey', 'bite', 'rabies', 'carcass', 'nuisance', 'sterilization'],
#         'Public Works Department (PWD)': ['road', 'pothole', 'pavement', 'drain', 'culvert', 'bridge', 'street', 'asphalt'],
#         'Water Supply & Sewerage Department': ['water', 'pipe', 'leak', 'sewage', 'sewer', 'drainage', 'manhole'],
#         'Health & Sanitation Department': ['garbage', 'waste', 'dump', 'cleanliness', 'hygiene', 'sweeping', 'mosquito', 'pest', 'litter', 'trash', 'filth'],
#         'Street Light Department': ['street light', 'streetlight', 'lamp', 'lighting', 'dark'],
#         'Horticulture & Parks Department': ['tree', 'park', 'garden', 'plant', 'grass', 'fallen tree'],
#         'Town Planning Department': ['illegal construction', 'encroachment', 'zoning', 'unauthorized'],
#         'Electricity Department': ['power', 'electricity', 'transformer', 'wire', 'outage' , 'electric', 'pole']
#     }
#     generated_tags = [tag.strip().lower() for tag in tags_string.split(',')]
#     for department, keywords in department_keywords.items():
#         for keyword in keywords:
#             for tag in generated_tags:
#                 if keyword in tag:
#                     return department
#     return "General Grievance Cell / Public Relations Office"

# # --- API Endpoint for the USER ---
# @app.route('/api/generate-tags', methods=['POST'])
# def handle_user_request():
#     data = request.get_json()
#     description = data.get('description', '')
#     if not description:
#         return jsonify({"error": "Description is required."}), 400
    
#     tags = generate_tags_from_description(description)
#     return jsonify({"generated_tags": tags})

# # --- API Endpoint for the ADMIN ---
# @app.route('/api/assign-department', methods=['POST'])
# def handle_admin_request():
#     data = request.get_json()
#     tags = data.get('tags', '')
#     if not tags:
#         return jsonify({"error": "Tags are required."}), 400

#     department = assign_department_from_tags(tags)
#     return jsonify({"assigned_department": department})

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import logging

# --- Initialization ---
load_dotenv()
app = Flask(__name__)
CORS(app) # Enables communication between frontend and backend

# Add this line to log to the console
logging.basicConfig(level=logging.INFO)

# --- Core Logic Functions ---
def generate_tags_from_description(description: str) -> str:
    """Generates tags using the Gemini API. This is the core AI function."""
    try:
        logging.info("Attempting to load Google API key...")
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            logging.error("Error: GOOGLE_API_KEY not found.")
            return "Error: GOOGLE_API_KEY not found."
        
        genai.configure(api_key=api_key)
        
        logging.info("API key loaded successfully. Configuring model...")
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        prompt = f"""
        You are a civic issue analysis bot. Your task is to extract highly specific keywords from a description.
        Analyze the following description and generate a list of 1-3 specific tags.
        Each tag should ideally describe the problem and the object (e.g., 'broken road', 'stray dogs', 'industrial smoke').
        Do not generalize. Provide the output as a single line of comma-separated values.

        Description:
        ---
        {description}
        ---

        Tags:
        """
        
        logging.info(f"Sending prompt to Gemini API. Description: {description[:50]}...")
        response = model.generate_content(prompt)
        
        logging.info("Received response from Gemini API.")
        # Print the raw text response for debugging
        logging.info(f"Gemini API Response: {response.text.strip()}")
        
        return response.text.strip()
    except Exception as e:
        # This will print the actual error message to your console
        logging.error(f"An error occurred during tag generation: {e}")
        return f"An error occurred during tag generation: {e}"

def assign_department_from_tags(tags_string: str) -> str:
    """Assigns a department based on a string of tags. This is the core classification function."""
    department_keywords = {
        'Pollution Control Board': ['pollution', 'smoke', 'emission', 'factory', 'industrial waste', 'noise', 'contamination', 'air quality', 'water pollution'],
        'Transport Department (RTO)': ['bus', 'auto', 'traffic signal', 'transport', 'vehicle', 'overcrowding', 'driving', 'license'],
        'Animal Control & Veterinary Services': ['animal', 'dog', 'stray', 'cattle', 'monkey', 'bite', 'rabies', 'carcass', 'nuisance', 'sterilization'],
        'Public Works Department (PWD)': ['road', 'pothole', 'pavement', 'drain', 'culvert', 'bridge', 'street', 'asphalt'],
        'Water Supply & Sewerage Department': ['water', 'pipe', 'leak', 'sewage', 'sewer', 'drainage', 'manhole'],
        'Health & Sanitation Department': ['garbage', 'waste', 'dump', 'cleanliness', 'hygiene', 'sweeping', 'mosquito', 'pest', 'litter', 'trash', 'filth'],
        'Street Light Department': ['street light', 'streetlight', 'lamp', 'lighting', 'dark'],
        'Horticulture & Parks Department': ['tree', 'park', 'garden', 'plant', 'grass', 'fallen tree'],
        'Town Planning Department': ['illegal construction', 'encroachment', 'zoning', 'unauthorized'],
        'Electricity Department': ['power', 'electricity', 'transformer', 'wire', 'outage' , 'electric', 'pole']
    }
    generated_tags = [tag.strip().lower() for tag in tags_string.split(',')]
    for department, keywords in department_keywords.items():
        for keyword in keywords:
            for tag in generated_tags:
                if keyword in tag:
                    return department
    return "General Grievance Cell / Public Relations Office"

# --- API Endpoint for the USER ---
@app.route('/api/generate-tags', methods=['POST'])
def handle_user_request():
    logging.info("Request received at /api/generate-tags")
    data = request.get_json()
    description = data.get('description', '')
    if not description:
        logging.warning("Description is missing from request.")
        return jsonify({"error": "Description is required."}), 400
    
    tags = generate_tags_from_description(description)
    return jsonify({"generated_tags": tags})

# --- API Endpoint for the ADMIN ---
@app.route('/api/assign-department', methods=['POST'])
def handle_admin_request():
    logging.info("Request received at /api/assign-department")
    data = request.get_json()
    tags = data.get('tags', '')
    if not tags:
        logging.warning("Tags are missing from request.")
        return jsonify({"error": "Tags are required."}), 400

    department = assign_department_from_tags(tags)
    return jsonify({"assigned_department": department})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
