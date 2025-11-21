#!/usr/bin/env python3
"""
Script to merge Geo_questions.jsonl and math_questions.jsonl files
into a single merged_questions.jsonl file.

This script:
1. Reads both JSONL files
2. Combines all questions into a single list
3. Adds metadata to distinguish question sources
4. Writes the merged data to a new JSONL file
"""

import json
import os
from pathlib import Path

def load_jsonl(file_path):
    """Load questions from a JSONL file."""
    questions = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if line:  # Skip empty lines
                    try:
                        question = json.loads(line)
                        questions.append(question)
                    except json.JSONDecodeError as e:
                        print(f"Warning: Error parsing line {line_num} in {file_path}: {e}")
                        continue
    except FileNotFoundError:
        print(f"Error: File {file_path} not found")
        return []
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []
    
    return questions

def save_jsonl(questions, file_path):
    """Save questions to a JSONL file."""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            for question in questions:
                f.write(json.dumps(question, ensure_ascii=False) + '\n')
        print(f"Successfully saved {len(questions)} questions to {file_path}")
    except Exception as e:
        print(f"Error saving to {file_path}: {e}")

def add_source_metadata(questions, source_name):
    """Add source metadata to questions."""
    for i, question in enumerate(questions):
        # Add source information
        question['source_file'] = source_name
        question['merged_index'] = i + 1
        
        # Ensure question_id exists and is unique
        if 'question_id' not in question:
            question['question_id'] = f"merged_{source_name}_{i+1}"
        else:
            # Make question_id unique by prefixing source
            original_id = question['question_id']
            question['question_id'] = f"{source_name}_{original_id}"

def main():
    # Define file paths
    base_dir = Path(__file__).parent / "src" / "assets"
    geo_file = base_dir / "Geo_questions.jsonl"
    math_file = base_dir / "math_questions.jsonl"
    output_file = base_dir / "merged_questions.jsonl"
    
    print("Starting question merge process...")
    print(f"Base directory: {base_dir}")
    print(f"Geo questions file: {geo_file}")
    print(f"Math questions file: {math_file}")
    print(f"Output file: {output_file}")
    print()
    
    # Check if input files exist
    if not geo_file.exists():
        print(f"Error: {geo_file} not found")
        return
    
    if not math_file.exists():
        print(f"Error: {math_file} not found")
        return
    
    # Load questions from both files
    print("Loading Geo questions...")
    geo_questions = load_jsonl(geo_file)
    print(f"Loaded {len(geo_questions)} Geo questions")
    
    print("Loading Math questions...")
    math_questions = load_jsonl(math_file)
    print(f"Loaded {len(math_questions)} Math questions")
    
    if not geo_questions and not math_questions:
        print("No questions loaded from either file. Exiting.")
        return
    
    # Add source metadata
    print("Adding source metadata...")
    add_source_metadata(geo_questions, "geo")
    add_source_metadata(math_questions, "math")
    
    # Combine all questions
    all_questions = geo_questions + math_questions
    
    # Add overall metadata
    merged_metadata = {
        "total_questions": len(all_questions),
        "geo_questions": len(geo_questions),
        "math_questions": len(math_questions),
        "merge_timestamp": str(Path().cwd()),
        "source_files": ["Geo_questions.jsonl", "math_questions.jsonl"]
    }
    
    # Create final merged data structure
    merged_data = {
        "metadata": merged_metadata,
        "questions": all_questions
    }
    
    # Save merged questions
    print(f"Saving merged questions to {output_file}...")
    save_jsonl([merged_data], output_file)
    
    # Print summary
    print("\n" + "="*50)
    print("MERGE SUMMARY")
    print("="*50)
    print(f"Total questions merged: {len(all_questions)}")
    print(f"  - Geo questions: {len(geo_questions)}")
    print(f"  - Math questions: {len(math_questions)}")
    print(f"Output file: {output_file}")
    print(f"File size: {output_file.stat().st_size / 1024:.1f} KB")
    print("="*50)
    
    # Verify the output
    print("\nVerifying merged file...")
    try:
        with open(output_file, 'r', encoding='utf-8') as f:
            first_line = f.readline().strip()
            if first_line:
                merged_verification = json.loads(first_line)
                if 'metadata' in merged_verification and 'questions' in merged_verification:
                    print("✓ Merged file structure is valid")
                    print(f"✓ Contains {len(merged_verification['questions'])} questions")
                else:
                    print("⚠ Warning: Merged file structure may be unexpected")
            else:
                print("⚠ Warning: Merged file appears to be empty")
    except Exception as e:
        print(f"✗ Error verifying merged file: {e}")

if __name__ == "__main__":
    main()
