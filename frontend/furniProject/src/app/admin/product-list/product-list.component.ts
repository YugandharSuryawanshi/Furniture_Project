import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap
} from 'rxjs/operators';

import { AdminApiService } from '../../service/admin-api.service';
import { ToastrService } from 'ngx-toastr';
import { ImageService } from '../../service/image.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {

  display = true;
  displayUpdateForm = false;

  loadingProducts = true;
  isLoadingProductDetails = false;
  isLoadingProductTypes = false;
  isUpdatingProduct = false;

  products: any[] = [];
  productTypes: any[] = [];

  searchStr = '';

  selectedImages: File[] = [];
  selectedImagePreviews: string[] = [];

  productColor = '#000000';

  productImages: string[] = [];

  /*
   * NOTE:
   * API calls are handled through AdminApiService and interceptor.
   * Image URLs are handled separately because <img src=""> does not
   * pass through Angular HttpClient interceptor.
   *
   * Keep this only for the existing backend upload location.
   */
  basePath = 'http://localhost:1000/uploads/';

  canShowImages = true;

  /*
   * Search handling
   */
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  /*
   * Used to prevent old product-list requests from hiding the
   * skeleton of a newer request.
   */
  private productRequestId = 0;

  /*
   * Prevent duplicate delete requests.
   */
  deletingProductId: number | null = null;

  formData: any = {
    product_id: '',
    product_type_id: '',
    product_name: '',
    product_price: '',
    duplicate_price: '',
    product_image: '',
    product_size: '',
    product_color: '',
    product_lable: '',
    product_details: '',
    product_brand: '',
    product_weight: '',
    no_of_pieces: '',
    product_pattern: '',
    product_origin: '',
    product_material: '',
    product_warranty: '',
    product_care_instructions: '',
    additional_details: '',
    gst_percentage: '',
    discount_percentage: ''
  };

  constructor(
    private adminApi: AdminApiService,
    private toastr: ToastrService,
    public imageService: ImageService
  ) { }


  ngOnInit(): void {

    /*
     * Initial product list
     */
    this.getProducts();

    /*
     * Product types
     */
    this.getProductTypes();

    /*
     * Debounced product search
     *
     * User types:
     * chair
     *
     * API call will happen only after the user stops typing
     * for 500ms.
     */
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchValue: string) => {

          const value = searchValue.trim();

          /*
           * Empty search => load all products
           */
          if (!value) {
            this.loadingProducts = true;

            return this.adminApi.getProducts().pipe(
              finalize(() => {
                // handled below through request id
              })
            );
          }

          /*
           * Search API
           */
          this.loadingProducts = true;

          return this.adminApi.searchProducts(
            encodeURIComponent(value)
          );
        })
      )
      .subscribe({
        next: (res: any) => {

          this.products = res?.products ?? [];

          this.finishProductLoading();

        },

        error: (error) => {

          console.error('Error searching products:', error);

          this.products = [];

          this.finishProductLoading();

          this.toastr.error(
            error?.error?.message || 'Error while searching products',
            'Error'
          );
        }
      });
  }


  ngOnDestroy(): void {

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    this.searchSubject.complete();
  }


  /*
   * ---------------------------------------------------------
   * PRODUCT LIST
   * ---------------------------------------------------------
   */

  getProducts(): void {

    const requestId = ++this.productRequestId;

    this.loadingProducts = true;

    const startTime = Date.now();

    this.adminApi.getProducts()
      .pipe(
        finalize(() => {

          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(700 - elapsed, 0);

          setTimeout(() => {

            if (requestId === this.productRequestId) {
              this.loadingProducts = false;
            }

          }, remainingTime);

        })
      )
      .subscribe({

        next: (res: any) => {

          this.products = res?.products ?? [];

        },

        error: (error) => {

          console.error(
            'Error fetching products:',
            error
          );

          this.products = [];

          this.toastr.error(
            error?.error?.message ||
            'Error while fetching products',
            'Error'
          );
        }

      });
  }


  /*
   * ---------------------------------------------------------
   * PRODUCT SEARCH
   * ---------------------------------------------------------
   *
   * Called from input event.
   * Actual API request is handled by the debounced Subject.
   */

  onSearchInput(): void {

    this.searchSubject.next(
      this.searchStr || ''
    );
  }


  /*
   * Search button / Enter key
   *
   * We directly trigger the same search Subject.
   */
  searchProducts(): void {

    this.searchSubject.next(
      this.searchStr || ''
    );
  }


  /*
   * Keeps product skeleton visible for minimum 700ms.
   */
  private finishProductLoading(): void {

    const currentRequestId = this.productRequestId;

    setTimeout(() => {

      if (currentRequestId === this.productRequestId) {
        this.loadingProducts = false;
      }

    }, 700);
  }


  /*
   * ---------------------------------------------------------
   * PRODUCT TYPES
   * ---------------------------------------------------------
   */

  getProductTypes(): void {

    this.isLoadingProductTypes = true;

    this.adminApi.getProductTypes()
      .pipe(
        finalize(() => {
          this.isLoadingProductTypes = false;
        })
      )
      .subscribe({

        next: (res: any) => {

          this.productTypes =
            res?.product_types ?? [];

        },

        error: (error) => {

          console.error(
            'Error fetching product types:',
            error
          );

          this.productTypes = [];

          this.toastr.error(
            error?.error?.message ||
            'Error while fetching product types',
            'Error'
          );
        }

      });
  }


  /*
   * ---------------------------------------------------------
   * GET SINGLE PRODUCT
   * ---------------------------------------------------------
   */

  get_This_Product(product_id: any): void {

    this.display = false;
    this.displayUpdateForm = true;

    this.isLoadingProductDetails = true;

    this.selectedImages = [];
    this.selectedImagePreviews = [];

    this.productImages = [];

    this.canShowImages = true;

    this.adminApi.getProduct(product_id)
      .pipe(
        finalize(() => {
          this.isLoadingProductDetails = false;
        })
      )
      .subscribe({

        next: (res: any) => {

          if (!res?.single_product) {
            this.toastr.error(
              'Product details not found',
              'Error'
            );

            this.backToProductList();

            return;
          }

          /*
           * Load product data
           */
          this.formData = {
            ...this.formData,
            ...res.single_product
          };

          /*
           * Product color
           */
          this.productColor =
            res.single_product.product_color ||
            '#000000';

          /*
           * Existing product images
           */
          this.productImages = [];

          if (
            res.images &&
            res.images.length > 0 &&
            res.images[0]
          ) {

            this.productImages =
              res.images[0]
                .split(',')
                .map((image: string) => image.trim())
                .filter((image: string) => image);

          }

          /*
           * Keep existing image visibility
           */
          this.canShowImages = true;

        },

        error: (error) => {

          console.error(
            'Error fetching product details:',
            error
          );

          this.toastr.error(
            error?.error?.message ||
            'Error while fetching product details',
            'Error'
          );

          this.backToProductList();
        }

      });
  }


  /*
   * ---------------------------------------------------------
   * IMAGE SELECTION
   * ---------------------------------------------------------
   */

  onImageSelect(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files) {
      return;
    }

    this.selectedImages =
      Array.from(input.files);

    this.selectedImagePreviews = [];

    this.canShowImages = false;

    /*
     * Generate previews
     */
    this.selectedImages.forEach(
      (file: File) => {

        const reader =
          new FileReader();

        reader.onload = () => {

          if (reader.result) {

            this.selectedImagePreviews.push(
              reader.result as string
            );

          }

        };

        reader.readAsDataURL(file);
      }
    );
  }


  /*
   * ---------------------------------------------------------
   * UPDATE PRODUCT
   * ---------------------------------------------------------
   */

  updateProduct(): void {

    if (this.isUpdatingProduct) {
      return;
    }

    this.isUpdatingProduct = true;

    const formData =
      new FormData();

    formData.append(
      'product_type_id',
      this.formData.product_type_id || ''
    );

    formData.append(
      'product_name',
      this.formData.product_name || ''
    );

    formData.append(
      'product_price',
      this.formData.product_price || ''
    );

    formData.append(
      'duplicate_price',
      this.formData.duplicate_price || ''
    );

    formData.append(
      'product_size',
      this.formData.product_size || ''
    );

    formData.append(
      'product_color',
      this.formData.product_color || ''
    );

    formData.append(
      'product_lable',
      this.formData.product_lable || ''
    );

    formData.append(
      'product_details',
      this.formData.product_details || ''
    );

    formData.append(
      'product_brand',
      this.formData.product_brand || ''
    );

    formData.append(
      'product_weight',
      this.formData.product_weight || ''
    );

    formData.append(
      'no_of_pieces',
      this.formData.no_of_pieces || ''
    );

    formData.append(
      'product_pattern',
      this.formData.product_pattern || ''
    );

    formData.append(
      'product_origin',
      this.formData.product_origin || ''
    );

    formData.append(
      'product_material',
      this.formData.product_material || ''
    );

    formData.append(
      'product_warranty',
      this.formData.product_warranty || ''
    );

    formData.append(
      'product_care_instructions',
      this.formData.product_care_instructions || ''
    );

    formData.append(
      'additional_details',
      this.formData.additional_details || ''
    );

    formData.append(
      'gst_percentage',
      this.formData.gst_percentage || ''
    );

    formData.append(
      'discount_percentage',
      this.formData.discount_percentage || ''
    );

    /*
     * Selected new images
     */
    this.selectedImages.forEach(
      (image: File) => {

        formData.append(
          'product_image',
          image
        );

      }
    );

    this.adminApi
      .updateProduct(
        this.formData.product_id,
        formData
      )
      .pipe(
        finalize(() => {
          this.isUpdatingProduct = false;
        })
      )
      .subscribe({

        next: (res: any) => {

          if (
            res?.success === false
          ) {

            this.toastr.error(
              res?.message ||
              'Product update failed',
              'Error'
            );

            return;
          }

          this.toastr.success(
            res?.message ||
            'Product updated successfully',
            'Success'
          );

          this.clearProductEditData();

          this.displayUpdateForm = false;
          this.display = true;

          this.getProducts();
        },

        error: (error) => {

          console.error(
            'Error updating product:',
            error
          );

          this.toastr.error(
            error?.error?.message ||
            'Error while updating product',
            'Error'
          );
        }

      });
  }


  /*
   * ---------------------------------------------------------
   * DELETE PRODUCT
   * ---------------------------------------------------------
   */

  deleteProduct(product_id: any): void {

    /*
     * Prevent another delete request while one
     * product deletion is already running.
     */
    if (this.deletingProductId !== null) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this product?'
      );

    if (!confirmed) {
      return;
    }

    this.deletingProductId =
      Number(product_id);

    this.adminApi
      .deleteProduct(product_id)
      .pipe(
        finalize(() => {

          /*
           * Always unlock delete button,
           * whether API succeeds or fails.
           */
          this.deletingProductId = null;

        })
      )
      .subscribe({

        next: (res: any) => {

          if (
            res?.success === false
          ) {

            this.toastr.error(
              res?.message ||
              'Product deletion failed',
              'Error'
            );

            return;
          }

          this.toastr.success(
            res?.message ||
            'Product deleted successfully',
            'Success'
          );

          /*
           * Refresh product list
           */
          this.getProducts();
        },

        error: (error) => {

          console.error(
            'Error deleting product:',
            error
          );

          this.toastr.error(
            error?.error?.message ||
            'Error while deleting product',
            'Error'
          );
        }

      });
  }


  /*
   * ---------------------------------------------------------
   * BACK TO PRODUCT LIST
   * ---------------------------------------------------------
   */

  backToProductList(): void {

    this.displayUpdateForm = false;
    this.display = true;

    this.isLoadingProductDetails = false;

    this.clearProductEditData();
  }

//  Clear Edit Data

  private clearProductEditData(): void {

    this.selectedImages = [];

    this.selectedImagePreviews = [];

    this.productImages = [];

    this.canShowImages = true;

    this.productColor = '#000000';

    this.formData = {
      product_id: '',
      product_type_id: '',
      product_name: '',
      product_price: '',
      duplicate_price: '',
      product_image: '',
      product_size: '',
      product_color: '',
      product_lable: '',
      product_details: '',
      product_brand: '',
      product_weight: '',
      no_of_pieces: '',
      product_pattern: '',
      product_origin: '',
      product_material: '',
      product_warranty: '',
      product_care_instructions: '',
      additional_details: '',
      gst_percentage: '',
      discount_percentage: ''
    };
  }

  getProductImageUrl(image: string): string {

    if (!image) {
      return '';
    }

    return this.imageService.getImageUrl(image);
  }

}