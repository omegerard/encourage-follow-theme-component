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
    fetchWatchedCategories(currentUser.username).then((watchedCategoryIds) => {
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

const fetchWatchedCategories = async (username) => {
    try {
        const response = await fetch(`/u/${username}/notifications.json`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        // Haal de gevolgde categorie-ID's op
        const watchedCategoryIds = data.user.watched_category_ids;

        if (!watchedCategoryIds || watchedCategoryIds.length === 0) {
            console.log("Geen gevolgde categorieën gevonden.");
            return [];
        }

        console.log("Gevolgde categorieën:", watchedCategoryIds);
        return watchedCategoryIds;

    } catch (error) {
        console.error("Fout bij het ophalen van gevolgde categorieën:", error);
        return [];
    }
};


