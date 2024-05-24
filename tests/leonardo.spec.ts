import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { LandingPage } from '../pages/landing';
import { AiGenerationPage } from '../pages/ai-generation';

const email = process.env.EMAIL as string;
const password = process.env.PASSWORD as string;
const username = process.env.USERNAME as string;
const url = process.env.WEB_URL as string;

test.describe('Login and generate one image based on a prompt', () => {
    test('It should login and generate one image', async ({ page }) => {
        test.slow();
        let loginPage = new LoginPage(page);
        
        await test.step('Login to Leonardo', async () => {
            await loginPage.open(url);
            await loginPage.login(username, password);
        });
    });    
});