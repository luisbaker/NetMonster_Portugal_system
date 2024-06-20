document.addEventListener("DOMContentLoaded", () => {
	const autor = "Equipa Baker Telekom (AS198590).";
	const informacaoSite = "Site feito em Portugal 🇵🇹. Hospedado na Europa 🇪🇺.";
	const anoAtual = new Date().getFullYear();
	const direitosAutoraisSection = document.getElementById("direitosAutorais");

	const paragrafoAutor = document.createElement("p");
	paragrafoAutor.textContent = autor;
	direitosAutoraisSection.appendChild(paragrafoAutor);

	const paragrafoInformacaoSite = document.createElement("p");
	paragrafoInformacaoSite.textContent = informacaoSite;
	direitosAutoraisSection.appendChild(paragrafoInformacaoSite);
	const paragrafoDireitosAutorais = document.createElement("p");
	paragrafoDireitosAutorais.textContent = `© ${anoAtual} Todos os direitos reservados.`;
	direitosAutoraisSection.appendChild(paragrafoDireitosAutorais);

	const linkToS = document.createElement("a");
	linkToS.href = "/tos.html";
	linkToS.textContent = "Termos de Serviço";
	linkToS.style.marginLeft = "10px";
	direitosAutoraisSection.appendChild(linkToS);

	const cookieBanner = document.getElementById("cookie-banner");
	const aceitarCookiesBtn = document.getElementById("aceitar-cookies");
	const recusarCookiesBtn = document.getElementById("recusar-cookies");

	if (!localStorage.getItem("aceitaCookies")) {
		cookieBanner.style.display = "block";
	}

	aceitarCookiesBtn.addEventListener("click", () => {
		localStorage.setItem("aceitaCookies", "true");
		cookieBanner.style.display = "none";
	});

	recusarCookiesBtn.addEventListener("click", () => {
		window.history.back();
	});
});
