// ATENÇÃO: Você precisará ATUALIZAR esta URL depois de implantar seu backend no Render.
// Ela será algo como: https://nome-do-seu-backend.onrender.com
const SERVER_BASE_URL = 'https://SUA_URL_DO_BACKEND_AQUI.onrender.com'; 

const form = document.getElementById('form-compra');
const mensagem = document.getElementById('mensagem-sucesso');
const pixCodeElement = document.getElementById('pix-code');
const copyPixBtn = document.getElementById('copy-pix-btn');
const copyFeedback = document.getElementById('copy-feedback');

// Função para copiar texto para a área de transferência
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed'; // Evita rolagem
  textarea.style.opacity = 0; // Torna invisível
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

// Função para exibir mensagens na tela (substitui alert)
function showMessage(element, message, type = 'error') {
  // Remover mensagens existentes para evitar acúmulo
  const existingMessages = element.parentNode.querySelectorAll('.temp-message');
  existingMessages.forEach(msg => msg.remove());

  const msgDiv = document.createElement('div');
  msgDiv.textContent = message;
  msgDiv.classList.add('temp-message'); // Adiciona uma classe para fácil remoção
  msgDiv.style.marginTop = '10px';
  msgDiv.style.padding = '8px';
  msgDiv.style.borderRadius = '5px';
  msgDiv.style.fontWeight = 'bold';
  msgDiv.style.textAlign = 'center'; // Centraliza a mensagem

  if (type === 'error') {
    msgDiv.style.backgroundColor = '#ffe0e0'; // Vermelho claro
    msgDiv.style.color = '#cc0000'; // Vermelho escuro
    msgDiv.style.border = '1px solid #cc0000';
  } else if (type === 'success') {
    msgDiv.style.backgroundColor = '#e0ffe0'; // Verde claro
    msgDiv.style.color = '#008000'; // Verde escuro
    msgDiv.style.border = '1px solid #008000';
  }

  // Insere a mensagem antes do elemento, para que apareça acima do formulário/botão
  element.parentNode.insertBefore(msgDiv, element); 
  setTimeout(() => msgDiv.remove(), 4000); // Remove a mensagem após 4 segundos
}


// Event listener para o botão de copiar PIX
copyPixBtn.addEventListener('click', function() {
  const pixCode = pixCodeElement.textContent;
  if (copyToClipboard(pixCode)) {
    copyFeedback.style.display = 'block'; // Mostra a mensagem de feedback
    setTimeout(() => {
      copyFeedback.style.display = 'none'; // Esconde a mensagem após 2 segundos
    }, 2000);
  } else {
    showMessage(copyPixBtn, 'Erro ao copiar o código PIX. Por favor, tente novamente manualmente.', 'error');
  }
});

form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const nome = form.nome.value.trim();
  const celular = form.celular.value.trim();

  // Validação do nome: apenas letras e espaços (com acentos)
  const nomeValido = /^[A-Za-zÀ-ÿ\s]+$/.test(nome);
  if (!nome || !nomeValido) {
    showMessage(form, 'Por favor, preencha seu nome corretamente, apenas letras e espaços.', 'error');
    return;
  }

  // Limpa o celular para conter apenas números
  const celularLimpo = celular.replace(/\D/g, '');
  if (celularLimpo.length !== 11) {
    showMessage(form, 'Por favor, insira um número de celular válido com DDD (11 dígitos).', 'error');
    return;
  }

  try {
    // Use a URL completa do seu serviço Render
    const resposta = await fetch(`${SERVER_BASE_URL}/comprar-ingresso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ nome, celular })
    });

    if (resposta.ok) {
      form.style.display = 'none';
      mensagem.style.display = 'block';
      form.reset(); // Limpa o formulário após o sucesso
    } else {
      showMessage(form, 'Erro ao enviar os dados. Tente novamente.', 'error');
    }
  } catch (erro) {
    console.error('Erro de rede:', erro);
    showMessage(form, 'Erro ao conectar com o servidor. Verifique sua conexão ou tente mais tarde.', 'error');
  }
});
