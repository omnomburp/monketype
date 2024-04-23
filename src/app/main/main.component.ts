import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChildren, ViewChild, Renderer2 } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent implements AfterViewInit{

  @ViewChild('myInput') divElement?: ElementRef;
  @ViewChild('myButton') btnElement?: ElementRef;
  @ViewChildren('hint') elements?: QueryList<ElementRef>;
  spanArray : ElementRef[] = [];
  words: string = ""; 
  title : string = 'Welcome to bad typing test';
  currIndex : number = 0;
  timer? : number;
  timeWorker? : Worker;
  wpm : number = 0;
  accuracy : number = 0;

  constructor(private http: HttpClient, private renderer: Renderer2, public router: Router) {

  }

  ngOnInit() : void {
    this.timeWorker = new Worker(new URL('../app.worker', import.meta.url));
    
    this.timeWorker.onmessage = (event) => {
      if (event.data.type === 'UPDATE_TIMER') {
        this.timer = event.data.timer;
      }
      if (event.data.type === 'TIME_ENDED') {
        for (let i = 0; i < this.currIndex; ++i) {
          if (this.spanArray[i].nativeElement.textContent == ' ') {
            this.wpm += 2;
          }
        }
        this.accuracy = 100 - Math.floor((this.accuracy / this.currIndex) * 100);
        this.router.navigate(['/stats', this.wpm, this.accuracy]);
        this.timeWorker?.terminate();
      }
    }
    this.timer = 30;
    this.http.get('assets/words.json')
    .subscribe(response => {
      let temp = response as string[];
      let temp2 = [];
      for (let i = 0; i < 60; ++i) {
        temp2.push(temp[this.getRandomNum()]);
      }
      this.words = temp2.join(' ');
    });

    this.renderer.setStyle(this.divElement?.nativeElement, 'display', 'none');
  }

  ngAfterViewInit() : void {
    setTimeout(() => {
      this.spanArray = (this.elements?.toArray() as ElementRef[]);
    }, 0);
    this.spanArray?.[0].nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }

  ngOnDestroy() {
    this.timeWorker?.terminate();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === this.spanArray?.[this.currIndex].nativeElement.textContent) {
      this.renderer.setStyle(this.spanArray?.[this.currIndex].nativeElement, 'color', 'white');
      this.renderer.setStyle(this.spanArray?.[this.currIndex].nativeElement, 'font-size', '30px');
    }
    else if (event.key === 'Backspace' && this.currIndex != 0) {
      this.renderer.setStyle(this.spanArray?.[this.currIndex-1].nativeElement, 'color', '#999');
      this.renderer.setStyle(this.spanArray?.[this.currIndex].nativeElement, 'font-size', '30px');
      this.currIndex -= 2;
    }
    else {
      this.renderer.setStyle(this.spanArray?.[this.currIndex].nativeElement, 'color', 'red');
      this.renderer.setStyle(this.spanArray?.[this.currIndex].nativeElement, 'font-size', '30px');
      ++this.accuracy;
    }
    ++this.currIndex;
    this.renderer.setStyle(this.spanArray?.[this.currIndex].nativeElement, 'font-size', '35px');
  }

  getRandomNum() : number {
    const min : number = 0;
    const max : number = 140;
    const randomNumber : number = Math.floor(Math.random() * (max - min + 1) + min);
    return randomNumber;
  }

  startGame() : void {
    this.timeWorker?.postMessage('START_TIMER');
    this.renderer.setStyle(this.btnElement?.nativeElement, 'display', 'none');
    this.renderer.setStyle(this.divElement?.nativeElement, 'display', 'block');
  }


}
