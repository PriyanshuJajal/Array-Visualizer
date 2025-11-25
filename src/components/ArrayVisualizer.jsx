import React, { useState } from "react";
import { Moon, Sun, MessageSquare, X, Send } from 'lucide-react';

// ============== CONSTANTS ==============
const ALGORITHMS = {
  traversal: {
    name: 'Array Traversal',
    code: `function traverseArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]); // Visit each element
  }
}`,
    complexity: 'Time: O(n) | Space: O(1)',
    advantages: '• Simple operation\n• Accesses all elements\n• Foundation for many algorithms',
    disadvantages: '• Can be slow when array is large\n• Must visit every element (not selective)'
  },
  insertion: {
    name: 'Array Insertion',
    code: `function insertAt(arr, index, value) {
  if (index < 0 || index > arr.length) {
    return arr; // Invalid index
  }
  for (let i = arr.length; i > index; i--) {
    arr[i] = arr[i - 1]; // Shift elements
  }
  arr[index] = value;
  return arr;
}`,
    complexity: 'Time: O(n) | Space: O(1)',
    advantages: '• Easy to implement\n• Useful for dynamic modifications',
    disadvantages: '• Requires shifting elements\n• Slow for large arrays'
  },
  update: {
    name: 'Update Element',
    code: `function updateAt(arr, index, value) {
  if (index < 0 || index >= arr.length) {
    return arr; // Invalid index
  }
  arr[index] = value;
  return arr;
}`,
    complexity: 'Time: O(1) | Space: O(1)',
    advantages: '• Very fast\n• Direct access using index\n• Constant time operation',
    disadvantages: '• Requires knowing a valid index\n• Cannot update if index is out of bounds'
  },
  deletion: {
    name: 'Delete Element',
    code: `function deleteAt(arr, index) {
  if (index < 0 || index >= arr.length) {
    return arr; // Invalid index
  }
  for (let i = index; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1]; // Shift left
  }
  arr.length--; // Remove last duplicate
  return arr;
}`,
    complexity: 'Time: O(n) | Space: O(1)',
    advantages: '• Simple logic\n• Works for any index',
    disadvantages: '• Requires shifting elements\n• Slow for large arrays'
  },
  linearSearch: {
    name: 'Linear Search',
    code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == target) return i;
  }
  return -1;
}`,
    complexity: 'Time: O(n) | Space: O(1)',
    advantages: '• Simple to implement\n• Works on unsorted arrays\n• No preprocessing needed',
    disadvantages: '• Slow for large datasets\n• Not efficient for sorted arrays'
  },
  binarySearch: {
    name: 'Binary Search',
    code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1; // Not found
}`,
    complexity: 'Time: O(log n) | Space: O(1)',
    advantages: '• Very fast for large datasets\n• Efficient algorithm\n• Logarithmic time complexity',
    disadvantages: '• Requires sorted array\n• More complex to implement'
  },
  bubbleSort: {
    name: 'Bubble Sort',
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let swapped = false;

    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    complexity: 'Time: O(n²) | Space: O(1)',
    advantages: '• Simple and easy to understand\n• In-place sorting\n• Stable sort\n• With Optimization, much faster on nearly sorted arrays',
    disadvantages: '• Very slow for large arrays\n• Not practical for real-world use'
  },
  insertionSort: {
    name: 'Insertion Sort',
    code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    complexity: 'Time: O(n²) | Space: O(1)',
    advantages: '• Efficient for small datasets\n• Adaptive (fast for nearly sorted)\n• Stable and in-place',
    disadvantages: '• Slow for large datasets\n• Quadratic time complexity'
  },
  selectionSort: {
    name: 'Selection Sort',
    code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
    complexity: 'Time: O(n²) | Space: O(1)',
    advantages: '• Simple implementation\n• Minimal swaps (O(n))\n• Works well for small arrays',
    disadvantages: '• Slow for large datasets\n• Not stable\n• Always O(n²)'
  }
};

