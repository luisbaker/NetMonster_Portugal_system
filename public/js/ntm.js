document.addEventListener('DOMContentLoaded', async () => {
    await loadFileList();
    document.getElementById('uploadForm').onsubmit = uploadFile;
    document.getElementById('importButton').onclick = importFile;
});

async function loadFileList() {
    try {
        const response = await fetch('/files');
        const files = await response.json();
        const fileListElement = document.getElementById('files');
        fileListElement.innerHTML = '';

        files.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file;
            li.onclick = () => loadFileContent(file);
            fileListElement.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao carregar arquivos:', error);
    }
}

async function loadFileContent(file) {
    try {
        const response = await fetch(`/files/${file}`);
        const content = await response.text();
        document.getElementById('fileEditor').value = content;
    } catch (error) {
        console.error('Erro ao carregar conteúdo do arquivo:', error);
    }
}

async function uploadFile(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        await loadFileList();
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
    }
}

async function importFile() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecione um arquivo para importar.');
        return;
    }

    const formData = new FormData();
    formData.append('ntmFile', file);

    try {
        const response = await fetch('/import', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Arquivo importado com sucesso.');
            await loadFileList();
        } else {
            alert('Erro ao importar arquivo.');
        }
    } catch (error) {
        console.error('Erro ao importar arquivo:', error);
    }
}
