import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'register.component.html',
styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    
    // emailPattern = ("(^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$[!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    emailPattern ="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,4}$"
    fieldTextType: boolean; 


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.maxLength(20)]],
            middleName: ['', Validators.nullValidator],
            lastName: ['', [Validators.required,Validators.maxLength(20)]],
            empId: ['', [Validators.required,Validators.pattern(/^-?([0-9]\d*)?$/)]],
            email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();
        console.log(this.form)
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
            this.loading = true;
            this.accountService.register(this.form.value)
                .pipe(first())
                .subscribe(
                    data => {
                        this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                        this.router.navigate(['../login'], { relativeTo: this.route });
                    },
                    error => {
                        this.alertService.error(error);
                        this.loading = false;
                    });
        
    }
    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
      }
}