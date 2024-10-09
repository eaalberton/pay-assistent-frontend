import { AfterViewChecked, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Company, CustomerService, MerchantCustomerService, Request, SupportLevel } from '../customer-service-summary/customer-service-summary.component';
import { MatSelect } from '@angular/material/select';
import { FormControl, Validators } from '@angular/forms';
import { CustomerServiceService } from '../service/customer-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../service/auth.service';
import * as moment from 'moment';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-customer-service-detail',
  templateUrl: './customer-service-detail.component.html',
  styleUrls: ['./customer-service-detail.component.css']
})
export class CustomerServiceDetailComponent implements AfterViewChecked {

  @ViewChild('request') requestMatSelectElement: MatSelect;

  @ViewChild(MatTable) table: MatTable<CustomerService>;

  merchantCustomerService: MerchantCustomerService;

  requests: Request[];

  selectedRequest: Request;

  supportLevels: SupportLevel[] = [
    {value: 'N1'},
    {value: 'N2'},
    {value: 'N3'},
  ];

  companies: Company[] = [
    {value: 'PAYBROKERS', viewValue: 'PAYBROKERS'},
    {value: 'PAGFAST', viewValue: 'PAGFAST'},
  ];

  quantity: number = 1;

  dateNow: Date = new Date();

  dateStart: Date = new Date(this.dateNow.getTime() - 2*60000);

  hoursStart = this.dateStart.getHours();

  minutesStart = this.dateStart.getMinutes();

  hoursEnd = this.dateNow.getHours();

  minutesEnd = this.dateNow.getMinutes();

  displayedColumns: string[] = ['request', 'company', 'platformRequest', 'supportLevel', 'dateStart', 'dateEnd', 'quantity', 'actions'];

  isValueChanged:boolean = true;

  isLoading:boolean = false;

  showTable = false;

  companyFormControl = new FormControl('', [Validators.required]);
  quantityFormControl = new FormControl('', [Validators.required]);
  requestFormControl = new FormControl('', [Validators.required]);
  hourStartFormControl = new FormControl('', [Validators.required]);
  minuteStartFormControl = new FormControl('', [Validators.required]);
  hourEndFormControl = new FormControl('', [Validators.required]);
  minuteEndFormControl = new FormControl('', [Validators.required]);

  constructor(
    private service:CustomerServiceService,
    private _snackBar: MatSnackBar,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,

    public dialogRef: MatDialogRef<CustomerServiceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MerchantCustomerService,
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.validadeAuth();

  }

  validadeAuth() {
    this.authService.validadeAuth().subscribe()
  }

  // Initially fill the selectedRequests so it can be used in the for loop** 
  selectedRequests: Request[];

  // Receive user input and send to search method**
  onKey(value: any) { 
    this.selectedRequests = this.search(value);
  }

  // Filter the states list and send back to populate the selectedStates**
  search(value: string) { 
    let filter = value.toLowerCase();
    return this.requests.filter(option => option.name.toLowerCase().match(filter));
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000 });
  }

  ngAfterViewInit() {

    this.selectedRequests = this.data.requests;
    this.requests = this.data.requests;

    this.findCustomerServices();

    this.new();

    this.requestMatSelectElement.focus();

  }

  new() {
    this.companyFormControl.clearValidators();
    this.quantityFormControl.clearValidators();
    this.requestFormControl.clearValidators();
    this.hourStartFormControl.clearValidators();
    this.minuteStartFormControl.clearValidators();
    this.hourEndFormControl.clearValidators();
    this.minuteEndFormControl.clearValidators();

    this.data.customerService.supportLevel = 'N1';
    this.data.customerService.quantity = 1;
    this.data.customerService.request = undefined;
  }

  findCustomerServices() {
    this.service.findDetail(this.data.customerService.user.id, this.data.customerService.merchant.id)
    .subscribe(result => { 
      this.data.customerServices = result;

      if (this.data.customerServices.length > 0) 
        this.showTable = true;
      else 
        this.showTable = false;

    })
  }

  add():void {

    this.companyFormControl.addValidators(Validators.required);
    this.quantityFormControl.addValidators(Validators.required);
    this.requestFormControl.addValidators(Validators.required);
    this.hourStartFormControl.addValidators(Validators.required);
    this.minuteStartFormControl.addValidators(Validators.required);
    this.hourEndFormControl.addValidators(Validators.required);
    this.minuteEndFormControl.addValidators(Validators.required);

    if (!this.isValid())
      return;

    this.isLoading = true;

    this.data.customerService.shift = this.data.customerService.user.shift;

    this.dateStart.setHours(this.hoursStart);
    this.dateStart.setMinutes(this.minutesStart);

    this.dateNow.setHours(this.hoursEnd);
    this.dateNow.setMinutes(this.minutesEnd);

    this.data.customerService.dateStart = (moment(this.dateStart)).format('DD/MM/YYYY HH:mm');
    this.data.customerService.dateEnd = (moment(this.dateNow)).format('DD/MM/YYYY HH:mm');

    this.service.save(this.data.customerService)
    .subscribe(result => { 

      if (this.data.customerServices == undefined)
        this.data.customerServices = [];

      this.showTable = true;

      this.data.customerServices.push(result);

      if (this.table != undefined)
        this.table.renderRows();

      this.isLoading = false;

      this.new();
      this.requestMatSelectElement.focus();

      this.openSnackBar('Atendimento salvo com sucesso! ', 'Ok');
    })
  }

  isValid():boolean {
    this.companyFormControl.updateValueAndValidity();
    this.quantityFormControl.updateValueAndValidity();
    this.requestFormControl.updateValueAndValidity();
    this.hourStartFormControl.updateValueAndValidity();
    this.minuteStartFormControl.updateValueAndValidity();
    this.hourEndFormControl.updateValueAndValidity();
    this.minuteEndFormControl.updateValueAndValidity();

    if (this.quantityFormControl.errors || this.requestFormControl.errors ||
    this.hourStartFormControl.errors || this.minuteStartFormControl.errors ||
    this.hourEndFormControl.errors || this.minuteEndFormControl.errors || 
    this.companyFormControl.errors)
      return false;

    if (this.data.customerService.quantity == null || this.data.customerService.request == null ||
    this.hoursStart == null || this.minutesStart == null ||
    this.hoursEnd == null || this.minutesEnd == null)
      return false;

    return true;
  }

  remove(customerService: CustomerService): void {

    this.service.remove(customerService.id).subscribe(() => {
    
      const index = this.data.customerServices.findIndex((service: CustomerService) => service.id === customerService.id);
      
      if (index !== -1) 
        this.data.customerServices.splice(index, 1);

      this.table.renderRows();

      this.isLoading = false;

      this.openSnackBar('Atendimento removido com sucesso! ', 'Ok');
    });
  }

}
