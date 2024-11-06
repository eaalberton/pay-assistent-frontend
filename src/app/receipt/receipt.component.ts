import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../service/auth.service';
import { ReceiptService } from '../service/receipt.service';

export class Company {
  value: string;
  viewValue: string;
}

export class ReceiptDTO {
  company: string;
  metadata: string;
}

export class FileDTO {
  name: string = '';
  file: any;
}

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements AfterViewChecked {

  @ViewChild('metadata') metadataInputElement: ElementRef;

  receiptDTO = new ReceiptDTO();

  companies: Company[] = [
    //{value: 'PAYBROKERS', viewValue: 'PAYBROKERS'},
    {value: 'PAGFAST', viewValue: 'PAGFAST'},
  ];

  isValueChanged:boolean = true;
  isLoading:boolean = false;

  companyFormControl = new FormControl('', [Validators.required]);
  metadataFormControl = new FormControl('', [Validators.required]);


  constructor(
    private service:ReceiptService,
    private _snackBar: MatSnackBar,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.validadeAuth();
  }

  validadeAuth() {
    this.authService.validadeAuth().subscribe()
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  generateReceipt_():void {
    this.companyFormControl.addValidators(Validators.required);
    this.metadataFormControl.addValidators(Validators.required);

    if (!this.isValid())
      return;

    this.isLoading = true;

    this.service.generateReceipt(this.receiptDTO)
    .subscribe(result => { 

      console.log(result);

      const file = new Blob([result], {
        type: result.type
      });

      const blob = window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = blob;
      link.download = 'receipt.pdf';

      link.click();

      window.URL.revokeObjectURL(blob);
      link.remove();

      this.isValueChanged = false;

      this.isLoading = false;
    })
  }

  generateReceiptInMemory():void {
    this.companyFormControl.addValidators(Validators.required);
    this.metadataFormControl.addValidators(Validators.required);

    if (!this.isValid())
      return;

    this.isLoading = true;

    this.service.generateReceiptInMemory(this.receiptDTO)
    .subscribe({
      next: (result) => {
        const sampleArr = this.base64ToArrayBufferAngular15(result.file);
        this.saveByteArray(result, sampleArr);
        this.isValueChanged = false;
      },
      error: (result) => {
        console.log(result);
        alert("Review the information provided!");
        this.isLoading = false;
      }
    });
    
  }

  private saveByteArray(file: FileDTO, byte: any) {
    var blob = new Blob([byte], { type: 'application/pdf' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = file.name;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(link.href);
    link.remove();
    this.isLoading = false;

    this.openSnackBar('Comprovante gerado com sucesso!', 'Ok');
  }

  private base64ToArrayBufferAngular15(base64: any) {
    //(window.atob) Só funciona até angular 15 conforme MDN Reference
    // window.btoa('test')  faz o encode: ('test' > dGVzdA== )
    // window.atob('dGVzdA==') faz o decode: ('dGVzdA==' > test )
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  onValueChange() {
    this.isValueChanged = true;
  }

  new() {
    this.receiptDTO.metadata = '';
    this.receiptDTO.company = 'PAGFAST';

    this.companyFormControl.clearValidators();
    this.metadataFormControl.clearValidators();

    this.metadataInputElement.nativeElement.focus();
    this.isValueChanged = true;
  }

  isValid():boolean {
    this.companyFormControl.updateValueAndValidity();
    this.metadataFormControl.updateValueAndValidity();

    if (this.companyFormControl.errors || this.metadataFormControl.errors)
      return false;

    if (this.receiptDTO.company == null || this.receiptDTO.metadata == null)
      return false;

    return true;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000 });
  }

  ngAfterViewInit() {
    this.new();
  }

}
