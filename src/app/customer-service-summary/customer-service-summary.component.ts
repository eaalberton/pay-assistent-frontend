import { AfterViewChecked, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../service/auth.service';
import { MatSelect } from '@angular/material/select';
import { CustomerServiceService } from '../service/customer-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerServiceDetailComponent } from '../customer-service-detail/customer-service-detail.component';

export class Shift {
  value: string;
  viewValue: string;
}

export class Merchant {
  id: number;
  name: string;
  platform: string;
  platformRequest: string;
}

export class User {
  id: number;
  name: string;
  shift: string;
}

export class Request {
  id: number;
  name: string;
}

export class MerchantCustomerService {
  requests: Request[];
  customerServices: CustomerService[];

  customerService: CustomerService;
}

export class SupportLevel {
  value: string;
}

export class CustomerService {
  id: number;

  merchant: Merchant;

  request: Request | undefined;

  user: User;

  dateStart: string;

  dateEnd: string;

  shift: string;

  supportLevel: string;

  quantity: number;
}

export class ServiceSummaryDto {
  id: number;

  merchant: string;

  quantity: number;
}

@Component({
  selector: 'app-customer-service-summary',
  templateUrl: './customer-service-summary.component.html',
  styleUrls: ['./customer-service-summary.component.css']
})
export class CustomerServiceSummaryComponent implements AfterViewChecked {

  @ViewChild('merchant') merchantMatSelectElement: MatSelect;

  merchantCustomerService = new MerchantCustomerService();

  customerService = new CustomerService;

  summary: ServiceSummaryDto[];

  user = new User();

  merchants: Merchant[];

  requests: Request[];

  selectedShift: string;

  selectedMerchant: Merchant;

  initialMerchant: Merchant;

  displayedColumns: string[] = ['merchant', 'quantity', 'actions'];


  shifts: Shift[] = [
    {value: 'MADRUGADA', viewValue: 'Madrugada'},
    {value: 'COMERCIAL', viewValue: 'Comercial'},
    {value: 'NOTURNO', viewValue: 'Noturno'},
  ];

  isValueChanged:boolean = true;
  isLoading:boolean = false;

  merchantFormControl = new FormControl('', [Validators.required]);

  constructor(
    private service:CustomerServiceService,
    private _snackBar: MatSnackBar,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.validadeAuth();

    this.findUserById();   
  }

  ngAfterViewInit() {
    this.merchantMatSelectElement.focus();

    this.findAllMerchants();

    this.findAllRequests();
  }

  validadeAuth() {
    this.authService.validadeAuth().subscribe()
  }

  // Initially fill the selectedMerchants so it can be used in the for loop** 
  selectedMerchants: Merchant[];

  // Receive user input and send to search method**
  onKey(value: any) { 
    this.selectedMerchants = this.search(value);
  }

  // Filter the states list and send back to populate the selectedStates**
  search(value: string) { 
    let filter = value.toLowerCase();
    return this.merchants.filter(option => option.name.toLowerCase().startsWith(filter));
  }

  findAllMerchants() {
    this.service.findAllMerchants()
    .subscribe(result => { 
      this.merchants = result;
      this.selectedMerchants = result;
    })
  }

  findAllRequests() {
    this.service.findAllRequests()
    .subscribe(result => { 
      this.requests = result;
    })
  }

  findUserById() {
    const id = this.authService.getUserId();

    if (id !== null) {
      this.authService.findUserById(id)
      .subscribe(result => { 
        this.user = result;
        this.findCustomerServicesSummary();
      })
    }  
  }

  findCustomerServicesSummary() {
    this.service.findSummary(this.user.id)
    .subscribe(result => { 
      this.summary = result;
    })
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000 });
  }

  add(serviceSummary: ServiceSummaryDto){
    this.selectedMerchant = this.merchants.find(option => option.id === serviceSummary.id) ?? new Merchant;
    this.openDialog();
  }

  new() {
    this.merchantFormControl.clearValidators();

    this.selectedMerchant = this.initialMerchant;
  }

  isValid():boolean {
    this.merchantFormControl.updateValueAndValidity();

    if (this.merchantFormControl.errors)
      return false;

    if (this.selectedMerchant == null)
      return false;

    return true;
  }


  openDialog(): void {

    this.merchantFormControl.addValidators(Validators.required);

    if (!this.isValid())
      return;

    this.customerService.merchant = this.selectedMerchant;
    this.customerService.user = this.user;
    
    const dialogRef = this.dialog.open(CustomerServiceDetailComponent, {
      data: {
        customerService: this.customerService,
        requests: this.requests
      },
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      this.findCustomerServicesSummary();
      this.new();
      this.merchantMatSelectElement.focus();
    });
  }

  getTotal() {
    if (this.summary != undefined)
      return this.summary.map(t => t.quantity).reduce((acc, value) => acc + value, 0);
    else 
      return null;
  }

}
