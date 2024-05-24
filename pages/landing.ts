import { Page, Locator } from '@playwright/test';

export class LandingPage {
    readonly page: Page;
    readonly $welcomeModalCloseButton: Locator;
    readonly $welcomePageHeader: Locator;
    readonly $createNewImageButton: Locator;
    readonly $profileMenu: Locator;
    readonly $logoutButton: Locator;

    constructor (page: Page) {
        this.page = page;
        this.$welcomeModalCloseButton = page.getByLabel('Close');
        this.$welcomePageHeader = page.getByRole('heading', { name: 'Get Started Here' });
        this.$createNewImageButton = page.getByRole('link', { name: 'Create New Image' });
        this.$profileMenu = page.getByRole('button', { name: 'Profile' });
        this.$logoutButton = page.getByRole('menuitemradio', { name: 'Sign out Logout' }).locator('a');
    };

    // elements methods and actions

    async clickCreateNewImageButton() {
        await this.$createNewImageButton.click();
    };

    async clickProfileMenu(username: string) {
        await this.page.getByRole('button', { name: `${username} ${username}` }).click();
    };

    async clickLogoutButton() {
        await this.$logoutButton.click();
    };

    async closeModalIfVisible(){
        try {
            await this.$welcomeModalCloseButton.click( { timeout: 10000 } );            
        } catch (error) {
            console.log(`No modal to close ${error}`);            
        }
    };

    async isLandingPageVisible(): Promise<boolean> {
        let isLandingPageVisible: boolean = await this.$welcomePageHeader.isVisible();
        return isLandingPageVisible;
    };

    // Page Workflows

    async checkLandingPage(): Promise<boolean> {
        await this.closeModalIfVisible();
        return await this.isLandingPageVisible();
    };

    async navigateToImageGeneration(){
        await this.clickCreateNewImageButton();
    };

    async logout(username: string) {
        await this.clickProfileMenu(username);
        await this.clickLogoutButton();
    };
};