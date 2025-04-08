# USERS-MANAGEMENT

Un système complet de gestion d'utilisateurs avec API REST et interface utilisateur moderne.

## 🚀 Fonctionnalités

- **API REST** : Gestion complète des utilisateurs (CRUD)
- **Interface Utilisateur** : Design moderne et responsive
- **Base de données** : Stockage sécurisé avec MySQL
- **Tests** : Couverture complète des tests unitaires et d'intégration
- **CI/CD** : Pipeline automatisé avec GitHub Actions
- **Docker** : Conteneurisation pour un déploiement facile

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- MySQL (v8 ou supérieur)
- Docker et Docker Compose (optionnel)
- npm ou yarn

## 🛠️ Installation

### Installation Locale

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/users-management.git
   cd users-management
   ```

2. **Configuration de la base de données**
   ```bash
   # Copier les fichiers d'exemple
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Modifier les variables d'environnement selon votre configuration
   ```

3. **Installation des dépendances**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

4. **Initialisation de la base de données**
   ```bash
   cd backend
   npm run init-db
   ```

### Installation avec Docker

1. **Construire et démarrer les conteneurs**
   ```bash
   docker-compose up -d
   ```

## 🚀 Démarrage

### Mode Développement

1. **Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm start
   ```

### Mode Production

1. **Backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run build
   npm run serve
   ```

## 📚 Documentation API

### Endpoints

#### Utilisateurs

- `GET /api/users` : Récupérer tous les utilisateurs
- `GET /api/users/:id` : Récupérer un utilisateur spécifique
- `POST /api/users` : Créer un nouvel utilisateur
- `PUT /api/users/:id` : Mettre à jour un utilisateur
- `DELETE /api/users/:id` : Supprimer un utilisateur

### Format des Données

#### Création/Mise à jour d'utilisateur
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

## 🧪 Tests

### Exécution des Tests

```bash
# Tests Backend
cd backend
npm test

# Tests Frontend
cd frontend
npm test
```

### Couverture des Tests

```bash
# Backend
cd backend
npm run test:coverage

# Frontend
cd frontend
npm run test:coverage
```

## 🔄 CI/CD

Le projet utilise GitHub Actions pour l'intégration continue et le déploiement continu. Le pipeline :

1. Vérifie le code
2. Exécute les tests
3. Construit l'image Docker
4. Déploie sur Docker Hub

## 📦 Structure du Projet

```
users-management/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── controllers/
│   │   └── tests/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── Dockerfile
│   └── package.json
├── .github/
│   └── workflows/
├── docker-compose.yml
└── README.md
```

## 🔒 Sécurité

- Validation des données
- Protection contre les injections SQL
- Gestion sécurisée des mots de passe
- Headers de sécurité configurés
- Rate limiting

## 🌐 Environnements

- **Développement** : `http://localhost:3000` (Frontend) et `http://localhost:5000` (Backend)
- **Production** : URLs de production à configurer

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- Votre Nom - [@votre-username](https://github.com/votre-username)

## 🙏 Remerciements

- Liste des bibliothèques et outils utilisés
- Crédits aux contributeurs
- Ressources inspirantes 