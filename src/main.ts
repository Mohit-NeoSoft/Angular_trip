import { bootstrapApplication } from '@angular/platform-browser';
import { TripVisualizerComponent } from './app/trip-visualizer/trip-visualizer.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

bootstrapApplication(TripVisualizerComponent, {
  providers: [importProvidersFrom(FormsModule)],
}).catch(err => console.error(err));
