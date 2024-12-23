import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  api.onPageChange(() => {
    // Controleer of de pagina een topicpagina is
    const isTopicPage = window.location.pathname.startsWith("/t/");
    if (!isTopicPage) {
      console.log("Geen topicpagina. Script stopt hier.");
      return;
    }

    // Selecteer de juiste sectie waar de tekst moet worden toegevoegd
    const targetSection = document.querySelector(".topic-map__additional-contents");
    if (!targetSection) {
      console.warn("Kon .topic-map__additional-contents niet vinden.");
      return;
    }

    // Controleer eerst of de gebruiker is ingelogd
    const currentUser = api.getCurrentUser();
    if (!currentUser) {
      console.log("Niet-geregistreerde gebruiker. Toon algemene boodschap.");

      // Voeg algemene boodschap toe
      const messageDiv = document.createElement("div");
      messageDiv.className = "custom-message";
      messageDiv.innerHTML = `
        <p>
          Registreer je om geen enkele update te missen! Klik op de knop 
          <strong>"Registreren"</strong> rechtsboven op deze pagina.
        </p>
      `;
      targetSection.appendChild(messageDiv);
      return;
    }

    console.log("Geregistreerde gebruiker gedetecteerd:", currentUser.username);

    // Haal de huidige categorie-ID op uit de DOM
    const categoryElement = document.querySelector("name='data-category-id'");
    const topicCategoryId = categoryElement ? parseInt(categoryElement.content, 10) : null;
    if (!topicCategoryId) {
      console.warn("Kon de categorie-ID niet ophalen.");
      return;
    }

    console.log("Huidige topic categorie:", topicCategoryId);

    // Controleer of de gebruiker categorie 55 volgt
    const watchedCategoryIds = currentUser.notification_levels ? currentUser.notification_levels.watching : [];
    if (topicCategoryId === 55 && !watchedCategoryIds.includes(55)) {
      console.log("Geregistreerde gebruiker volgt categorie 55 NIET. Toon aangepaste boodschap.");

      // Voeg aangepaste boodschap toe
      const messageDiv = document.createElement("div");
      messageDiv.className = "custom-message";
      messageDiv.innerHTML = `
        <div class="gipso-footer-cta">
          <p>
            Volg deze categorie om geen enkele update te missen! Klik op de knop
            <strong>"Volgen"</strong> bovenaan deze pagina.
          </p>
        </div>
      `;
      targetSection.appendChild(messageDiv);
    } else {
      console.log("Categorie 55 wordt gevolgd. Geen extra boodschap nodig.");
    }
  });
});

