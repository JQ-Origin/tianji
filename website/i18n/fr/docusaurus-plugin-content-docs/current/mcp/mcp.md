---
sidebar_position: 1
_i18n_hash: 3c015e32f8f31f3336c113e85a87d389
---
# Intégration avec MCP

## Introduction

Tianji MCP Server est un serveur basé sur le protocole Model Context Protocol (MCP) qui sert de pont entre les assistants IA et la plateforme Tianji. Il expose la fonctionnalité de sondage de la plateforme Tianji aux assistants IA via le protocole MCP. Ce serveur fournit les fonctionnalités principales suivantes :

- Interroger les résultats des sondages
- Obtenir des informations détaillées sur un sondage
- Obtenir tous les sondages dans un espace de travail
- Obtenir la liste des sites web

## Méthodes d'installation

### Installation via NPX

Vous pouvez utiliser Tianji MCP Server en ajoutant la configuration suivante au fichier de configuration de votre assistant IA :

```json
{
  "mcpServers": {
    "tianji": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "tianji-mcp-server"
      ],
      "env": {
        "TIANJI_BASE_URL": "https://tianji.example.com",
        "TIANJI_API_KEY": "<votre-clé-api>",
        "TIANJI_WORKSPACE_ID": "<votre-id-espace-de-travail>"
      }
    }
  }
}
```

### Configuration des variables d'environnement

Avant d'utiliser Tianji MCP Server, vous devez définir les variables d'environnement suivantes :

```bash
# URL de base de l'API de la plateforme Tianji
TIANJI_BASE_URL=https://tianji.example.com

# Clé API de la plateforme Tianji
TIANJI_API_KEY=votre_clé_api_ici

# ID de l'espace de travail de la plateforme Tianji
TIANJI_WORKSPACE_ID=votre_id_espace_de_travail_ici
```

### Obtenir une clé API

Vous pouvez obtenir une clé API de la plateforme Tianji en suivant ces étapes :

1. Après vous être connecté à la plateforme Tianji, cliquez sur votre **image de profil** en haut à droite
2. Sélectionnez **Profil** dans le menu déroulant
3. Sur la page de profil, trouvez l'option **Clés API**
4. Cliquez sur créer une nouvelle clé et suivez les invites pour compléter la création de la clé

## Instructions d'utilisation

Tianji MCP Server fournit une série d'outils qui peuvent interagir avec les assistants IA via le protocole MCP. Ci-dessous se trouvent les descriptions détaillées de chaque outil :

### Interroger les résultats des sondages

Utilisez l'outil `tianji_get_survey_results` pour interroger les données de résultats d'un sondage spécifique.

**Paramètres :**

- `workspaceId` : ID de l'espace de travail Tianji (par défaut, la valeur configurée dans les variables d'environnement)
- `surveyId` : ID du sondage
- `limit` : Limite sur le nombre d'enregistrements retournés (par défaut 20)
- `cursor` : Curseur de pagination (optionnel)
- `startAt` : Heure de début, format ISO, exemple : 2023-10-01T00:00:00Z
- `endAt` : Heure de fin, format ISO, exemple : 2023-10-31T23:59:59Z
- `filter` : Conditions de filtre (optionnel)

### Obtenir les informations d'un sondage

Utilisez l'outil `tianji_get_survey_info` pour obtenir des informations de base sur un sondage spécifique.

**Paramètres :**

- `workspaceId` : ID de l'espace de travail Tianji (par défaut, la valeur configurée dans les variables d'environnement)
- `surveyId` : ID du sondage

### Obtenir la liste de tous les sondages

Utilisez l'outil `tianji_get_all_survey_list` pour obtenir une liste de tous les sondages dans l'espace de travail.

**Paramètres :**

- `workspaceId` : ID de l'espace de travail Tianji (par défaut, la valeur configurée dans les variables d'environnement)

### Obtenir la liste des sites web

Utilisez l'outil `tianji_get_website_list` pour obtenir une liste des sites web dans l'espace de travail.

**Paramètres :**

- `workspaceId` : ID de l'espace de travail Tianji (par défaut, la valeur configurée dans les variables d'environnement)

## Exemples d'utilisation

Ci-dessous se trouvent des exemples d'interactions en langage naturel entre les utilisateurs et les assistants IA intégrés avec Tianji MCP Server :

### Exemple 1 : Obtenir la liste de tous les sondages

```
Utilisateur : Aidez-moi à voir toutes mes listes de questionnaires de sondage

Assistant IA : Je vais obtenir toutes vos listes de questionnaires de sondage pour vous.
[L'assistant IA appelle tianji_get_all_survey_list via le protocole MCP pour obtenir des données]
En fonction des données de votre espace de travail, vous avez actuellement les sondages suivants :
1. Enquête de satisfaction de l'expérience utilisateur (créée le 2023-09-15)
2. Enquête sur les retours des fonctionnalités du produit (créée le 2023-10-01)
3. Évaluation de l'utilisabilité du site web (créée le 2023-10-20)
```

### Exemple 2 : Obtenir les détails d'un sondage spécifique

```
Utilisateur : Veuillez me donner les détails de l'« Enquête de satisfaction de l'expérience utilisateur »

Assistant IA : Je vais interroger les détails de ce sondage pour vous.
[L'assistant IA appelle tianji_get_survey_info via le protocole MCP pour obtenir des données]
Détails de l'« Enquête de satisfaction de l'expérience utilisateur » :
- Date de création : 2023-09-15
- Statut : Actif
- Nombre de questions : 10
- Réponses collectées : 128
- Réponse la plus récente : 2023-10-25
```

### Exemple 3 : Interroger les résultats des sondages

```
Utilisateur : Aidez-moi à analyser les résultats d'octobre de l'« Enquête sur les retours des fonctionnalités du produit »

Assistant IA : Je vais analyser les résultats d'octobre de l'« Enquête sur les retours des fonctionnalités du produit ».
[L'assistant IA appelle tianji_get_survey_results via le protocole MCP pour obtenir des données pour la période spécifique]
Analyse des résultats d'octobre de l'« Enquête sur les retours des fonctionnalités du produit » :
- Total des réponses : 42
- Fonctionnalité la plus populaire : Rapports automatisés (85 % de retours positifs)
- Fonctionnalité nécessitant le plus d'améliorations : Adaptation mobile (mentionnée par 62 %)
- Note de satisfaction moyenne : 4.2/5
- Suggestions principales des utilisateurs : Ajouter une fonctionnalité d'exportation de données, optimiser la vitesse de chargement des pages
```
