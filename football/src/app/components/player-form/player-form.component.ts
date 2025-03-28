import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Player, PlayerPosition } from '../../models/player/player.module';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit {
  playerForm: FormGroup;
  playerId: number | null = null;
  positions = Object.values(PlayerPosition);

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,

    private router: Router,
    private route: ActivatedRoute
  ) {
    this.playerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: ['', Validators.required],
      team: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(16)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.playerId = +id;
        this.loadPlayer(this.playerId);
      }
    });
  }

  loadPlayer(id: number): void {
    this.playerService.getPlayerById(id).subscribe(player => {
      this.playerForm.patchValue(player);
    });
  }

  savePlayer(): void {
    if (this.playerForm.invalid) return;

    const playerData: Player = { id: this.playerId || 0, ...this.playerForm.value };


      this.playerService.addPlayer(playerData).subscribe(() => {
        this.router.navigate(['/players']);
      });

  }


}
