import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from 'src/app/models/Constant';
import { Route } from 'src/app/models/Route';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  readonly Constant = Constant;
  togglePassword:string = "password";
  userName: string = '';
  password: string = '';
  otp: string ='';
  loginToggle: boolean = false;

    constructor(private authservice: AuthService,
      private dataService: DataService,
      private _router: Router) {
      
      this.token = localStorage.getItem(this.Constant.TOKEN);

      if(!this.Constant.EMPTY_STRINGS.includes(this.token)){
        this._router.navigate([Route.HOME_CONFIGURATION_ROUTE]);
      }
    }



  token:any;
  ngOnInit(): void {
  }

  togglePasswordField(){
    if(this.togglePassword == "password"){
      this.togglePassword = "text"
    }else{
      this.togglePassword = "password";
    }
  }

  toggleNewPassword:string = "password";
  toggleNewPasswordField(){
    if(this.toggleNewPassword == "password"){
      this.toggleNewPassword = "text"
    }else{
      this.toggleNewPassword = "password";
    }
  }

  toggleConfirmPassword:string = "password";
  toggleconfirmPasswordField(){
    if(this.toggleConfirmPassword == "password"){
      this.toggleConfirmPassword = "text"
    }else{
      this.toggleConfirmPassword = "password";
    }
  }



  login() {
    debugger
    this.loginToggle = true;
    this.authservice.login(this.userName, this.password).subscribe(response=>{
      if(response.status && response.object!=null){
        localStorage.setItem(this.Constant.TOKEN, response.object.idToken);
        localStorage.setItem(this.Constant.REFRESH_TOKEN, response.object.refreshToken);
        localStorage.setItem(this.Constant.ACCOUNT_UUID, response.object.accountUuid);
        localStorage.setItem(this.Constant.USER_NAME, response.object.userName);
        localStorage.setItem(this.Constant.USER_EMAIL, response.object.userEmail);
  
        this._router.navigate([Route.HOME_CONFIGURATION_ROUTE]);
      }else{
        this.dataService.showToast(response.message);
      }
      this.loginToggle = false;
    },error=>{
      console.log(error)
      this.loginToggle = false;
      if(error.status==0){
        this.dataService.showToast('Server is down, please try after sometime.');
      }else{
        this.dataService.showToast(error.error);
      }
    })
  }


  emailVerifyToggle:boolean = false;
  sendForgetPasswordOtp(){
    debugger
    this.emailVerifyToggle = true;
    this.authservice.getForgetPasswordOTP(this.userName).subscribe(response=>{
    
    },error=>{
      this.dataService.showToast('Something went wrong!');
      this.emailVerifyToggle = false;
    })
  }

  passwordResetFormToggle:boolean = false;
  verifyPasswordSpinnerToggle: boolean = false;
  verifyOtp(){
    debugger
    this.verifyPasswordSpinnerToggle = true;
    this.authservice.verifyForgetPasswordOTP(this.userName, this.otp).subscribe(response=>{
      if(response.status){
        this.passwordResetFormToggle = true;
      }
      this.verifyPasswordSpinnerToggle = false;
    },error=>{
      this.dataService.showToast('Incorrect Otp');
      this.passwordResetFormToggle = false;
      this.verifyPasswordSpinnerToggle = false;
    })
  }

  showError: boolean = false;
  newPassword: string ='';
  confirmPassword: string ='';
  checkSamePassword() {
    if (this.newPassword != this.confirmPassword) {
      this.showError = true;
    } else {
      this.showError = false;
    }
  }

  routeToLoginToggle:boolean = false;
  updatePasswordSpinnerToggle:boolean = false;
  updateUserPassword(){
    debugger
    this.updatePasswordSpinnerToggle = true;
    this.authservice.updateUserPassword(this.userName, this.password, this.newPassword).subscribe(response=>{
      if(response.status){
        this.routeToLoginToggle = true;
      }
      this.updatePasswordSpinnerToggle = false;
    },(error)=>{
      this.dataService.showToast('Something went wrong!');
      this.routeToLoginToggle = false;
      this.updatePasswordSpinnerToggle = false;
    })
  }

}
