    6 ## 1. Vue d'ensemble du Projet
    7
    8 Ce document fournit une analyse technique exhaustive de l'application **"Car Rental Management System"**. L'objectif de ce projet était de développer une solution web   
      complète et moderne pour la gestion d'une flotte de véhicules de location. La plateforme s'adresse à deux types d'utilisateurs : les **clients** (qui peuvent consulter e
      réserver des voitures) et les **administrateurs** (qui disposent d'outils puissants pour gérer l'ensemble du système).
    9
   10 L'architecture est scindée en deux projets distincts :
   11 -   **`car-rental-frontend`** : Une application client riche (Single-Page Application) développée en React.
   12 -   **`car-rental-backend-express`** : Une API RESTful robuste développée avec Express.js, servant de cerveau à l'application.
   13
   14 La philosophie de conception a privilégié la modularité, la maintenabilité et une expérience utilisateur claire et efficace.
   15
   16 ## 2. Architecture et Choix Technologiques
   17
   18 ### 2.1. Diagramme d'Architecture Globale
  graph TD
      subgraph "Navigateur Client"
          A[React App]
      end

      subgraph "Serveur API (Node.js)"
          B[Express.js]
          C[Middlewares]
          D[Contrôleurs]
          E[Modèles Mongoose]
      end

      subgraph "Base de Données"
          F[(MongoDB)]
      end

      subgraph "Services Tiers"
          G[Ollama LLM]
      end

      A -- Requêtes API (HTTPS) --> B
      B --> C
      C --> D
      D --> E
      E -- Interroge --> F
      D -- Appelle --> G

      style A fill:#61DAFB
      style B fill:#8CC84B
      style F fill:#4DB33D
      style G fill:#FFA500

    1
    2 ### 2.2. Choix Technologiques et Justifications
    3
    4 #### **Frontend (`car-rental-frontend`)**
    5
    6 | Technologie          | Version    | Rôle et Justification
      |
    7 | -------------------- | ---------- |
      ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |     
    8 | **React**            | `^18.2.0`  | Bibliothèque de référence pour la création d'interfaces utilisateur dynamiques et réactives. Son écosystème mature et sa performanc
      en font un choix idéal.             |
    9 | **TypeScript**       | `^4.6.4`   | Sur-ensemble de JavaScript qui ajoute un typage statique, garantissant une meilleure robustesse du code, une auto-complétion       
      améliorée et moins d'erreurs à l'exécution. |
   10 | **Vite**             | `^3.1.0`   | Outil de build ultra-rapide qui offre un démarrage quasi instantané du serveur de développement et un HMR (Hot Module Replacement) 
      performant.                       |
   11 | **shadcn/ui**        | `latest`   | Collection de composants d'interface utilisateur réutilisables, esthétiques et accessibles, basés sur Radix UI et Tailwind CSS.    
      Accélère le développement UI.         |
   12 | **Tailwind CSS**     | `^3.3.3`   | Framework CSS "utility-first" qui permet de construire des designs personnalisés rapidement sans quitter le HTML.
      |
   13 | **React Router**     | `^6.16.0`  | Bibliothèque standard pour la gestion de la navigation (routing) dans une application React.
      |
   14 | **axios**            | `^1.13.2`  | Client HTTP basé sur les promesses, utilisé pour toutes les communications avec l'API backend. Facilite l'envoi de requêtes et la  
      gestion des réponses.             |
   15 | **Recharts**         | `latest`   | Bibliothèque de graphiques pour React. Utilisée pour construire les visualisations de données (barres, camemberts) dans le tableau 
      bord admin.                    |
   16 | **date-fns**         | `^4.1.0`   | Bibliothèque moderne et légère pour la manipulation des dates, utilisée pour le calcul de la durée des réservations.
      |
   17 | **Lucide React**     | `^0.292.0` | Bibliothèque d'icônes simple et claire, utilisée pour améliorer l'ergonomie et l'attrait visuel de l'interface.
      |
   18
   19 #### **Backend (`car-rental-backend-express`)**
   20
   21 | Technologie      | Version   | Rôle et Justification
      |
   22 | ---------------- | --------- |
      ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   23 | **Node.js**      | `LTS`     | Environnement d'exécution JavaScript côté serveur, permettant d'unifier le langage de développement sur l'ensemble de la stack.
      |
   24 | **Express.js**   | `latest`  | Framework minimaliste et flexible pour Node.js, idéal pour construire des API RESTful rapidement.
      |
   25 | **MongoDB**      | `Cloud`   | Base de données NoSQL orientée documents, choisie pour sa flexibilité et sa facilité d'utilisation avec JavaScript/JSON.
      |
   26 | **Mongoose**     | `latest`  | Bibliothèque de modélisation d'objets (ODM) pour MongoDB. Fournit une couche d'abstraction pour modéliser les données et gérer la       
      validation.                  |
   27 | **JWT**          | `latest`  | Standard ouvert (JSON Web Tokens) pour créer des jetons d'accès. Utilisé pour sécuriser les points d'API et gérer les sessions
      utilisateur.                       |
   28 | **bcryptjs**     | `latest`  | Bibliothèque pour hacher les mots de passe. Essentielle pour stocker les informations d'identification des utilisateurs de manière      
      sécurisée.                      |
   29 | **Joi**          | `latest`  | Bibliothèque de validation de schémas de données, utilisée dans un middleware pour s'assurer que les données entrantes des requêtes API 
      sont valides et propres. |
   30 | **node-cron**    | `latest`  | Permet de planifier des tâches à exécuter à des intervalles fixes (cron jobs). Utilisé pour simuler l'utilisation des voitures.
      |
   31 | **dotenv**       | `latest`  | Module pour charger les variables d'environnement depuis un fichier `.env`, gardant les secrets (clés d'API, URI de DB) hors du code    
      source.                     |
   32
   33 ## 3. Modèles de Données (Schémas Mongoose)
  erDiagram
      USER {
          ObjectId _id PK
          String email "unique"
          String password
          Boolean isAdmin "default: false"
      }

      CAR {
          ObjectId _id PK
          String brand
          String model
          Number year
          Number price
          String status "enum: AVAILABLE, RESERVED, MAINTENANCE"
          Number totalKilometers
          Number kilometersSinceLastMaintenance
          Date lastMaintenanceDate
      }

      BOOKING {
          ObjectId _id PK
          ObjectId userId FK
          ObjectId carId FK
          Date startDate
          Date endDate
          Number totalPrice
          Object options
          String insurance
          Object userDetails
      }

      MAINTENANCE_LOG {
          ObjectId _id PK
          ObjectId carId FK
          Date date
          String description
          Number cost
      }

      ACTIVITY_LOG {
          ObjectId _id PK
          ObjectId carId FK
          String activityType
          String description
          Date timestamp
      }

      USER ||--o{ BOOKING : "fait"
      CAR ||--o{ BOOKING : "est réservée dans"
      CAR ||--o{ MAINTENANCE_LOG : "a un historique de"
      CAR ||--o{ ACTIVITY_LOG : "a un journal de"

    1 
    2 1.  **User** : Représente un utilisateur enregistré. Le champ `isAdmin` contrôle l'accès aux panneaux d'administration.
    3 2.  **Car** : Représente un véhicule de la flotte. Le `status` est central pour la logique métier, et les champs de kilomètres sont mis à jour dynamiquement.
    4 3.  **Booking** : Document central qui lie un `User` à une `Car` pour une période donnée. Il stocke un instantané du prix, des options et des informations de l'utilisate
      au moment de la réservation.
    5 4.  **MaintenanceLog** : Enregistre chaque intervention de maintenance sur un véhicule, y compris la description et le coût.
    6 5.  **ActivityLog** : Trace les événements importants liés à une voiture (création, mise à jour, changement de statut), fournissant un audit trail simple.
    7 
    8 ## 4. Points d'API (Endpoints)
    9 
   10 Voici un résumé des routes API exposées par le backend Express.
   11 
   12 | Méthode | Route                       | Description                                                                 | Accès       |
   13 | ------- | --------------------------- | --------------------------------------------------------------------------- | ----------- |
   14 | `POST`  | `/auth/register`            | Enregistre un nouvel utilisateur.                                           | Public      |
   15 | `POST`  | `/auth/login`               | Authentifie un utilisateur et retourne un token JWT.                        | Public      |
   16 | `GET`   | `/cars`                     | Récupère la liste de toutes les voitures avec le statut `AVAILABLE`.        | Public      |
   17 | `GET`   | `/cars/:id`                 | Récupère les détails d'une voiture spécifique.                              | Public      |
   18 | `GET`   | `/cars/admin`               | Récupère la liste de **toutes** les voitures pour l'admin.                  | Admin       |
   19 | `POST`  | `/cars`                     | Ajoute une nouvelle voiture à la flotte.                                    | Admin       |
   20 | `PUT`   | `/cars/:id`                 | Met à jour les informations d'une voiture.                                  | Admin       |
   21 | `DELETE`| `/cars/:id`                 | Supprime une voiture.                                                       | Admin       |
   22 | `PUT`   | `/cars/:id/status`          | Change le statut d'une voiture (e.g., vers `MAINTENANCE`).                  | Admin       |
   23 | `POST`  | `/bookings`                 | Crée une nouvelle réservation.                                              | Utilisateur |
   24 | `GET`   | `/bookings/admin`           | Récupère la liste de toutes les réservations.                               | Admin       |
   25 | `GET`   | `/users/admin`              | Récupère la liste de tous les utilisateurs.                                 | Admin       |
   26 | `PUT`   | `/users/admin/:id`          | Met à jour le statut `isAdmin` d'un utilisateur.                            | Admin       |
   27 | `POST`  | `/maintenance/:carId`       | Ajoute un journal de maintenance pour une voiture.                          | Admin       |
   28 | `GET`   | `/maintenance/:carId`       | Récupère l'historique de maintenance d'une voiture.                         | Admin       |
   29 | `GET`   | `/dashboard/analytics`      | Récupère les données agrégées pour le tableau de bord (KPIs, graphiques).   | Admin       |
   30 | `POST`  | `/chatbot`                  | Agit comme proxy pour envoyer un prompt au service Ollama.                  | Public      |
   31
   32 ## 5. Description des Fonctionnalités Clés
   33
   34 #### **Flux d'Authentification**
   35 L'authentification est modulaire et centrée sur l'utilisateur. Un utilisateur non authentifié peut naviguer sur le site public. S'il tente une action protégée (comme    
      réserver), un modal s'ouvre, lui proposant de se connecter ou de s'inscrire via des onglets.
   36 -   **Inscription** : Le mot de passe est haché avec `bcryptjs` avant d'être stocké.
   37 -   **Connexion** : Le mot de passe fourni est comparé au hash stocké. En cas de succès, un token JWT est généré et stocké sur le client. Ce token est ensuite inclus dan
      l'en-tête `Authorization` de toutes les requêtes sécurisées.
   38
   39 #### **Gestion de la Flotte (Admin)**
   40 Les administrateurs ont un contrôle total sur la flotte via le `CarManagementPage`. Ils peuvent créer, lire, mettre à jour et supprimer des voitures. Le changement de   
      statut d'une voiture (par exemple, de `MAINTENANCE` à `AVAILABLE`) déclenche une logique métier côté backend, comme la réinitialisation des
      `kilometersSinceLastMaintenance`.
   41
   42 #### **Système de Réservation**
   43 1.  **Sélection** : L'utilisateur sélectionne une voiture et est redirigé vers la page de réservation (`/book/:carId`).
   44 2.  **Configuration** : La page charge les détails de la voiture. L'utilisateur choisit une plage de dates, des options supplémentaires (chauffeur, etc.) et un niveau   
      d'assurance.
   45 3.  **Calcul Dynamique** : Le prix total est recalculé en temps réel à chaque changement (`(prix_base + prix_options) * nombre_jours`).
   46 4.  **Soumission** : Si l'utilisateur n'est pas connecté, le modal d'authentification s'ouvre. Une fois connecté, la réservation est envoyée au backend.
   47 5.  **Confirmation** : Le backend vérifie que la voiture est disponible, crée le document `Booking`, et met à jour le statut de la voiture à `RESERVED`.
   48
   49 #### **Tableau de Bord Analytique (Admin)**
   50 Le dashboard (`/dashboard`) n'est plus une simple page d'accueil. Il s'agit d'un centre d'analyse qui récupère des données agrégées depuis le backend.
   51 -   **KPIs** : Des cartes affichent les métriques vitales : revenus totaux, nombre de réservations, coûts de maintenance, etc.
   52 -   **Graphiques** : `Recharts` est utilisé pour visualiser les revenus mensuels (BarChart) et la popularité des modèles de voitures (PieChart). Ces agrégations sont    
      calculées efficacement par MongoDB pour minimiser la charge sur le serveur applicatif.
   53
   54 #### **Module de Maintenance Avancé**
   55 Cette section (`/maintenance`) fournit aux administrateurs une vue d'ensemble de l'état de la flotte.
   56 -   **Vue d'ensemble** : Un tableau trie les voitures par `kilometersSinceLastMaintenance`, avec une barre de progression visuelle.
   57 -   **Journalisation** : Les admins peuvent enregistrer des opérations de maintenance via un modal. L'ajout d'un log réinitialise automatiquement le compteur de kilomètr
      et remet la voiture en statut `AVAILABLE`, simulant la fin d'une révision.
   58
   59 #### **Simulation et Tâches de Fond (`cron.js`)**
   60 Pour rendre l'application plus vivante et les données de maintenance plus réalistes, un cron job s'exécute chaque minute :
   61 -   Il recherche toutes les voitures dont le statut est `RESERVED`.
   62 -   Pour chaque voiture, il ajoute un nombre aléatoire de kilomètres à `totalKilometers` and `kilometersSinceLastMaintenance`, simulant ainsi une utilisation réelle.    
   63
   64 ## 6. Conclusion
   65 Le projet "Car Rental Management System" est une application web fonctionnelle, robuste et extensible. Les choix technologiques sont modernes et éprouvés, et l
      'architecture modulaire permet d'ajouter facilement de nouvelles fonctionnalités à l'avenir. Le système répond à toutes les exigences initiales, offrant une interface   
      utilisateur soignée et des outils de gestion puissants pour les administrateurs.