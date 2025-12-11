import conf from '../conf/conf.js';
import {Client, ID, TablesDB, Storage, Query} from 'appwrite';

export class Service{
    
    client = new Client();
    
    tablesDB;

    bucket;


    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.tablesDB=new TablesDB(this.client);
        this.bucket=new Storage(this.client);
    }


    //Posts Related Services;

     // Creates a post: uses an Appwrite-generated rowId (ID.unique()).
    // Returns the created row object or null on error.
    async createPost({title, slug, content, featuredImage, status, userId}){
        try{
            const rowId=ID.unique()
            const res= await this.tablesDB.createRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId,
                data:{
                    ...(slug ? { slug } : {}),
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                },
            });
            return res ?? null;
        }
        catch(error){
            console.log("Appwrite service :: createPost :: error", error);
            return null;
        }
    }


    // Update by Appwrite row id ($id)
    // 'id' is the actual Appwrite row id (the $id returned after create)
    async updatePost(id, {title, content, featuredImage, status}){
        if (!id) {
            console.warn('updatePost called without id');
            return null;
        }
        try{
            const res=await this.tablesDB.updateRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: id,
                data: {
                    title,
                    content,
                    featuredImage,
                    status,
                },
            });
            return res ?? null
        }
        catch(error){
            console.log("Appwrite service :: updatePost :: error", error);
            return null;
        }
    }

    // Delete by Appwrite row id ($id):
    async deletePost(id){
         if (!id) {
            console.warn('deletePost called without id');
            return false;
        }
        try{
            await this.tablesDB.deleteRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: id,
            })
            return true;
        }
        catch(error){
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    // Get post by Appwrite row id ($id)
    async getPost(id){
        if (!id) {
        console.warn('getPost called without id - returning null');
        return null;
        }
        try{
            const res=await this.tablesDB.getRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: id,
            });
            return res ?? null;
        }
        catch(error){
            console.log("Appwrite service :: getPost :: error", error);
            return null;
        }
    }

    // async getPosts(queries=[Query.equal("status", "active")]){
    //     try{
    //         return await this.tablesDB.listRows({
    //             databaseId: conf.appwriteDatabaseId,
    //             tableId: conf.appwriteCollectionId,
    //             queries: [...queries, Query.limit(25), Query.offset(0)], 
    //         })
    //     }
    //     catch(error){
    //         console.log("Appwrite service :: getPosts :: error", error);
    //         return false
    //     }
    // }

     // List posts - returns { total, rows: [...] } or null on error
    // default filter: status = active
    async getPosts(queries = [Query.equal('status', 'active')], limit = 25, offset = 0) {
        try {
        const res = await this.tablesDB.listRows({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCollectionId,
            queries: [...queries, Query.limit(limit), Query.offset(offset)],
        });
        return res; // caller should read res.rows
        } catch (error) {
        console.log('Appwrite service :: getPosts :: error', error);
        return null;
        }
    }

     // Helper: get post by slug column (returns first match or null)
    async getPostBySlug(slug) {
        if (!slug) return null;
        try {
        const res = await this.tablesDB.listRows({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCollectionId,
            queries: [Query.equal('slug', slug), Query.limit(1)],
        });
        return res?.rows?.[0] ?? null;
        } catch (error) {
        console.log('Appwrite service :: getPostBySlug :: error', error);
        return null;
        }
    }

    //File Upload Service;

    async uploadFile(file){
        try{
            return await this.bucket.createFile({
                bucketId: conf.appwriteBucketId,
                fileId: ID.unique(),
                file,
            })
        }
        catch(error){
            console.log("Appwrite service :: uploadFile :: error", error);
            return null;
        }
    }

    async deleteFile(fileId){
        try{
            return await this.bucket.deleteFile({
                bucketId: conf.appwriteBucketId,
                fileId
            })
        }
        catch(error){
            console.log("Appwrite service :: deleteFile :: error", error);
            return null;
        }
    }


    getFilePreview(fileId){
        return this.bucket.getFileView({
            bucketId: conf.appwriteBucketId,
            fileId
        })
    }

}

const service=new Service();

export default service;