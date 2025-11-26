import json
import os
import torch
from transformers import T5ForConditionalGeneration, RobertaTokenizer
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from tqdm import tqdm


def get_path(relative_path):
    """Get absolute path relative to script location"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up to Ml directory, then navigate to target
    ml_dir = os.path.dirname(script_dir)  # From scripts/ to Ml/
    return os.path.join(ml_dir, relative_path)

def evaluate_model():
    """Evaluate trained model on test set"""
    
    print("📊 Evaluating Model...")
    
    # Load config with proper path
    config_path = get_path('config/model_config.json')
    print(f"📂 Loading config from: {config_path}")
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Load test data with proper path
    test_path = get_path('data/processed/test.json')
    print(f"📂 Loading test data from: {test_path}")
    
    with open(test_path, 'r') as f:
        test_data = json.load(f)
    
    print(f"✅ Loaded {len(test_data)} test examples")
    
    # Load model and tokenizer with proper path
    model_path = get_path(config['output_dir'])
    print(f"📥 Loading trained model from: {model_path}")
    
    model = T5ForConditionalGeneration.from_pretrained(model_path)
    tokenizer = RobertaTokenizer.from_pretrained(model_path)
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"🖥️  Using device: {device}")
    
    model.to(device)
    model.eval()
    
    # Predictions
    predictions = []
    true_labels = []
    
    print("🔍 Running predictions...")
    
    # Evaluate on all test data (or limit if too many)
    eval_limit = min(len(test_data), 500)  # Evaluate up to 500 examples
    print(f"📊 Evaluating on {eval_limit} examples...")
    
    for example in tqdm(test_data[:eval_limit]):
        
        # Create input text with error type context
        input_text = f"Fix {example['error_type']}: {example['faulty_code']}"
        
        # Tokenize input
        inputs = tokenizer(
            input_text,
            max_length=config.get('max_length', 256),
            truncation=True,
            return_tensors='pt'
        ).to(device)
        
        # Generate prediction
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_length=config.get('max_length', 256),
                num_beams=4,  # Beam search for better quality
                early_stopping=True
            )
        
        # Decode prediction
        prediction = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        predictions.append(prediction)
        true_labels.append(example['fixed_code'])
    
    # Calculate exact match accuracy
    exact_matches = sum(1 for pred, true in zip(predictions, true_labels) if pred.strip() == true.strip())
    exact_match_accuracy = exact_matches / len(predictions)
    
    # Calculate token-level accuracy
    total_tokens = 0
    correct_tokens = 0
    
    for pred, true in zip(predictions, true_labels):
        pred_tokens = tokenizer.tokenize(pred)
        true_tokens = tokenizer.tokenize(true)
        
        total_tokens += len(true_tokens)
        
        # Count matching tokens
        for i, token in enumerate(true_tokens):
            if i < len(pred_tokens) and pred_tokens[i] == token:
                correct_tokens += 1
    
    token_accuracy = correct_tokens / total_tokens if total_tokens > 0 else 0
    
    # Calculate BLEU-like similarity
    from difflib import SequenceMatcher
    similarities = [
        SequenceMatcher(None, pred.strip(), true.strip()).ratio()
        for pred, true in zip(predictions, true_labels)
    ]
    avg_similarity = sum(similarities) / len(similarities)
    
    print("\n" + "="*60)
    print("✅ EVALUATION RESULTS")
    print("="*60)
    print(f"📊 Test Examples:        {eval_limit}")
    print(f"🎯 Exact Match Accuracy: {exact_match_accuracy:.2%}")
    print(f"🔤 Token-Level Accuracy: {token_accuracy:.2%}")
    print(f"📏 Average Similarity:   {avg_similarity:.2%}")
    print("="*60)
    
    # Save metrics
    metrics = {
        "test_examples": eval_limit,
        "exact_match_accuracy": float(exact_match_accuracy),
        "token_level_accuracy": float(token_accuracy),
        "average_similarity": float(avg_similarity),
        "sample_predictions": [
            {
                "input": test_data[i]['faulty_code'][:100] + "...",
                "prediction": predictions[i][:100] + "...",
                "expected": true_labels[i][:100] + "...",
                "similarity": similarities[i]
            }
            for i in range(min(5, len(predictions)))
        ]
    }
    
    # Save to output directory
    metrics_path = os.path.join(model_path, 'evaluation_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"\n💾 Metrics saved to: {metrics_path}")
    
    # Show some example predictions
    print("\n" + "="*60)
    print("📝 SAMPLE PREDICTIONS (First 3)")
    print("="*60)
    
    for i in range(min(3, len(predictions))):
        print(f"\n--- Example {i+1} ---")
        print(f"Error Type: {test_data[i]['error_type']}")
        print(f"Input (Faulty):\n{test_data[i]['faulty_code'][:200]}...")
        print(f"\nPrediction:\n{predictions[i][:200]}...")
        print(f"\nExpected (Fixed):\n{true_labels[i][:200]}...")
        print(f"Similarity: {similarities[i]:.2%}")
        print("-" * 60)

if __name__ == "__main__":
    print(f"📍 Current working directory: {os.getcwd()}")
    print(f"📍 Script location: {os.path.abspath(__file__)}\n")
    
    evaluate_model()