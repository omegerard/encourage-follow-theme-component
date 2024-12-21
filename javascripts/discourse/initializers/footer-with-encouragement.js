import User from "discourse/models/user";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "footer-with-encouragement",

  initialize() {
    console.log("My GiPSo Discourse Theme Component wordt geïnitialiseerd!");

    withPluginApi("0.8", (api) => {
      console.log("Plugin API succesvol geladen!");

      api.decorateWidget("post:after", (helper) => {
        console.log("Widget post:after wordt aangeroepen!");

        // Controleer of er een topic beschikbaar is
        const topic = helper.widget.attrs.topic;
        if (!topic) {
          console.log("Geen topic-context beschikbaar. Return null.");
          return null;
        }

        // Log de categorie van het topic
        const topicCategory = topic.category_id;
        console.log("Categorie-ID van dit topic:", topicCategory);

        // Haal de huidige gebruiker op
        const currentUser = User.current();
        console.log("Ingelogde gebruiker:", currentUser);

        // Basisvalidatie van trackingCategories
        const trackingCategories =
          currentUser?.trackingCategories || [];
        console.log("Categorieën die gevolgd worden door de gebruiker:", trackingCategories);

        // Alleen iets toevoegen als het een specifieke categorie is (bijv. ID 55)
        if (topicCategory === 55) {
          if (!currentUser) {
            console.log("Niet-geregistreerde gebruiker. Toon registratieboodschap.");
            return helper.rawHtml(`
              <div class="gipso-footer-cta">
                <p>
                  Registreer je om updates rechtstreeks in je inbox te ontvangen!
                  <a href="/signup" class="btn btn-primary">Registreer nu</a>
                </p>
              </div>
            `);
          } else if (!trackingCategories.includes(topicCategory)) {
            console.log("Geregistreerde gebruiker volgt de categorie niet. Toon volgboodschap.");
            return helper.rawHtml(`
              <div class="gipso-footer-cta">
                <p>Volg deze categorie om geen enkele update te missen!</p>
              </div>
            `);
          }
        }

        // Als geen voorwaarden voldoen, return expliciet null
        console.log("Geen inhoud toegevoegd aan widget.");
        return null;
      });
    });
  },
};
