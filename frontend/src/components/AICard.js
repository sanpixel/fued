import React, { useState } from 'react';
import './TodoCard.css'; // Reuse the same styles

const AICard = () => {
  const [aiInput, setAiInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState('');

  const handleAISubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: aiInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiInput('');
        setLastResponse('✅ Todo added successfully!');
        // Clear success message after 2 seconds
        setTimeout(() => setLastResponse(''), 2000);
      } else {
        setLastResponse('❌ Error: Could not process request');
        setTimeout(() => setLastResponse(''), 3000);
      }
    } catch (error) {
      console.error('AI request failed:', error);
      setLastResponse('Error: Network request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="todo-card">
      <div className="card-header">
        <div className="todo-title">🤖 AI Assistant</div>
        <div className="todo-count">Shakespeare</div>
      </div>

      <div className="todo-body">
        <form onSubmit={handleAISubmit} className="add-todo-form">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Tell AI what you need to do..."
            className="todo-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="add-btn"
            disabled={isLoading || !aiInput.trim()}
            style={{
              backgroundColor: isLoading ? '#6c757d' : '#28a745',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>

        {lastResponse && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: lastResponse.includes('✅') ? '#d4edda' : '#f8d7da',
            borderRadius: '4px',
            borderLeft: `4px solid ${lastResponse.includes('✅') ? '#28a745' : '#dc3545'}`,
            textAlign: 'center',
            color: lastResponse.includes('✅') ? '#155724' : '#721c24'
          }}>
            {lastResponse}
          </div>
        )}

        {!lastResponse && (
          <div className="empty-todos">
            Ask AI to create todos for you in Shakespeare style!
          </div>
        )}
      </div>
    </div>
  );
};

export default AICard;