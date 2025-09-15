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
        setLastResponse(data.aiResponse);
        setAiInput('');
        // Optionally refresh the todo list in the other card
      } else {
        setLastResponse('Error: Could not process request');
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
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            borderLeft: '4px solid #28a745'
          }}>
            <div style={{fontSize: '12px', color: '#6c757d', marginBottom: '4px'}}>
              AI Generated:
            </div>
            <div style={{color: '#212529', fontStyle: 'italic'}}>
              "{lastResponse}"
            </div>
            <div style={{fontSize: '11px', color: '#28a745', marginTop: '4px'}}>
              ✅ Added to your todo list
            </div>
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