import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly $usernameInput: Locator;
    readonly $passwordInput: Locator;
    readonly $loginButton: Locator;    

    constructor(page: Page) {
        this.page = page;
        this.$usernameInput = page.getByPlaceholder('name@host.com');
        this.$passwordInput = page.getByPlaceholder('Password');
        this.$loginButton = page.getByRole('button', { name: 'Sign in' });        
    };

    // elements methods and actions

    async open(url: string) {        
        await this.page.goto(url, { waitUntil: 'load', timeout: 10000 }); // wait until was required for webkit to work
    };

    async fillUsername(username: string) {
        await this.$usernameInput.fill(username);
    };

    async fillPassword(password: string) {
        await this.$passwordInput.fill(password);
    };

    async clickLoginButton() {
        await this.$loginButton.click();
    };
    
    // Page Workflows - makes it easier to write tests and reuse code

    async login(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    };    
};