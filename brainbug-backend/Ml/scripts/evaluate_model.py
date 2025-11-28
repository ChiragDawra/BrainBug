import json
import torch
from transformers import T5ForConditionalGeneration, RobertaTokenizer
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from tqdm import tqdm

def evaluate_model():
    """Evaluate trained model on test set"""
    
    print("📊 Evaluating Model...")
    
    # Load config
    with open('config/model_config.json', 'r') as f:
        config = json.load(f)
    
    # Load test data
    with open('data/processed/test.json', 'r') as f:
        test_data = json.load(f)
    
    print(f"✅ Loaded {len(test_data)} test examples")
    
    # Load model and tokenizer
    print("📥 Loading trained model...")
    model = T5ForConditionalGeneration.from_pretrained(config['output_dir'])
    tokenizer = RobertaTokenizer.from_pretrained(config['output_dir'])
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model.to(device)
    model.eval()
    
    # Predictions
    predictions = []
    true_labels = []
    
    print("🔍 Running predictions...")
    for example in tqdm(test_data[:100]):  # Test on first 100 for speed
        
        # Tokenize input
        inputs = tokenizer(
            example['code'],
            max_length=512,
            truncation=True,
            return_tensors='pt'
        ).to(device)
        
        # Generate prediction
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_length=16,
                num_beams=1
            )
        
        # Decode prediction
        prediction = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract label (0 or 1)
        pred_label = 1 if "1" in prediction else 0
        
        predictions.append(pred_label)
        true_labels.append(example['label'])
    
    # Calculate metrics
    accuracy = accuracy_score(true_labels, predictions)
    precision, recall, f1, _ = precision_recall_fscore_support(
        true_labels, predictions, average='binary'
    )
    
    print("\n✅ Evaluation Results:")
    print(f"   Accuracy:  {accuracy:.2%}")
    print(f"   Precision: {precision:.2%}")
    print(f"   Recall:    {recall:.2%}")
    print(f"   F1 Score:  {f1:.2%}")
    
    # Save metrics
    metrics = {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1)
    }
    
    with open(f"{config['output_dir']}/evaluation_metrics.json", 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"\n💾 Metrics saved to: {config['output_dir']}/evaluation_metrics.json")

if __name__ == "__main__":
    evaluate_model()
