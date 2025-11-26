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

def get_path(relative_path):
    """Get absolute path relative to script location"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Go up to Ml directory, then navigate to target
    ml_dir = os.path.dirname(script_dir)  # From scripts/ to Ml/
    return os.path.join(ml_dir, relative_path)

def load_data():
    """Load training and validation data from local files"""
    train_path = get_path('data/processed/train.json')
    val_path = get_path('data/processed/val.json')
    
    print(f"📂 Loading training data from: {train_path}")
    with open(train_path, 'r') as f:
        train_data = json.load(f)
    
    print(f"📂 Loading validation data from: {val_path}")
    with open(val_path, 'r') as f:
        val_data = json.load(f)
    
    return train_data, val_data

def preprocess_function(data, tokenizer, max_length):
    """Preprocess data for training"""
    input_ids = []
    attention_masks = []
    labels = []
    
    for item in data:
        # Create input with error context
        input_text = f"Fix {item['error_type']}: {item['faulty_code']}"
        
        # Tokenize input (faulty code with error type)
        inputs = tokenizer(
            input_text,
            max_length=max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        
        # Tokenize output (fixed code)
        targets = tokenizer(
            item['fixed_code'],
            max_length=max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        
        input_ids.append(inputs['input_ids'].squeeze())
        attention_masks.append(inputs['attention_mask'].squeeze())
        labels.append(targets['input_ids'].squeeze())
    
    return {
        'input_ids': input_ids,
        'attention_mask': attention_masks,
        'labels': labels
    }

def train_model_optimized():
    """Memory-optimized training for RTX 4050 6GB"""
    
    print("🤖 Starting Optimized CodeT5 Fine-tuning...")
    
    # Load optimized config with proper path handling
    config_path = get_path('config/model_config.json')
    print(f"📂 Loading config from: {config_path}")
    
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Load tokenizer and model with memory optimizations
    print(f"📥 Loading {config['model_name']} with optimizations...")
    tokenizer = RobertaTokenizer.from_pretrained(
        config['model_name'],
        use_fast=True,
        trust_remote_code=True
    )
    
    model = T5ForConditionalGeneration.from_pretrained(
        config['model_name'],
        trust_remote_code=True,
        use_safetensors=True,
        use_cache=False  # For gradient checkpointing
    )
    
    # Load data
    train_data, val_data = load_data()
    print(f"✅ Loaded {len(train_data)} training samples and {len(val_data)} validation samples")
    
    # Preprocess data
    print("🔄 Preprocessing data...")
    train_dataset = preprocess_function(train_data, tokenizer, config['max_length'])
    val_dataset = preprocess_function(val_data, tokenizer, config['max_length'])
    
    # Convert to HuggingFace Dataset
    train_dataset = Dataset.from_dict(train_dataset)
    val_dataset = Dataset.from_dict(val_dataset)
    
    # Data collator
    data_collator = DataCollatorForSeq2Seq(tokenizer=tokenizer, model=model)
    
    # Ensure output directories exist
    output_dir = get_path(config['output_dir'])
    logging_dir = get_path(config['logging_dir'])
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(logging_dir, exist_ok=True)
    
    # Memory-optimized training arguments (FP16 disabled due to gradient scaling bug)
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=config['num_epochs'],
        per_device_train_batch_size=config['batch_size'],
        per_device_eval_batch_size=config.get('eval_batch_size', 1),
        gradient_accumulation_steps=config.get('gradient_accumulation_steps', 1),
        learning_rate=config['learning_rate'],
        warmup_steps=config['warmup_steps'],
        save_steps=config['save_steps'],
        eval_steps=config['eval_steps'],
        logging_dir=logging_dir,
        logging_steps=100,
        eval_strategy="steps",
        save_total_limit=3,
        load_best_model_at_end=True,
        metric_for_best_model="eval_loss",
        greater_is_better=False,
        report_to="tensorboard",
        remove_unused_columns=False,
        push_to_hub=False,
        fp16=False,  # Disabled due to gradient scaling bug
        bf16=False,  # BF16 alternative (if GPU supports it, RTX 4050 doesn't)
        max_grad_norm=1.0,  # Gradient clipping
        dataloader_pin_memory=False,  # Reduce memory
        dataloader_num_workers=0,  # Avoid multiprocessing issues
        gradient_checkpointing=True,  # Memory optimization - CRITICAL
        optim="adamw_torch",  # Use PyTorch's native AdamW
        torch_compile=False  # Disable compilation for stability
    )
    
    print("⚠️  FP16 disabled due to gradient scaling bug - training in FP32 mode")
    
    # Initialize trainer (processing_class instead of tokenizer for future compatibility)
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        processing_class=tokenizer,
        data_collator=data_collator
    )
    
    # Enable gradient checkpointing
    model.gradient_checkpointing_enable()
    
    # Train
    print("🚀 Optimized training started...")
    print(f"💾 Batch size: {config['batch_size']}")
    print(f"📏 Sequence length: {config['max_length']}")
    print(f"🎯 Gradient accumulation: {config.get('gradient_accumulation_steps', 1)}")
    
    trainer.train()
    
    # Save final model
    print("💾 Saving final model...")
    trainer.save_model(output_dir)
    tokenizer.save_pretrained(output_dir)
    
    print(f"✅ Training complete! Model saved to: {output_dir}")

if __name__ == "__main__":
    print(f"📍 Current working directory: {os.getcwd()}")
    print(f"📍 Script location: {os.path.abspath(__file__)}")
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"🖥️  Using device: {device}")
    if torch.cuda.is_available():
        print(f"🎮 GPU: {torch.cuda.get_device_name()}")
        print(f"💾 VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB")
    
    train_model_optimized()