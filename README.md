# SAT Demo Application

A comprehensive digital SAT practice test application built with Vue.js 3, featuring realistic test conditions, progress tracking, and persistent data storage.

## 🚀 Features

### Core Functionality
- **Complete SAT Test Experience**: Full Reading & Writing and Math sections
- **Realistic Test Environment**: Authentic question format and timing
- **Progress Persistence**: LocalStorage integration prevents data loss on refresh
- **Question Navigation**: Easy navigation between questions with visual indicators
- **Flag System**: Mark questions for review
- **Timer Integration**: Realistic test timing with automatic progression

### User Experience
- **Student Authentication**: Name-based access system
- **Session Management**: Seamless transition between Reading & Writing and Math sections
- **Break Page**: Dedicated break between Session 1 and Session 2
- **Responsive Design**: Works on desktop and tablet devices
- **Visual Feedback**: Clear progress indicators and answer status

### Technical Features
- **Async Question Loading**: Dynamic question loading from Supabase database
- **Error Handling**: Graceful error handling with retry functionality
- **Loading States**: User-friendly loading indicators
- **Debug Tools**: Built-in debugging panel for development

## 🛠️ Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Styling**: CSS3 with modern design patterns
- **Data Processing**: Papa Parse for CSV handling
- **State Management**: Vue 3 Reactivity System

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd satDemo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🏗️ Project Structure

```
satDemo/
├── src/
│   ├── components/          # Vue components
│   │   ├── AccessPage.vue   # Student login/access
│   │   ├── SatDemo.vue      # Main test interface
│   │   ├── QuestionArea.vue # Question display and answers
│   │   ├── Timer.vue        # Test timer component
│   │   ├── BreakPage.vue    # Break between sessions
│   │   └── ...
│   ├── lib/                 # Utility libraries
│   │   ├── supabase.js      # Database configuration
│   │   ├── loadingQuestion.js # Question loading logic
│   │   └── auth.js          # Authentication utilities
│   ├── assets/              # Static assets
│   │   ├── data.csv         # Question data
│   │   └── ...
│   └── main.js              # Application entry point
├── public/                  # Public assets
├── package.json
└── README.md
```

## 🎯 Usage

### For Students

1. **Access the Application**
   - Open the application in your browser
   - Enter your name to begin

2. **Taking the Test**
   - Read the instructions carefully
   - Answer questions by clicking on your choice
   - Use the flag button to mark questions for review
   - Navigate between questions using the navigation panel
   - Use Prev/Next buttons or click question numbers

3. **Session Management**
   - Complete Session 1 (Reading & Writing)
   - Take a break between sessions
   - Continue to Session 2 (Math)
   - Submit when finished

### For Administrators

1. **Question Management**
   - Questions are loaded from Supabase database
   - Update questions in the `SATRW` table
   - Questions are automatically categorized by module

2. **Debug Mode**
   - Press `Ctrl+D` to open debug panel
   - View current session/module status
   - Clear progress data if needed
   - Switch between sessions for testing

## 🔧 Configuration

### Database Setup

1. **Create Supabase Project**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project

2. **Set up Database Table**
   ```sql
   CREATE TABLE SATRW (
     id SERIAL PRIMARY KEY,
     test_number VARCHAR(10),
     module_number INTEGER,
     question_prompt TEXT,
     question_question TEXT,
     choices TEXT,
     correct_answer VARCHAR(10)
   );
   ```

3. **Import Question Data**
   - Use the provided CSV files or import your own
   - Ensure proper column mapping

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key

# Optional: Additional configuration
VITE_APP_TITLE=SAT Demo Application
```

## 📊 Data Management

### Question Format

Questions are stored in Supabase with the following structure:
- `test_number`: Test identifier
- `module_number`: Module number (1-4)
- `question_prompt`: Question text/passage
- `question_question`: Specific question
- `choices`: JSON array of answer choices
- `correct_answer`: Correct answer identifier

### LocalStorage Keys

The application uses the following localStorage keys:
- `sat_demo_answers`: User's answer selections
- `sat_demo_flagged`: Flagged questions
- `sat_demo_progress`: Module progress tracking
- `sat_demo_current_question`: Current question number
- `sat_demo_current_session`: Current session
- `sat_demo_current_module`: Current module
- `sat_demo_timer_started`: Timer state

## 🔄 User State Management

### State Architecture

The application uses Vue 3's Composition API with reactive state management to handle user progress and test data. State is organized into several key areas:

#### 1. **Test Progress State**
```javascript
// Current test position
const currentQuestion = ref(0)
const currentSession = ref('session1')
const currentModule = ref('module1')

// Test flow control
const showInstructions = ref(true)
const showBreakPage = ref(false)
const timerStarted = ref(false)
```

#### 2. **User Data State**
```javascript
// User answers for all modules
const moduleAnswers = ref({
  module1: [],
  module2: [],
  module3: [],
  module4: []
})

// Flagged questions for review
const moduleFlaggedQuestions = ref({
  module1: [],
  module2: [],
  module3: [],
  module4: []
})

// Progress tracking
const moduleProgress = ref({
  module1: 0,
  module2: 0,
  module3: 0,
  module4: 0
})
```

#### 3. **Question Data State**
```javascript
// Dynamically loaded questions
const moduleQuestions = ref({
  module1: [],
  module2: [],
  module3: [],
  module4: []
})

