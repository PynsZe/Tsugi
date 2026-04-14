# SAE - Quick Start

Ce README centralise les points pratiques pour lancer le projet et consommer l'API Gateway.

## Lancer le projet

```bash
cd backend
npm run dev
```

## Documentation Swagger (Gateway)

Dans le code actuel, la version API est definie dans `backend/packages/config/config.ts` avec `version = 1`, donc le prefixe est `/api/v1`.

- UI: `http://localhost:3000/api/v1/doc`
- JSON: `http://localhost:3000/api/v1/doc/spec/gateway.json`

## Regenerer la doc (si besoin)

```bash
cd backend
npm run swagger --prefix apps/gateway
```

## Base API et format JSON

- Base URL locale Gateway: `http://localhost:3000/api/v1`
- Les routes attendent et renvoient du JSON (`Content-Type: application/json`).
- Cote client, penser a envoyer le header suivant sur les requetes avec body:

```bash
Content-Type: application/json
```

## Token et JWT

### Obtenir un token

Le login est expose via la Gateway:

- `POST /api/v1/auth/login`

Payload:

```json
{
  "email": "test@mail.com",
  "password": "123456"
}
```

Reponse (format actuel):

```json
{
  "sub": "67e57ac2f5a2a6f0af0b62d0",
  "accessToken": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": "1h"
}
```

### Utiliser le token

Pour les endpoints proteges, envoyer:

```bash
Authorization: Bearer <jwt>
```

Exemple:

```bash
curl -X GET "http://localhost:3000/api/v1/catalog" \
  -H "Authorization: Bearer <jwt>"
```

### Notes Auth importantes

- L'auth Gateway peut etre active/desactivee via `NEED_AUTHENTICATION` (1 par defaut).
- Si le token est absent, invalide, ou mal forme, la reponse est `401`.
- Claims JWT attendues: `sub`, `email`, `username`.

## HTTP Responses (resume)

Selon les routes et services, les statuts les plus frequents sont:

- `200`: lecture/requete OK
- `201`: creation reussie (ex: register) et actuellement login cote users service
- `400`: entree invalide (body/params)
- `401`: non authentifie / token invalide
- `404`: ressource introuvable
- `409`: conflit (ex: utilisateur deja existant)
- `500`: erreur interne serveur

La Gateway relaie en general le `status` recu des services internes.

## JSON Error Response

Deux formats d'erreur existent actuellement selon le middleware/service:

Format minimal:

```json
{
  "error": "INTERNAL_SERVER_ERROR"
}
```

Format detaille (erreurs metier `AppError`):

```json
{
  "error": "NOT_FOUND",
  "message": "anime not found in Jikan API"
}
```

Validation de params (exemple):

```json
{
  "error": "INVALID_PARAMS",
  "details": [
	{
	  "path": "id",
	  "message": "Number must be greater than 0"
	}
  ]
}
```

## Rate Limiting

Le controle de debit est applique principalement dans `catalog_service` pour proteger les APIs externes.

- Variable de config: `API_RATE_LIMIT` (ms), valeur par defaut `1050`.
- Jikan est appele avec un limiter `Bottleneck` en sequence (`maxConcurrent: 1`, `minTime: API_RATE_LIMIT`).
- Yurippe a son propre limiter (`maxConcurrent: 3`, `minTime: 150`).
- Un `sleep(API_RATE_LIMIT)` est aussi applique dans la boucle de recuperation catalogue.

Objectif: eviter les erreurs `429 Too Many Requests` cote fournisseurs externes.

## Caching

Le cache est gere dans `catalog_service` via MongoDB (`CatalogModel`).

- Quand un anime est deja en base et encore "frais", il est renvoye sans nouvel appel externe.
- Fraicheur definie par `ANIME_FRESHNESS_DURATION` (ms), defaut `24h`.
- Si entree absente ou expiree, les donnees sont re-fetch depuis Jikan/Yurippe puis upsert en base.

En pratique, cela reduit:

- le temps de reponse,
- la charge sur les APIs externes,
- le risque de rate-limit distant.

## Variables d'environnement utiles

Variables partagees (voir `backend/packages/config/config.ts`):

- `PORT` (Gateway, defaut `3000`)
- `AUTH_SERVICE_PORT` (defaut `3001`)
- `CATALOG_SERVICE_PORT` (defaut `3002`)
- `JWT_SECRET`
- `JWT_EXPIRES_IN` (defaut `1h`)
- `NEED_AUTHENTICATION` (`1` ou `0`)
- `ANIME_FRESHNESS_DURATION`
- `API_RATE_LIMIT`

## Exemple rapide de flow

1. `POST /api/v1/auth/register`
2. `POST /api/v1/auth/login` pour recuperer le JWT
3. Appeler les routes protegees (`/api/v1/catalog`, `/api/v1/users/...`) avec `Authorization: Bearer <jwt>`

