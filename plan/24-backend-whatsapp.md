# Tache 24 - Finaliser l integration WhatsApp

## Objectif
Proposer un flux coherent pour envoyer les commandes ou factures via WhatsApp (Click to Chat ou API Business).

## Contexte
Le module `backend/billing/integrations/whatsapp.py` est un stub et le storefront compose un message minimal. Les organisations doivent pouvoir definir leur numero et choisir le canal (classique ou API Cloud).

## Actions detaillees
- Completer `whatsapp.py` avec des helpers pour generer les messages panier et facture (texte, liens media).
- Ajouter la configuration necessaire (tokens API, template IDs) dans les settings et l admin.
- Exposer une action API pour envoyer un message via l API Business avec gestion des erreurs et journalisation.
- Documenter les prerequis (format numero, configuration Facebook) et fournir un mode fallback Click to Chat.

## Livrables
- Module WhatsApp pret a l emploi avec tests (mock API).
- Guide de configuration admin.
