import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ContestationService } from '../service/contestation.service';
import { CheckContestationDTO } from '../model/CheckContestation';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-check-contestation',
  templateUrl: './check-contestation.component.html',
  styleUrls: ['./check-contestation.component.css']
})
export class CheckContestationComponent implements AfterViewChecked {

  @ViewChild('document') documentInputElement: ElementRef;

  checkContestation = new CheckContestationDTO();

  isValueChanged:boolean = true;
  isLoading:boolean = false;

  documentFormControl = new FormControl('', [Validators.required]);
  merchantFormControl = new FormControl('', [Validators.required]);


  constructor(
    private service:ContestationService,
    private _snackBar: MatSnackBar,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  check():void {
    this.documentFormControl.addValidators(Validators.required);
    this.merchantFormControl.addValidators(Validators.required);

    if (!this.isValid())
      return;

    this.isLoading = true;

    this.service.check(this.checkContestation)
    .subscribe(result => { 
      this.checkContestation = result;
      this.isValueChanged = false;

      this.isLoading = false;
    })
    
  }

  onValueChange() {
    this.isValueChanged = true;
  }

  new() {
    this.checkContestation = new CheckContestationDTO();
    this.isValueChanged = true;

    this.documentFormControl.clearValidators();
    this.merchantFormControl.clearValidators();

    this.documentInputElement.nativeElement.focus();
  }

  copyResultToClipBoard() {
    navigator.clipboard.writeText(this.checkContestation.result);
    this.openSnackBar('Conteúdo copiado para área de transferência! ', 'Ok');
  }

  isValid():boolean {
    this.documentFormControl.updateValueAndValidity();
    this.merchantFormControl.updateValueAndValidity();

    if (this.documentFormControl.errors || this.merchantFormControl.errors)
      return false;

    if (this.checkContestation.document == null || this.checkContestation.merchant == null)
      return false;

    return true;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000 });
  }

  ngAfterViewInit() {
    this.documentInputElement.nativeElement.focus();
  }
  
}
