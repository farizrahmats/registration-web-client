import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../_service/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-registration-component',
  templateUrl: './registration-component.component.html',
  styleUrls: ['./registration-component.component.css']
})
export class RegistrationComponentComponent implements OnInit {
  
  hide = true;
  maxDate = new Date();
  resgistForm: FormGroup;
  typeForm: boolean = false;
	hasFormErrors: boolean = false;
  pipe = new DatePipe('en-US');
  showLogin: boolean = false;

  validationMessages = {
		'firstName': [
			{type: 'required', message: 'First Name is required'}
    ],
    'lastName': [
			{type: 'required', message: 'Last Name is required'}
    ],
    'email': [
      {type: 'required', message: 'Email is required'},
      {type: 'email', message: 'Please enter a valid Email Address'},
      {type: 'exist', message: 'Email is already Exist'}
      
    ],
    'password': [
      {type: 'required', message: 'Password is required'},
      {type: 'minlength', message: 'Please enter min 8'}
    ],
		'contactNo': [
			{type: 'required', message: 'Mobile Number is required'},
			{type: 'pattern', message: 'Please enter valid Indonesian phone number'},
      {type: 'minlength', message: 'Please enter min 10'},
      {type: 'exist', message: 'Mobile Number is already Exist'}
		],
	};

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
		this.resgistForm = this.fb.group({
			contactNo: [{value: null, disabled: this.typeForm}, [Validators.required, Validators.pattern(/^(^\+62\s?|^0)(\d{3,4}-?){2}\d{3,4}$/g), Validators.min(10)]],
			firstName: [{value: null, disabled: this.typeForm}, Validators.required],
			lastName: [{value: null, disabled: this.typeForm}, Validators.required],
			gender: [{value: null, disabled: this.typeForm}],
			dateOfBirth: [{value: null, disabled: this.typeForm}],
			email: [{value: null, disabled: this.typeForm}, [Validators.required, Validators.email]],
			password: [{value: null, disabled: this.typeForm}, [Validators.required, Validators.min(8)]]
		});
  }

  /** ACTIONS */
	prepare(): any {
		const controls = this.resgistForm.controls;
    let dob = this.pipe.transform(controls['dateOfBirth'].value, 'y-M-d');
    const _data = {
      first_name: controls['firstName'].value,
      last_name: controls['lastName'].value,
      contact_no: controls['contactNo'].value,
      email: controls['email'].value,
      gender: controls['gender'].value,
      date_of_birth: dob,
      password: controls['password'].value
    };

		return _data;
	}
  
  onSubmit() {
		this.hasFormErrors = false;
		const controls = this.resgistForm.controls;
		
		/** check form */
		if (this.resgistForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const dataPrepared = this.prepare();

		this.create(dataPrepared);
  }
  
  create(_data: any) {
    this.typeForm = true;
    
		this.userService.create(_data).subscribe(res => {
      this.showLogin = true;
		}, err => {
      this.showLogin = false;
      this.typeForm = false;

      const controls = this.resgistForm.controls;
      if(typeof err.error.errors.contact_no !== undefined){
        controls['contactNo'].setErrors({'incorrect': true, 'exist': true});
      }

      if(typeof err.error.errors.email !== undefined){
        controls['email'].setErrors({'incorrect': true, 'exist': true});
        
      }

      this.hasFormErrors = true;
			return;
		});
	}
}
