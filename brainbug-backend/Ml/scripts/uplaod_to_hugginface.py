import json
import os
from huggingface_hub import HfApi, create_repo, upload_folder
from transformers import T5ForConditionalGeneration, RobertaTokenizer


def get_path(relative_path):
    """Get absolute path relative to script location"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    ml_dir = os.path.dirname(script_dir)
    return os.path.join(ml_dir, relative_path)


def create_model_card(model_name, repo_id, metrics=None):
    """Create a README.md model card for Hugging Face"""
    
    model_card = f"""---
language: 
- code

license: mit
tags:
- code-generation
- bug-fixing
- code-repair
- codet5
- debugging
datasets:
- custom
metrics:
- accuracy
- exact-match
library_name: transformers
pipeline_tag: text2text-generation
---

# {model_name}

## Model Description

This is a fine-tuned **CodeT5** model for automatic bug detection and code repair. The model has been trained to identify and fix various types of programming errors in Python code.

## Supported Error Types

- **WVAV**: Wrong Variable Used in Variable Assignment
- **MLAC**: Missing Line After Call
- **WPFV**: Wrong Parameter in Function/Method Call
- And more...

## Model Details

- **Base Model**: `Salesforce/codet5-base`
- **Fine-tuned on**: Custom bug-fix dataset
- **Task**: Code-to-Code generation (bug fixing)
- **Language**: Python
- **Model Size**: 220M parameters

## Usage

```python
from transformers import T5ForConditionalGeneration, RobertaTokenizer

# Load model and tokenizer
model = T5ForConditionalGeneration.from_pretrained("{repo_id}")
tokenizer = RobertaTokenizer.from_pretrained("{repo_id}")

# Example: Fix buggy code
faulty_code = \"\"\"
def check_for_file(self, file_path):
    files = self.connection.glob(file_path)
    return len(files) == 1
\"\"\"

# Prepare input
input_text = f"Fix WVAV: {{faulty_code}}"
inputs = tokenizer(input_text, return_tensors="pt", max_length=256, truncation=True)

# Generate fix
outputs = model.generate(**inputs, max_length=256, num_beams=5)
fixed_code = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(fixed_code)
```

## Training Details

- **Training Epochs**: 10
- **Batch Size**: 1 (with gradient accumulation)
- **Learning Rate**: 3e-5
- **Optimizer**: AdamW
- **Hardware**: NVIDIA RTX 4050 (6GB)

## Performance Metrics
"""

    if metrics:
        model_card += f"""
- **Exact Match Accuracy**: {metrics.get('exact_match_accuracy', 'N/A'):.2%}
- **Token-Level Accuracy**: {metrics.get('token_level_accuracy', 'N/A'):.2%}
- **Average Similarity**: {metrics.get('average_similarity', 'N/A'):.2%}
"""
    
    model_card += """

## Limitations

- Trained primarily on Python code
- Best performance on error types seen during training
- May not handle very long code snippets (>256 tokens)
- Requires error type specification for optimal results

## Citation

```bibtex
@misc{brainbug-codet5,
  author = {Your Name},
  title = {BrainBug: CodeT5 for Automatic Bug Repair},
  year = {2025},
  publisher = {HuggingFace},
  howpublished = {\\url{https://huggingface.co/""" + repo_id + """}}
}
```

## License

MIT License

## Contact

