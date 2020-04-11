import { Injectable } from '@angular/core';
import { ProductDetail } from './product-detail.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {
  listData: ProductDetail[];
  fileToUpload: File = null;
  productDetail:ProductDetail;
  constructor(private http: HttpClient,formBuilder:FormBuilder) { 
    
  }

  refreshProducts(){
    return this.http.get(environment.apiUrl+'/Product/GetProducts')
                    .subscribe(res =>{ this.listData = res as ProductDetail[]});
                    //.toPromise().then(res => this.listData = res as ProductDetail[]);
  }
  GetProduct(id:number):any{
    return this.http.get(environment.apiUrl+'/Product/GetProduct/'+id);
  }
  SaveImage(){
    const formDataApi: FormData = new FormData();
    formDataApi.append("File",this.fileToUpload,this.fileToUpload.name);
    return this.http.post(environment.apiUrl+'/Product/SaveImage',formDataApi);
  }

  postProduct(formData: any){
    const formDataApi: FormData = new FormData();
    formDataApi.append("Name",formData.name);
    formDataApi.append("Price",formData.price.toString());
    formDataApi.append("Photo",formData.photo);
    if(this.fileToUpload != null)
    formDataApi.append("File",this.fileToUpload,this.fileToUpload.name);
    return this.http.post(environment.apiUrl+'/Product/AddProduct',formDataApi);
  }

  putProduct(formData: any){
    const formDataApi: FormData = new FormData();
    formDataApi.append("Name",formData.name);
    formDataApi.append("Price",formData.price.toString());
    formDataApi.append("Photo",formData.photo);
    if(this.fileToUpload != null)
    formDataApi.append("File",this.fileToUpload,this.fileToUpload.name);
    return this.http.put(environment.apiUrl+'/Product/UpdateProduct/'+ formData.id,formDataApi);
  }

  deleteProduct(id:number){
    return this.http.delete(environment.apiUrl+'/Product/DeleteProduct/'+id);
  }
}
