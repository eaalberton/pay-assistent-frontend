import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CheckContestationComponent } from './check-contestation/check-contestation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HomeComponent } from './home/home.component';
import { MenuBarComponent } from './menu/menu-bar/menu-bar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ImportContestationComponent } from './import-contestation/import-contestation.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { TokenInterceptorService } from './service/token-interceptor.service';
import { HttpErrorInterceptor } from './service/http-error.interceptor';
import { CustomerServiceSummaryComponent } from './customer-service-summary/customer-service-summary.component';
import { CustomerServiceDetailComponent } from './customer-service-detail/customer-service-detail.component';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconButtonSizesModule } from 'mat-icon-button-sizes';
import { ReceiptComponent } from './receipt/receipt.component';



@NgModule({
  declarations: [
    AppComponent,
    CheckContestationComponent,
    HomeComponent,
    MenuBarComponent,
    ImportContestationComponent,
    LoginFormComponent,
    CustomerServiceSummaryComponent,
    CustomerServiceDetailComponent,
    ReceiptComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatIconButtonSizesModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: TokenInterceptorService, 
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
