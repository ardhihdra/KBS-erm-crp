import pandas as pd
import json

ORIGINAL_HEADER = [
    "Date",
    "Supplier",
    "IN Col Lbs",
    "JB  Lbs",
    "SupL Lbs",
    "BF Lbs",
    "SP Lbs",
    "CM  Lbs",
    "Total",
    "OUT Col Lbs",
    "JB  Lbs",
    "SupL Lbs",
    "BF Lbs",
    "SP Lbs",
    "CM  Lbs",
    "Total",
    "NET (Cans) Col Lbs",
    "JB  Lbs",
    "SupL Lbs",
    "BF Lbs",
    "SP Lbs",
    "CM  Lbs",
    "Total",
    "Total Inventory (cans) Col Lbs",
    "JB  Lbs",
    "SupL Lbs",
    "BF Lbs",
    "SP Lbs",
    "CM  Lbs",
    "Total",
    " Inventory Composition (%) Col",
    "JB",
    "SupL",
    "BF",
    "SP",
    "CM",
    "Total      %",
    "Report Inventory Out",
    "Sample And Etc.",
    "Total Bersih Produksi",
    "Export",
    "Description",
]

SHEET_NAME = [
    "Crab - Harbor Seafood",
    "Crab - Empires",
]

SUPPLIER = {
    "harbor_seafood": "64fc9403cecad6a8631d305c",
    "empires": "64fc9403cecad6a8631d305d",
}

# item id based on column on ORIGINAL_HEADER
ITEM = [
    "64fc92efcecad6a8631d304d",
    "64fc92efcecad6a8631d304e",
    "64fdcc57724331747db20f75",
    "64fc92efcecad6a8631d3052",
    "64fdccd0724331747db20f7a",
    "64fc92efcecad6a8631d3056",
]


def read_excel_data():
    file_path = "Inventory Bahan Baku Agustus 2023 (1).xlsx"
    sheet_name = SHEET_NAME[0]
    header_range = "D:AS"
    value_range = "D:AS"
    supplier = SUPPLIER["harbor_seafood"]

    data = {}

    # Read header data
    # Read header data
    header_data = pd.read_excel(
        file_path, sheet_name=sheet_name, header=None, usecols=header_range
    )
    header_data = header_data.iloc[4:7].values.tolist()
    header_data = get_header_title(header_data)
    data["header"] = header_data

    value_data = pd.read_excel(
        file_path, sheet_name=sheet_name, header=None, usecols=value_range
    )
    value_data = value_data.values.tolist()
    data["values"] = value_data

    print(data["values"][-1])
    # Create a dictionary for the selected values
    selected_values = []
    for val in data["values"][26:-2]:
        for itemCol in range(2, 8):
            if not pd.isna(val[itemCol]):
                selected_values.append(
                    {
                        "date": val[0].isoformat(),
                        "name": "IN " + sheet_name,
                        "description": "just some notes",
                        "supplier": {"$oid": supplier},
                        "expenseCategory": {"$oid": "64fc9f11cecad6a8631d307b"},
                        "subTotal": float(val[itemCol]) * 23.43,
                        "total": val[itemCol] if not pd.isna(val[itemCol]) else 0,
                        "removed": False,
                        "item": {"$oid": ITEM[itemCol - 2]},
                    }
                )

    # Write the dictionary to a JSON file
    with open(f"expenses-{sheet_name}.json", "w") as json_file:
        json.dump(selected_values, json_file)


def get_header_title(header_data):
    combined_header = []
    for col in range(len(header_data[0])):
        header = ""
        for row in range(3):
            val = header_data[row][col]
            if type(val) == str:
                header += str(val) + " "
        combined_header.append(header.rstrip())
    return combined_header


read_excel_data()
