import { Page, Locator } from '@playwright/test';

export class AiGenerationPage {
    readonly page: Page;
    readonly $alchemyModalCloseButton: Locator;
    readonly $aiGenerationsHeader: Locator;
    readonly $numberOfImages: Locator;
    readonly $alchemyToggleButton: Locator;
    readonly $finetunedModel: Locator;
    readonly $finetunedModelSelectButton: Locator;
    readonly $imageResolution512Button: Locator;
    readonly $generateButton: Locator;
    readonly $promptInput: Locator;
    readonly $closeSettingsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.$alchemyModalCloseButton = page.getByLabel('Close').nth(2);
        this.$aiGenerationsHeader = page.getByRole('heading', { name: 'AI Image Generation' });
        this.$numberOfImages = page.getByLabel('Number of Images').getByText('1');
        this.$alchemyToggleButton = page.locator('div').filter({ hasText: /^AlchemyV2Loading\.\.\.$/ }).locator('span').nth(2);
        this.$finetunedModel = page.getByLabel('Finetuned Model', { exact: true });
        this.$finetunedModelSelectButton = page.getByRole('button', { name: 'Leonardo Lightning XL Alchemy' });
        this.$imageResolution512Button = page.locator('div').filter({ hasText: /^512 × 512$/ }).first();
        this.$generateButton = page.getByRole('button', { name: 'Generate' });
        this.$promptInput = page.getByPlaceholder('Type a prompt');
        this.$closeSettingsButton = page.getByLabel('Close AI Generations settings');
    };

    // elements methods and actions

    async clickAlchemyModalCloseButton() {
        try {
            await this.$alchemyModalCloseButton.click( { timeout: 10000 } );
        } catch (error) {
            console.log(`No modal to close ${error}`);            
        };
    };

    async checkPageHeader(): Promise<boolean> {
        await this.clickAlchemyModalCloseButton();
        return await this.$aiGenerationsHeader.isVisible();
    };

    async clickNumberOfImages() {
        await this.$numberOfImages.click();
    };

    async clickAlchemyToggleButton() {
        await this.$alchemyToggleButton.click();
    };

    async clickFinetuneModel() {
        await this.$finetunedModel.click();
    };

    async clickFinetuneModelSelectButton() {
        await this.$finetunedModelSelectButton.click();
    };

    async clickImageResolution512Button() {
        await this.$imageResolution512Button.click();
    };

    async clickGenerateButton() {
        await this.$generateButton.click();
    };

    async clickCloseSettingsButton() {
        await this.$closeSettingsButton.click();
    };

    async fillPromptInput(prompt: string) {
        await this.$promptInput.fill(prompt);
    };

    async waitForImageGeneration(currentImageCount: number, prompt: string, page: Page): Promise<number> {
        try {
            await page.locator(`//div/img[contains(@alt,'${prompt}')]`).waitFor({ state: 'visible', timeout: 20000 })            
            currentImageCount = await page.locator(`//div/img[contains(@alt,'${prompt}')]`).count();
            console.log(`Current image count: ${currentImageCount}`);            
        } catch (error) {
            console.log(`Error: ${error}`);
            currentImageCount = 0;            
        }        
        return currentImageCount;
    };

    // Page Workflows

    async prepareToGenerateImage(){
        await this.clickNumberOfImages();
        await this.clickAlchemyToggleButton();
        await this.clickFinetuneModel();
        await this.clickFinetuneModelSelectButton();
        await this.clickImageResolution512Button();        
    };

    async generateImage(prompt: string) {
        await this.fillPromptInput(prompt);
        await this.clickGenerateButton();
    };

    async waitForImageAndCountResults(prompt: string, page: Page): Promise<number> {
        let currentImageCount: number = 0;
        currentImageCount = await this.waitForImageGeneration(currentImageCount, prompt, page);
        return currentImageCount;        
    };
};