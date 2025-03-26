// obtém elementos do DOM
const form = document.getElementById('ticket-form');  
const areaUpload = document.getElementById('area-upload');  
const inputArquivo = document.getElementById('input-arquivo'); 
const uploadImagem = document.getElementById('upload-imagem'); 
const mensagem = document.getElementById('mensagem'); 
const arquivoAcoes = document.getElementById('arquivo-acoes'); 
const btnRemover = document.getElementById('btn-remover');  
const btnMudar = document.getElementById('btn-mudar');  
const uploadHint = document.getElementById('upload-hint');  

const textosInputs = document.querySelectorAll('.required');  // obriga todos os inputs a serem obrigatórios

// objeto para armazenar os dados do formulário
const formData = {
    imagem: '',
    nome: '',
    email: '',
    github: '',
}

// função para validar os inputs de texto
function validarTextosInputs() {
    let ehValido = true;  // flag para saber se os campos são válidos

    // Verificando cada input
    textosInputs.forEach(input => {
        const hint = input.nextElementSibling; 

        // se o campo estiver vazio, marca como erro
        if (input.value.trim() === '') {
            input.classList.add('error');
            hint.classList.add('error');
            ehValido = false;  // definindo como inválido
        } else {
            input.classList.remove('error');
            hint.classList.remove('error');
        }
    });

    return ehValido;  // retorna se todos os campos estão válidos
}

// função para validar o arquivo (foto)
function validarArquivo(input, hint) {
    const arquivo = inputArquivo.files[0];  // obtém o arquivo carregado
    let ehValido = true;

    // se não houver arquivo, reclama de erro
    if (!arquivo) {
        hint.classList.add('error');
        hint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                          <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
                          </svg> Por favor, faça o upload de uma imagem.`;
        ehValido = false;
    } else {
        const tiposValidos = ['image/jpeg', 'image/png'];  // tipos de imagem permitidos
        const tamanhoMaximo = 500 * 1024;  // tamanho máximo de 500KB

        //sSe o arquivo não for do tipo correto
        if (!tiposValidos.includes(arquivo.type)) {
            hint.classList.add('error');
            hint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                              <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
                              filetype upload a JPG or PNG photo.`;
            input.value = '';  // limpa o input
            ehValido = false;
        } else if (arquivo.size > tamanhoMaximo) {
            // se o arquivo for muito grande
            hint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                              <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
                              Arquivo muito grande. Por favor, faça o upload de uma foto com menos de 500KB.`;
            input.value = '';  // limpa o input
            ehValido = false;
        } else {
            hint.classList.remove('error');
            hint.innerHTML = `<img src="assets/images/icon-info.svg" alt=""> Faça o upload da sua foto (JPG or PNG, tamanho máximo: 500KB).`;
            displayUploadImagem(arquivo);  // exibe a imagem
        }
    }
    return ehValido;  // eetorna se o arquivo é válido
}

// função para exibir a imagem carregada
function displayUploadImagem(arquivo) {
    const leitura = new FileReader();

    leitura.onload = e => {
        uploadImagem.src = e.target.result;  // define a imagem para visualização
        arquivoAcoes.classList.add('show');  // exibe as ações de arquivo
        mensagem.classList.add('hide');  // esconde a mensagem de instrução
    }

    leitura.readAsDataURL(arquivo);  // lê o arquivo como URL
}

// função para resetar o upload
function resetUpload() {
    const defaultUploadIcon = `images/icon-upload.svg`;
    inputArquivo.value = '';  // limpa o input
    uploadImagem.src = defaultUploadIcon;  // restaura o ícone padrão
    mensagem.classList.add('hide');  // esconde a mensagem
    arquivoAcoes.classList.remove('show');  // esconde as ações
    uploadHint.classList.remove('error');  // remove erro
    uploadHint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                            <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
                            Upload a photo (JPG or PNG, max size: 500KB).`;
}

// função para armazenar e exibir os dados do formulário
function armazenarEdisplayFormData() {
    formData.imagem = uploadImagem.src;
    formData.nome = document.getElementById('full-name').value.trim();
    formData.email = document.getElementById('email').value.trim();
    formData.github = document.getElementById('github').value.trim();

    console.log('formData.imagem:', formData.imagem); 

    // exibe os dados no ticket gerado
    document.getElementById('header-name').textContent = formData.nome;
    document.getElementById('display-name').textContent = formData.nome;
    document.getElementById('display-email').textContent = formData.email;
    document.getElementById('display-github').textContent = formData.github;
    document.getElementById('display-imagem').src = formData.imagem;
}

// evento de envio do formulário
form.addEventListener('submit', e => {
    e.preventDefault();  // impede o envio padrão do formulário

    console.log('Form submitted');  

    // valida os inputs de texto e o arquivo
    const ehValidoTexto = validarTextosInputs();
    const ehValidoArquivo = validarArquivo(inputArquivo, uploadHint);

    console.log('ehValidoTexto:', ehValidoTexto);  
    console.log('ehValidoArquivo:', ehValidoArquivo);  

    // se os dados forem válidos, exibe os dados do ticket e envia por email
    if (ehValidoTexto && ehValidoArquivo) {
        armazenarEdisplayFormData();  // armazena e exibe os dados
        document.getElementById('form-conteudo').classList.add('hide');  // esconde o formulário
        document.getElementById('display-data').style.display = 'block';  // exibe o ticket gerado

        // parâmetros para envio por e-mail
        const templateParametros = {
            user_name: formData.nome,
            user_email: formData.email,
            user_github: formData.github,
            id_ingresso: "#01609",
        };

        // envia os dados do ticket via EmailJS
        emailjs.send("service_4e26szr", "template_hfirvit", templateParametros)
            .then(response => {
                console.log('Ticket sent successfully', response);  // sucesso no envio
            })
            .catch(error => {
                console.error("Error sending ticket", error);  // erro no envio
            });
    }
});

// eventos para interação com o upload de arquivo
areaUpload.addEventListener('click', () => {
    inputArquivo.click();  // abre o seletor de arquivos ao clicar na área de upload
});

areaUpload.addEventListener('dragover', (e) => e.preventDefault());  // impede o comportamento padrão de arrastar

areaUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    const arquivos = e.dataTransfer.files;  // obtém os arquivos arrastados
    if (arquivos.length > 1) {
        const DT = new DataTransfer();
        DT.items.add(arquivos[0]);
        inputArquivo.files = DT.arquivos;  // ajusta o arquivo para upload
        validarArquivo(inputArquivo, uploadHint);  // valida o arquivo
    }
});

inputArquivo.addEventListener('change', () => {
    validarArquivo(inputArquivo, uploadHint);  // valida o arquivo após a seleção
});

btnRemover.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetUpload();  // reseta o upload
});

btnMudar.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputArquivo.click();  // abre o seletor de arquivos para mudar a imagem
});
