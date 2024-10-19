import { OnboardingModel } from './onboardingModel';
import { OnboardingStatus } from '../constants';
import { Database } from 'sqlite3';

jest.mock('sqlite3', () => {
    const mDatabase = {
        all: jest.fn((query, params, callback) => {
            const status = params[0];
            const data = [
                { onboarding_id: 1, user_id: 1, status: 'pending' },
                { onboarding_id: 2, user_id: 2, status: 'completed' },
                { onboarding_id: 3, user_id: 3, status: 'in_progress' },
            ];
            const filteredData = data.filter(record => record.status === status);
            callback(null, filteredData);
        }),
    };
    return { Database: jest.fn(() => mDatabase) };
});

describe('OnboardingModel', () => {
    let onboardingModel: OnboardingModel;

    beforeEach(() => {
        onboardingModel = new OnboardingModel();
    });

    it('should retrieve all onboarding records with the specified status', async () => {
        const status = OnboardingStatus.IN_PROGRESS;
        const results = await onboardingModel.getAllByStatus(status);
        expect(results).toEqual([
            { onboarding_id: 3, user_id: 3, status: 'in_progress' },
        ]);
    });
});