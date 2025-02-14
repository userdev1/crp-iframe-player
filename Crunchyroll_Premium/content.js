var HTML = document.documentElement.innerHTML;

//function que pega algo dentro dentro do html.
function pegaString(str, first_character, last_character) {
	if(str.match(first_character + "(.*)" + last_character) == null){
		return null;
	}else{
	    new_str = str.match(first_character + "(.*)" + last_character)[1].trim()
	    return(new_str)
    }
}
//function que mudar o player para um mais simples.
function importPlayer(){
		console.log("[CR Premium] Removendo player da Crunchyroll...");
		var elem = document.getElementById('showmedia_video_player');
    	elem.parentNode.removeChild(elem);

		console.log("[CR Premium] Pegando dados da stream...");
		var video_config_media = JSON.parse(pegaString(HTML, "vilos.config.media = ", ";"));

    	console.log("[CR Premium] Adicionando o jwplayer...");
    	ifrm = document.createElement("iframe");
    	ifrm.setAttribute("id", "frame"); 
		ifrm.setAttribute("src", "https://userdev1.github.io/crp-iframe-player/"); 
		ifrm.setAttribute("width","100%");
		ifrm.setAttribute("height","100%");
		ifrm.setAttribute("frameborder","0");
		ifrm.setAttribute("scrolling","no");
		ifrm.setAttribute("allowfullscreen","allowfullscreen");
		ifrm.setAttribute("allow","autoplay; encrypted-media *");

		if(document.body.querySelector("#showmedia_video_box") != null){
			document.body.querySelector("#showmedia_video_box").appendChild(ifrm);
		}else{
			document.body.querySelector("#showmedia_video_box_wide").appendChild(ifrm);
		}

		//Remove Nota do topo sobre experimentar o premium
		if (document.body.querySelector(".freetrial-note") != null) {
			console.log("[CR Premium] Removendo Free Trial Note...");
			document.body.querySelector(".freetrial-note").style.display = "none";
		}

		//Remove avisos q o video nn pode ser visto
		if(document.body.querySelector(".showmedia-trailer-notice") != null){
			console.log("[CR Premium] Removendo Trailer Notice...");
			document.body.querySelector(".showmedia-trailer-notice").style.display = "none";
		}

		//Remove sugestão de inscrever-se para o trial gratuito
		if(document.body.querySelector("#showmedia_free_trial_signup") != null){
			console.log("[CR Premium] Removendo Free Trial Signup...");
			document.body.querySelector("#showmedia_free_trial_signup").style.display = "none";
		}

        // Simular interação do usuário para deixar em fullscreen automaticamente
		var element = document.getElementById("template_scroller");
		if (element) element.click();
        
		const series = document.querySelector('meta[property="og:title"]');
		const up_next = document.querySelector('link[rel=next]');
		chrome.storage.sync.get(['aseguir', 'cooldown'], function(items) {
			ifrm.onload = function(){
				ifrm.contentWindow.postMessage({
           			'video_config_media': [JSON.stringify(video_config_media)],
				   	'lang': [pegaString(HTML, 'LOCALE = "', '",')],
				   	'series': series ? series.content : undefined,
				   	'up_next': up_next ? up_next.href : undefined,
				   	'up_next_cooldown': items.cooldown === undefined ? 5 : items.cooldown,
				   	'up_next_enable': items.aseguir === undefined ? true : items.aseguir,
				   	'version': "1.0.3"
        		},"*");
			};
		});

		//console.log(video_config_media);
}
//function ao carregar pagina.
function onloadfunction() {
	if (window.location.href.includes('crunchyroll.com')) {
		console.log('[CR Premium] Source: crunchyroll.com')
		if(pegaString(HTML, "vilos.config.media = ", ";") != null){
			importPlayer();
		}
	} else if (window.location.href.includes('crunchy-dl.com')) {
		console.log('[CR Premium] Source: crunchy-dl.com');

		var actualCode = `
			var baseURL = 'iina://open?url=';
			var url = player.allVideos["1080p"];
			var finalURL = \`\${baseURL}\${url}\`

			var mpcButton_iconPath = "https://userdev1.github.io/crp-iframe-player/assets/icon/external-link.svg";
			var mpcButton_tooltipText = "Abrir no MPC-HC";
			var mpcButtonId = "mpc-hc-button";

			function mpc_ButtonClickAction() {
				player.jw.pause();
				window.open(finalURL, '_blank');
				return;
			}

			player.jw.addButton(mpcButton_iconPath, mpcButton_tooltipText, () => mpc_ButtonClickAction(), mpcButtonId);
		`;
		var script = document.createElement('script');
		script.textContent = actualCode;
		(document.head||document.documentElement).appendChild(script);
		script.remove();
	}
}
document.addEventListener("DOMContentLoaded", onloadfunction());
