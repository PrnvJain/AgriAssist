import asyncio
from db import get_user_data_by_id

# Import other libraries
import json
import pandas as pd

# Load the JSON data
with open(r"C:\Users\korad\OneDrive\Desktop\majorprojectnahihoraha-master\backend\output.json") as file:
    data = json.load(file)

# Extract NDVI and BSI Data
ndvi_data = data["processedData"]["ndvi_analysis"]
bsi_data = data["processedData"]["bsi_analysis"]

# Create DataFrames
ndvi_df = pd.DataFrame(ndvi_data)
bsi_df = pd.DataFrame(bsi_data)

# Display tables
print("NDVI Data:")
print(ndvi_df)

print("\nBSI Data:")
print(bsi_df)

# Save as CSV for further analysis
ndvi_df.to_csv("ndvi_analysis.csv", index=False)
bsi_df.to_csv("bsi_analysis.csv", index=False)

# Use asyncio.run() to call the async function
user_id = 4
user_data = asyncio.run(get_user_data_by_id(user_id))
print(user_data)

{'id': 4, 'user_id': None, 'no_of_wells': 5, 'no_of_vehicles': 3, 'no_of_cattles': 10, 'no_of_borewells': 2, 'gender': 'Male      ', 'total_lands_owned': 4, 'vehicles_owned': 1}

well = 0
if user_data['no_of_wells'] > 1:
    well = 1

vehicle = 0
if user_data['no_of_vehicles'] == 1:
    vehicle = 0.5
elif user_data['no_of_vehicles'] == 2:
    vehicle = 1
elif user_data['no_of_vehicles'] == 3:
    vehicle = 1.5
elif user_data['no_of_vehicles'] > 3:
    vehicle = 2

cattle = 0
if user_data['no_of_cattles'] == 1:
    cattle = 0.3
elif user_data['no_of_cattles'] == 2:
    cattle = 0.5
elif user_data['no_of_cattles'] == 3:
    cattle = 0.7
elif user_data['no_of_cattles'] == 4:
    cattle = 0.9
elif user_data['no_of_cattles'] == 5:
    cattle = 1.2
elif user_data['no_of_cattles'] == 6:
    cattle = 1.5
elif user_data['no_of_cattles'] > 6:
    cattle = 2


# global_credit_score = user_data[]