import User from "discourse/models/user";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "footer-with-encouragement",

  async initialize() {
    console.log("My GiPSo Discourse Theme Component voor een specifieke footer werkt!");

    // Gebruik withPluginApi om de API te injecteren
    await withPluginApi("0.8", async (api) => {
      console.log("Plugin API beschikbaar!");
await api.decorateWidget("post:after", async (helper) => {
    console.log("Widget post:after gedecoreerd");

    // Controleer de inhoud van helper
    console.log("Helper object:", helper);

    const topic = helper.widget.attrs.topic;
    if (!topic) {
        console.log("Geen topic-context beschikbaar.");
        return;
    }

    const topicCategory = topic.category_id;
    const currentUser = User.current();

    try {
        const watchedCategoryIds = currentUser.notifications
            ? currentUser.notifications.watched_category_ids || []
            : [];

        console.log("Volgde categorieën:", watchedCategoryIds);

        if (!watchedCategoryIds.includes(topicCategory)) {
            console.log("Categorie wordt niet gevolgd. Toon aangepaste boodschap.");
            
            // Probeer de widget direct te bewerken
            helper.widget = {
                ...helper.widget,
                content: `<div class="gipso-footer-cta">
                    <p>Volg deze categorie om geen enkele update te missen! Klik op de knop
                    <strong>"Volgen"</strong> bovenaan deze pagina.</p>
                </div>`
            };
        }
    } catch (error) {
        console.error("Fout bij ophalen van categorieën:", error);
    }
});

    });
  },
};

