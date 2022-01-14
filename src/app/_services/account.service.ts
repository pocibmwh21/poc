import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';


@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    private data = {
        userInfo:null,
        teamInfo:null,
        allSkill:null,
        allProjects:null
    }

    private userInfoData =  new BehaviorSubject([]);
    private teamInfoData =  new BehaviorSubject([]);
    private allSkillData = new BehaviorSubject([]);
    private allProjectsData = new BehaviorSubject([]);



    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }



    login(username, password) {
        return this.http.post<User>(`/api/auth/signin`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`/api/auth/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`/home/${id}`);
    }

    update(id, params) {

        
        return this.http.put(`/home/user/${id}`, params)
            .pipe(map(x => {

                
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {

                   
                    // update local storage
                    const user = { ...this.userValue, ...x };

                  //  console.log("UserValue: ",user);
                    localStorage.removeItem('user');
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
    deleteImage(id: string) {
        return this.http.delete(`/home/delete/${id}`);
    }


    get userInfoFields(){
        return this.userInfoData.asObservable();
    }

    get teamInfoFields(){
        return this.teamInfoData.asObservable();
    }

    get allSkillFields(){
        return this.allSkillData.asObservable();

    }

    get allProjectFields(){
        return this.allProjectsData.asObservable();

    }

    getTeamData(page){
         this.http.get(`/home/user/getuserswithpagination?page=${page}`).subscribe(response=>{
             this.data.userInfo =  response;
             this.teamInfoData.next(this.data.userInfo.UserInfo)
             this.userInfoData.next(this.data.userInfo);

         })
    }

    getAllSkillSets(){
        return this.http.get(`/home/getAllSkills`).subscribe(response=>{
            this.data.allSkill = response;
            this.allSkillData.next(this.data.allSkill.payload)
        });
    }
    getAllProjects(){
        return this.http.get(`/home/getAllProjects`).subscribe(response=>{
            this.data.allProjects = response;
            this.allProjectsData.next(this.data.allProjects.payload)
        });
    }

    
}