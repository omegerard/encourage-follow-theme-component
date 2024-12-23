import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  api.onPageChange(() => {
    const topicElement = document.querySelector(".topic-map");
    if (!topicElement) {
      console.log("Geen topicpagina. Stop de uitvoering.");
      return;
    }

    const targetSection = document.querySelector(".topic-map__additional-contents");
    if (!targetSection) {
      console.warn("Kon .topic-map__additional-contents niet vinden.");
      return;
    }

    const currentUser = api.getCurrentUser();
    if (!currentUser) {
      console.log("Niet-geregistreerde gebruiker. Toon algemene boodschap.");

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

    const categoryBadge = document.querySelector(".badge-category[data-category-id]");
    if (!categoryBadge) {
      console.error("Kon de categoriebadge niet vinden in de DOM.");
      return;
    }

    const topicCategoryId = parseInt(categoryBadge.getAttribute("data-category-id"), 10);
    console.log("Huidige topic categorie:", topicCategoryId);

    // Haal gewatchte categorieën op en voeg de aangepaste boodschap toe indien nodig
    fetchWatchedCategories(currentUser.id).then((watchedCategoryIds) => {
      console.log("Categorieën die worden gevolgd:", watchedCategoryIds);

      if (topicCategoryId === 55 && !watchedCategoryIds.includes(55)) {
        console.log("Geregistreerde gebruiker volgt categorie 55 NIET. Toon aangepaste boodschap.");

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
});


function fetchWatchedCategories(userId) {
  // Controleer of userId geldig is
  if (!userId) {
    console.error("Gebruikers-ID is ongeldig of niet beschikbaar.");
    return Promise.resolve([]);
  }

  // Endpoint-URL voor categorievoorkeuren
  const url = `/u/${userId}/preferences/categories.json`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API-fout: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      // Controleer of de structuur correct is
      if (data.category_notification_levels && data.category_notification_levels.watching) {
        return data.category_notification_levels.watching;
      } else {
        console.warn("Onverwachte datastructuur van API:", data);
        return [];
      }
    })
    .catch((error) => {
      console.error("Fout bij ophalen van gewatchte categorieën:", error);
      return [];
    });
}

