document.addEventListener('DOMContentLoaded', function() {
    const autor = 'Equipa iBakerServer';
    const anoAtual = new Date().getFullYear();
  
    // Seção de Direitos Autorais
    const direitosAutoraisSection = document.getElementById('direitosAutorais');
  
    // Cria um parágrafo para exibir as informações de direitos autorais
    const paragrafoDireitosAutorais = document.createElement('p');
    paragrafoDireitosAutorais.textContent = `© ${anoAtual} ${autor}. Todos os direitos reservados.`;
  
    // Adiciona o parágrafo à seção de Direitos Autorais
    direitosAutoraisSection.appendChild(paragrafoDireitosAutorais);
  });
  