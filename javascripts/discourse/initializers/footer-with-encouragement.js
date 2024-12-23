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

    // Haal de notificatieniveaus op voor categorieën
    const watchedCategoryIds = currentUser.notification_levels
      ? currentUser.notification_levels.watching || []
      : [];

    console.log("Gewaakte categorieën:", watchedCategoryIds);

    // Controleer of de huidige categorie 55 is en NIET wordt gevolgd
    if (topicCategoryId === 55 && !watchedCategoryIds.includes(55)) {
      // Voeg aangepaste boodschap toe
      const additionalContent = document.createElement("div");
      additionalContent.className = "gipso-footer-cta";
      additionalContent.innerHTML = `
        <p>
          Volg deze categorie om geen enkele update te missen! Klik op de knop
          <strong>"Volgen"</strong> bovenaan deze pagina.
        </p>
      `;
      document.body.appendChild(additionalContent);
    } else {
      console.log("Categorie 55 wordt gevolgd. Geen extra boodschap nodig.");
    }
  });
});

