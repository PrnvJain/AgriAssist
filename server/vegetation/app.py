from flask import Flask, request, jsonify, render_template, send_file
from flask import request as req
from flask_cors import CORS
from flask_cors import cross_origin
from sentinelhub import SHConfig, SentinelHubStatistical, BBox, Geometry, DataCollection, CRS
import json
from datetime import datetime
import matplotlib
matplotlib.use('Agg')  # Required for non-interactive backend
import matplotlib.pyplot as plt
import pandas as pd
import os
from werkzeug.utils import secure_filename

import random
app = Flask(__name__)
CORS(app)   # Enable CORS for all routes


GLOBAL_DATA_FILE = r"C:/Users/Apoorva/Documents/VIT/Major Project/Bhoomi/Bhoomi-main/client/public/global_data.json"
FORM_DATA_FILE = r"C:/Users/Apoorva/Documents/VIT/Major Project/Bhoomi/Bhoomi-main/client/public/form_data.json"
LOAN_APPLICATION_FILE = r"C:/Users/Apoorva/Documents/VIT/Major Project/Bhoomi/Bhoomi-main/client/public/loan_data.json"
OUTPUT_FILE = r"C:/Users/Apoorva/Documents/VIT/Major Project/Bhoomi/Bhoomi-main/client/public/output.json"
credit_score = 0
# Crop category lists
cash_crops = [
    "cotton", "jute", "tea", "coffee", "sugarcane", "tobacco", "black pepper", "turmeric", "cardamom",
    "ginger", "rubber", "cocoa", "areca nut", "clove", "cashew nut", "vanilla", "betel leaves", "oil palm", "coriander"
]

horticulture_crops = [
    "mango", "banana", "apple", "grapes", "pomegranate", "papaya", "guava", "litchi", "pineapple", "orange",
    "watermelon", "lemon", "chikoo", "custard apple", "coconut", "jackfruit", "strawberry", "potato", "tomato",
    "onion", "brinjal", "cauliflower", "cabbage", "carrot", "radish", "beans", "cucumber", "pumpkin", "spinach",
    "ladyfinger", "green peas", "bitter gourd", "bottle gourd", "chilies", "roses", "marigolds", "tulips",
    "jasmine", "hibiscus", "orchids", "sunflowers", "carnations", "chrysanthemums"
]

food_crops = [
    "rice", "wheat", "maize", "barley", "jowar", "bajra", "ragi", "foxtail millet", "kodo millet", "chana", "arhar",
    "tur", "urad", "moong", "masoor", "rajma", "cowpea", "moth bean", "horse gram", "groundnut", "mustard",
    "soybean", "sunflower", "sesame", "castor", "linseed", "safflower", "niger seed", "coconut", "potato",
    "sweet potato", "yam", "tapioca"
]

# Define soil type suitability
red_soil_crops = [
    "ragi", "foxtail millet", "kodo millet", "bajra", "jowar",
    "urad", "tur", "horse gram", "groundnut", "castor",
    "sweet potato", "yam", "mango", "pomegranate", "guava",
    "jackfruit", "tomato", "carrot", "radish", "chilies",
    "bottle gourd", "cotton", "tobacco", "coffee", "turmeric",
    "areca nut", "vanilla", "ginger"
]

black_soil_crops = [
    "rice", "wheat", "maize", "barley", "chana", "masoor",
    "rajma", "cowpea", "soybean", "sesame", "sunflower",
    "linseed", "mustard", "potato", "tapioca", "banana",
    "orange", "coconut", "pineapple", "strawberry", "onion",
    "cabbage", "cauliflower", "brinjal", "spinach", "beans",
    "pumpkin", "green peas", "sugarcane", "jute", "tea",
    "rubber", "clove", "black pepper", "cocoa", "betel leaves",
    "oil palm"
]


# Configuration for Sentinel Hub
# Your existing configuration and variables here
config = SHConfig()
config.sh_client_id = 'db0acfc2-e952-484e-8ee3-5eb450a32a56'
config.sh_client_secret = 'EiNkMgCQl3MlUktuOkYpeKwKwKBEV9Sh'

