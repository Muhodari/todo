import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { Post } from './post.model';
import {map} from 'rxjs/operators'
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';


const BACKEND_URL=environment.apiUrl+"/posts";

@Injectable({providedIn: 'root'})

export class PostsService {
  private posts: Post[] = [];

  private postsUpdated = new Subject<{posts:Post[],postCount:number}>();



constructor(private http:HttpClient,private router:Router){}

  getPosts(postsPerPage:number,currentPage:number) {
    const queryParams=`?pagesize=${postsPerPage}&page=${currentPage}`;
   this.http.get<{message:string,posts:any,maxPosts:number}>(BACKEND_URL+queryParams)
   .pipe(map((postData)=>{
     return{posts:postData.posts.map(post=>{
     return{ 
        title:post.title,
       content:post.content,
       id:post._id,
       creator:post.creator
      }
     }),
     maxPosts:postData.maxPosts
    };
    
     }))

.subscribe(transformedPostData=>{
  // console.log(transformedPostData);
     this.posts=transformedPostData.posts;
    this.postsUpdated.next({
      posts:[...this.posts],
      postCount:transformedPostData.maxPosts
    })
   })
  }

getPost(id:string){
  return this.http.get<{
    _id:string;
    title:string;
    content:string;
    creator:string;
  }>(BACKEND_URL+"/"+id);
}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
   const postData= new FormData();
   postData.append('title',title);
   postData.append('content',content);
    this.http.post<{message:string,post:Post}>(BACKEND_URL,postData)
    .subscribe((responseData)=>{
      //console.log(responseData.message);
      const post:Post={
        id:responseData.post.id,
        title:title,
        content:content,
         creator:null
      }
      this.router.navigate(["./"])
    }

    );
   
  }

//  delete request
deletePost(postId:string){
 return this.http.delete(BACKEND_URL+"/"+postId)
}

updatePost(id:string,title:string,content:string){
let postData: Post | FormData;

 postData= new FormData();
 postData.append("id",id);
 postData.append("title",title);
 postData.append("content",content);




   postData={
     id:id,
    title:title,
    content:content,
   
    creator:null
  };
this.http.put(BACKEND_URL+"/"+id,postData).subscribe((response)=>{

this.router.navigate(["./"])

})
}


}
