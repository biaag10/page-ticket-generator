const form = document.getElementById('ticket-form');

const areaUpload = document.getElementById('area-upload');
const inputArquivo = document.getElementById('input-arquivo');
const uploadImagem = document.getElementById('upload-imagem');
const mensagem = document.getElementById('mensagem');
const arquivoAcoes = document.getElementById('arquivo-acoes');
const btnRemover = document.getElementById('btn-remover');
const btnMudar = document.getElementById('btn-mudar');
const uploadHint = document.getElementById('upload-hint');

const textosInputs = document.querySelectorAll('.required');

const formData = {
    imagem: '',
    nome: '',
    email: '',
    github: '',
}

function validarTextosInputs() {
    let ehValido = true;

    textosInputs.forEach(input => {
        const hint = input.nextElementSibling;

        if (input.value.trim() === '') {
            input.classList.add('error');
            hint.classList.add('error');
            ehValido = false;
        } else {
            input.classList.remove('error');
            hint.classList.remove('error');
        }
    });

    return ehValido;
}

function validarArquivo(input, hint) {
    const arquivo = inputArquivo.files[0];
    let ehValido = true;

    if (!arquivo) {
        hint.classList.add('error');
        hint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
        </svg> Please upload an image.`
        ehValido = false;
    } else {
        const tiposValidos = ['image/jpeg', 'image/png'];
        const tamanhoMaximo = 500 * 1024;

        if (!tiposValidos.includes(arquivo.type)) {
            hint.classList.add('error');
            hint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
            filetype upload a JPG or PNG photo.`
            input.value = '';
            ehValido = false;
        } else if (arquivo.size > tamanhoMaximo) {
            hint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
            File too large. Please upload a photo under 500KB.`;
            input.value = '';
            ehValido = false;
        } else {
            hint.classList.remove('error');
            hint.innerHTML = `<img src="assets/images/icon-info.svg" alt=""> Upload your photo (JPG or PNG, max size: 500KB).`;
            displayUploadImagem(arquivo);
        }
        
    }
    return ehValido;
}

function displayUploadImagem(arquivo) {
    const leitura = new FileReader();

    leitura.onload = e => {
        uploadImagem.src = e.target.result;
        arquivoAcoes.classList.add('show');
        mensagem.classList.add('hide');
    }

    leitura.readAsDataURL(arquivo);
}

function resetUpload() {
    const defaultUploadIcon = `images/icon-upload.svg`;
    inputArquivo.value = '';
    uploadImagem.src = defaultUploadIcon;
    mensagem.classList.add('hide');
    arquivoAcoes.classList.remove('show');
    uploadHint.classList.remove('error');
    uploadHint.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path stroke="#f57261" stroke-linecap="round" stroke-linejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"/>
        Upload a photo (JPG or PNG, max size: 500KB).`
}

function armazenarEdisplayFormData() {
    formData.imagem = uploadImagem.src;
    formData.nome = document.getElementById('full-name').value.trim();
    formData.email = document.getElementById('email').value.trim();
    formData.github = document.getElementById('github').value.trim();

    console.log('formData.imagem:', formData.imagem);

    document.getElementById('header-name').textContent = formData.nome;
    document.getElementById('display-name').textContent = formData.nome;
    document.getElementById('display-email').textContent = formData.email;
    document.getElementById('display-github').textContent = formData.github;
    document.getElementById('display-imagem').src = formData.imagem;

    
}


form.addEventListener('submit', e => {
    e.preventDefault();

    console.log('Form submitted'); // Adicione este log

    const ehValidoTexto = validarTextosInputs();
    const ehValidoArquivo = validarArquivo(inputArquivo, uploadHint);

    console.log('ehValidoTexto:', ehValidoTexto); // Adicione este log
    console.log('ehValidoArquivo:', ehValidoArquivo); // Adicione este log

    if (ehValidoTexto && ehValidoArquivo) {
        armazenarEdisplayFormData();
        document.getElementById('form-conteudo').classList.add('hide');
        document.getElementById('display-data').style.display = 'block';

        const templateParametros = {
            user_name: formData.nome,
            user_email: formData.email,
            user_github: formData.github,
            id_ingresso: "#01609",
        };

        emailjs.send("service_4e26szr", "template_hfirvit", templateParametros)
            .then(response => {
                console.log('Ticket sent successfully', response);
            })
            .catch(error => {
                console.error("Error sending ticket", error);
            });
    }
});

areaUpload.addEventListener('click', () => {
    inputArquivo.click();
})

areaUpload.addEventListener('dragover', (e) => e.preventDefault());

areaUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    const arquivos = e.dataTransfer.files;
    if(arquivos.length > 1) {
        const DT = new DataTransfer();
        DT.items.add(arquivos[0]);
        inputArquivo.files = DT.arquivos;
        validarArquivo(inputArquivo, uploadHint);
    }
})

inputArquivo.addEventListener('change', () => {
    validarArquivo(inputArquivo, uploadHint);
})

btnRemover.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetUpload();
})

btnMudar.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputArquivo.click();
})

