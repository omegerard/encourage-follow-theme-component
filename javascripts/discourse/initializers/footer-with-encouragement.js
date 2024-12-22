import User from "discourse/models/user";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "footer-with-encouragement",

  async initialize() {
    console.log("My GiPSo Discourse Theme Component voor een specifieke footer werkt!");

    // Gebruik withPluginApi om de API te injecteren
    await withPluginApi("0.8", async (api) => {
      console.log("Plugin API beschikbaar!");
      async (helper) => {
      // Gebruik decorateWidget om een extra sectie toe te voegen aan de footer
        console.log("Widget post:after gedecoreerd");

        // Controleer of we in een topic-context zitten
        const topic = helper.widget.attrs.topic;
        if (!topic) {
          console.log("Geen topic-context beschikbaar.");
          return;
        }

        const topicCategory = topic.category_id; // Hier halen we de categorie op
        console.log("Categorie ID:", topicCategory);

        const currentUser = User.current();
        console.log("Huidige gebruiker:", currentUser);

        // Controleer of we de juiste categorie volgen
        try {
          const watchedCategoryIds = currentUser.notifications
            ? currentUser.notifications.watched_category_ids || []
            : [];

          console.log("Volgde categorieën:", watchedCategoryIds);

          // Scenario 4: Categorie 55 wordt niet gevolgd, toon boodschap
          if (!watchedCategoryIds.includes(topicCategory)) {
            console.log("Categorie wordt niet gevolgd. Toon aangepaste boodschap.");
          }
        } catch (error) {
          console.error("Fout bij ophalen van categorieën:", error);
        }
      };
    });
  },
};

