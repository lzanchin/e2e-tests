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
        let landingPage = new LandingPage(page);
        let aiGenerationPage = new AiGenerationPage(page);

        // expected number of images to be generated
        let expectedImageCount: number = 1;

        // prompt to be generated with a timestap to facilitate finding the image
        let prompt: string = `a successful end to end test (${Date.now()})`;
        
        await test.step('Login to Leonardo', async () => {
            await loginPage.open(url);
            //await page.pause();
            await loginPage.login(email, password);
        });

        await test.step('Navigate to Image Generation', async () => {
            expect(await landingPage.checkLandingPage()).toBeTruthy();
            await landingPage.navigateToImageGeneration();
        });

        await test.step('Check AI Generation Page', async () => {
            expect(await aiGenerationPage.checkPageHeader()).toBeTruthy();
        });

        await test.step('Prepare Image Generation', async () => {
            await aiGenerationPage.prepareToGenerateImage();        
        });

        await test.step('Generate Image', async () => {
            await aiGenerationPage.generateImage(prompt);
        });

        await test.step('Check Image Generation', async () => {
            expect(await aiGenerationPage.waitForImageAndCountResults(prompt, page)).toBe(expectedImageCount);
        });

        await test.step('Logout', async () => {
            await aiGenerationPage.clickCloseSettingsButton();
            await landingPage.logout(username);
        });
    });    
});