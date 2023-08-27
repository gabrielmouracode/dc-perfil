function openTab(formName) {
    const forms = document.querySelectorAll('.form');
    forms.forEach(tabContent => {
      tabContent.classList.remove('active');
    });
  
    const targetTab = document.getElementById(formName);
    targetTab.classList.add('active');
    const formButtons = document.querySelectorAll('.nav-link');
    formButtons.forEach(formButton => {
      formButton.classList.remove('active');
    });
    const activeButton = document.querySelector(`[onclick="openTab('${formName}')"]`);
    activeButton.classList.add('active');
}
function createTruncatedLinkElement(title, url) {
  const linkDiv = document.createElement("div");
  linkDiv.classList.add("links", "d-flex", "justify-content-between", "bg-body-tertiary", "mb-3");
  
  const iconDiv = document.createElement("div");
  iconDiv.classList.add("links-icon", "bg-primary");
  
  const iconElement = document.createElement("i");
  iconElement.classList.add("bi", "bi-link-45deg", "icon-medium");
  
  const contentDiv = document.createElement("div");
  contentDiv.classList.add("d-flex", "flex-column", "justify-content-center", "px-2", "links-conteudo");
  
  const titleParagraph = document.createElement("p");
  titleParagraph.id = "nameLinksform"
  titleParagraph.classList.add("m-0");
  titleParagraph.textContent = title;
  
  const urlParagraph = document.createElement("p");
  urlParagraph.id = "urlLinksform"
  urlParagraph.classList.add("m-0");
  urlParagraph.textContent = url;
  
  contentDiv.appendChild(titleParagraph);
  contentDiv.appendChild(urlParagraph);
  
  const optionDiv = document.createElement("div");
  optionDiv.classList.add("links-option", "bg-danger");
  
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("bi", "bi-trash-fill", "icon-medium");
  
  optionDiv.appendChild(trashIcon);
  iconDiv.appendChild(iconElement)
  linkDiv.appendChild(iconDiv);
  linkDiv.appendChild(contentDiv);
  linkDiv.appendChild(optionDiv);

  trashIcon.addEventListener("click", async function() {
    var nameElement = linkDiv.querySelector('#nameLinksform'); // Encontra o elemento com o ID nameLinksform
    var urlElement = linkDiv.querySelector('#urlLinksform');
    if (linkDiv) {
      try {
        const response = await fetch('/api/links/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `name=${nameElement.textContent}&url=${urlElement.textContent}`,
        });
    
        if (response.ok){
          linkDiv.remove();
          alerta("alert-success", "Link removido com sucesso.");
        } else {
          alerta("alert-danger", "Erro ao atualizar Link.");
        }
      } catch (error) {
        alerta("alert-danger", "Erro ao atualizar Link.");
      }
    }
  });
  return linkDiv;
}
var trashIcons = document.querySelectorAll('.bi-trash-fill');

trashIcons.forEach(function(icon) {
    icon.addEventListener('click', async function() {
        
        var linksDiv = this.closest('.links');
        var nameElement = linksDiv.querySelector('#nameLinksform'); // Encontra o elemento com o ID nameLinksform
        var urlElement = linksDiv.querySelector('#urlLinksform');
        if (linksDiv) {
          try {
            const response = await fetch('/api/links/remove', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: `name=${nameElement.textContent}&url=${urlElement.textContent}`,
            });
        
            if (response.ok){
              linksDiv.remove();
              alerta("alert-success", "Link removido com sucesso.");
            } else {
              alerta("alert-danger", "Erro ao atualizar Link.");
            }
          } catch (error) {
            alerta("alert-danger", "Erro ao atualizar Link.");
          }
        }
    });
});

function alerta(type, message){
  var alertDiv = document.createElement('div');
  alertDiv.classList.add('alert', type, 'position-fixed', 'top-0', 'end-0', 'm-3');
  alertDiv.innerHTML = message;

  // Adicione o alerta à página
  var body = document.querySelector('body');
  body.appendChild(alertDiv);
  setTimeout(function() {
    alertDiv.remove(); // Ocultar o alerta após 3 segundos
  }, 3000);
}
const salvarMudancasBtn = document.getElementById('addlink');
const modalInput = document.getElementById('nome-url');
const modalInput2 = document.getElementById('links-url');
const resultadoTexto = document.getElementById('resultadoTexto');
const modalElement = new bootstrap.Modal(document.getElementById('myModal'));

salvarMudancasBtn.addEventListener('click', async function() {
    if(modalInput.value && modalInput2.value){
      const links = document.querySelectorAll('.links');
      if(links.length >= 3){
        alerta("alert-danger", "Número máximo de links atingido.")
        modalInput.value = ''
        modalInput2.value = ''
        modalElement.hide();
        return
      }
      try {
        const response = await fetch('/api/links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `name=${modalInput.value}&url=${modalInput2.value}`,
        });
    
        if (response.ok){
          const linksContainer = document.getElementById("links");
          const newLink = createTruncatedLinkElement(modalInput.value, modalInput2.value);
          linksContainer.appendChild(newLink);
          modalInput.value = ''
          modalInput2.value = ''    
          modalElement.hide();
          alerta("alert-success", "Link gerado com sucesso.");
        } else {
          alerta("alert-danger", "Erro ao atualizar Link.");
          modalElement.hide();
        }
      } catch (error) {
        alerta("alert-danger", "Erro ao atualizar Link.");
        modalElement.hide();
      }
      
    }
    
});

async function saveInfo(){
  var inputName = document.getElementById("username");
  var inputUrl = document.getElementById("perfilurl");
  var inputBio = document.getElementById("bio");

  try {
    const response = await fetch('/api/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${inputName.value}&url=${inputUrl.value}&bio=${inputBio.value}`,
    });

    if (response.ok){
      alerta("alert-success", "Informações Atualizada.");
    } else {
      const errorMessage = await response.text();
      if(errorMessage === "URL já em uso."){
        alerta("alert-danger", errorMessage);
      }else{
        alerta("alert-danger", "Erro ao atualizar Informações.");
      }
      
    }
  } catch (error) {
    alerta("alert-danger", "Erro ao atualizar Informações.");
  }
}
async function saveCustomize(){
  var inputAvatar = document.getElementById("urlavatar");
  var inputBanner = document.getElementById("urlbanner");

  try {
    const response = await fetch('/api/customize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `avatar=${inputAvatar.value}&banner=${inputBanner.value}`,
    });

    if (response.ok){
      alerta("alert-success", "Customize Atualizado.");
    } else {
      alerta("alert-danger", "Erro ao atualizar Customize.");
    }
  } catch (error) {
    alerta("alert-danger", "Erro ao atualizar Customize.");
  }
}
async function saveSocial(){
  var inputInstagram = document.getElementById("urlinstagram");
  var inputTwitter = document.getElementById("urltwitter");
  var inputYoutube = document.getElementById("urlyoutube");
  var inputTiktok = document.getElementById("urltiktok");
  var inputGithub = document.getElementById("urlgithub");
  var inputTelegram = document.getElementById("urltelegram");

  try {
    const response = await fetch('/api/social', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `instagram=${inputInstagram.value}&twitter=${inputTwitter.value}&youtube=${inputYoutube.value}&tiktok=${inputTiktok.value}&github=${inputGithub.value}&telegram=${inputTelegram.value}`,
    });

    if (response.ok){
      alerta("alert-success", "Customize Atualizado.");
    } else {

      alerta("alert-danger", "Erro ao atualizar Customize.");
    }
  } catch (error) {
    alerta("alert-danger", "Erro ao atualizar Customize.");
  }
}