import { CommonModule } from '@angular/common';
import { Component, effect, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Trip {
  start: string;
  end: string;
}

interface TripSegment extends Trip {
  type: 'continued' | 'non-continued' | 'duplicate';
  level: number;
  color: string;
}

@Component({
  selector: 'app-trip-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-visualizer.component.html',
  styleUrls: ['./trip-visualizer.component.scss'],
})
export class TripVisualizerComponent {
  start = '';
  end = '';
  search = '';
  trips = signal<Trip[]>(JSON.parse(localStorage.getItem('trips') || '[]'));

  get tripsList(): TripSegment[] {
    return this.tripSegments();
  }

  tripSegments = computed<TripSegment[]>(() => {
    const data = this.trips().filter(t =>
      t.start.toLowerCase().includes(this.search.toLowerCase()) ||
      t.end.toLowerCase().includes(this.search.toLowerCase())
    );
    const segments: TripSegment[] = [];

    for (let i = 0; i < data.length; i++) {
      const curr = data[i];
      const prev = data[i - 1];
      let type: TripSegment['type'] = 'continued';

      if (!prev) {
        type = 'continued';
      } else if (prev.end === curr.start) {
        type = 'continued';
      } else if (prev.start === curr.start && prev.end === curr.end) {
        type = 'duplicate';
      } else {
        type = 'non-continued';
      }

      const level = type === 'duplicate' ? 100 : 100;
      const color =
        type === 'continued'
          ? '#3f51b5'
          : type === 'non-continued'
            ? '#2196f3'
            : '#ffa726';

      segments.push({ ...curr, type, level, color });
    }

    return segments;
  });

  addTrip() {
    const trimmedStart = this.start.trim().toUpperCase();
    const trimmedEnd = this.end.trim().toUpperCase();
    if (trimmedStart && trimmedEnd) {
      this.trips.update(trips => [...trips, { start: trimmedStart, end: trimmedEnd }]);
      this.start = '';
      this.end = '';
      this.saveToLocalStorage();
    }
  }

  clearTrips() {
    this.trips.set([]);
    localStorage.removeItem('trips');
  }

  saveToLocalStorage() {
    localStorage.setItem('trips', JSON.stringify(this.trips()));
  }
}
