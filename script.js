// Initialize toast
const toast = new bootstrap.Toast(document.getElementById('notificationToast'));

// Character count handlers
document.getElementById('normalMessage').addEventListener('input', function() {
    document.getElementById('normalMessageCount').textContent = this.value.length;
});

document.getElementById('secretMessage').addEventListener('input', function() {
    document.getElementById('secretMessageCount').textContent = this.value.length;
});

// Copy to clipboard function
async function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).value;
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Success', 'Text copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Error', 'Failed to copy text', 'error');
    }
}

// Show notification function
function showNotification(title, message, type = 'info') {
    const toastElement = document.getElementById('notificationToast');
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;
    
    // Remove existing classes
    toastElement.classList.remove('bg-success', 'bg-danger', 'bg-info');
    
    // Add appropriate class based on type
    if (type === 'success') toastElement.classList.add('bg-success', 'text-white');
    if (type === 'error') toastElement.classList.add('bg-danger', 'text-white');
    if (type === 'info') toastElement.classList.add('bg-info', 'text-white');
    
    toast.show();
}

// Enhanced encode function with loading state
async function encodeMessage() {
    const encodeBtn = document.getElementById('encodeBtn');
    const spinner = encodeBtn.querySelector('.spinner-border');
    const btnText = encodeBtn.querySelector('.btn-text');
    
    try {
        // Show loading state
        spinner.classList.remove('d-none');
        btnText.classList.add('d-none');
        encodeBtn.disabled = true;
        
        const normalMessage = document.getElementById('normalMessage').value;
        const secretMessage = document.getElementById('secretMessage').value;
        
        if (!normalMessage || !secretMessage) {
            throw new Error('Please fill in both messages');
        }
        
        // Convert secret message to binary
        const binarySecret = stringToBinary(secretMessage);
        
        // Encode the secret message
        const encodedText = encodeWithZeroWidth(normalMessage, binarySecret);
        
        document.getElementById('encodedMessage').value = encodedText;
        showNotification('Success', 'Message encoded successfully!', 'success');
        
    } catch (error) {
        showNotification('Error', error.message, 'error');
    } finally {
        // Reset loading state
        spinner.classList.add('d-none');
        btnText.classList.remove('d-none');
        encodeBtn.disabled = false;
    }
}

// Enhanced decode function with loading state
async function decodeMessage() {
    const decodeBtn = document.getElementById('decodeBtn');
    const spinner = decodeBtn.querySelector('.spinner-border');
    const btnText = decodeBtn.querySelector('.btn-text');
    
    try {
        // Show loading state
        spinner.classList.remove('d-none');
        btnText.classList.add('d-none');
        decodeBtn.disabled = true;
        
        const encodedText = document.getElementById('encodedMessage').value;
        
        if (!encodedText) {
            throw new Error('Please enter the encoded message');
        }
        
        // Extract and decode the message
        const binaryMessage = extractBinaryFromZeroWidth(encodedText);
        const decodedMessage = binaryToString(binaryMessage);
        
        if (!decodedMessage) {
            throw new Error('No hidden message found');
        }
        
        document.getElementById('decodedMessage').value = decodedMessage;
        showNotification('Success', 'Message decoded successfully!', 'success');
        
    } catch (error) {
        showNotification('Error', error.message, 'error');
    } finally {
        // Reset loading state
        spinner.classList.add('d-none');
        btnText.classList.remove('d-none');
        decodeBtn.disabled = false;
    }
}

function stringToBinary(str) {
    return str.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('');
}

function binaryToString(binary) {
    const bytes = binary.match(/.{1,8}/g) || [];
    return bytes.map(byte => 
        String.fromCharCode(parseInt(byte, 2))
    ).join('');
}

function encodeWithZeroWidth(text, binary) {
    const zeroWidth = {
        '0': '\u200B', // Zero-width space
        '1': '\u200C'  // Zero-width non-joiner
    };
    
    const encodedBinary = binary.split('').map(bit => zeroWidth[bit]).join('');
    return text + encodedBinary;
}

function extractBinaryFromZeroWidth(text) {
    const zeroWidth = {
        '\u200B': '0', // Zero-width space
        '\u200C': '1'  // Zero-width non-joiner
    };
    
    return text.split('').map(char => zeroWidth[char] || '').join('');
}