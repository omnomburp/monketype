import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  wpm : string = "";
  accuracy : string = "";

  constructor(private route: ActivatedRoute, private router: Router){}

  ngOnInit() : void {
    const tempWpm = this.route.snapshot.paramMap.get('WPM');
    this.wpm = tempWpm ? tempWpm.toString() : "";
    const tempAcc = this.route.snapshot.paramMap.get('ACC');
    this.accuracy = tempAcc ? tempAcc.toString() : "";
  }

  restartGame() : void {
    this.router.navigate(['/']);
  }
}
