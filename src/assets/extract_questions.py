#!/usr/bin/env python3
"""
Script to extract individual questions from the merged_questions.jsonl file
and create a simple JSONL file with one question per line.
"""

import json
import os
from pathlib import Path

def main():
    # Define file paths
    base_dir = Path(__file__).parent / "src" / "assets"
    merged_file = base_dir / "merged_questions.jsonl"
    output_file = base_dir / "all_questions.jsonl"
    
    print("Extracting individual questions...")
    print(f"Merged file: {merged_file}")
    print(f"Output file: {output_file}")
    
    if not merged_file.exists():
        print(f"Error: {merged_file} not found")
        return
    
    # Load the merged data
    try:
        with open(merged_file, 'r', encoding='utf-8') as f:
            merged_data = json.load(f)
    except Exception as e:
        print(f"Error loading merged file: {e}")
        return
    
    # Extract questions
    questions = merged_data.get('questions', [])
    print(f"Found {len(questions)} questions to extract")
    
    # Save individual questions
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            for question in questions:
                f.write(json.dumps(question, ensure_ascii=False) + '\n')
        print(f"Successfully saved {len(questions)} questions to {output_file}")
    except Exception as e:
        print(f"Error saving questions: {e}")
        return
    
    # Print summary
    print("\n" + "="*50)
    print("EXTRACTION SUMMARY")
    print("="*50)
    print(f"Questions extracted: {len(questions)}")
    print(f"Output file: {output_file}")
    print(f"File size: {output_file.stat().st_size / 1024:.1f} KB")
    print("="*50)

if __name__ == "__main__":
    main()