evalscript = """

//VERSION=3
function setup() {
  return {
    input: [{
      bands: [
        "B02",
        "B04",
        "B08",
        "B11",
        "SCL",
        "CLM",
        "dataMask"
      ]
    }],
    output: [
      {
        id: "ndvi",
        bands: ["NDVI"]
      },
      {
        id: "bsi",
        bands: ["BSI"]
      },
      {
        id: "dataMask",
        bands: 1
      }]
  }
}

function evaluatePixel(samples) {
    let ndvi = (samples.B08 - samples.B04)/(samples.B08 + samples.B04)
    let bsi = ((samples.B11 + samples.B04)-(samples.B08 + samples.B02))/((samples.B11 + samples.B04)+(samples.B08 + samples.B02));
     
    var validNDVIMask = 1
    if (samples.B08 + samples.B04 + samples.B11 + samples.B02 == 0 ){
        validNDVIMask = 0
    }

    var noWaterMask = 1
    if (samples.SCL == 6 ){
        noWaterMask = 0
    }

    return {
        ndvi: [ndvi],
        bsi: [bsi],
        // Exclude nodata pixels, pixels where ndvi is not defined and water pixels from statistics:
        dataMask: [samples.dataMask * validNDVIMask * noWaterMask]
    }
}
"""




@app.route('/local', methods=['POST'])
@cross_origin()
def save_form_data():
    try:
        # Get JSON data from the request
        form_data = req.get_json()
        
        # Calculate the local credit score
        credit_score = calculate_local_credit_score(form_data)
    
        with open(OUTPUT_FILE, 'r') as file:
            output_data = json.load(file)
        
        # Extract the analysisReport and bsi_analysis from output_data
        analysis_report = output_data.get("analysisReport", [])
        bsi_analysis = output_data.get("processedData", {}).get("bsi_analysis", [])
        
        # Fetch the cycle detection status from the first entry of analysisReport
        if analysis_report[0] == "true":
            cycle = 1
        else:
            cycle = 0
        
        # Fetch the mean_ndvi and other details from analysisReport
        mean_ndvi = int(analysis_report[1].get("mean_ndvi", 0))

        # Calculate the average BSI score from the bsi_analysis list
        bsi_values = [entry.get("mean_bsi", 0) for entry in bsi_analysis]
        average_bsi = sum(bsi_values) / len(bsi_values) if bsi_values else 0
        print("Average BSI:", average_bsi)
        
        # Calculate green_index based on mean_ndvi
        mean_ndvi = 0
        if mean_ndvi > 0.7:
            green_index = 2
        elif mean_ndvi >= 0.5:
            green_index = 1.5
        elif mean_ndvi >= 0.3:
            green_index = 1
        else:
            green_index = 0.5

        # Calculate land_type based on bsi_score
        land_type = 0
        if average_bsi > -0.343:
            land_type = 0.25
        elif -0.387 < average_bsi <= -0.365:
            land_type = 0.5
        elif average_bsi <= -0.387:
            land_type = 1


        form_data['local_credit_score'] = credit_score + green_index + land_type + cycle
        print("Local Credit Score:", credit_score)
        print("Green Index:", green_index)
        print("Land Type:", land_type)
        print("Cycle:", cycle)
        # Add a timestamp to the form data
        form_data['timestamp'] = datetime.now().isoformat()

    
        # Check if the file exists
        DATA_FILE = r"C:/Users/Apoorva/Documents/VIT/Major Project/Bhoomi/Bhoomi-main/client/public/form_data.json"
        if os.path.exists(DATA_FILE):
            # If the file exists, append the new data
            with open(DATA_FILE, 'r') as file:
                existing_data = json.load(file)
        else:
            # If the file does not exist, initialize an empty list
            existing_data = []
        
        # Append the new form data
        existing_data.append(form_data)

        # Save the updated data back to the file
        with open(DATA_FILE, 'w') as file:
            json.dump(existing_data, file, indent=4)

        return jsonify({"message": "Form data saved successfully!", "local_credit_score": credit_score}), 200

    except Exception as e:
        print("Error saving form data:", e)
        return jsonify({"message": credit_score, "error": str(e)}), 500