// ============== GOOGLE FORM CONFIG ==============
// REPLACE THESE VALUES WITH YOUR OWN FROM GOOGLE FORMS!
const GOOGLE_FORM_CONFIG = {
  formId: import.meta.env.VITE_FORM_ID, 
  entries: {
    name: import.meta.env.VITE_ENTRY_NAME,     
    email: import.meta.env.VITE_ENTRY_EMAIL,    
    type: import.meta.env.VITE_ENTRY_TYPE,   
    message: import.meta.env.VITE_ENTRY_MESSAGE, 
    rating: import.meta.env.VITE_ENTRY_RATING  
  }
};


// ============== FEEDBACK MODAL COMPONENT ==============
const FeedbackModal = ({ isOpen, onClose, theme }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'General Feedback',
    message: '',
    rating: '5'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      alert('Please enter your feedback message');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create form data for Google Forms
      const formBody = new URLSearchParams();
      formBody.append(GOOGLE_FORM_CONFIG.entries.name, formData.name);
      formBody.append(GOOGLE_FORM_CONFIG.entries.email, formData.email);
      formBody.append(GOOGLE_FORM_CONFIG.entries.type, formData.type);
      formBody.append(GOOGLE_FORM_CONFIG.entries.message, formData.message);
      formBody.append(GOOGLE_FORM_CONFIG.entries.rating, formData.rating);

      // Submit to Google Forms
      // eslint-disable-next-line no-unused-vars
      const response = await fetch(
        `https://docs.google.com/forms/d/e/${GOOGLE_FORM_CONFIG.formId}/formResponse`,
        {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.toString()
        }
      );

      // no-cors mode doesn't allow reading response, so we assume success
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
        setFormData({ name: '', email: '', type: 'General Feedback', message: '', rating: '5' });
        setSubmitStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{backgroundColor: 'rgba(0 , 0 , 0 , 0.5)'}}
      onClick={onClose}
    >
      <div
        className={`${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'} rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <MessageSquare className="text-blue-500" size={24} />
            <h2 className="text-xl font-semibold">Send Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className={`${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} p-2 rounded-lg transition-colors`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Email (Optional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="your.email@example.com"
            />
          </div>

          {/* Feedback Type */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Feedback Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className={`hover:cursor-pointer w-full px-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option>General Feedback</option>
              <option>Bug Report</option>
              <option>Feature Request</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
              placeholder="Tell me what you think..."
            />
          </div>

          {/* Rating */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Rating: {formData.rating}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              ✓ Thank you for your feedback!
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              ✗ Error submitting feedback. Please try again.
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 hover:cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 hover:cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send size={18} />
                  Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============== HEADER COMPONENT ==============
const Header = ({ theme, toggleTheme, onFeedbackClick }) => {
  const headerTxtClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const subTxtClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-800';

  return (
    <div className="mb-6">
      <div className="relative">
        {/* Buttons on the right for medium+ screens, centered for mobile */}
        <div className="flex gap-2 justify-center md:justify-end md:absolute md:top-0 md:right-0 mb-4 md:mb-0">
          <button
            onClick={onFeedbackClick}
            className={`flex items-center cursor-pointer gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium text-sm sm:text-base transition-colors ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-800 text-white'
                : 'bg-blue-500 hover:bg-blue-700 text-white' 
            }`}
          >
            <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Feedback</span>
          </button>
          <button
            onClick={toggleTheme}
            className={`flex items-center cursor-pointer gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium text-sm sm:text-base transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-900' 
            }`}
          >
            {theme === 'dark' ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
        
        {/* Heading and paragraph always centered */}
        <div className="flex flex-col items-center text-center">
          <h1 className={`text-2xl sm:text-3xl font-semibold mb-2 ${headerTxtClass}`}>
            Array Visualizer
          </h1>
          <p className={`text-sm sm:text-base ${subTxtClass}`}>
            Interactive learning tool for Data Structures and Algorithms
          </p>
        </div>
      </div>
    </div>
  );
};

// ============== CONTROLS COMPONENT ==============
const Controls = ({ 
  theme, 
  arrSize, 
  setArrSize, 
  visualMode, 
  setVisualMode, 
  animationSpeed, 
  setAnimationSpeed,
  isAnimating,
  onGenerateRandom,
  onGenerateUser,
  onReset,
  inputVal,
  setInputVal
}) => {
  const smallMuted = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm p-6 mb-6`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className={`text-sm font-medium mb-2 block ${smallMuted}`}>Array Size: {arrSize}</label>
          <input 
            type="range" 
            min={5} 
            max={20} 
            value={arrSize}
            onChange={(e) => setArrSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            disabled={isAnimating}
          />
        </div>

        <div>
          <label className={`text-sm font-medium mb-2 block ${smallMuted}`}>Visualization</label>
          <select
            value={visualMode}
            onChange={(e) => setVisualMode(e.target.value)}
            className={`clean-select w-full cursor-pointer ${theme === 'dark' ? 'dark' : ''}`}
            disabled={isAnimating}
          >
            <option value="squares">Grid View</option>
            <option value="bars">Bar Chart</option>
          </select>
        </div>

        <div>
          <label className={`text-sm font-medium mb-2 block ${smallMuted}`}>Speed: {animationSpeed}ms</label>
          <input 
            type="range" 
            min={100} 
            max={2000} 
            step={50} 
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            disabled={isAnimating}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onGenerateRandom}
          disabled={isAnimating}
          className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors font-medium cursor-pointer magic-btn"
        >
          Generate Random
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 5,3,8,2"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className={`clean-input flex-1 text-sm ${theme === 'dark' ? 'dark' : ''}`}
            disabled={isAnimating}
          />
          <button
            onClick={onGenerateUser}
            disabled={isAnimating}
            className="magic-btn bg-sky-500 hover:bg-sky-700 text-white px-3 py-2 rounded-lg transition-colors cursor-pointer font-medium text-sm sm:text-base"
          >
            Set Array
          </button>
        </div>

        <button
          onClick={onReset}
          className="magic-btn bg-sky-500 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer font-medium text-sm sm:text-base"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// ============== ARRAY DISPLAY COMPONENT ==============
const ArrayDisplay = ({ theme, visualMode, arr, highlightedIndices, comparedIndices }) => {
  if (visualMode === 'squares') {
    return (
      <div className="flex flex-wrap gap-2 sm:gap-4  justify-center">
        {arr.map((val, idx) => (
          <div key={idx} className="flex flex-col items-center group">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-white font-semibold text-base sm:text-lg shadow-sm transition-all duration-300"
              style={{
                backgroundColor: comparedIndices.includes(idx)
                  ? '#10b981'
                  : highlightedIndices.includes(idx)
                  ? '#3b82f6'
                  : theme === 'dark'
                  ? '#374151'
                  : '#6b7280',
                transform: highlightedIndices.includes(idx) ? 'scale(1.15)' : 'scale(1)',
                boxShadow: highlightedIndices.includes(idx) ? '0 4px 12px rgba(59, 130, 246, 0.4)' : ''
              }}
            >
              {val}
            </div>
            <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} text-xs mt-1 sm:mt-2 font-mono`}>{idx}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-x-auto">
      {/* On large screens this wrapper becomes flex + centers the whole bar row */}
      <div className="lg:flex lg:justify-center">
        <div className="flex items-end gap-1 sm:gap-2 h-56 sm:h-64 px-2 min-w-max justify-start">
          {arr.map((val, idx) => {
            const maxVal = Math.max(...arr);
            const htPercent = (val / maxVal) * 100;

            return (
              <div
                key={idx}
                className="flex flex-col items-center group shrink-0"
              >
                <span className="text-xs font-mono mb-1">{val}</span>
                <div
                  className="rounded-lg transition-all duration-300 flex items-end justify-center text-white font-semibold text-xs sm:text-sm pb-1 sm:pb-2"
                  style={{
                    width: `${Math.max(32 , Math.min(45 , 500 / arr.length)
                    )}px`,
                    height: `${htPercent}%`,
                    minHeight: `${Math.max(24 , (val / maxVal) * 50)}px`,
                    backgroundColor: comparedIndices.includes(idx)
                      ? "#10b981"
                      : highlightedIndices.includes(idx)
                      ? "#3b82f6"
                      : theme === "dark"
                      ? "#374151"
                      : "#6b7280",
                    boxShadow: highlightedIndices.includes(idx)
                      ? "0 0 20px rgba(59, 130, 246, 0.5)"
                      : "",
                  }}
                />
                <span
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  } text-xs mt-1 font-mono`}
                >
                  {idx}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============== OPERATION SECTION COMPONENT ==============
const OperationSection = ({ theme, title, isExpanded, onToggle, children }) => {
  const headerTxtClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm overflow-hidden`}>
      <button 
        onClick={onToggle}
        className={`w-full px-6 py-4 cursor-pointer flex items-center justify-between ${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
      >
        <h3 className={`text-lg font-semibold ${headerTxtClass}`}>{title}</h3>
        {isExpanded ? <span>▲</span> : <span>▼</span>}
      </button>
      {isExpanded && <div className="p-6">{children}</div>}
    </div>
  );
};

// ============== ALGORITHM INFO COMPONENT ==============
const AlgorithmInfo = ({ theme, algorithm, showCode, showInfo, onToggleCode, onToggleInfo }) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2">
        <button
          onClick={onToggleCode}
          className="magic-btn cursor-pointer bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {showCode ? 'Hide' : 'Show'} Code
        </button>
        <button 
          onClick={onToggleInfo}
          className="magic-btn cursor-pointer bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {showInfo ? 'Hide' : 'Show'} Analysis
        </button>
      </div>

      {showCode && (
        <div className="bg-gray-900 border-gray-700 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold mb-4">{algorithm.name}</h3>
          <pre className="text-green-400 text-sm overflow-x-auto font-mono">{algorithm.code}</pre>
        </div>
      )}

      {showInfo && (
        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'} rounded-lg shadow-sm p-6`}>
          <h3 className="text-lg font-semibold mb-4">Algorithm Analysis</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className={theme === 'dark' ? 'bg-gray-900 border border-gray-700 rounded-lg p-4' : 'bg-blue-50 border border-blue-200 rounded-lg p-4'}>
              <h4 className={theme === 'dark' ? 'text-blue-300 font-semibold mb-2' : 'text-blue-900 font-semibold mb-2'}>Complexity</h4>

              <p className={theme === 'dark' ? 'text-gray-300 text-sm' : 'text-gray-700 text-sm'}>{algorithm.complexity}</p>
            </div>

            <div className={theme === 'dark' ? 'bg-gray-900 border border-gray-700 rounded-lg p-4' : 'bg-green-50 border border-green-200 rounded-lg p-4'}>

              <h4 className={theme === 'dark' ? 'text-green-300 font-semibold mb-2' : 'text-green-900 font-semibold mb-2'}>Advantages</h4>

              <p className={theme === 'dark' ? 'text-gray-300 text-sm whitespace-pre-line' : 'text-gray-700 text-sm whitespace-pre-line'}>{algorithm.advantages}</p>
            </div>

            <div className={theme === 'dark' ? 'bg-gray-900 border border-gray-700 rounded-lg p-4' : 'bg-red-50 border border-red-200 rounded-lg p-4'}>

              <h4 className={theme === 'dark' ? 'text-red-300 font-semibold mb-2' : 'text-red-900 font-semibold mb-2'}>Disadvantages</h4>

              <p className={theme === 'dark' ? 'text-gray-300 text-sm whitespace-pre-line' : 'text-gray-700 text-sm whitespace-pre-line'}>{algorithm.disadvantages}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== MAIN COMPONENT ==============
const ArrayVisualizer = () => {
  const [arr, setArr] = useState([10, 25, 4, 19, 7, 3, 21, 18]);
  const [arrSize, setArrSize] = useState(8);
  const [visualMode, setVisualMode] = useState('squares');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [currOperation, setCurrOperation] = useState('none');
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [comparedIndices, setComparedIndices] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [inputIdx, setInputIdx] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [expandedSection, setExpandedSection] = useState('basic');
  const [theme, setTheme] = useState('light');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const abortRef = React.useRef(false);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const generateRandomArr = () => {
    const newArr = Array.from({length: arrSize}, () => Math.floor(Math.random() * 100) + 1);
    setArr(newArr);
    setHighlightedIndices([]);
    setComparedIndices([]);
  };

  const generateUserArr = () => {
    const values = inputVal.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (values.length > 0) {
      setArr(values);
      setArrSize(values.length);
      setInputVal('');
    }
  };

  const resetVisualization = () => {
    abortRef.current = true;
    setHighlightedIndices([]);
    setComparedIndices([]);
    setIsAnimating(false);
    setCurrOperation('none');
  };

  const traverseArr = async () => {
    setCurrOperation('traversal');
    setIsAnimating(true);

    for (let i = 0; i < arr.length; i++) {
      if (abortRef.current) { setIsAnimating(false); return; }

      setHighlightedIndices([i]);
      await sleep(animationSpeed);
    }
    setIsAnimating(false);
    setHighlightedIndices([]);
  };

  const insertElement = async () => {
    const val = parseInt(inputVal);
    const idx = parseInt(inputIdx);
    if (isNaN(val)) return;

    setIsAnimating(true);
    setCurrOperation('insertion');
    const newArr = [...arr];
    
    if (isNaN(idx) || idx >= newArr.length) {
      newArr.push(val);
      setHighlightedIndices([newArr.length - 1]);
    } else {
      newArr.splice(idx, 0, val);
      setHighlightedIndices([idx]);
    }

    setArr(newArr);
    await sleep(animationSpeed);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setInputIdx('');
    setInputVal('');
  };

  const deleteElement = async () => {
    const idx = parseInt(inputIdx);
    if (isNaN(idx) || idx < 0 || idx >= arr.length) return;

    setIsAnimating(true);
    setCurrOperation('deletion');
    setHighlightedIndices([idx]);
    await sleep(animationSpeed);

    const newArr = arr.filter((_, i) => i !== idx);
    setArr(newArr);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setInputIdx('');
    setInputVal('');
  };

  const updateElement = async () => {
    const val = parseInt(inputVal);
    const idx = parseInt(inputIdx);
    if (isNaN(val) || isNaN(idx) || idx < 0 || idx >= arr.length) return;

    setIsAnimating(true);
    setCurrOperation('update');
    setHighlightedIndices([idx]);
    await sleep(animationSpeed);

    const newArr = [...arr];
    newArr[idx] = val;
    setArr(newArr);
    setHighlightedIndices([]);
    setIsAnimating(false);
    setInputVal('');
    setInputIdx('');
  };

  const linearSearch = async () => {
    const target = parseInt(searchVal);
    if (isNaN(target)) return;

    setIsAnimating(true);
    setCurrOperation('linearSearch');

    for (let i = 0; i < arr.length; i++) {
      if (abortRef.current) { setIsAnimating(false); return; }

      setHighlightedIndices([i]);
      await sleep(animationSpeed);

      if (arr[i] === target) {
        setComparedIndices([i]);
        await sleep(animationSpeed * 2);
        setHighlightedIndices([]);
        setIsAnimating(false);
        setSearchVal('');
        return;
      }
    }
    
    setHighlightedIndices([]);
    setIsAnimating(false);
    setSearchVal('');
    alert('Element Not Found!');
  };

  const binarySearch = async () => {
    const target = parseInt(searchVal);
    if (isNaN(target)) return;

    setIsAnimating(true);
    setCurrOperation('binarySearch');

    const sortedArr = [...arr].sort((a, b) => a - b);
    await sleep(animationSpeed);
    setArr(sortedArr);
    await sleep(animationSpeed);

    let l = 0;
    let r = sortedArr.length - 1;

    while (l <= r) {
      if (abortRef.current) { setIsAnimating(false); return; }

      const mid = Math.floor(l + (r - l) / 2);
      setHighlightedIndices([l, mid, r]);
      await sleep(animationSpeed);

      if (sortedArr[mid] === target) {
        setComparedIndices([mid]);
        await sleep(animationSpeed * 2);
        setHighlightedIndices([]);
        setIsAnimating(false);
        setSearchVal('');
        return;
      }

      if (sortedArr[mid] < target) l = mid + 1;
      else r = mid - 1;
    }
    
    setHighlightedIndices([]);
    setIsAnimating(false);
    setSearchVal('');
    alert('Element not found!');
  };

  const bubbleSort = async () => {
    setIsAnimating(true);
    setCurrOperation('bubbleSort');
    const newArr = [...arr];

    for (let i = 0; i < newArr.length; i++) {
      if (abortRef.current) { setIsAnimating(false); return; }

      let swapped = false;

      for (let j = 0; j < newArr.length - i - 1; j++) {
        if (abortRef.current) { setIsAnimating(false); return; }

        setComparedIndices([j, j + 1]);
        await sleep(animationSpeed);

        if (newArr[j] > newArr[j + 1]) {
          [newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]];
          setArr([...newArr]);
          swapped = true;
          await sleep(animationSpeed);
        }
      }
      setHighlightedIndices([newArr.length - i - 1]);

      if (!swapped) break;
    }

    setComparedIndices([]);
    setHighlightedIndices([]);
    setIsAnimating(false);
  };

  const insertionSort = async () => {
    setIsAnimating(true);
    setCurrOperation('insertionSort');
    const newArr = [...arr];

    for (let i = 1; i < newArr.length; i++) {
      if (abortRef.current) { setIsAnimating(false); return; }

      let key = newArr[i];
      let j = i - 1;

      setHighlightedIndices([i]);
      await sleep(animationSpeed);

      while (j >= 0 && newArr[j] > key) {
        if (abortRef.current) { setIsAnimating(false); return; }

        setComparedIndices([j, j + 1]);
        newArr[j + 1] = newArr[j];
        setArr([...newArr]);
        await sleep(animationSpeed);
        j--;
      }

      newArr[j + 1] = key;
      setArr([...newArr]);
      await sleep(animationSpeed);
    }

    setHighlightedIndices([]);
    setComparedIndices([]);
    setIsAnimating(false);
  };

  const selectionSort = async () => {
    setIsAnimating(true);
    setCurrOperation('selectionSort');
    const newArr = [...arr];

    for (let i = 0; i < newArr.length - 1; i++) {
      if (abortRef.current) { setIsAnimating(false); return; }

      let minIdx = i;
      setHighlightedIndices([i]);
      
      for (let j = i + 1; j < newArr.length; j++) {
        if (abortRef.current) { setIsAnimating(false); return; }
        
        setComparedIndices([minIdx, j]);
        await sleep(animationSpeed);
        if (newArr[j] < newArr[minIdx]) minIdx = j;
      }
      
      if (minIdx !== i) {
        [newArr[i], newArr[minIdx]] = [newArr[minIdx], newArr[i]];
        setArr([...newArr]);
        await sleep(animationSpeed);
      }
    }
    
    setHighlightedIndices([]);
    setComparedIndices([]);
    setIsAnimating(false);
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'} min-h-screen p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        <Header 
          theme={theme} 
          toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          onFeedbackClick={() => setIsFeedbackOpen(true)}
        />

        <FeedbackModal 
          isOpen={isFeedbackOpen} 
          onClose={() => setIsFeedbackOpen(false)}
          theme={theme}
        />

        <Controls
          theme={theme}
          arrSize={arrSize}
          setArrSize={setArrSize}
          visualMode={visualMode}
          setVisualMode={setVisualMode}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          isAnimating={isAnimating}
          onGenerateRandom={generateRandomArr}
          onGenerateUser={generateUserArr}
          onReset={resetVisualization}
          inputVal={inputVal}
          setInputVal={setInputVal}
        />

        <div className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg shadow-sm p-4 sm:p-8 mb-6 h-72 sm:h-80 flex items-center justify-center`}>
          <ArrayDisplay
            theme={theme}
            visualMode={visualMode}
            arr={arr}
            highlightedIndices={highlightedIndices}
            comparedIndices={comparedIndices}
          />
        </div>

        <div className="space-y-4">
          <OperationSection
            theme={theme}
            title="Basic Operations"
            isExpanded={expandedSection === 'basic'}
            onToggle={() => setExpandedSection(expandedSection === 'basic' ? '' : 'basic')}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Value"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className={`clean-input ${theme === 'dark' ? 'dark' : ''}`}
                  disabled={isAnimating}
                />
                <input
                  type="text"
                  placeholder="Index"
                  value={inputIdx}
                  onChange={(e) => setInputIdx(e.target.value)}
                  className={`clean-input ${theme === 'dark' ? 'dark' : ''}`}
                  disabled={isAnimating}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={traverseArr} disabled={isAnimating} className="magic-btn cursor-pointer bg-fuchsia-400 hover:bg-fuchsia-500 text-white px-4 py-2 rounded-lg">
                  Traverse
                </button>
                <button onClick={insertElement} disabled={isAnimating} className="magic-btn cursor-pointer bg-emerald-400 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors">
                  Insert
                </button>
                <button onClick={updateElement} disabled={isAnimating} className="magic-btn cursor-pointer bg-amber-400 hover:bg-amber-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors">
                  Update
                </button>
                <button onClick={deleteElement} disabled={isAnimating} className="magic-btn cursor-pointer bg-cyan-500 hover:bg-cyan-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors">
                  Delete
                </button>
              </div>

              <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-300' : 'bg-blue-50 border-blue-200 text-gray-600'} mt-3 text-sm p-3 rounded-lg`}>
                <strong>Note:</strong> For Delete operation, only Index is sufficient !
              </div>
            </div>
          </OperationSection>

          <OperationSection
            theme={theme}
            title="Search Algorithms"
            isExpanded={expandedSection === 'search'}
            onToggle={() => setExpandedSection(expandedSection === 'search' ? '' : 'search')}
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search Value"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className={`clean-input w-full ${theme === 'dark' ? 'dark' : ''}`}
                disabled={isAnimating}
              />
              <div className="flex flex-wrap gap-2">
                <button onClick={linearSearch} disabled={isAnimating} className="magic-btn cursor-pointer bg-indigo-500 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors">
                  Linear Search
                </button>
                <button onClick={binarySearch} disabled={isAnimating} className="magic-btn cursor-pointer bg-violet-500 hover:bg-violet-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors">
                  Binary Search
                </button>
              </div>
            </div>
          </OperationSection>

          <OperationSection
            theme={theme}
            title="Sorting Algorithms"
            isExpanded={expandedSection === 'sort'}
            onToggle={() => setExpandedSection(expandedSection === 'sort' ? '' : 'sort')}
          >
            <div className="flex flex-wrap gap-2">
              <button onClick={bubbleSort} disabled={isAnimating} className="magic-btn cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors">
                Bubble Sort
              </button>
              <button onClick={insertionSort} disabled={isAnimating} className="magic-btn cursor-pointer bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors">
                Insertion Sort
              </button>
              <button onClick={selectionSort} disabled={isAnimating} className="magic-btn cursor-pointer bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors">
                Selection Sort
              </button>
            </div>
          </OperationSection>
        </div>

        {currOperation !== 'none' && ALGORITHMS[currOperation] && (
          <AlgorithmInfo
            theme={theme}
            algorithm={ALGORITHMS[currOperation]}
            showCode={showCode}
            showInfo={showInfo}
            onToggleCode={() => setShowCode(!showCode)}
            onToggleInfo={() => setShowInfo(!showInfo)}
          />
        )}

        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'} mt-6 rounded-lg shadow-sm p-4`}>
          <h4 className="text-sm font-semibold mb-3">Color Legend</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm">Default</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Found/Sorted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualizer;
