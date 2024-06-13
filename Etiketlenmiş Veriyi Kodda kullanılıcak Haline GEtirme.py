import pandas as pd

pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)

# Read the CSV file into a DataFrame
df_kuraklik = pd.read_csv('kuraklik_tahmini_duzeltilmis (1).csv')

# Display the first 5 rows
print(df_kuraklik.head().to_markdown(index=False, numalign="left", stralign="left"))

# Print the column names and their data types
print(df_kuraklik.info())

# Create a dictionary to store the results
kuraklik_sozluk = {}

# Iterate through the rows of the DataFrame
for index, row in df_kuraklik.iterrows():
    city = row['City']
    kuraklik_durumlari = row.drop('City').tolist()  # Extract the drought conditions as a list
    kuraklik_sozluk[city] = kuraklik_durumlari

# Print the dictionary in the requested format
for city, durumlar in kuraklik_sozluk.items():
    print(f'"{city}": {durumlar},')