import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { OnboardingController } from './';

const app = express();
app.use(bodyParser.json());

const onboardingController = new OnboardingController();

app.get('/onboarding/overview', (req, res) => onboardingController.getOnboardingOverview(req, res));

describe('GET /onboarding/overview', () => {
    it('should return onboarding overview', async () => {
        const response = await request(app).get('/onboarding/overview');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('ongoingProcesses');
        expect(response.body).toHaveProperty('completedProcesses');
    });
});