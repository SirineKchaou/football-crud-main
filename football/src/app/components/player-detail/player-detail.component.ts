import {Component, OnInit} from '@angular/core';
import {Player} from '../../models/player/player.module';
import {ActivatedRoute, Router} from '@angular/router';
import {PlayerService} from '../../services/player.service';

@Component({
  selector: 'app-player-detail',
  imports: [],
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.css'
})
export class PlayerDetailComponent implements OnInit {

  player: Player = {} as Player;


  constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router) {
  }

  ngOnInit(): void {
    this.getPlayer();
  }
  getPlayer(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const id = parseInt(idParam, 10);

      if (!isNaN(id)) {
        this.playerService.getPlayerById(id).subscribe(player => this.player = player);
      } else {
        console.log("Error: Invalid ID");
      }
    } else {
      console.log("Error: ID is null");
    }
  }

  goBack(): void{
    window.history.pushState({}, '', '/players');
    window.location.reload();
  }


}
