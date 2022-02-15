import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';


@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    dropdownList = [];

    private data = {
        userInfo: null,
        teamInfo: null,
        allSkill: null,
        allProjects: null,
        allLeavesYear: null,
        allLeaves: null,
        allProjectAbout: null,
        prouctResourceCount: null,
        allUsers: null
    }

    private userInfoData = new BehaviorSubject([]);
    private teamInfoData = new BehaviorSubject([]);
    private allSkillData = new BehaviorSubject([]);
    private allProjectsData = new BehaviorSubject([]);
    // private allLeavesDataYear = new BehaviorSubject(this.data.allLeavesYear);




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

    deleteLeave(lid) {
        console.log(lid)
        let options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: lid,
        };
        return this.http.delete(`/home/leave/deleteLeaves`, options);
    }
    get userInfoFields() {
        return this.userInfoData.asObservable();
    }

    get teamInfoFields() {
        return this.teamInfoData.asObservable();
    }

    get allSkillFields() {
        return this.allSkillData.asObservable();

    }

    get allProjectFields() {
        return this.allProjectsData.asObservable();

    }

    // get allLeavesYearFields(){
    //     return this.allLeavesDataYear.asObservable();

    // }

    getTeamData(page) {
        this.http.get(`/home/user/getuserswithpagination?page=${page}`).subscribe(response => {
            this.data.userInfo = response;
            this.teamInfoData.next(this.data.userInfo.UserInfo)
            this.userInfoData.next(this.data.userInfo);

        })
    }

    getAllSkillSets() {
        return this.http.get(`/home/getAllSkills`).subscribe(response => {
            console.log(response)
            this.data.allSkill = response;
            this.allSkillData.next(this.data.allSkill.payload)
        });
    }


    getAllLeavesByMonthYear(month, year) {
        return this.http.get(`/home/leave/getUserLeavesByMonthAndYear?month=${month}&year=${year}`)
            .pipe(map(response => {
                this.data.allLeavesYear = response[year];
                return this.data.allLeavesYear
            }))
    }

    getAllProjectAbout() {
        return this.http.get(`/home/getAllProjects`)
            .pipe(map(response => {
                this.data.allProjectAbout = response;
                return this.data.allProjectAbout.payload
            }))
    }
    getAllLeaves() {
        return this.http.get(`/home/leave/getAllLeaves`)
            .pipe(map(response => {
                this.data.allLeaves = response;
                return this.data.allLeaves
            }))
    }
    getProjectResourceCount() {
        return this.http.get(`/home/user/productAndResourceCount`)
            .pipe(map(response => {
                this.data.prouctResourceCount = response;
                return this.data.prouctResourceCount.body
            }))
    }

    getAllUsers() {
        return this.http.get(`/home/user/getusers`)
            .pipe(map(response => {
                this.data.allUsers = response;
                return this.data.allUsers.payload
            }))
    }
    getAllCertifkn() {
        return (this.dropdownList = [
            { item_id: 1, item_text: 'Mumbai' },
            { item_id: 2, item_text: 'Bangaluru' },
            { item_id: 3, item_text: 'Pune' },
            { item_id: 4, item_text: 'Navsari' },
            { item_id: 5, item_text: 'New Delhi' }
        ]);
    }
}