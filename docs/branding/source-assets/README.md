# Source Assets (Master Files)

Ce dossier est destine aux fichiers originaux haute definition (PSD, AI, PNG 4K, videos) utilises pour derivation web.

## Consignes

1. Conserver les fichiers dans des sous dossiers par categorie (hero, advertising, icons).
2. Ajouter un fichier `metadata.json` par ressource listant auteur, licence, date d import.
3. Avant commit, exporter une version optimisee (`.webp`, `.avif`, `.svg`) dans `frontend/public/assets/brand/`.
4. Executer `npm run optimize:images` pour minifier les fichiers destines a la production.
5. Ne pas committer de fichiers superieurs a 5 Mo (utiliser Git LFS ou stockage externe si necessaire).
