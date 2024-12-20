import User from "discourse/models/user";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "footer-with-encouragement",

  initialize() {
    console.log("Theme component: footer-with-encouragement geladen!");

    // Gebruik withPluginApi om de API te injecteren
    withPluginApi("0.8", (api) => {
      console.log("Plugin API beschikbaar!");

      // Gebruik decorateWidget om een extra sectie toe te voegen aan de footer
      api.decorateWidget("topic-footer:after", (helper) => {
        console.log("Widget wordt gedecoreerd");

        const currentUser = User.current();
        const categorySlug = helper.attrs.categorySlug;

        // Controleer of het een specifieke categorie is
        if (categorySlug === "gipsonieuws") {
          if (!currentUser) {
            // Niet-geregistreerde gebruikers
            return helper.rawHtml(`
              <div class="cta-gipsonieuws">
                <p>
                  Registreer je om updates rechtstreeks in je inbox te ontvangen!
                  <a href="/signup" class="btn btn-primary">Registreer nu</a>
                </p>
              </div>
            `);
          } else if (
            !currentUser.trackingCategories ||
            !currentUser.trackingCategories.includes(helper.attrs.categoryId)
          ) {
            // Geregistreerde gebruikers die de categorie niet volgen
            return helper.rawHtml(`
              <div class="cta-gipsonieuws">
                <p>
                  Volg deze categorie om alle updates te ontvangen!
                  Klik op de <strong>"Volgen"</strong>-knop bovenaan.
                </p>
              </div>
            `);
          }
        }
      });
    });
  },
};

