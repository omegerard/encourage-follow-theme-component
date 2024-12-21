import User from "discourse/models/user";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "footer-with-encouragement",

  initialize() {
    console.log("My GiPSo Discourse Theme Component voor een specifieke footer werkt!");

    // Gebruik withPluginApi om de API te injecteren
    withPluginApi("0.8", (api) => {
      console.log("Plugin API beschikbaar!");

      // Gebruik decorateWidget om een extra sectie toe te voegen aan de footer
      api.decorateWidget("post:after", async (helper) => {
        console.log("Widget post:after gedecoreerd");

        // Controleer of we in een topic-context zitten
        const topic = helper.widget.attrs.topic;
        if (!topic) {
          console.log("Geen topic-context beschikbaar.");
          return null; // Return expliciet null om niets toe te voegen
        }

        const topicCategory = topic.category_id; // Hier halen we de categorie op
        console.log("Categorie ID:", topicCategory);

        const currentUser = User.current();
        console.log("Huidige gebruiker:", currentUser);

        // Controleer of de gebruiker "trackingCategories" beschikbaar heeft
        if (!currentUser?.trackingCategories || !Array.isArray(currentUser.trackingCategories)) {
          console.warn("Trackingcategorieën zijn niet beschikbaar of niet geladen.");
          return null; // Return expliciet null om niets toe te voegen
        }

        console.log("Gebruiker volgt deze categorieën:", currentUser.trackingCategories);

        // Voeg hier je logica toe voor het tonen van content
        if (topicCategory === 55) {
          console.log("Juiste categorie!");

          // Voor demonstratie: toon een eenvoudige boodschap
          return helper.rawHtml(`
            <div class="gipso-footer-message">
              <p>Bedankt voor het lezen van GiPSo-informatie!</p>
            </div>
          `);
        }

        // Return null als er geen inhoud wordt toegevoegd
        return null;
      });
    });
  },
};

