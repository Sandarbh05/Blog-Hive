import conf from '../conf/conf.js';
import {Client, Account, ID} from "appwrite";

export class AuthService{
    
    client = new Client();

    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account=new Account(this.client)
    }

    async createAccount({email, password, name}){
        // eslint-disable-next-line no-useless-catch
        try {
            const userAccount = await this.account.create({
                userId: ID.unique(),
                email,
                password,
                name,
            });
            if(userAccount){
                // call another method
                const session = await this.login({email,password});
                return {user: userAccount, session}         
            }

            return userAccount;  
        }
        catch(error){
            // throw error
            const err = {
            message: error?.message || 'Create account error',
            code: error?.code || 'AUTH_CREATE_ERROR',
            original: error
            };
        throw err;
        }
    }

    async login({email, password}){
        // eslint-disable-next-line no-useless-catch
        try{
            return await this.account.createEmailPasswordSession({
                email,
                password
            });
        }
        catch(error){
            throw error;
        }
    }

    async getCurrentUser(){
        try{
            const user = await this.account.get(); 
            return user;
        }
        catch(error){
            console.log("Appwrite Error:", error);
            return null;
        }
    }

    async logout(){
        try{
            await this.account.deleteSessions();
        }
        catch(error){
            console.log("Appwrite service :: logout :: error", error);
        }
    }

}

const authService=new AuthService()

export default authService