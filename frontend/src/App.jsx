import React, { useState } from "react";
import axios from "axios";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);

  const uploadPDF = async () => {
    if (!pdfFile) return alert("Please select a PDF file first.");
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData);
      setFilename(res.data.filename);
      
      // Add success message to chat
      const successMessage = {
        id: Date.now(),
        text: `PDF "${pdfFile.name}" uploaded successfully! You can now ask questions about its content.`,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const askQuestion = async () => {
    if (!filename || !question.trim()) {
      return alert("Upload a PDF and ask a question.");
    }

    // Add user question to messages
    const userMessage = {
      id: Date.now(),
      text: question,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    setIsAsking(true);
    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("question", question);

    try {
      const res = await axios.post("http://localhost:8000/ask", formData);
      
      // Add assistant response to messages
      const assistantMessage = {
        id: Date.now() + 1,
        text: res.data.answer,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Ask error:", err);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't process your question. Please try again.",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAsking(false);
      setQuestion("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '900px' }}>
      <div className="chat-container">
        {/* Header */}
        <div className="brand-header">
          <div className="brand-logo">P</div>
          <h5 className="mb-0 fw-semibold">Planet</h5>
          <div className="ms-auto">
            <small className="text-muted">PDF Q&A Assistant</small>
          </div>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
            <div className="upload-icon mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h6 className="mb-2">Upload PDF</h6>
            <p className="text-muted mb-3">
              {pdfFile ? pdfFile.name : "Click to select a PDF file or drag and drop"}
            </p>
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            {pdfFile && (
              <button 
                className="btn-upload" 
                onClick={(e) => {
                  e.stopPropagation();
                  uploadPDF();
                }}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload PDF'}
              </button>
            )}
          </div>
          
          {filename && (
            <div className="upload-success">
              <span className="check-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </span>
              <span>PDF ready for questions</span>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="file-icon mb-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <p>Upload a PDF and start asking questions about its content.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.sender === 'assistant' && (
                  <div className="avatar assistant">AI</div>
                )}
                <div className="message-bubble">
                  {message.text}
                </div>
                {message.sender === 'user' && (
                  <div className="avatar user">U</div>
                )}
              </div>
            ))
          )}
          
          {isAsking && (
            <div className="message assistant">
              <div className="avatar assistant">AI</div>
              <div className="message-bubble">
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-group-custom">
            <input
              type="text"
              className="form-control-custom"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message..."
              disabled={!filename || isAsking}
            />
            <button
              className="send-btn"
              onClick={askQuestion}
              disabled={!filename || !question.trim() || isAsking}
            >
              <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2"/>
              </svg>
            </button>
          </div>
          {!filename && (
            <div className="file-info">
              Please upload a PDF file first to start asking questions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;