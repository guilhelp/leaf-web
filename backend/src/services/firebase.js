const { initializeApp, cert } = require("firebase-admin/app");
const serviceAccount = require("../../serviceAccount.json");

(async () => {
  const app = initializeApp({
    credential: cert(serviceAccount),
  });
})();