def calculate_local_credit_score(form_data):
    """
    Function to calculate local credit score based on form data.
    """
    
     # Map ownershipType, landuse, soilType, and other categorical values to scores
    land = form_data.get("landUse").lower()  # Normalize case
    landuse_score = 0
    if land == "agricultural":
        landuse_score = 1
    elif land == "non-agricultural":
        landuse_score = 0.5
    else:
        landuse_score = 0

    irrigattion = form_data.get("irrigation")
    if irrigattion == "yes":
        irrigation_scores = 1
    else:
        irrigation_scores = 0


    # Determine crop rating
    crop = form_data.get("cropTypes").lower() # Normalize case
    crop_types_score = 0
    if crop in cash_crops:
        crop_types_score = 2  # Cash crop
    elif crop in horticulture_crops:
        crop_types_score = 1  # Horticulture crop
    elif crop in food_crops:
        crop_types_score = 0.5  # Food crop
    else:
        crop_types_score = 0.25 # Other crops

    # Calculate individual scores
    ownership = form_data.get("ownershipType")# Simplify for demonstration
    if ownership == "owned":
        ownership_score = 1.0
    elif ownership == "leased":
        ownership_score = 0.5
    else:
        ownership_score = 0.3
    
     # Avoid division by zero
    if int(form_data.get("landArea")) <= 0:
        return 0

    # Calculate Yield Per Unit Area (YPUA)
    ypua = int(form_data.get("averageYield")) / int(form_data.get("landArea"))

    # Define thresholds (these can be tuned based on real-world data)
    threshold_high = 3.0  # High yield (e.g., 3 tons per hectare)
    threshold_low = 1.0   # Low yield (e.g., 1 ton per hectare)

    # Assign score based on yield per unit area
    if ypua >= threshold_high:
        average_yield_score = 1.0  # High yield
    elif ypua >= threshold_low:
        average_yield_score = 0.5  # Moderate yield
    else:
        average_yield_score = 0.

    crop_type = form_data.get("cropTypes")
    soil_type = form_data.get("soilType")
    
    # Calculate soil type score
    soil_type_score = calculate_soil_type_score(crop_type, soil_type)

    # Example for brevity
    total_score = ownership_score + crop_types_score + average_yield_score + soil_type_score + irrigation_scores + landuse_score
    print("Ownership Score:", ownership_score)
    print("Crop Types Score:", crop_types_score)
    print("Average Yield Score:", average_yield_score)
    print("Soil Type Score:", soil_type_score)
    print("Irrigation Score:", irrigation_scores)
    print("Land Use Score:", landuse_score)

    return round(total_score, 2)


# Function to calculate aoil score based on form data
def calculate_soil_type_score(crop_type, soil_type):
    """
    Calculate soil type score based on the crop type and soil type.
    """
    # Normalize inputs to handle case sensitivity
    crop_type = crop_type.lower()
    soil_type = soil_type.lower()

    # Check soil type and crop suitability
    if soil_type == "red" and crop_type in red_soil_crops:
        return 1  # Suitable
    elif soil_type == "black" and crop_type in black_soil_crops:
        return 1  # Suitable
    else:
        return 0.25  # Not suitable


#Global Credit Form Data
@app.route('/global', methods=['POST'])
@cross_origin()
def save_global_data():
    try:
        # Get JSON data from the request
        global_data = req.get_json()
        global_data['global_credit_score'] = calculate_global_credit_score(global_data)
        # Add a timestamp to the global data
        global_data['timestamp'] = datetime.now().isoformat()

        # Check if the file exists
        DATA_FILE = r"C:/Users/Apoorva/Documents/VIT/Major Project/Bhoomi/Bhoomi-main/client/public/global_data.json"
        if os.path.exists(DATA_FILE):
            # If the file exists, append the new data
            with open(DATA_FILE, 'r') as file:
                existing_data = json.load(file)
        else:
            # If the file does not exist, initialize an empty list
            existing_data = []

        # Append the new global data
        existing_data.append(global_data)

        # Save the updated data back to the file
        with open(DATA_FILE, 'w') as file:
            json.dump(existing_data, file, indent=4)

        return jsonify({"message": "Global data saved successfully!"}), 200

    except Exception as e:
        print("Error saving global data:", e)
        return jsonify({"message": "Failed to save global data", "error": str(e)}), 500

