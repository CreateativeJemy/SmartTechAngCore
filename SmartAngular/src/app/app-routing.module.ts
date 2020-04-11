import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailListComponent } from './product-detail-list/product-detail-list.component';
import { ProductDetailService } from './shared/product-detail.service';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';


const routes: Routes = [
  { path:'',redirectTo:'products',pathMatch:'full' },
  { path:'products',component:ProductDetailListComponent },
  { path:'product/create',component:ProductDetailComponent },
  { path:'product/edit/:id',component:ProductEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
