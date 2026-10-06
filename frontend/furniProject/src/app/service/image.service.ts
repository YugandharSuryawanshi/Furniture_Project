import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  // readonly IMAGE_BASE_URL = 'https://furniture-backend-ssa5.onrender.com/uploads/';
  // IMAGE_BASE_URL = 'http://localhost:4000/uploads/';
  IMAGE_BASE_URL = `${environment.apiUrl}/uploads/`;

  getImageUrl(imageName: string | null | undefined): string {

    if (!imageName) {
      return 'assets/images/no-image.png';
    }

    return `${this.IMAGE_BASE_URL}${imageName}`;
  }
}