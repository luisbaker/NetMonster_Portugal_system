document.addEventListener('DOMContentLoaded', function() {
  const autor = 'Equipa iBakerServer';
  const anoAtual = new Date().getFullYear();
  const direitosAutoraisSection = document.getElementById('direitosAutorais');
  const paragrafoDireitosAutorais = document.createElement('p');
  paragrafoDireitosAutorais.textContent = `© ${anoAtual} ${autor}. Todos os direitos reservados.`;
  direitosAutoraisSection.appendChild(paragrafoDireitosAutorais);
  const linkToS = document.createElement('a');
  linkToS.href = '/tos.html'; 
  linkToS.textContent = 'Termos de Serviço';
  linkToS.style.marginLeft = '10px'; 
  direitosAutoraisSection.appendChild(linkToS);
  const cookieBanner = document.getElementById('cookie-banner');
  const aceitarCookiesBtn = document.getElementById('aceitar-cookies');
  const recusarCookiesBtn = document.getElementById('recusar-cookies');
  if (!localStorage.getItem('aceitaCookies')) {
        cookieBanner.style.display = 'block';
  }
  aceitarCookiesBtn.addEventListener('click', function() {
    localStorage.setItem('aceitaCookies', 'true');
    cookieBanner.style.display = 'none';
  });
  recusarCookiesBtn.addEventListener('click', function() {
    window.history.back();
  });
});