def calculate_global_credit_score(data):
    """
    Calculate global credit score based on provided parameters, including bank savings, crop insurance, and health insurance.
    The score is bounded between 0 and 10.
    :param data: Dictionary containing the input parameters.
    :return: Global credit score.
    """

    print("Calculating global credit score...")
    
    num_vehicles = int(data.get("numVehicles", 0))
    num_wells = int(data.get("numWells", 0))
    num_borewells = int(data.get("numBorewells", 0))
    canal_water = data.get("canalWater", "no").lower()
    annual_income = int(data.get("annualIncome", 0))
    other_income = int(data.get("otherIncome", 0))
    outstanding_loan_amount = int(data.get("outstandingLoanAmount", 0))
    bank_savings = float(data.get("bankSavings", 0))  # Convert to float if input is string
    crop_insurance = data.get("cropInsurance", "no").lower()  # Boolean based on "yes" or "no"
    health_insurance = data.get("healthInsurance", "no").lower()  # Boolean: True/False

    # Scoring logic
    vehicle_score = 0 if num_vehicles == 0 else min(num_vehicles * 0.45, 1.25)
    well_score = min(num_wells * 0.45, 1.25)
    borewell_score = min(num_borewells * 0.25, 1)
    canal_water_score = 1 if canal_water == "yes" else 0
    income_score = min((annual_income + other_income) / 100000, 2)  # Capped at 5
    loan_score = 1 if outstanding_loan_amount == 0 else 0
    savings_score = min(bank_savings / 100000, 0.75)  # Capped at 2
    crop_insurance_score = 1 if crop_insurance else 0
    health_insurance_score = 0.75 if health_insurance == "yes" else 0

    # Combine scores with weights
    global_credit_score = vehicle_score + well_score + borewell_score + canal_water_score + income_score + loan_score + savings_score + crop_insurance_score + health_insurance_score

    # Ensure the score is between 0 and 10
    global_credit_score = round(global_credit_score, 2)

    print("Vehicle Score:", vehicle_score)
    print("Well Score:", well_score)
    print("Borewell Score:", borewell_score)
    print("Canal Water Score:", canal_water_score)
    print("Income Score:", income_score)
    print("Loan Score:", loan_score)
    print("Savings Score:", savings_score)
    print("Crop Insurance Score:", crop_insurance_score)
    print("Health Insurance Score:", health_insurance_score)
    print("Global Credit Score:", global_credit_score)

    return global_credit_score


# Loan Application
@app.route('/submit-loan', methods=['POST'])
@cross_origin()
def submit_loan_application():
    try:
        # Get the form data from the request
        form_data = req.get_json()
        aadhar_number = form_data.get('aadharNumber')

        # Validate Aadhar number is provided
        if not aadhar_number:
            return jsonify({"message": "Aadhar number is required."}), 400

        # Load data from both files
        if os.path.exists(GLOBAL_DATA_FILE):
            with open(GLOBAL_DATA_FILE, 'r') as file:
                global_data = json.load(file)
        else:
            global_data = []

        if os.path.exists(FORM_DATA_FILE):
            with open(FORM_DATA_FILE, 'r') as file:
                form_data_list = json.load(file)
        else:
            form_data_list = []

        # Search for matching Aadhar number in both files
        global_entry = next((entry for entry in global_data if entry.get('aadharNumber') == aadhar_number), None)
        form_entry = next((entry for entry in form_data_list if entry.get('aadharNumber') == aadhar_number), None)

        if not global_entry and not form_entry:
            return jsonify({"message": "Aadhar number not found in both files."}), 404
        elif not global_entry:
            return jsonify({"message": "Aadhar number not found in global_data.json."}), 404
        elif not form_entry:
            return jsonify({"message": "Aadhar number not found in form_data.json."}), 404

        # Extract specific fields from form_data
        bank_name = form_data.get('bankName')
        loan_amount = form_data.get('loanAmount')
        repayment_months = form_data.get('repaymentMonths')

        # Determine sanction_loan based on global_credit_score
        global_credit_score = global_entry.get('global_credit_score', 0)
        if global_credit_score < 3:
            sanction_loan = 30
        elif 3 <= global_credit_score < 6:
            sanction_loan = 70
        elif 6 <= global_credit_score < 8:
            sanction_loan = 90
        else:
            sanction_loan = 100

        # Determine warning based on local_credit_score
        local_credit_score = form_entry.get('local_credit_score', 0)
        if local_credit_score < 3:
            warning = "High Risk"
        elif 3 <= local_credit_score < 6:
            warning = "Moderate Risk"
        else:
            warning = "Safe"

        # Merge data from both entries and include selected form_data fields
        merged_data = {
            **global_entry,
            **form_entry,
            "bankName": bank_name,            # Add bankName from form_data
            "loanAmount": loan_amount,        # Add loanAmount from form_data
            "repaymentMonths": repayment_months,  # Add repaymentMonths from form_data
            "loanStatus": "Pending",          # Add loan_status field
            "sanction_loan": sanction_loan,   # Add sanction_loan field
            "warning": warning                # Add warning field
        }
        
        LOAN_APPLICATION_FILE=r"C:/Users/Apoorva/Documents/VIT/Major Project/Bhoomi/Bhoomi-main/client/public/loan_data.json";
        # Save the merged data to the loan_application.json file
        if os.path.exists(LOAN_APPLICATION_FILE):
            with open(LOAN_APPLICATION_FILE, 'r') as file:
                loan_data = json.load(file)
        else:
            loan_data = []

        # Append the merged entry
        loan_data.append(merged_data)

        with open(LOAN_APPLICATION_FILE, 'w') as file:
            json.dump(loan_data, file, indent=4)

        return jsonify({"message": "Loan application submitted successfully.", "data": merged_data}), 200

    except Exception as e:
        print("Error processing loan application:", e)
        return jsonify({"message": "An error occurred.", "error": str(e)}), 500


