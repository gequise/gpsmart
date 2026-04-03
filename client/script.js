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

    // Convert URLs to clickable links
    processedContent = processedContent.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    // If this message includes a final route link, format it as card
    const isRouteMessage = content.includes('✅ La ruta optimizada es:') || content.includes('Enlace Google Maps:');
    if (isRouteMessage) {
        messageDiv.classList.add('route-message');
    }

    messageDiv.innerHTML = processedContent;

    // Add copy link button for route messages with link
    if (isRouteMessage) {
        const linkMatch = content.match(/https?:\/\/[^\s]+/);
        if (linkMatch) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-link-btn';
            copyBtn.textContent = 'Copiar enlace';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(linkMatch[0]).then(() => {
                    copyBtn.textContent = 'Copiado ✓';
                    setTimeout(() => { copyBtn.textContent = 'Copiar enlace'; }, 1600);
                }).catch(() => {
                    copyBtn.textContent = 'Error copiar';
                });
            });
            messageDiv.appendChild(copyBtn);
        }
    }

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
