import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CredentialsDto } from '../model/CredentialsDto';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements AfterViewChecked  {

  showRegister: boolean = false;

  user = new CredentialsDto();

  @ViewChild('loginName') loginInputElement: ElementRef;

  isValueChanged:boolean = true;
  isLoading:boolean = false;

  loginFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);


  constructor(
    private service:AuthService,
    private _snackBar: MatSnackBar,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  login():void {
    this.loginFormControl.addValidators(Validators.required);
    this.passwordFormControl.addValidators(Validators.required);

    if (!this.isValid())
      return;

    this.isLoading = true;

    this.service.login(this.user)
    .subscribe(result => { 

      this.user = result;
      this.isValueChanged = false;

      this.isLoading = false;

      this.service.setAuthToken(this.user.token);

      this.service.setUserId(this.user.id);

      this.router.navigate(['/']);
    })
    
  }

  register():void {
    this.loginFormControl.addValidators(Validators.required);
    this.passwordFormControl.addValidators(Validators.required);

    if (!this.isValid())
      return;

    this.isLoading = true;

    this.service.register(this.user)
    .subscribe(result => { 
      
      this.user = result;
      this.isValueChanged = false;

      this.isLoading = false;
    })
    
  }

  onValueChange() {
    this.isValueChanged = true;
  }

  new() {
    this.user = new CredentialsDto();
    this.isValueChanged = true;

    this.loginFormControl.clearValidators();
    this.passwordFormControl.clearValidators();

    this.loginInputElement.nativeElement.focus();
  }

  isValid():boolean {
    this.loginFormControl.updateValueAndValidity();
    this.passwordFormControl.updateValueAndValidity();

    if (this.loginFormControl.errors || this.loginFormControl.errors)
      return false;

    if (this.user.login == null || this.user.password == null)
      return false;

    return true;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000 });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.service.setAuthToken(null);
    });
    
    this.loginInputElement.nativeElement.focus();
  }

}
