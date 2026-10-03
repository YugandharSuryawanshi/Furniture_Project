import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../service/loading.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

  loading$ = this.loadingService.loading$;

  constructor(
    private loadingService: LoadingService
  ) { }

}
