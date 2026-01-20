document.addEventListener('DOMContentLoaded', () => {
    const askBtn = document.getElementById('ask-btn');
    const clearBtn = document.getElementById('clear-btn');
    const questionInput = document.getElementById('question-input');
    const chatHistory = document.getElementById('chat-history');
    const statusIndicator = document.getElementById('status-indicator');

    // Chat history storage
    let conversationHistory = [];

    // Event Listeners
    askBtn.addEventListener('click', handleAsk);
    clearBtn.addEventListener('click', clearConversation);
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
        }
    });

    // Focus input on load
    questionInput.focus();

    async function handleAsk() {
        const question = questionInput.value.trim();
        if (!question) return;

        // Clear welcome message if it exists
        const welcomeMsg = chatHistory.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }

        // Add user message to chat
        addMessage('user', question);

        // Clear input
        questionInput.value = '';

        // UI State: Loading
        askBtn.disabled = true;
        const originalBtnHTML = askBtn.innerHTML;
        askBtn.innerHTML = '<span class="loading-spinner"></span> Asking...';
        updateStatus('loading', 'Processing...');

        // Add temporary "thinking" message
        const thinkingId = addMessage('ai', '💭 Thinking...', true);

        try {
            // Encode the question for the URL parameter
            const encodedQuestion = encodeURIComponent(question);
            const response = await fetch(`/rag?question=${encodedQuestion}`);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.text();

            // Remove thinking message
            removeMessage(thinkingId);

            // Add AI response
            addMessage('ai', data);

            // Update status
            updateStatus('ready', 'Ready');

        } catch (error) {
            // Remove thinking message
            removeMessage(thinkingId);

            // Add error message
            console.error('Error:', error);
            addMessage('ai', `❌ Error: ${error.message}`, false, true);

            // Update status
            updateStatus('error', 'Error occurred');
        } finally {
            // Restore Button
            askBtn.disabled = false;
            askBtn.innerHTML = originalBtnHTML;
            questionInput.focus();
        }
    }

    function addMessage(type, text, isTemporary = false, isError = false) {
        const messageId = `msg-${Date.now()}-${Math.random()}`;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.id = messageId;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const labelDiv = document.createElement('div');
        labelDiv.className = 'message-label';
        labelDiv.textContent = type === 'user' ? 'You' : 'AI Assistant';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;

        if (isError) {
            textDiv.style.color = '#ef4444';
        }

        const timestampDiv = document.createElement('div');
        timestampDiv.className = 'message-timestamp';
        timestampDiv.textContent = new Date().toLocaleTimeString();

        contentDiv.appendChild(labelDiv);
        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(timestampDiv);
        messageDiv.appendChild(contentDiv);

        chatHistory.appendChild(messageDiv);

        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Store in history (unless temporary)
        if (!isTemporary) {
            conversationHistory.push({
                id: messageId,
                type,
                text,
                timestamp: new Date().toISOString()
            });
        }

        return messageId;
    }

    function removeMessage(messageId) {
        const messageElement = document.getElementById(messageId);
        if (messageElement) {
            messageElement.remove();
        }
    }

    function clearConversation() {
        // Confirm before clearing
        if (conversationHistory.length > 0) {
            if (!confirm('Are you sure you want to clear the conversation history?')) {
                return;
            }
        }

        // Clear chat history
        chatHistory.innerHTML = `
            <div class="welcome-message">
                <h2>👋 Welcome to the RAG Testing Interface</h2>
                <p>This interface replaces Postman for testing your Spring AI RAG endpoints.</p>
                <div class="features">
                    <div class="feature-item">
                        <span class="feature-icon">💬</span>
                        <span>Ask questions and get AI-powered responses</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📜</span>
                        <span>View complete conversation history</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">⚡</span>
                        <span>Real-time API testing with visual feedback</span>
                    </div>
                </div>
            </div>
        `;

        // Clear conversation history
        conversationHistory = [];

        // Reset status
        updateStatus('ready', 'Ready');

        // Focus input
        questionInput.focus();
    }

    function updateStatus(state, text) {
        statusIndicator.className = `status-indicator ${state}`;
        const statusText = statusIndicator.querySelector('.status-dot').nextSibling;
        if (statusText) {
            statusText.textContent = ` ${text}`;
        } else {
            statusIndicator.innerHTML = `<span class="status-dot"></span> ${text}`;
        }
    }

    // Initialize status
    updateStatus('ready', 'Ready');
});
