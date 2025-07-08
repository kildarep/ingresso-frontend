// A constante SERVER_BASE_URL e a lógica de envio de formulário foram removidas,
// pois o contato agora será feito via WhatsApp.

const pixCodeElement = document.getElementById('pix-code');
const copyPixBtn = document.getElementById('copy-pix-btn');
const copyFeedback = document.getElementById('copy-feedback');

// Função para copiar texto para a área de transferência
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed'; 
  textarea.style.opacity = 0; 
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    return true;
  } catch (err) {
    console.error('Falha ao copiar:', err);
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

// Função para exibir mensagens na tela (ainda útil para o feedback de cópia do PIX)
function showMessage(element, message, type = 'error') {
  const existingMessages = element.parentNode.querySelectorAll('.temp-message');
  existingMessages.forEach(msg => msg.remove());

  const msgDiv = document.createElement('div');
  msgDiv.textContent = message;
  msgDiv.classList.add('temp-message'); 
  msgDiv.style.marginTop = '10px';
  msgDiv.style.padding = '8px';
  msgDiv.style.borderRadius = '5px';
  msgDiv.style.fontWeight = 'bold';
  msgDiv.style.textAlign = 'center'; 

  if (type === 'error') {
    msgDiv.style.backgroundColor = '#ffe0e0'; 
    msgDiv.style.color = '#cc0000'; 
    msgDiv.style.border = '1px solid #cc0000';
  } else if (type === 'success') {
    msgDiv.style.backgroundColor = '#e0ffe0'; 
    msgDiv.style.color = '#008000'; 
    msgDiv.style.border = '1px solid #008000';
  }

  element.parentNode.insertBefore(msgDiv, element); 
  setTimeout(() => msgDiv.remove(), 4000); 
}


copyPixBtn.addEventListener('click', function() {
  const pixCode = pixCodeElement.textContent;
  if (copyToClipboard(pixCode)) {
    copyFeedback.style.display = 'block'; 
    setTimeout(() => {
      copyFeedback.style.display = 'none'; 
    }, 2000);
  } else {
    showMessage(copyPixBtn, 'Erro ao copiar o código PIX. Por favor, tente novamente manualmente.', 'error');
  }
});

// A lógica de envio de formulário foi removida.
// O botão agora é um link direto para o WhatsApp.
