import { FullConfig } from "playwright/test";
import { config as dotEnvConfig } from "dotenv";

async function globalSetup(config: FullConfig) {
    dotEnvConfig({
        path: ".env",
        override: true
    });
}
module.exports = globalSetup;