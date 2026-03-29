import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Aspire API running on port ${PORT} [${env.NODE_ENV}]`);
});
