import { UserModel } from '../models';
import { AppUser } from '../utils';

export class UserService {
    private userModel: UserModel;

    constructor() {
        this.userModel = new UserModel();
    }

    public async getAllUsers(): Promise<AppUser[] | undefined> {
        return await this.userModel.getAllUsers()
    }

    public async getUserDetail(id: number): Promise<AppUser | undefined> {
        return await this.userModel.getUserDetailById(id);
    }

    public async updateUserStatus(id: number, online: boolean): Promise<void> {
        return await this.userModel.updateUserStatus(id, online);
    }
}