import User from "discourse/models/user";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "footer-with-encouragement",

  initialize() {
    console.log("My GiPSo Discourse Theme Component wordt geïnitialiseerd!");

    withPluginApi("0.8", (api) => {
      console.log("Plugin API succesvol geladen!");

      api.decorateWidget("post:after", async (helper) => {
        console.log("Widget post:after wordt aangeroepen!");

        // Controleer of er een topic beschikbaar is
        const topic = helper.widget.attrs.topic;
        if (!topic) {
          console.log("Geen topic-context beschikbaar. Return null.");
          return null;
        }

        // Haal de categorie-ID van het topic op
        const topicCategory = topic.category_id;
        console.log("Categorie-ID van dit topic:", topicCategory);

        // Controleer of het topic in categorie 55 valt
        if (topicCategory !== 55) {
          console.log("Dit topic hoort niet bij categorie 55. Geen boodschap tonen.");
          return null;
        }

        // Haal de huidige gebruiker op
        const currentUser = User.current();
        if (!currentUser) {
          console.log("Niet-geregistreerde gebruiker. Toon algemene boodschap.");
          return helper.rawHtml(`
            <div class="gipso-footer-cta">
              <p>
                Registreer je om updates rechtstreeks in je inbox te ontvangen!
                <a href="/signup" class="btn btn-primary">Registreer nu</a>
              </p>
            </div>
          `);
        }

        console.log("Ingelogde gebruiker:", currentUser);

        // Controleer of de gebruiker categorie 55 observeert
        let isWatchingCategory = false;
        try {
          const response = await fetch(`/u/${currentUser.username}/notifications.json`);
          const notifications = await response.json();

          console.log("Notificatie-instellingen opgehaald:", notifications);

          if (Array.isArray(notifications.watched_category_ids)) {
            isWatchingCategory = notifications.watched_category_ids.includes(55);
          }
        } catch (error) {
          console.error("Fout bij ophalen van notificatiestatus:", error);
          return null; // Stop de uitvoering als notificatiestatus niet kan worden opgehaald
        }

        // Controleer observatiestatus en toon boodschap indien nodig
        if (isWatchingCategory) {
          console.log("Categorie 55 wordt al geobserveerd. Geen boodschap tonen.");
          return null;
        }

        console.log("Categorie 55 wordt NIET geobserveerd. Toon aangepaste boodschap.");
        const messageHtml = `
          <div class="gipso-footer-cta">
            <p>
              Volg deze categorie om geen enkele update te missen! Klik op de knop
              <strong>"Volgen"</strong> bovenaan deze pagina.
            </p>
          </div>
        `;

        // Controleer dat de boodschap een geldige string is
        if (typeof messageHtml === "string") {
          return helper.rawHtml(messageHtml);
        }

        console.error("Ongeldige boodschap-HTML. Return null.");
        return null;
      });
    });
  },
};

