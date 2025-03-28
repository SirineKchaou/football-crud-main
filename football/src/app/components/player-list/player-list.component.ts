import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Player} from '../../models/player/player.module';
import {PlayerService} from '../../services/player.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-player-list',
  imports: [CommonModule],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css'
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  errorMessage: string = '';
  isAuthenticated: boolean = false;

  selectedFile: File | null = null;

  constructor(private playerService: PlayerService, private router: Router, private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {

    this.getPlayers();
    this.isAuthenticated = this.authService.isAuthenticated();
  }


  getPlayers(): void {
    this.playerService.getPlayers().subscribe({
      next: (data) => {
        console.log('Liste des joueurs:', data);
        this.players = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des joueurs', err);
      }
    });
  }



  deletePlayer(id: number): void {
    this.playerService.deletePlayer(id).subscribe({
      next: () => {
        this.players = this.players.filter(player => player.id !== id);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression du joueur';
      }
    });
  }

  goToPlayerDetail(playerId: number): void {
    this.router.navigate(['/player/detail', playerId]);
  }

  goToPlayerUpdate(playerId: number): void {
    this.router.navigate(['/player/edit/', playerId]);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      this.selectedFile = input.files[0];
    }
  }


  onFileSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);


      this.http.post('/players/import', formData).subscribe({
        next: (response) => {
          console.log('Importation réussie:', response);
          this.getPlayers();
        },
        error: (error) => {
          console.error('Erreur lors de l\'importation:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