# Get Loan Applications
@app.route('/admin/loan-applications', methods=['GET'])
def get_latest_loan_applications():
    try:
        # Check if the loan application file exists

        if os.path.exists(LOAN_APPLICATION_FILE):
            with open(LOAN_APPLICATION_FILE, 'r') as file:
                loan_data = json.load(file)
        else:
            loan_data = []

        # Sort the entries by timestamp in descending order and get the latest 10 entries
        latest_entries = sorted(loan_data, key=lambda x: x.get('timestamp', 0), reverse=True)[:10]
        print("Latest loan applications:", latest_entries)
        return jsonify({"message": "Latest loan applications retrieved successfully.", "data": latest_entries}), 200

    except Exception as e:
        print("Error retrieving loan applications:", e)
        return jsonify({"message": "An error occurred.", "error": str(e)}), 500
    


@app.route('/admin/approve-loan', methods=['POST'])
def update_approve_status():
    try:
        data = request.get_json()
        aadhar_number = data.get('aadharNumber')
        status = data.get('status')
        review_message = data.get('reviewMessage', "")
        sanctioned_amount = data.get('sanctionedAmount', None)

        if not aadhar_number or not status:
            return jsonify({"message": "Aadhar number and status are required."}), 400

        if os.path.exists(LOAN_APPLICATION_FILE):
            with open(LOAN_APPLICATION_FILE, 'r') as file:
                loan_data = json.load(file)
        else:
            return jsonify({"message": "Loan application file not found."}), 404

        # Update the loan application
        for application in loan_data:
            if application.get('aadharNumber') == aadhar_number:
                application['loanStatus'] = status
                if status == "Approved" and sanctioned_amount is not None:
                    application['sanctionedAmount'] = sanctioned_amount
                break
        else:
            return jsonify({"message": "Loan application not found."}), 404

        # Write back the updated data to the file
        with open(LOAN_APPLICATION_FILE, 'w') as file:
            json.dump(loan_data, file, indent=4)

        return jsonify({"message": f"Loan status updated to {status} successfully."}), 200

    except Exception as e:
        print("Error updating loan status:", e)
        return jsonify({"message": "An error occurred.", "error": str(e)}), 500
   

@app.route('/admin/update-loan-status', methods=['POST'])
def update_loan_status():
    try:
        data = request.get_json()
        aadhar_number = data.get('aadharNumber')
        status = data.get('status')
        review_message = data.get('reviewMessage', "")

        if not aadhar_number or not status:
            return jsonify({"message": "Aadhar number and status are required."}), 400

        if os.path.exists(LOAN_APPLICATION_FILE):
            with open(LOAN_APPLICATION_FILE, 'r') as file:
                loan_data = json.load(file)
        else:
            return jsonify({"message": "Loan application file not found."}), 404

        for application in loan_data:
            if application.get('aadharNumber') == aadhar_number:
                application['loanStatus'] = status
                if status == "Reverted":
                    application['reviewMessage'] = review_message
                break
        else:
            return jsonify({"message": "Loan application not found."}), 404

        with open(LOAN_APPLICATION_FILE, 'w') as file:
            json.dump(loan_data, file, indent=4)

        return jsonify({"message": f"Loan status updated to {status} successfully."}), 200

    except Exception as e:
        print("Error updating loan status:", e)
        return jsonify({"message": "An error occurred.", "error": str(e)}), 500
    
