# Question Merge Summary

## Overview
Successfully merged Geo_questions.jsonl and math_questions.jsonl files into a comprehensive question database.

## Files Created

### 1. `merge_questions.py`
- **Purpose**: Main script to merge the two JSONL files
- **Features**:
  - Loads questions from both Geo and Math files
  - Adds source metadata to distinguish question origins
  - Creates unique question IDs by prefixing source
  - Generates comprehensive merge statistics
  - Validates output structure

### 2. `extract_questions.py`
- **Purpose**: Extracts individual questions from the merged structure
- **Features**:
  - Converts single-line merged format to individual question lines
  - Creates a clean JSONL file with one question per line
  - Maintains all original question data and metadata

### 3. `merged_questions.jsonl`
- **Purpose**: Complete merged dataset with metadata
- **Structure**:
  ```json
  {
    "metadata": {
      "total_questions": 1610,
      "geo_questions": 224,
      "math_questions": 1386,
      "merge_timestamp": "...",
      "source_files": ["Geo_questions.jsonl", "math_questions.jsonl"]
    },
    "questions": [...]
  }
  ```

### 4. `all_questions.jsonl`
- **Purpose**: Individual questions in standard JSONL format
- **Structure**: One JSON object per line, each containing:
  - Original question data
  - `source_file`: "geo" or "math"
  - `merged_index`: Sequential number within source
  - `question_id`: Prefixed with source for uniqueness

## Statistics

| Metric | Value |
|--------|-------|
| **Total Questions** | 1,610 |
| **Geo Questions** | 224 |
| **Math Questions** | 1,386 |
| **File Size** | ~47.6 MB |
| **Format** | JSONL (JSON Lines) |

## Question Structure

Each question contains:
- `question_id`: Unique identifier (prefixed with source)
- `question_attribute`: Array of tags/categories
- `question_subject`: Subject area ("Math")
- `difficulty`: Difficulty level
- `question_content`: HTML content with question text and diagrams
- `question_prompt`: Text prompt
- `question_question`: Main question text
- `question_choices`: Answer choices (HTML format)
- `question_rationale`: Explanation of correct answer
- `source_file`: "geo" or "math"
- `merged_index`: Sequential number within source

## Usage Examples

### Load all questions in Python:
```python
import json

questions = []
with open('src/assets/all_questions.jsonl', 'r') as f:
    for line in f:
        questions.append(json.loads(line))
```

### Filter by source:
```python
geo_questions = [q for q in questions if q['source_file'] == 'geo']
math_questions = [q for q in questions if q['source_file'] == 'math']
```

### Filter by difficulty:
```python
hard_questions = [q for q in questions if 'Hard' in q['difficulty']]
```

## File Locations
- **Scripts**: `/Users/youngscholars/Desktop/satDemo/`
- **Data**: `/Users/youngscholars/Desktop/satDemo/src/assets/`
- **Output**: `/Users/youngscholars/Desktop/satDemo/src/assets/all_questions.jsonl`

## Next Steps
1. The merged questions can now be used in the SAT Demo application
2. Update the `loadingQuestion.js` to load from `all_questions.jsonl`
3. Implement filtering by question type (Geo vs Math) if needed
4. Add question categorization based on `question_attribute` field

## Notes
- All original question data is preserved
- Source information is maintained for traceability
- Question IDs are made unique across both sources
- The merge process is idempotent and can be re-run safely
