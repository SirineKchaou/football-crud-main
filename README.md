# Football Player Management Application

Cette application permet de gérer une liste de joueurs de football via une API REST avec Symfony pour le backend et Angular pour le frontend. Elle prend en charge les opérations CRUD (Create, Read, Update, Delete) et l'importation de joueurs depuis un fichier XLSX.

## Prérequis

Avant de commencer, assurez-vous que vous avez les outils suivants installés sur votre machine :

- PHP (version 8.0 ou supérieure)
- Composer
- Node.js (version 14 ou supérieure)
- Angular CLI
- MySQL ou une autre base de données compatible

## Installation

### 1. Dézipper le projet

Si vous avez reçu le projet sous forme de fichier ZIP, commencez par le dézipper sur votre machine locale. Par exemple :

```bash
unzip football-player-management.zip
cd football-player-management
```
### 2. Backend (Symfony)
   Installation des dépendances
   Allez dans le répertoire du backend :

```bash
cd backend
```

Installez les dépendances PHP via Composer :

```bash
composer install
```
Configuration de la base de données
Configurez les paramètres de la base de données dans .env :

```bash
DATABASE_URL="mysql://root:password@127.0.0.1:3306/football"
```

Créez la base de données et les tables :

```bash
php bin/console doctrine:database:create
php bin/console doctrine:schema:update --force
```

##### Démarrage du serveur Symfony
Pour démarrer le serveur backend Symfony, exécutez la commande suivante :

```bash
php bin/console server:run
```

Ou utilisez la commande personnalisée app:start pour démarrer à la fois les serveurs Symfony et Angular :

```bash
php bin/console app:start
```

### 3. Frontend (Angular)
   Installation des dépendances
   Allez dans le répertoire du frontend :

```bash
cd frontend
```

Installez les dépendances Node.js avec npm :

```bash
npm install
```

Démarrage du serveur Angular
Pour démarrer le serveur frontend Angular, exécutez la commande suivante :

```bash
ng serve
```

Cela démarre l'application Angular sur http://localhost:4200.

### 4. Commande personnalisée app:start
   
La commande personnalisée app:start permet de démarrer à la fois les serveurs Symfony et Angular simultanément. Pour l'utiliser, exécutez simplement :

```bash
php bin/console app:start
```

Cela lancera à la fois le serveur Symfony (backend) et le serveur Angular (frontend) sur leurs ports respectifs.
