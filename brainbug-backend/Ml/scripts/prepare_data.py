import pandas as pd
import json
import os
from sklearn.model_selection import train_test_split

def prepare_pyresbugs_dataset():
    """
    Prepare PyResBugs dataset for CodeT5 training
    """
    
    print("📊 Loading PyResBugs dataset...")
    
    # Load Excel file
    df = pd.read_excel('data/raw/PyResBugs/PyresBugs.xlsx')
    
    print(f"✅ Loaded {len(df)} bug examples")
    
    # Clean data - remove rows with missing code
    df = df.dropna(subset=['Faulty Code', 'Fault Free Code'])
    
    print(f"✅ After cleaning: {len(df)} examples")
    
    # Create dataset
    dataset = []
    
    for idx, row in df.iterrows():
        # Buggy code example (label = 1)
        dataset.append({
            "code": str(row['Faulty Code']),
            "label": 1,
            "bug_type": str(row['Bug_Type']) if pd.notna(row['Bug_Type']) else "unknown",
            "bug_description": str(row['Bug_Description']) if pd.notna(row['Bug_Description']) else "",
            "fixed_code": str(row['Fault Free Code'])
        })
        
        # Fixed code example (label = 0)
        dataset.append({
            "code": str(row['Fault Free Code']),
            "label": 0,
            "bug_type": "none",
            "bug_description": "",
            "fixed_code": str(row['Fault Free Code'])
        })
    
    print(f"✅ Created {len(dataset)} examples ({len(df)} buggy + {len(df)} fixed)")
    
    # Split: 70% train, 15% val, 15% test
    train, temp = train_test_split(dataset, test_size=0.3, random_state=42)
    val, test = train_test_split(temp, test_size=0.5, random_state=42)
    
    # Save to processed folder
    output_dir = "data/processed"
    os.makedirs(output_dir, exist_ok=True)
    
    with open(f"{output_dir}/train.json", 'w') as f:
        json.dump(train, f, indent=2)
    
    with open(f"{output_dir}/val.json", 'w') as f:
        json.dump(val, f, indent=2)
    
    with open(f"{output_dir}/test.json", 'w') as f:
        json.dump(test, f, indent=2)
    
    print(f"\n✅ Dataset prepared successfully!")
    print(f"   📁 Train: {len(train)} examples → data/processed/train.json")
    print(f"   📁 Val: {len(val)} examples → data/processed/val.json")
    print(f"   📁 Test: {len(test)} examples → data/processed/test.json")
    
    # Show sample
    print(f"\n📋 Sample training example:")
    sample = train[0]
    print(f"   Bug Type: {sample['bug_type']}")
    print(f"   Has Bug: {sample['label']}")
    print(f"   Code: {sample['code'][:100]}...")

if __name__ == "__main__":
    prepare_pyresbugs_dataset()
