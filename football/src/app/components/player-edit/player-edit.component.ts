import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Player} from '../../models/player/player.module';
import {ActivatedRoute, Router} from '@angular/router';
import {PlayerService} from '../../services/player.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-player-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-edit.component.html',
  styleUrl: './player-edit.component.css'
})
export class PlayerEditComponent implements OnInit {
  playerForm!: FormGroup; // Add definite assignment assertion
  player: Player | null = null; // Initialize as null
  positions: string[] = ['Attaquant', 'Milieu', 'Défenseur', 'Gardien'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playerService: PlayerService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getPlayer();
  }

  initForm(): void {
    this.playerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: ['', Validators.required],
      team: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(16)]]
    });
  }

  getPlayer(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.playerService.getPlayerById(id).subscribe(player => {
        this.player = player;
        this.playerForm.patchValue(player);
      });
    }
  }

  onSubmit(): void {
    if (this.playerForm.invalid || !this.player) {
      return;
    }

    const updatedPlayer = this.playerForm.value;
    this.playerService.updatePlayer(this.player.id, updatedPlayer).subscribe({
      next: () => {
        this.router.navigate(['/players']);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du joueur', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/players']);
  }
}
