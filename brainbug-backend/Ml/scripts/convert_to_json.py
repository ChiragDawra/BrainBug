import pandas as pd
import json
import os
from sklearn.model_selection import train_test_split

def convert_excel_to_json_advanced():
    """Convert your bug dataset to JSON for error analysis and fixing"""
    
    print("📊 Converting Bug Dataset to JSON format...")
    
    # Step 1: Load Excel file
    excel_file = "D:\\BrainBug\\brainbug-backend\\Ml\\data\\raw\\PyresBugs.xlsx"
    df = pd.read_excel(excel_file)
    
    print(f"✅ Loaded Excel file with {len(df)} rows")
    
    # Step 2: Create enhanced dataset for bug detection and fixing
    dataset = []
    
    for index, row in df.iterrows():
        # Map fault acronyms to human-readable error types
        fault_mapping = {
            'WPFV': 'Wrong Parameter/Variable Used',
            'WLEC': 'Wrong Logical Expression',
            'MPFC': 'Missing Parameter in Function Call',
            'MLEC': 'Missing Logical Expression Condition',
            'MVAV': 'Missing Variable Assignment',
            'MVIV': 'Missing Variable Initialization',
            'MFC': 'Missing Function Call',
            'WFC': 'Wrong Function Called',
            'WFI': 'Wrong Function Implementation',
            'WAV': 'Wrong Assigned Value'
        }
        
        error_type = fault_mapping.get(str(row['Fault_Acronym']), str(row['Fault_Acronym']))
        
        # Create fix suggestion based on the fault type
        fix_suggestions = {
            'WPFV': 'Use the correct variable/parameter in the function call',
            'WLEC': 'Fix the logical expression condition',
            'MPFC': 'Add the missing parameter to the function call',
            'MLEC': 'Add the missing condition to the logical expression',
            'MVAV': 'Add the missing variable assignment',
            'MVIV': 'Initialize the variable before use',
            'MFC': 'Add the missing function call',
            'WFC': 'Call the correct function',
            'WFI': 'Implement the function correctly',
            'WAV': 'Assign the correct value to the variable'
        }
        
        fix_suggestion = fix_suggestions.get(str(row['Fault_Acronym']), 'Fix the code implementation')
        
        example = {
            # Input: Faulty code that needs to be analyzed
            "faulty_code": str(row['Faulty Code']),
            
            # Target: Comprehensive error analysis and fix
            "fixed_code": str(row['Fault Free Code']),
            "error_type": error_type,
            "error_description": str(row['Implementation-Level Description']),
            "fault_acronym": str(row['Fault_Acronym']),
            "bug_description": str(row['Bug_Description']),
            "fix_suggestion": fix_suggestion,
            
            # Model training targets (choose one format):
            
            # FORMAT 1: Simple error detection
            # "target_simple": f"Error: {error_type} | Fix: {fix_suggestion}",
            
            # # FORMAT 2: Detailed analysis
            "target_detailed": f"Error: {error_type} | Description: {row['Implementation-Level Description']} | Fix: {fix_suggestion}",
            
            # # FORMAT 3: Code generation (fixed code)
            # "target_code": str(row['Fault Free Code']),
            
            # Additional context
            "project": str(row['Project']),
            "diff_patch": str(row['Diff_patch'])[:500]  # Truncate long diffs
        }
        dataset.append(example)
    
    print(f"🔄 Processed {len(dataset)} bug examples")
    
    # Step 3: Split data (80/10/10)
    train_data, temp_data = train_test_split(
        dataset, test_size=0.2, random_state=42
    )
    val_data, test_data = train_test_split(
        temp_data, test_size=0.5, random_state=42
    )
    
    # Step 4: Create directories
    os.makedirs("data/processed", exist_ok=True)
    
    # Step 5: Save datasets
    with open("data/processed/train.json", "w") as f:
        json.dump(train_data, f, indent=2)
    
    with open("data/processed/val.json", "w") as f:
        json.dump(val_data, f, indent=2)
    
    with open("data/processed/test.json", "w") as f:
        json.dump(test_data, f, indent=2)
    
    print("✅ Advanced conversion completed!")
    
    # Show statistics
    print(f"\n📊 Dataset Statistics:")
    print(f"   Training examples: {len(train_data)}")
    print(f"   Validation examples: {len(val_data)}")
    print(f"   Test examples: {len(test_data)}")
    
    # Show fault type distribution
    fault_types = [item['fault_acronym'] for item in dataset]
    from collections import Counter
    fault_dist = Counter(fault_types)
    
    print(f"\n🔧 Fault Type Distribution:")
    for fault_type, count in fault_dist.most_common():
        print(f"   {fault_type}: {count} examples")
    
    # Show sample
    print(f"\n📄 Sample converted example:")
    sample = dataset[0]
    print(f"   Faulty Code: {sample['faulty_code'][:100]}...")
    print(f"   Error Type: {sample['error_type']}")
    print(f"   Target: {sample['target_detailed']}")

if __name__ == "__main__":
    convert_excel_to_json_advanced()