For questions or issues, please open an issue on the model repository.
"""
    
    return model_card


def upload_to_huggingface():
    """Upload trained model to Hugging Face Hub"""
    
    print("🚀 BrainBug Model Upload to Hugging Face")
    print("="*70 + "\n")
    
    # Load config
    config_path = get_path('config/model_config.json')
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    model_path = get_path(config['output_dir'])
    
    # Check if model exists
    if not os.path.exists(model_path):
        print(f"❌ Error: Model not found at {model_path}")
        print("Please train the model first!")
        return
    
    print(f"📂 Model found at: {model_path}\n")
    
    # Get Hugging Face credentials
    print("="*70)
    print("HUGGING FACE SETUP")
    print("="*70)
    print("You need a Hugging Face account and access token.")
    print("Get your token from: https://huggingface.co/settings/tokens\n")
    
    hf_username = input("Enter your Hugging Face username: ").strip()
    
    print("\nEnter your Hugging Face token (input will be hidden):")
    import getpass
    hf_token = getpass.getpass("Token: ").strip()
    
    if not hf_username or not hf_token:
        print("❌ Username and token are required!")
        return
    
    # Get model name
    print("\n" + "="*70)
    default_model_name = "brainbug"
    model_name = input(f"Enter model name (default: {default_model_name}): ").strip()
    
    if not model_name:
        model_name = default_model_name
    
    repo_id = f"{hf_username}/{model_name}"
    
    print(f"\n📦 Repository will be created at: https://huggingface.co/{repo_id}")
    
    confirm = input("\nProceed with upload? (yes/no): ").strip().lower()
    
    if confirm != 'yes':
        print("❌ Upload cancelled.")
        return
    
    try:
        # Initialize Hugging Face API
        api = HfApi()
        
        # Create repository
        print("\n📦 Creating repository on Hugging Face...")
        try:
            create_repo(
                repo_id=repo_id,
                token=hf_token,
                private=False,  # Set to True for private repo
                exist_ok=True
            )
            print(f"✅ Repository created: {repo_id}")
        except Exception as e:
            print(f"⚠️  Repository might already exist: {e}")
        
        # Load metrics if available
        metrics = None
        metrics_path = os.path.join(model_path, 'evaluation_metrics.json')
        if os.path.exists(metrics_path):
            with open(metrics_path, 'r') as f:
                metrics = json.load(f)
            print("✅ Loaded evaluation metrics")
        
        # Create model card
        print("📝 Creating model card (README.md)...")
        model_card_content = create_model_card(model_name, repo_id, metrics)
        readme_path = os.path.join(model_path, 'README.md')
        
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(model_card_content)
        print("✅ Model card created")
        
        # Create .gitattributes for large files
        gitattributes_path = os.path.join(model_path, '.gitattributes')
        with open(gitattributes_path, 'w') as f:
            f.write("*.bin filter=lfs diff=lfs merge=lfs -text\n")
            f.write("*.safetensors filter=lfs diff=lfs merge=lfs -text\n")
            f.write("*.h5 filter=lfs diff=lfs merge=lfs -text\n")
        
        # Upload model
        print(f"\n⬆️  Uploading model to Hugging Face...")
        print("This may take several minutes depending on your internet speed...\n")
        
        api.upload_folder(
            folder_path=model_path,
            repo_id=repo_id,
            token=hf_token,
            commit_message="Upload trained BrainBug CodeT5 model"
        )
        
        print("\n" + "="*70)
        print("✅ MODEL SUCCESSFULLY UPLOADED!")
        print("="*70)
        print(f"🔗 Model URL: https://huggingface.co/{repo_id}")
        print("\nYou can now use your model with:")
        print(f'model = T5ForConditionalGeneration.from_pretrained("{repo_id}")')
        print(f'tokenizer = RobertaTokenizer.from_pretrained("{repo_id}")')
        print("\n🎉 Share your model: https://huggingface.co/" + repo_id)
        print("="*70)
        
    except Exception as e:
        print(f"\n❌ Error during upload: {e}")
        print("\nTroubleshooting:")
        print("1. Check your internet connection")
        print("2. Verify your Hugging Face token is valid")
        print("3. Ensure you have write permissions")
        print("4. Try installing: pip install huggingface_hub --upgrade")


def main():
    print("📍 Current working directory:", os.getcwd())
    print("📍 Script location:", os.path.abspath(__file__), "\n")
    
    upload_to_huggingface()


if __name__ == "__main__":
    main()

#     ======================================================================████████████████████████▍                            | 12/17 [23:26<06:27, 77.57s/it]
# 🔗 Model URL: https://huggingface.co/Sagar123x/brainbug

# You can now use your model with:
# model = T5ForConditionalGeneration.from_pretrained("Sagar123x/brainbug")
# tokenizer = RobertaTokenizer.from_pretrained("Sagar123x/brainbug")

# 🎉 Share your model: https://huggingface.co/Sagar123x/brainbug