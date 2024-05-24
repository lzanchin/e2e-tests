import { Page, Locator } from '@playwright/test';

export class AiGenerationPage {
    readonly page: Page;
    readonly $alchemyModalCloseButton: Locator;
    readonly $alchemyTrialExpiredCloseButton: Locator;
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
        this.$alchemyTrialExpiredCloseButton = this.page.getByLabel('Close', { exact: true });
    };

    // elements methods and actions

    async clickAlchemyModalCloseButton() {
        try {
            await this.$alchemyModalCloseButton.click( { timeout: 10000 } );
        } catch (error) {
            console.log(`No modal to close ${error}`);            
        };
    };

    // returns a boolean to be validated at the test this is the correct page (just an extra layer of validation)
    async checkPageHeader(): Promise<boolean> {
        await this.clickAlchemyModalCloseButton();
        return await this.$aiGenerationsHeader.isVisible();
    };

    async clickNumberOfImages() {
        await this.$numberOfImages.click();
    };

    async clickAlchemyToggleButton() {
        await this.$alchemyToggleButton.click();
        // if alchemy trial is expired, click on the close button to close the modal
        try {
            await this.$alchemyTrialExpiredCloseButton.click( { timeout: 10000 } ); //can potentially reduce this timeout for a shorter number
        } catch (error) {
            console.log(`No modal to close ${error}`);            
        };        
    };

    async clickFinetuneModel() {
        await this.$finetunedModel.click();
    };

    async clickFinetuneModelSelectButton() {
        await this.$finetunedModelSelectButton.click();
    };

    // I would change this method to dynamically get the element depending on the resolution defined
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

    // with more time and more understanding of the Leonardo app, I would change the way I am finding the image generated
    // I noticed that the prompt is in the alt attribute of the image, which is reliable but if the prompt is too long it breaks
    // for that reason I created this method of using a timestamp so I can search with the unique timestamp I created
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