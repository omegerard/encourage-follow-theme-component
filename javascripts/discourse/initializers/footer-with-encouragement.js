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
      api.decorateWidget("post:after", (helper) => {
        console.log("post widget gedecoreerd");

        const currentUser = User.current();

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
	
        // Controleer of de categorie 'GiPSo in beweging' is
	if (topicCategory === 55) {
	  console.log("Juiste categorie!")
          if (!currentUser) {
            // Niet-geregistreerde gebruikers
            return helper.rawHtml(`
              <div class="gipsoinbeweging-cta">
                <p>Ben je geïnteresseerd in onze updates? <strong>Registreer je nu</strong> om berichten rechtstreeks in je e-mail te ontvangen!</p>
              </div>
            `);
          } else if (
            !currentUser.trackingCategories ||
            !currentUser.trackingCategories.includes(helper.attrs.categoryId)
          ) {
            // Geregistreerde gebruikers die de categorie niet volgen
            return helper.rawHtml(`
              <div class="gipsoinbeweging-cta">
                <p>Volg deze categorie om geen enkele update te missen! Klik op de knop <strong>"Volgen"</strong> bovenaan deze pagina.</p>
              </div>
            `);
          }
        }
      });
    });
  },
};

