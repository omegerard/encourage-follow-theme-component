// Wacht tot de DOM volledig is geladen
document.addEventListener("DOMContentLoaded", function () {
  // Selecteer de juiste sectie waar de tekst moet worden toegevoegd
  const targetSection = document.querySelector(".topic-map__additional-contents");

  if (targetSection) {
    console.log("Gevonden: .topic-map__additional-contents");

    // Controleer eerst of de gebruiker is ingelogd
    const currentUser = Discourse.User.current();
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
    } else {
      console.log("Geregistreerde gebruiker gedetecteerd:", currentUser.username);

      // Controleer of de gebruiker categorie 55 volgt
      const topicCategoryId = Discourse.Topic.currentCategory.id;
      console.log("Huidige topic categorie:", topicCategoryId);

      const watchedCategoryIds = currentUser.notifications
        ? currentUser.notifications.watched_category_ids || []
        : [];

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
    }
  } else {
    console.warn("Kon .topic-map__additional-contents niet vinden.");
  }
});