// Loading states
const isLoadingQuestions = ref(true)
const questionsError = ref(null)
```

### State Persistence Strategy

#### **Automatic Saving**
The application automatically saves user state on every significant action:

```javascript
// Save triggers
function selectAnswer(idx) {
  // Update state
  currentAnswers[currentQuestion.value] = idx
  moduleProgress.value[currentModule.value] = answeredCount
  
  // Auto-save
  saveToLocalStorage()
}

function toggleFlag(idx) {
  // Update state
  currentFlagged[idx] = !currentFlagged[idx]
  
  // Auto-save
  saveToLocalStorage()
}
```

#### **State Loading Process**
1. **Component Mount**: Load questions from Supabase
2. **Questions Ready**: Load saved user state from localStorage
3. **Data Validation**: Ensure saved data matches current question structure
4. **State Restoration**: Restore user position and progress

```javascript
// Loading sequence
onMounted(async () => {
  await loadQuestions() // Load questions first
})

// Watch for questions to load, then restore state
watch(() => moduleQuestions.value.module1.length, (newLength) => {
  if (newLength > 0) {
    loadFromLocalStorage() // Restore user state
  }
})
```

### State Management Functions

#### **Save State**
```javascript
function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(moduleAnswers.value))
    localStorage.setItem(STORAGE_KEYS.FLAGGED, JSON.stringify(moduleFlaggedQuestions.value))
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(moduleProgress.value))
    localStorage.setItem(STORAGE_KEYS.CURRENT_QUESTION, currentQuestion.value.toString())
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, currentSession.value)
    localStorage.setItem(STORAGE_KEYS.CURRENT_MODULE, currentModule.value)
    localStorage.setItem(STORAGE_KEYS.TIMER_STARTED, timerStarted.value.toString())
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}
```

#### **Load State**
```javascript
function loadFromLocalStorage() {
  try {
    // Validate questions are loaded
    if (moduleQuestions.value.module1.length === 0) return
    
    // Load and validate answers
    const savedAnswers = localStorage.getItem(STORAGE_KEYS.ANSWERS)
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers)
      if (parsedAnswers.module1?.length === moduleQuestions.value.module1.length) {
        moduleAnswers.value = parsedAnswers
      }
    }
    
    // Load other state...
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
}
```

#### **Clear State**
```javascript
function clearLocalStorage() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}
```

### State Flow Diagram

```
User Action → State Update → Auto-Save → localStorage
     ↓
Page Refresh → Load Questions → Load State → Restore Position
     ↓
Test Complete → Clear State → Fresh Start
```

### State Validation

The application includes robust state validation:

1. **Data Structure Validation**: Ensures saved data matches current question structure
2. **Range Validation**: Validates question numbers are within valid range
3. **Type Validation**: Ensures data types are correct before loading
4. **Error Handling**: Graceful fallback if state loading fails

### Debug State Management

#### **Debug Panel Features**
- **Current State Display**: Shows current session, module, and question
- **Manual Save/Load**: Test state persistence manually
- **Clear State**: Reset all user progress
- **State Inspection**: View current state values

#### **Console Logging**
```javascript
// Debug logging for state operations
console.log('Saving to localStorage...')
console.log('Current answers:', moduleAnswers.value)
console.log('Progress saved to localStorage successfully')
```

### State Management Best Practices

1. **Always Save on State Change**: Every user action triggers an auto-save
2. **Validate Before Loading**: Check data structure before restoring state
3. **Handle Errors Gracefully**: Provide fallbacks for localStorage failures
4. **Clear on Completion**: Remove state when test is finished
5. **Debug Tools**: Provide debugging capabilities for development

### State Recovery Scenarios

#### **Normal Recovery**
- User refreshes page → State restored to exact position
- User closes browser → State persists for next session
- User navigates away → State maintained

#### **Error Recovery**
- Corrupted state data → Falls back to fresh start
- Missing questions → Waits for questions to load
- localStorage unavailable → Continues without persistence

#### **Test Completion**
- All modules finished → State cleared automatically
- Manual reset → Debug panel clear function
- New test start → Fresh state initialization

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI
   ```bash
   npm i -g vercel
   ```

2. Deploy
   ```bash
   vercel
   ```

### Deploy to Netlify

1. Build the project
   ```bash
   npm run build
   ```

2. Upload the `dist` folder to Netlify

## 🐛 Troubleshooting

### Common Issues

1. **Questions not loading**
   - Check Supabase connection
   - Verify environment variables
   - Check browser console for errors

2. **Progress not saving**
   - Ensure localStorage is enabled
   - Check browser console for errors
   - Try clearing browser data

3. **Timer not working**
   - Check if timer is properly started
   - Verify timer component is mounted

### Debug Mode

Press `Ctrl+D` to access the debug panel with:
- Current session/module status
- Question count
- Manual save/load/clear functions
- Session switching for testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- College Board for SAT test format reference
- Vue.js team for the excellent framework
- Supabase for the backend infrastructure
- All contributors and testers

## 📞 Support

For support or questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the debug console logs

---

**Note**: This is a demo application for educational purposes. It is not affiliated with or endorsed by the College Board.