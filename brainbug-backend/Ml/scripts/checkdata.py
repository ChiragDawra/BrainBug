import pandas as pd

# Load Excel file
df = pd.read_excel('data/raw/PyResBugs/PyresBugs.xlsx')

# Show structure
print(f"Total rows: {len(df)}")
print(f"\nColumns: {df.columns.tolist()}")
print(f"\nFirst 3 rows:")
print(df.head(3))