@app.route('/admin/search-application/<aadhar_number>', methods=['GET'])
def search_application(aadhar_number):
    try:
        # Check if the loan application file exists
        if not os.path.exists(LOAN_APPLICATION_FILE):
            return jsonify({"message": "Loan application file not found."}), 404

        # Load loan application data
        with open(LOAN_APPLICATION_FILE, 'r') as file:
            loan_data = json.load(file)

        # Filter loan applications for the given Aadhar number
        matching_applications = [
            application for application in loan_data
            if application.get('aadharNumber') == aadhar_number
        ]

        if not matching_applications:
            return jsonify({"message": "No loan applications found for this Aadhar number."}), 404

        # Return matching applications
        return jsonify({"message": "Loan applications retrieved successfully.", "data": matching_applications}), 200

    except Exception as e:
        print(f"Error while fetching applications for Aadhar {aadhar_number}: {e}")
        return jsonify({"message": "An error occurred while fetching loan applications.", "error": str(e)}), 500
    
@app.route('/admin/view-application/<aadhar_number>', methods=['GET'])
@cross_origin()
def view_application(aadhar_number):
    try:
        if os.path.exists(LOAN_APPLICATION_FILE):
            with open(LOAN_APPLICATION_FILE, 'r') as file:
                loan_data = json.load(file)
        else:
            return jsonify({"message": "Loan application file not found."}), 404

        application = next((entry for entry in loan_data if entry.get('aadharNumber') == aadhar_number), None)
        if application:
            return jsonify({"data": application}), 200
        else:
            return jsonify({"message": "Application not found."}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500






# Function to generate NDVI graph
def generate_ndvi_graph(response_data):
    """Generate NDVI graph from response data and save it as PNG"""
    date = []
    Mean = []
    Min = []
    Max = []

    # Extract data from response
    intervals = response_data[0]['data']
    
    for data_item in intervals:
        ndvi_stats = data_item['outputs']['ndvi']['bands']['NDVI']['stats']
        date.append(data_item['interval']['to'][:10])  # Get date and trim to YYYY-MM-DD
        Mean.append(ndvi_stats['mean'])
        Max.append(ndvi_stats['max'])
        Min.append(ndvi_stats['min'])

    # Create DataFrame
    elements = {
        'Date': date,
        'Mean': Mean,
        'Max': Max,
        'Min': Min
    }
    table = pd.DataFrame(elements)

    # Create the plot
    matplotlib.rcParams.update({'font.size': 16})
    fig, ax = plt.subplots()
    fig.set_size_inches(20, 8)
    ax.ticklabel_format(style='plain')

    # Plot lines
    line1 = table.plot(color='#4d6600', alpha=0.3, kind='line', x='Date', y='Max', 
                      ax=ax, label='Maximum NDVI', linewidth=6)
    line2 = table.plot(color='#739900', kind='line', x='Date', y='Mean', 
                      ax=ax, label='Mean NDVI', linewidth=6, marker='o', markersize=15)
    line3 = table.plot(color='#99cc00', alpha=0.3, kind='line', x='Date', y='Min', 
                      ax=ax, label='Minimum NDVI', linewidth=6)

    # Fill between max and min
    plt.fill_between(table['Date'], table['Max'], table['Min'], color='#99cc00', alpha=0.1)

    # Customize plot
    plt.xlabel('Date')
    plt.ylabel('NDVI value')
    plt.title('NDVI')
    plt.legend(loc='best', bbox_to_anchor=(0.5, 0.2, 0.45, 0.2), shadow=True, prop={'size': 18})

    # Create static directory if it doesn't exist
    os.makedirs('static', exist_ok=True)
    
    # Generate unique filename using timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'ndvi_plot.png'
    plot_path = os.path.join('static', secure_filename(filename))
    
    # Save the plot
    plt.savefig(plot_path)
    plt.close()  # Close the figure to free memory
    return plot_path



def save_report_to_file(report_data):
    """
    Save the processed report data to a file named 'output'.
    If the file exists, it will be overwritten.
    """
    try:
        # Define the output file path
        file_path = r"C:/Users/Apoorva/Documents/VIT/Major Project/Bhoomi/Bhoomi-main/client/public/output.json"
        
        # Serialize the report data to a JSON string for better readability
        report_json = json.dumps(report_data, indent=4)
        
        # Write the data to the file
        with open(file_path, "w") as file:
            file.write(report_json)
        
        print(f"Report successfully written to {file_path}")
    except Exception as e:
        print(f"Error saving report to file: {e}")



@app.route('/getveg', methods=['POST'])
@cross_origin()

def get_veg():
    try:
        # Extract data from the request
        print(req.get_json())
        coordinates = req.json.get('coordinates')
        fromDate = req.json.get('fromDate')
        toDate = req.json.get('toDate')
        print("Coordinates: ", coordinates, "time:", fromDate, toDate)
        timeInterval = (fromDate, toDate)

        # Convert coordinates to a Polygon geometry
        if coordinates:
            if coordinates[0] != coordinates[-1]:
                coordinates.append(coordinates[0])
            polygon_coordinates = coordinates
            print("Polygon coordinates: ", polygon_coordinates)
            geometry = Geometry(geometry={'type': 'Polygon', 'coordinates': [polygon_coordinates]}, crs=CRS.WGS84)
        else:
            geometry = None

        # Initialize the SentinelHub request
        request = SentinelHubStatistical(
            aggregation=SentinelHubStatistical.aggregation(
                evalscript=evalscript,
                time_interval=timeInterval,
                aggregation_interval='P1M',
                size=[537.101, 589.55],
            ),
            input_data=[
                SentinelHubStatistical.input_data(DataCollection.SENTINEL2_L2A),
            ],
            geometry=geometry,
            config=config
        )

        # Fetch the data
        response = request.get_data()
        
        # Generate the graph
        plot_path = generate_ndvi_graph(response)
        
        # Process the response
        processed_response = process_response(response)
        
        # Add the graph URL to the response
        processed_response['graph_url'] = f'/{plot_path}'
        save_report_to_file(processed_response)
        return jsonify(processed_response), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# Add a new route to serve static files
@app.route('/static/<path:filename>')
def serve_static(filename):
    try:
        return send_file(
            os.path.join('static', secure_filename(filename)),
            mimetype='image/png'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/intermed')
def intermed():
    return render_template('intermed.html')

# Function to classify NDVI score
def classify_ndvi_score(ndvi_mean):
    if ndvi_mean > 0.7:
        return "very good vegetation"
    elif ndvi_mean >= 0.5:
        return "good vegetation"
    elif ndvi_mean >= 0.3:
        return "medium vegetation"
    else:
        return "low to average vegetation"

# Function to classify BSI score
def classify_bsi_score(bsi_mean):
    if bsi_mean > 0:
        return "bare soil"
    else:
        return "vegetated soil"
# a function that will give me vegetation index of the land latest, 
# Function to detect recent vegetation cycles
def detect_recent_vegetation_cycle(ndvi_analysis, max_allowed_other_vegetations=5):
    recent_cycle = []
    other_vegetation_count = 0

    for entry in ndvi_analysis:
        if entry['ndvi_score'] == 'low to average vegetation':
            if recent_cycle and other_vegetation_count <= max_allowed_other_vegetations:
                recent_cycle.append(entry)
                other_vegetation_count = 0  # Reset the count after finding the cycle end
            else:
                recent_cycle = [entry]
                other_vegetation_count = 0
        else:
            if recent_cycle:
                other_vegetation_count += 1
                if other_vegetation_count > max_allowed_other_vegetations:
                    recent_cycle = []  # Reset the cycle if max allowed other vegetations exceeded
            else:
                other_vegetation_count = 0
    return bool(recent_cycle)

def process_response(response):
    
  # Initialize lists to store analysis results
  ndvi_analysis = []
  bsi_analysis = []

  # Extract NDVI and BSI data and perform analysis
#   print(response)
#   print(response[0]['data'],type(response[0]['data']))
  intervals = response[0]['data']
  previous_ndvi_mean = None
  previous_bsi_mean = None

  for interval in intervals:
      ndvi_stats = interval['outputs']['ndvi']['bands']['NDVI']['stats']
      bsi_stats = interval['outputs']['bsi']['bands']['BSI']['stats']

      ndvi_mean = ndvi_stats['mean']
      bsi_mean = bsi_stats['mean']

      # NDVI analysis
      ndvi_score = classify_ndvi_score(ndvi_mean)
      if previous_ndvi_mean is not None:
          ndvi_trend = "Increased" if ndvi_mean > previous_ndvi_mean else "Decreased"
      else:
          ndvi_trend = "N/A"
      ndvi_analysis.append({
          "interval": interval['interval']['from'],
          "mean_ndvi": ndvi_mean,
          "ndvi_score": ndvi_score,
          "ndvi_trend": ndvi_trend
      })
      print(ndvi_analysis)
      print(type(ndvi_analysis))

      # BSI analysis
      bsi_score = classify_bsi_score(bsi_mean)
      if previous_bsi_mean is not None:
          bsi_trend = "Increased" if bsi_mean > previous_bsi_mean else "Decreased"
      else:
          bsi_trend = "N/A"
      bsi_analysis.append({
          "interval": interval['interval']['from'],
          "mean_bsi": bsi_mean,
          "bsi_score": bsi_score,
          "bsi_trend": bsi_trend
      })

      previous_ndvi_mean = ndvi_mean
      previous_bsi_mean = bsi_mean


  # Storing analysis in the Csv files 
  ndvi_df = pd.DataFrame(ndvi_analysis)
  bsi_df = pd.DataFrame(bsi_analysis)

  ndvi_csv_path = "ndvi_analysis.csv"
  bsi_csv_path = "bsi_analysis.csv"

  ndvi_df.to_csv(ndvi_csv_path, index=False)
  bsi_df.to_csv(bsi_csv_path, index=False)
  # Store the analysis results in a dictionary
  output_dict = {
      "ndvi_analysis": ndvi_analysis,
      "bsi_analysis": bsi_analysis
  }
  recent_veg  = detect_recent_vegetation_cycle(ndvi_analysis,4)
#   latest
  analysis_report = [recent_veg, ndvi_analysis[-1]]
    # Example processing - adjust according to your needs
  return {"vegetationData": response, "processedData": output_dict,  "analysisReport": analysis_report}  # Simplified example

@app.route('/get_712', methods=['POST'])
@cross_origin()
def get_712():
    # Extract data from the request
    data = req.get_json()

    # Extract details from the request data
    coordinates = data.get('coordinates')
    survey_number = data.get('survey_number')
    owner_details = data.get('owner_details')

    # Print the extracted data for debugging purposes
    print("Coordinates:", coordinates)
    print("Survey Number:", survey_number)
    print("Owner Details:", owner_details)

    # Prepare the response
    response = {
        'coordinates': coordinates,
        'survey_number': survey_number, 
        'owner_details': owner_details,
        'area_of_land': 2.45,
        'type_of_cultivation': 'bagayat',
        'water_source': 'well',
        'tax_information': 'bharla',
        'block_number': 'B-145'
    }

    # Check for missing fields and handle appropriately
    missing_fields = [key for key, value in response.items() if value is None]
    if missing_fields:
        return jsonify({
            'status': 'failure',
            'message': f'Missing or invalid fields: {", ".join(missing_fields)}',
            'data': response
        }), 400

    return jsonify({
        'status': 'success',
        'data': response
    })

# Assuming your image is in the static folder
ndvi_image_path = r"C:/Users/Apoorva/Documents/VIT/Major Project/Bhoomi/Bhoomi-main/server/vegetation/static/ndvi_plot.png"

@app.route('/ndvi-image')
def get_ndvi_image():
    try:
        if not os.path.exists(ndvi_image_path):
            print(f"Image not found at path: {ndvi_image_path}")  # Debug print
            return jsonify({'error': 'Image not found'}), 404
            
        print(f"Sending file from path: {ndvi_image_path}")  # Debug print
        return send_file(ndvi_image_path, mimetype='image/png')
    except Exception as e:
        print(f"Error fetching image: {e}")  # Log the error for debugging
        return jsonify({'error': str(e)}), 500




@app.route('/output.')
def serve_output_json():
    try:
        return send_file("output.json", mimetype="application/json")
    except Exception as e:
        return jsonify({"error": str(e)}), 404
    
@app.route('/analysis-report', methods=['GET'])
def get_analysis_report():
    try:
        # Your existing logic
        with open("output.json", "r") as file:
            data = json.load(file)
        analysis_report = data.get("analysisReport", {})
        return jsonify({"analysisReport": analysis_report}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(port=5000, debug=True)