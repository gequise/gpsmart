const sendBtn = document.getElementById('sendBtn');
const addDirectionBtn = document.getElementById('addDirectionBtn');
const directionsContainer = document.getElementById('directionsContainer');
const messagesDiv = document.getElementById('messages');

let messages = [];

sendBtn.addEventListener('click', sendMessage);
addDirectionBtn.addEventListener('click', addDirectionInput);

function addDirectionInput() {
    const directionItems = directionsContainer.querySelectorAll('.direction-item');
    const newIndex = directionItems.length + 1;
    
    const newItem = document.createElement('div');
    newItem.className = 'direction-item';
    newItem.innerHTML = `
        <span class="direction-number">${newIndex}</span>
        <input type="text" class="directionInput form-input" placeholder="Ingresa la dirección">
    `;
    
    directionsContainer.appendChild(newItem);
}

function sendMessage() {
    const startingPoint = document.getElementById('startingPoint').value.trim();
    const directionInputs = directionsContainer.querySelectorAll('.directionInput');
    const directions = Array.from(directionInputs).map(input => input.value.trim()).filter(dir => dir !== '');

    if (!startingPoint) {
        alert('Ingresa el punto de partida.');
        return;
    }

    if (directions.length < 1) {
        alert('Ingresa al menos 1 dirección intermedia.');
        return;
    }

    const userMessage = `Partida: ${startingPoint} | Direcciones a visitar: ${directions.join(', ')}`;

    // Add user message
    addMessage('user', userMessage);
    messages.push({ role: 'user', content: userMessage });

    // Clear inputs
    document.getElementById('startingPoint').value = '';
    directionInputs.forEach(input => input.value = '');

    // Call local server
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: messages,
            startingPoint: startingPoint,
            directions: directions
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            addMessage('assistant', `Error: ${data.error}`);
        } else {
            const assistantMessage = data.choices[0].message.content;
            addMessage('assistant', assistantMessage);
            messages.push({ role: 'assistant', content: assistantMessage });
        }
    })
    .catch(error => {
        addMessage('assistant', `Error: ${error.message}`);
    });
}

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    // Convert text line breaks into paragraphs and preserve formatting
    let processedContent = content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');

    // If this message includes a final route link, format it as card
    const isRouteMessage = content.includes('✅ La ruta optimizada es:') || content.includes('Enlace Google Maps:');
    
    if (isRouteMessage) {
        messageDiv.classList.add('route-message');
        // Remove URL and "Enlace para copiar" text from visible text
        processedContent = processedContent.replace(/Enlace para copiar o click \(Google Maps\):\s*<br>\s*/gi, '');
        processedContent = processedContent.replace(/https:\/\/www\.google\.com\/maps\/dir[^\s<)]+/g, '');
        // Clean up extra line breaks left by URL removal
        processedContent = processedContent.replace(/<br>\s*<br>/g, '<br>');
        processedContent = processedContent.trim();
    } else {
        // Convert URLs to clickable links for non-route messages
        processedContent = processedContent.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    messageDiv.innerHTML = processedContent;

    // Add action buttons for route messages
    if (isRouteMessage) {
        // Buscar URLs https://
        const linkMatch = content.match(/https:\/\/www\.google\.com\/maps\/dir[^\s)]+/);
        
        if (linkMatch) {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'route-buttons';
            
            // "Ir Ahora" button - primary action
            const goBtn = document.createElement('a');
            goBtn.href = linkMatch[0];
            goBtn.target = '_blank';
            goBtn.rel = 'noopener noreferrer';
            goBtn.className = 'btn-go-now';
            goBtn.innerHTML = '<i class="fas fa-navigation"></i> Ir Ahora';
            buttonsContainer.appendChild(goBtn);
            
            // Copy link button - secondary action
            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn-copy-link';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar enlace';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(linkMatch[0]).then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado';
                    setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar enlace'; }, 1600);
                }).catch(() => {
                    copyBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
                });
            });
            buttonsContainer.appendChild(copyBtn);
            
            messageDiv.appendChild(buttonsContainer);
        }
    }

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
