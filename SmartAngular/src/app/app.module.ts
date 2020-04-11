import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductDetailListComponent } from './product-detail-list/product-detail-list.component';
import { ProductDetailService } from './shared/product-detail.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from './shared/exportexcel.service';
import { ProductEditComponent } from './product-edit/product-edit.component';
// SmartAngular
@NgModule({
  declarations: [
    AppComponent,
    ProductDetailComponent,
    ProductDetailListComponent,
    ProductEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [ProductDetailService,ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
