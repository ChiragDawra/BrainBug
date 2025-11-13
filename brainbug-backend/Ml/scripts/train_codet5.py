import json
import torch
from transformers import (
    T5ForConditionalGeneration,
    RobertaTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForSeq2Seq
)
from datasets import Dataset
import os

def load_data():
    """Load processed JSON data"""
    print("📊 Loading training data...")
    
    with open('data/processed/train.json', 'r') as f:
        train_data = json.load(f)
    
    with open('data/processed/val.json', 'r') as f:
        val_data = json.load(f)
    
    print(f"✅ Loaded {len(train_data)} training examples")
    print(f"✅ Loaded {len(val_data)} validation examples")
    
    return train_data, val_data

def preprocess_function(examples, tokenizer, max_length=512):
    """Convert examples to model inputs"""
    
    # Create input text (code)
    inputs = [ex['code'] for ex in examples]
    
    # Create labels (bug or no bug)
    labels = [f"bug: {ex['label']}" for ex in examples]
    
    # Tokenize
    model_inputs = tokenizer(
        inputs,
        max_length=max_length,
        truncation=True,
        padding='max_length'
    )
    
    # Tokenize labels
    with tokenizer.as_target_tokenizer():
        label_encodings = tokenizer(
            labels,
            max_length=16,
            truncation=True,
            padding='max_length'
        )
    
    model_inputs['labels'] = label_encodings['input_ids']
    
    return model_inputs

def train_model():
    """Main training function"""
    
    print("🤖 Starting CodeT5 Fine-tuning...")
    
    # Load config
    with open('config/model_config.json', 'r') as f:
        config = json.load(f)
    
    # Load tokenizer and model
    print(f"📥 Loading {config['model_name']}...")
    tokenizer = RobertaTokenizer.from_pretrained(
    config['model_name'],
    use_fast=True,
    trust_remote_code=True
)

    
    model = T5ForConditionalGeneration.from_pretrained(
    config['model_name'],
    trust_remote_code=True,
    use_safetensors=True
)

    # Load data
    train_data, val_data = load_data()
    
    # Preprocess data
    print("🔄 Preprocessing data...")
    train_dataset = preprocess_function(train_data, tokenizer, config['max_length'])
    val_dataset = preprocess_function(val_data, tokenizer, config['max_length'])
    
    # Convert to HuggingFace Dataset
    train_dataset = Dataset.from_dict(train_dataset)
    val_dataset = Dataset.from_dict(val_dataset)
    
    # Data collator
    data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=model)
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=config['output_dir'],
        num_train_epochs=config['num_epochs'],
        per_device_train_batch_size=config['batch_size'],
        per_device_eval_batch_size=config['batch_size'],
        learning_rate=config['learning_rate'],
        warmup_steps=config['warmup_steps'],
        save_steps=config['save_steps'],
        eval_steps=config['eval_steps'],
        logging_dir=config['logging_dir'],
        logging_steps=100,
        eval_strategy="steps",

        save_total_limit=3,
        load_best_model_at_end=True,
        metric_for_best_model="eval_loss",
        greater_is_better=False,
        report_to="tensorboard",
        remove_unused_columns=False,
        push_to_hub=False
    )
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        tokenizer=tokenizer,
        data_collator=data_collator
    )
    
    # Train
    print("🚀 Training started...")
    print(f"   Total steps: {len(train_dataset) * config['num_epochs'] // config['batch_size']}")
    print(f"   Checkpoints: Every {config['save_steps']} steps")
    
    trainer.train()
    
    # Save final model
    print("💾 Saving final model...")
    trainer.save_model(config['output_dir'])
    tokenizer.save_pretrained(config['output_dir'])
    
    print(f"✅ Training complete!")
    print(f"   Model saved to: {config['output_dir']}")
    print(f"   Logs saved to: {config['logging_dir']}")
    
    # Print final metrics
    final_metrics = trainer.evaluate()
    print(f"\n📊 Final Metrics:")
    print(f"   Validation Loss: {final_metrics['eval_loss']:.4f}")

if __name__ == "__main__":
    # Check if GPU available
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"🖥️  Using device: {device}")
    
    if device == "cpu":
        print("⚠️  Warning: Training on CPU will be slow (2-3 hours)")
        print("   For faster training, use GPU/Colab")
    
    train_model()
