import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CheckContestationComponent } from './check-contestation/check-contestation.component';
import { ImportContestationComponent } from './import-contestation/import-contestation.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { CustomerServiceSummaryComponent } from './customer-service-summary/customer-service-summary.component';
import { ReceiptComponent } from './receipt/receipt.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'check-contestations',
    component: CheckContestationComponent,
    data: { title: 'Contestações', role: 'contestations' }
  },
  {
    path: 'import-contestations',
    component: ImportContestationComponent,
    data: { title: 'Contestações', role: 'contestations' }
  },
  {
    path: 'service-management',
    component: CustomerServiceSummaryComponent,
    data: { title: 'Atendimentos', role: 'service' }
  },
  {
    path: 'generate-receipt',
    component: ReceiptComponent,
    data: { title: 'Comprovantes', role: 'receipts' }
  },
  {
    path: 'auth',
    component: LoginFormComponent,
    data: { title: 'Login', role: 'login' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
