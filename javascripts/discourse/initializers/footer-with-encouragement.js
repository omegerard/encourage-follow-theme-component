import User from "discourse/models/user";

export default {
  name: "footer-with-encouragement",

  initialize(api) {
    console.log("My GiPSo Discourse Theme Component voor een specifieke footer werkt!");


    api.decorateWidget("topic-footer:after", (helper) => {
      const currentUser = User.current();
      const categorySlug = helper.attrs.categorySlug;

      // Controleer of de categorie 'GiPSo in beweging' is
      if (categorySlug === "gipso-in-beweging") {
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
  },
};

