// Obtendo elementos do DOM
const form = document.getElementById('ticket-form');  // Formulário do ticket
const areaUpload = document.getElementById('area-upload');  // Área para upload do avatar
const inputArquivo = document.getElementById('input-arquivo');  // Input de arquivo (avatar)
const uploadImagem = document.getElementById('upload-imagem');  // Imagem carregada
const mensagem = document.getElementById('mensagem');  // Mensagem de instrução
const arquivoAcoes = document.getElementById('arquivo-acoes');  // Ações (remover, mudar) do arquivo
const btnRemover = document.getElementById('btn-remover');  // Botão de remover imagem
const btnMudar = document.getElementById('btn-mudar');  // Botão de mudar imagem
const uploadHint = document.getElementById('upload-hint');  // Dicas de upload

const textosInputs = document.querySelectorAll('.required');  // Todos os inputs obrigatórios

// Objeto para armazenar os dados do formulário
const formData = {
    imagem: '',
    nome: '',
    email: '',
    github: '',
}

// Função para validar os inputs de texto (nome, email, etc)
function validarTextosInputs() {
    let ehValido = true;  // Flag para saber se os campos são válidos

    // Verificando cada input
    textosInputs.forEach(input => {
        const hint = input.nextElementSibling;  // Pegando a dica de cada input

        // Se o campo estiver vazio, marcar como erro
        if (input.value.trim() === '') {
            input.classList.add('error');
            hint.classList.add('error');
            ehValido = false;  // Definindo como inválido
        } else {
            input.classList.remove('error');
            hint.classList.remove('error');
        }
    });

    return ehValido;  // Retorna se todos os campos estão válidos
}

// Função para validar o arquivo (foto)
function validarArquivo(input, hint) {
    const arquivo = inputArquivo.files[0];  // Obtendo o arquivo carregado
    let ehValido = true;

    // Se não houver arquivo
    if (!arquivo) {
        hint.classList.add('error');
        hint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                          <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
                          </svg> Por favor, faça o upload de uma imagem.`;
        ehValido = false;
    } else {
        const tiposValidos = ['image/jpeg', 'image/png'];  // Tipos de imagem permitidos
        const tamanhoMaximo = 500 * 1024;  // Tamanho máximo de 500KB

        // Se o arquivo não for do tipo correto
        if (!tiposValidos.includes(arquivo.type)) {
            hint.classList.add('error');
            hint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                              <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
                              filetype upload a JPG or PNG photo.`;
            input.value = '';  // Limpa o input
            ehValido = false;
        } else if (arquivo.size > tamanhoMaximo) {
            // Se o arquivo for muito grande
            hint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                              <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
                              Arquivo muito grande. Por favor, faça o upload de uma foto com menos de 500KB.`;
            input.value = '';  // Limpa o input
            ehValido = false;
        } else {
            hint.classList.remove('error');
            hint.innerHTML = `<img src="assets/images/icon-info.svg" alt=""> Faça o upload da sua foto (JPG or PNG, tamanho máximo: 500KB).`;
            displayUploadImagem(arquivo);  // Exibe a imagem
        }
    }
    return ehValido;  // Retorna se o arquivo é válido
}

// Função para exibir a imagem carregada
function displayUploadImagem(arquivo) {
    const leitura = new FileReader();

    leitura.onload = e => {
        uploadImagem.src = e.target.result;  // Define a imagem para visualização
        arquivoAcoes.classList.add('show');  // Exibe as ações de arquivo
        mensagem.classList.add('hide');  // Esconde a mensagem de instrução
    }

    leitura.readAsDataURL(arquivo);  // Lê o arquivo como URL
}

// Função para resetar o upload
function resetUpload() {
    const defaultUploadIcon = `images/icon-upload.svg`;
    inputArquivo.value = '';  // Limpa o input
    uploadImagem.src = defaultUploadIcon;  // Restaura o ícone padrão
    mensagem.classList.add('hide');  // Esconde a mensagem
    arquivoAcoes.classList.remove('show');  // Esconde as ações
    uploadHint.classList.remove('error');  // Remove erro
    uploadHint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                            <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
                            Upload a photo (JPG or PNG, max size: 500KB).`;
}

// Função para armazenar e exibir os dados do formulário
function armazenarEdisplayFormData() {
    formData.imagem = uploadImagem.src;
    formData.nome = document.getElementById('full-name').value.trim();
    formData.email = document.getElementById('email').value.trim();
    formData.github = document.getElementById('github').value.trim();

    console.log('formData.imagem:', formData.imagem);  // Exibe no console para depuração

    // Exibe os dados no ticket gerado
    document.getElementById('header-name').textContent = formData.nome;
    document.getElementById('display-name').textContent = formData.nome;
    document.getElementById('display-email').textContent = formData.email;
    document.getElementById('display-github').textContent = formData.github;
    document.getElementById('display-imagem').src = formData.imagem;
}

// Evento de envio do formulário
form.addEventListener('submit', e => {
    e.preventDefault();  // Impede o envio padrão do formulário

    console.log('Form submitted');  // Log para depuração

    // Valida os inputs de texto e o arquivo
    const ehValidoTexto = validarTextosInputs();
    const ehValidoArquivo = validarArquivo(inputArquivo, uploadHint);

    console.log('ehValidoTexto:', ehValidoTexto);  // Log para depuração
    console.log('ehValidoArquivo:', ehValidoArquivo);  // Log para depuração

    // Se os dados forem válidos, exibe os dados do ticket e envia por email
    if (ehValidoTexto && ehValidoArquivo) {
        armazenarEdisplayFormData();  // Armazena e exibe os dados
        document.getElementById('form-conteudo').classList.add('hide');  // Esconde o formulário
        document.getElementById('display-data').style.display = 'block';  // Exibe o ticket gerado

        // Parâmetros para envio por email
        const templateParametros = {
            user_name: formData.nome,
            user_email: formData.email,
            user_github: formData.github,
            id_ingresso: "#01609",
        };

        // Envia os dados do ticket via EmailJS
        emailjs.send("service_4e26szr", "template_hfirvit", templateParametros)
            .then(response => {
                console.log('Ticket sent successfully', response);  // Sucesso no envio
            })
            .catch(error => {
                console.error("Error sending ticket", error);  // Erro no envio
            });
    }
});

// Eventos para interação com o upload de arquivo
areaUpload.addEventListener('click', () => {
    inputArquivo.click();  // Abre o seletor de arquivos ao clicar na área de upload
});

areaUpload.addEventListener('dragover', (e) => e.preventDefault());  // Impede o comportamento padrão de arrastar

areaUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    const arquivos = e.dataTransfer.files;  // Obtém os arquivos arrastados
    if (arquivos.length > 1) {
        const DT = new DataTransfer();
        DT.items.add(arquivos[0]);
        inputArquivo.files = DT.arquivos;  // Ajusta o arquivo para upload
        validarArquivo(inputArquivo, uploadHint);  // Valida o arquivo
    }
});

inputArquivo.addEventListener('change', () => {
    validarArquivo(inputArquivo, uploadHint);  // Valida o arquivo após a seleção
});

btnRemover.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetUpload();  // Reseta o upload
});

btnMudar.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputArquivo.click();  // Abre o seletor de arquivos para mudar a imagem
});
