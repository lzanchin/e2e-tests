import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { LandingPage } from '../pages/landing';
import { AiGenerationPage } from '../pages/ai-generation';

const email = process.env.EMAIL as string;
const password = process.env.PASSWORD as string;
const username = process.env.USERNAME as string;
const url = process.env.WEB_URL as string;

